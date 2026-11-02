/**
 * FritzLightbulbAccessory - FRITZ!DECT 500 / HAN-FUN lights (on/off + brightness)
 *
 * Based on glowf1sh/homebridge-fritz-new PR #17 by BeastiW (Bastian Wissler)
 *
 * @license MIT
 */

/* jslint node: true, laxcomma: true, esversion: 11 */
"use strict";

let Service, Characteristic, FritzAccessory;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    FritzAccessory = require('../accessory')(homebridge);

    class FritzLightbulbAccessory extends FritzAccessory {
        constructor(platform, ain, type, accessory) {
            super(platform, ain, type, accessory);

            this.accessory = accessory;
            this.platformAccessory = accessory;
            this.accessory.context.ain = ain;
            this.accessory.context.type = type;

            const infoService = this.accessory.getService(Service.AccessoryInformation) ||
                this.accessory.addService(Service.AccessoryInformation);
            infoService.setCharacteristic(Characteristic.SerialNumber, this.ain);
            if (this.device?.manufacturer) {
                infoService.setCharacteristic(Characteristic.Manufacturer, this.device.manufacturer);
            }
            if (this.device?.productname) {
                infoService.setCharacteristic(Characteristic.Model, this.device.productname);
            }
            if (this.device?.fwversion) {
                infoService.setCharacteristic(Characteristic.FirmwareRevision, this.device.fwversion);
            }

            const lightService = this.accessory.getService(Service.Lightbulb) ||
                this.accessory.addService(Service.Lightbulb, this.name);

            lightService.getCharacteristic(Characteristic.On)
                .onGet(this.getOn.bind(this))
                .onSet(state => {
                    // Respond to HomeKit immediately; setOn handles errors itself
                    this.setOn(state);
                });

            if (this.hasBrightnessSupport()) {
                lightService.getCharacteristic(Characteristic.Brightness)
                    .onGet(this.getBrightness.bind(this))
                    .onSet(brightness => {
                        this.setBrightness(brightness);
                    });
            }

            this.services = {
                AccessoryInformation: infoService,
                Lightbulb: lightService
            };

            lightService.fritzState = this.getDeviceState(this.device);
            lightService.fritzBrightness = this.getDeviceBrightness(this.device);

            this.update(this.device);
        }

        getServices() {
            return [];
        }

        hasBrightnessSupport() {
            const features = this.accessory.context.features || {};
            return !!(features.hasLevelControl || features.hasDimmer || this.device?.levelcontrol);
        }

        getDeviceState(device) {
            if (!device) return false;
            if (typeof device.state === 'boolean') return device.state;
            if (typeof device.simpleonoff?.state === 'boolean') return device.simpleonoff.state;
            if (typeof device.switch?.state === 'boolean') return device.switch.state;
            return false;
        }

        getDeviceBrightness(device) {
            if (!device) return 100;

            const levelpercentage = device.values?.levelcontrol?.levelpercentage;
            if (levelpercentage !== null && levelpercentage !== undefined) {
                return levelpercentage;
            }
            if (device.levelcontrol?.levelpercentage !== undefined) {
                return parseInt(device.levelcontrol.levelpercentage) || 0;
            }
            return this.getDeviceState(device) ? 100 : 0;
        }

        getOn() {
            this.queryState();
            return !!this.services.Lightbulb.fritzState;
        }

        async setOn(state) {
            const service = this.services.Lightbulb;
            this.platform.log(`Switching ${this.name} (${this.ain}) to ${state ? 'ON' : 'OFF'}`);

            try {
                await this.platform.fritz('setSimpleOnOff', this.ain, state ? 1 : 0, { priority: 10 });

                service.fritzState = state;
                service.getCharacteristic(Characteristic.On).updateValue(state);

                if (this.hasBrightnessSupport() && state && service.fritzBrightness === 0) {
                    service.fritzBrightness = 100;
                    service.getCharacteristic(Characteristic.Brightness).updateValue(100);
                }
            } catch (error) {
                this.platform.log.error(`Failed to switch ${this.name}:`, error);
                service.getCharacteristic(Characteristic.On).updateValue(!state);
            }
        }

        getBrightness() {
            this.queryState();
            return this.services.Lightbulb.fritzBrightness ?? 0;
        }

        async setBrightness(brightness) {
            const service = this.services.Lightbulb;
            const targetBrightness = Math.max(0, Math.min(100, Math.round(brightness)));

            try {
                await this.platform.fritz('setLevelPercentage', this.ain, targetBrightness, { priority: 10 });

                service.fritzBrightness = targetBrightness;
                service.getCharacteristic(Characteristic.Brightness).updateValue(targetBrightness);

                const targetState = targetBrightness > 0;
                service.fritzState = targetState;
                service.getCharacteristic(Characteristic.On).updateValue(targetState);
            } catch (error) {
                this.platform.log.error(`Failed to set brightness for ${this.name}:`, error);
                this.queryState();
            }
        }

        queryState() {
            return this.platform.fritz('getDeviceInfos', this.ain).then(device => {
                if (device) this.update(device);
            }).catch(error => {
                this.platform.log.debug(`Failed to query light state for ${this.ain}:`, error.message);
            });
        }

        update(device) {
            if (device) {
                this.device = device;
                this.accessory.context.features = device.features || this.accessory.context.features || {};
            }

            const service = this.services.Lightbulb;
            const state = this.getDeviceState(this.device);
            service.fritzState = state;
            service.getCharacteristic(Characteristic.On).updateValue(state);

            if (this.hasBrightnessSupport()) {
                const brightness = this.getDeviceBrightness(this.device);
                service.fritzBrightness = brightness;
                service.getCharacteristic(Characteristic.Brightness).updateValue(brightness);
            }
        }

        cleanup() {
        }
    }

    return FritzLightbulbAccessory;
};
