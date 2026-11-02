'use strict';

/**
 * Exercises the onGet/onSet handlers through the real HAP library
 * (@homebridge/hap-nodejs, as used by Homebridge 2).
 */

const assert = require('assert');
const hap = require('@homebridge/hap-nodejs');

const { Service, Characteristic } = hap;

class PlatformAccessory {
    constructor(displayName, UUID) {
        this.displayName = displayName;
        this.UUID = UUID;
        this.context = {};
        this._accessory = new hap.Accessory(displayName, UUID);
        this.services = this._accessory.services;
    }
    getService(type) { return this._accessory.getService(type); }
    addService(...args) { return this._accessory.addService(...args); }
    removeService(service) { return this._accessory.removeService(service); }
}

const homebridge = { hap, platformAccessory: PlatformAccessory };

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
// Wait for simulated FRITZ!Box responses (see fritz mock below)
const tick = () => delay(20);

function createPlatform(fritzImpl, config = {}) {
    const calls = [];
    const log = () => {};
    log.debug = log.info = log.warn = log.error = () => {};

    return {
        calls,
        log,
        config: {},
        interval: 60000,
        api: { hap, platformAccessory: PlatformAccessory },
        deviceConfig: (key, defaultValue) => (key in config ? config[key] : defaultValue),
        getName: () => 'Test Device',
        getDevice: () => ({ manufacturer: 'AVM', productname: 'FRITZ!DECT 200', fwversion: '1.0' }),
        fritz: async (method, ...args) => {
            calls.push([method, ...args]);
            await delay(5); // simulate network latency of the FRITZ!Box
            return fritzImpl(method, ...args);
        }
    };
}

describe('HAP onGet/onSet handlers', function() {
    // platform.js keeps module-level HAP references; other tests may have
    // initialised it with a mock, so re-initialise it with the real HAP.
    beforeEach(function() {
        require('../lib/platform')(homebridge);
    });

    const FritzOutletAccessory = require('../lib/accessories/outlet')(homebridge);
    const FritzWifiAccessory = require('../lib/accessories/wifi')(homebridge);
    const FritzButtonAccessory = require('../lib/accessories/button')(homebridge);
    const FritzAlarmSensorAccessory = require('../lib/accessories/alarmsensor')(homebridge);

    describe('outlet', function() {
        function createOutlet(fritzImpl) {
            const platform = createPlatform(fritzImpl);
            const accessory = new PlatformAccessory('Outlet', hap.uuid.generate('outlet-test'));
            accessory.context.functionbitmask = 32 | 65536; // temperature + power meter
            const outlet = new FritzOutletAccessory(platform, '11111 2222222', 'outlet', accessory);
            return { platform, accessory, outlet };
        }

        it('returns cached On state and triggers a refresh', async function() {
            const { platform, outlet } = createOutlet(async () => true);
            const on = outlet.services.Outlet.getCharacteristic(Characteristic.On);

            const value = await on.handleGetRequest();
            assert.strictEqual(value, false);
            assert(platform.calls.some(c => c[0] === 'getSwitchState'));

            await tick();
            assert.strictEqual(on.value, true);
        });

        it('switches on via onSet and updates state', async function() {
            const { platform, outlet } = createOutlet(async () => undefined);
            const on = outlet.services.Outlet.getCharacteristic(Characteristic.On);

            await on.handleSetRequest(true);
            await tick();

            assert(platform.calls.some(c => c[0] === 'setSwitchOn' && c[1] === '11111 2222222'));
            assert.strictEqual(outlet.services.Outlet.fritzState, true);
        });

        it('reverts the HomeKit state when switching fails', async function() {
            const { outlet } = createOutlet(async (method) => {
                if (method === 'setSwitchOn') throw new Error('box unreachable');
            });
            const on = outlet.services.Outlet.getCharacteristic(Characteristic.On);

            await on.handleSetRequest(true);
            await tick();

            assert.strictEqual(on.value, false);
        });

        it('serves power, energy, voltage and temperature values', async function() {
            const { outlet } = createOutlet(async () => 0);
            const outletService = outlet.services.Outlet;
            const FritzPlatform = require('../lib/platform')(homebridge);

            assert.strictEqual(await outletService.getCharacteristic(Characteristic.OutletInUse).handleGetRequest(), false);
            assert.strictEqual(await outletService.getCharacteristic(FritzPlatform.PowerUsage).handleGetRequest(), 0);
            assert.strictEqual(await outletService.getCharacteristic(FritzPlatform.EnergyConsumption).handleGetRequest(), 0);
            assert.strictEqual(await outletService.getCharacteristic(FritzPlatform.Voltage).handleGetRequest(), 0);
            assert.strictEqual(
                await outlet.services.TemperatureSensor.getCharacteristic(Characteristic.CurrentTemperature).handleGetRequest(),
                20
            );
        });
    });

    describe('guest wifi (fritz fallback)', function() {
        it('gets and sets the guest WLAN state', async function() {
            const platform = createPlatform(async (method) => method === 'getGuestWlan' ? true : (method === 'getOSVersion' ? '8.00' : undefined), {
                'wifi.tr64Fallback': true
            });
            const accessory = new PlatformAccessory('Guest WLAN', hap.uuid.generate('wifi-test'));
            const wifi = new FritzWifiAccessory(platform, accessory);
            const on = wifi.services.Switch.getCharacteristic(Characteristic.On);

            assert.strictEqual(await on.handleGetRequest(), false);
            await tick();
            assert.strictEqual(on.value, true);

            await on.handleSetRequest(false);
            assert(platform.calls.some(c => c[0] === 'setGuestWlan' && c[1] === false));

            wifi.cleanup();
        });
    });

    describe('button', function() {
        it('never writes null to the switch during polling', async function() {
            const platform = createPlatform(async () => [{ button: [{ lastpressedtimestamp: '100' }] }]);
            const accessory = new PlatformAccessory('Button', hap.uuid.generate('button-test'));
            const button = new FritzButtonAccessory(platform, '33333 4444444', 'button', accessory);
            button.index = 0;
            const on = button.services.Switch.getCharacteristic(Characteristic.On);

            button.update();
            await tick();
            assert.strictEqual(on.value, false);
            assert.strictEqual(await on.handleGetRequest(), false);

            button.cleanup();
        });
    });

    describe('alarm sensor', function() {
        it('returns a valid ContactSensorState', async function() {
            const platform = createPlatform(async () => 0);
            const accessory = new PlatformAccessory('Window', hap.uuid.generate('alarm-test'));
            const sensor = new FritzAlarmSensorAccessory(platform, '55555 6666666', 'alarmsensor', accessory);

            const value = await sensor.services.ContactSensor
                .getCharacteristic(Characteristic.ContactSensorState).handleGetRequest();
            assert.strictEqual(typeof value, 'number');

            sensor.cleanup();
        });
    });
});
