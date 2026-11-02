/**
 * FritzOutletAccessory
 *
 * @url https://github.com/glowf1sh/homebridge-fritz-new
 * @original author Andreas Götz
 * @new author Glowf1sh <https://twitch.tv/glowf1sh>
 * @license MIT
 */

/* jslint node: true, laxcomma: true, esversion: 11 */
"use strict";

let Service, Characteristic, FritzPlatform, FritzAccessory;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    FritzPlatform = require('../platform')(homebridge);
    FritzAccessory = require('../accessory')(homebridge);

    class FritzOutletAccessory extends FritzAccessory {
        constructor(platform, ain, type, device) {
            super(platform, ain, type, device);
            
            if (device) {
                // Existing accessory from cache
                this.accessory = device;
                this.accessory.context.ain = ain;
                this.accessory.context.type = type;
            } else {
                // New accessory
                const name = this.name;
                const uuid = this.platform.api.hap.uuid.generate(ain);
                this.accessory = new this.platform.api.platformAccessory(name, uuid);
                this.accessory.context.ain = ain;
                this.accessory.context.type = type;
            }
            
            this.platformAccessory = this.accessory; // For backward compatibility

            // Setup services
            if (!this.platformAccessory.getService(Service.AccessoryInformation)) {
                this.platformAccessory.addService(Service.AccessoryInformation);
            }
            
            // Update accessory information
            const infoService = this.platformAccessory.getService(Service.AccessoryInformation);
            infoService.setCharacteristic(Characteristic.SerialNumber, this.ain);
            
            if (this.device.manufacturer) {
                infoService.setCharacteristic(Characteristic.Manufacturer, this.device.manufacturer);
            }
            if (this.device.productname) {
                infoService.setCharacteristic(Characteristic.Model, this.device.productname);
            }
            if (this.device.fwversion) {
                infoService.setCharacteristic(Characteristic.FirmwareRevision, this.device.fwversion);
            }

            // Setup Outlet service
            let outletService = this.platformAccessory.getService(Service.Outlet);
            if (!outletService) {
                outletService = this.platformAccessory.addService(Service.Outlet, this.name);
            }

            // Outlet characteristics
            outletService.getCharacteristic(Characteristic.On)
                .onGet(this.getOn.bind(this))
                .onSet(state => {
                    // Respond to HomeKit immediately; setOn handles errors and reverts the state itself
                    this.setOn(state);
                });

            outletService.getCharacteristic(Characteristic.OutletInUse)
                .onGet(this.getInUse.bind(this));

            // Add PowerUsage characteristic if not exists
            // Check using characteristics array to avoid auto-adding by getCharacteristic
            const hasPowerUsage = outletService.characteristics.some(c => 
                c.UUID === FritzPlatform.PowerUsage.UUID || 
                (c.constructor && c.constructor.UUID === FritzPlatform.PowerUsage.UUID)
            );
            if (!hasPowerUsage) {
                outletService.addCharacteristic(FritzPlatform.PowerUsage);
            }
            outletService.getCharacteristic(FritzPlatform.PowerUsage)
                .onGet(this.getPowerUsage.bind(this));

            // Add EnergyConsumption characteristic if not exists
            const hasEnergyConsumption = outletService.characteristics.some(c => 
                c.UUID === FritzPlatform.EnergyConsumption.UUID || 
                (c.constructor && c.constructor.UUID === FritzPlatform.EnergyConsumption.UUID)
            );
            if (!hasEnergyConsumption) {
                outletService.addCharacteristic(FritzPlatform.EnergyConsumption);
            }
            outletService.getCharacteristic(FritzPlatform.EnergyConsumption)
                .onGet(this.getEnergyConsumption.bind(this));
                
            // Add Voltage characteristic if not exists
            const hasVoltage = outletService.characteristics.some(c => 
                c.UUID === FritzPlatform.Voltage.UUID || 
                (c.constructor && c.constructor.UUID === FritzPlatform.Voltage.UUID)
            );
            if (!hasVoltage) {
                outletService.addCharacteristic(FritzPlatform.Voltage);
            }
            outletService.getCharacteristic(FritzPlatform.Voltage)
                .onGet(this.getVoltage.bind(this));

            // TemperatureSensor - add only if device supports it (check functionbitmask)
            const functionbitmask = this.accessory.context.functionbitmask || 0;
            const hasTemperature = (functionbitmask & 32) !== 0;
            
            if (hasTemperature && 
                this.platform.deviceConfig(`${ain}.TemperatureSensor`, true)
            ) {
                let tempService = this.platformAccessory.getService(Service.TemperatureSensor);
                if (!tempService) {
                    tempService = this.platformAccessory.addService(Service.TemperatureSensor, this.name);
                }

                tempService.getCharacteristic(Characteristic.CurrentTemperature)
                    .setProps({minValue: -50})
                    .onGet(this.getCurrentTemperature.bind(this));
            } else {
                // Remove temperature service if it exists but device no longer supports it
                const tempService = this.platformAccessory.getService(Service.TemperatureSensor);
                if (tempService) {
                    this.platformAccessory.removeService(tempService);
                }
            }

            // Store references to services for quick access
            this.services = {
                AccessoryInformation: infoService,
                Outlet: outletService
            };
            
            if (hasTemperature && this.platform.deviceConfig(`${ain}.TemperatureSensor`, true)) {
                this.services.TemperatureSensor = this.platformAccessory.getService(Service.TemperatureSensor);
            }

            // Initialize state
            this.services.Outlet.fritzState = false;
            this.services.Outlet.fritzInUse = false;
            this.services.Outlet.fritzPowerUsage = 0;
            this.services.Outlet.fritzEnergyConsumption = 0;
            this.services.Outlet.fritzVoltage = 0;
            
            if (this.services.TemperatureSensor) {
                this.services.TemperatureSensor.fritzCurrentTemperature = 20;
            }
            
            // Check for power meter capability
            const hasPowerMeter = (functionbitmask & 65536) !== 0;
            if (hasPowerMeter) {
                // Power meter characteristics are already added in constructor
                this.platform.log.debug(`Outlet ${ain} has power meter capability`);
            }

            // Polling is now handled centrally by platform
            // Initial update
            this.update();
        }

        // Override getServices to work with dynamic platform
        getServices() {
            // Not needed for dynamic platform - services are managed by PlatformAccessory
            return [];
        }

        getOn() {
            this.platform.log.debug(`Getting ${this.type} ${this.ain} state`);

            this.queryOn();
            return !!this.services.Outlet.fritzState;
        }

        async setOn(state) {
            this.platform.log(`Switching ${this.name} (${this.ain}) to ${state ? 'ON' : 'OFF'}`);

            try {
                // Send command to Fritz!Box with high priority
                await this.platform.fritz(state ? 'setSwitchOn' : 'setSwitchOff', this.ain, { priority: 10 });
                this.platform.log(`Successfully switched ${this.name} to ${state ? 'ON' : 'OFF'}`);
                
                // Update internal state
                this.services.Outlet.fritzState = state;
                
                // IMPORTANT: Proactively update HomeKit with the new state
                this.services.Outlet.getCharacteristic(Characteristic.On).updateValue(state);
            } catch (error) {
                this.platform.log.error(`Failed to switch ${this.name}:`, error);
                // Revert the state in HomeKit if the command failed
                this.services.Outlet.getCharacteristic(Characteristic.On).updateValue(!state);
            }
        }

        queryOn() {
            this.platform.fritz('getSwitchState', this.ain).then(state => {
                if (state === null || state === undefined) return; // device offline, keep last state
                state = !!state;
                const service = this.services.Outlet;
                service.fritzState = state;
                service.getCharacteristic(Characteristic.On).updateValue(state);
            }).catch(error => {
                this.platform.log.debug(`Failed to query switch state for ${this.ain}:`, error.message);
            });
        }

        getInUse() {
            this.platform.log.debug(`Getting ${this.type} ${this.ain} in use`);

            this.queryPowerUsage();
            return !!this.services.Outlet.fritzInUse;
        }

        getPowerUsage() {
            this.platform.log.debug(`Getting ${this.type} ${this.ain} power usage`);

            this.queryPowerUsage();
            return this.services.Outlet.fritzPowerUsage ?? 0;
        }

        queryPowerUsage() {
            this.platform.fritz('getSwitchPower', this.ain).then(power => {
                if (power === null || power === undefined) return; // device offline, keep last value
                power = Number(power);
                if (!Number.isFinite(power)) return; // device offline, keep last value
                const service = this.services.Outlet;

                service.fritzInUse = power > 0;
                service.fritzPowerUsage = power;

                service.getCharacteristic(Characteristic.OutletInUse).updateValue(service.fritzInUse);
                service.getCharacteristic(FritzPlatform.PowerUsage).updateValue(power);
            }).catch(error => {
                this.platform.log.debug(`Failed to query power usage for ${this.ain}:`, error.message);
            });
        }

        getEnergyConsumption() {
            this.platform.log.debug(`Getting ${this.type} ${this.ain} energy consumption`);

            this.queryEnergyConsumption();
            return this.services.Outlet.fritzEnergyConsumption ?? 0;
        }

        queryEnergyConsumption() {
            this.platform.fritz('getSwitchEnergy', this.ain).then(energy => {
                if (energy === null || energy === undefined) return; // device offline, keep last value
                energy = Number(energy) / 1000.0;
                if (!Number.isFinite(energy)) return; // device offline, keep last value
                const service = this.services.Outlet;

                service.fritzEnergyConsumption = energy;
                service.getCharacteristic(FritzPlatform.EnergyConsumption).updateValue(energy);
            }).catch(error => {
                this.platform.log.debug(`Failed to query energy consumption for ${this.ain}:`, error.message);
            });
        }
        
        getVoltage() {
            this.platform.log.debug(`Getting ${this.type} ${this.ain} voltage`);

            // Voltage is updated through device updates from platform
            return this.services.Outlet.fritzVoltage ?? 0;
        }

        async update(device) {
            this.platform.log.debug(`Updating ${this.type} ${this.ain}`);
            
            // Update device data if provided
            if (device) {
                this.device = device;
                
                // Update voltage if available
                if (device.powermeter && device.powermeter.voltage !== undefined) {
                    const service = this.services.Outlet;
                    service.fritzVoltage = device.powermeter.voltage;
                    service.getCharacteristic(FritzPlatform.Voltage).updateValue(device.powermeter.voltage);
                }
            }

            // Outlet
            this.queryOn();
            this.queryPowerUsage();
            this.queryEnergyConsumption();

            // TemperatureSensor
            if (this.services.TemperatureSensor) {
                this.queryCurrentTemperature();
            }
        }

        cleanup() {
            // Cleanup handled by platform
        }
    }

    return FritzOutletAccessory;
};