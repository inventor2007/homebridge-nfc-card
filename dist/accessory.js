"use strict";
let hap;
class NfcCard {
    constructor(log, config, api) {
        this.log = log;
        this.name = config.name;
        this.api = api;
        this.name = config.name;
        this.informationService = new hap.Service.AccessoryInformation();
        this.manufacturer = config.manufacturer || "new_inventor";
        this.serial = config.serial || "000000001";
        this.model = config.model || "homebridge-nfc-card";
        this.firmware = config.firmware || "0.0.1";
        this.service = new hap.Service.NFCAccess(this.name);
        log.info("Switch finished initializing!");
    }
    /**
     * Handle requests to get the current value of the "Configuration State" characteristic
     */
    handleConfigurationStateGet() {
        this.log.debug('Triggered GET ConfigurationState');
        // set this to a valid value for ConfigurationState
        const currentValue = 1;
        return currentValue;
    }
    /*
     * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
     * Typical this only ever happens at the pairing process.
     */
    identify() {
        this.log("Identify!");
    }
    /*
     * This method is called directly after creation of this instance.
     * It should return all services which should be added to the accessory.
     */
    getServices() {
        this.informationService
            .setCharacteristic(hap.Characteristic.Manufacturer, "new_inventor")
            .setCharacteristic(hap.Characteristic.Model, "ComputerCard")
            .setCharacteristic(hap.Characteristic.SerialNumber, this.serial)
            .setCharacteristic(hap.Characteristic.FirmwareRevision, this.firmware);
        this.service.setCharacteristic(hap.Characteristic.NFCAccessSupportedConfiguration, "okmabiche");
        this.service.getCharacteristic(hap.Characteristic.ConfigurationState)
            .onGet(this.handleConfigurationStateGet.bind(this));
        this.service.getCharacteristic(hap.Characteristic.NFCAccessControlPoint)
            .on("set" /* CharacteristicEventTypes.SET */, (value, callback) => {
            console.log("Control Point Write: " + value);
            callback(undefined, "");
        });
        return [this.informationService, this.service];
    }
}
module.exports = (api) => {
    hap = api.hap;
    api.registerAccessory("homebridge-nfc-card", NfcCard);
};
//# sourceMappingURL=accessory.js.map