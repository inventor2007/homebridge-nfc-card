import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  Characteristic,
  CharacteristicEventTypes,
  CharacteristicGetCallback,
  CharacteristicSetCallback,
  CharacteristicValue,
  HAP,
  Logging,
  Service
} from "homebridge";

let hap: HAP;

/*
 * Initializer function called when the plugin is loaded.
 */
export = (api: API) => {
  hap = api.hap;
  api.registerAccessory("homebridge-nfc-card", NfcCard);
};

class NfcCard implements AccessoryPlugin {

  private readonly log: Logging;
  private readonly name: string;
  private readonly api: API

  private readonly service: Service;
  // private readonly Characteristic: Characteristic;

  private readonly informationService: Service;

  constructor(log: Logging, config: AccessoryConfig, api: API) {
    this.log = log;
    this.name = config.name;
    this.api = api;

    this.name = config.name

    this.service = new hap.Service.NFCAccess(this.name)

    this.service.setCharacteristic(hap.Characteristic.NFCAccessSupportedConfiguration, 2)

    this.informationService = new hap.Service.AccessoryInformation()
      .setCharacteristic(hap.Characteristic.Manufacturer, "Custom Manufacturer")
      .setCharacteristic(hap.Characteristic.Model, "Custom Model");

    this.service.getCharacteristic(hap.Characteristic.ConfigurationState)
      .on(CharacteristicEventTypes.GET, (callback: CharacteristicGetCallback) => {
        log.info("Current state of the switch was returned: ");
        callback(undefined, "this.switchOn");
      })
    
    this.service.getCharacteristic(hap.Characteristic.ConfigurationState)
      .on(CharacteristicEventTypes.GET, callback => {
        console.log("Queried config state: ");
        callback(undefined, 0);
      });

    this.service.getCharacteristic(hap.Characteristic.NFCAccessControlPoint)
      .on(CharacteristicEventTypes.SET, (value, callback) => {
        console.log("Control Point Write: " + value);
        callback(undefined, "");
      });

    

    log.info("Switch finished initializing!");
  }

  /*
   * This method is optional to implement. It is called when HomeKit ask to identify the accessory.
   * Typical this only ever happens at the pairing process.
   */
  identify(): void {
    this.log("Identify!");
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices(): Service[] {
    return [
      this.informationService,
      this.service,
    ];
  }

}
