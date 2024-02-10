"use strict";
let hap;
class NfcCard {
    constructor(log, config, api) {
        this.log = log;
        this.name = config.name;
        this.api = api;
        this.name = config.name;
        this.service = new hap.Service.NFCAccess(this.name);
        this.service.setCharacteristic(hap.Characteristic.NFCAccessSupportedConfiguration, 2);
        this.informationService = new hap.Service.AccessoryInformation()
            .setCharacteristic(hap.Characteristic.Manufacturer, "Custom Manufacturer")
            .setCharacteristic(hap.Characteristic.Model, "Custom Model");
        this.service.getCharacteristic(hap.Characteristic.ConfigurationState)
            .on("get" /* CharacteristicEventTypes.GET */, (callback) => {
            log.info("Current state of the switch was returned: ");
            callback(undefined, "this.switchOn");
        });
        this.service.getCharacteristic(hap.Characteristic.ConfigurationState)
            .on("get" /* CharacteristicEventTypes.GET */, callback => {
            console.log("Queried config state: ");
            callback(undefined, 0);
        });
        this.service.getCharacteristic(hap.Characteristic.NFCAccessControlPoint)
            .on("set" /* CharacteristicEventTypes.SET */, (value, callback) => {
            console.log("Control Point Write: " + value);
            callback(undefined, "");
        });
        log.info("Switch finished initializing!");
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
        return [
            this.informationService,
            this.service,
        ];
    }
}
module.exports = (api) => {
    hap = api.hap;
    api.registerAccessory("homebridge-nfc-card", NfcCard);
};
//# sourceMappingURL=accessory.js.map