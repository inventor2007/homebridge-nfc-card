import {
  AccessoryConfig,
  AccessoryPlugin,
  API,
  CharacteristicEventTypes,
  HAP,
  Logging,
  Service
} from "homebridge";

let hap: HAP


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

  
  // private readonly Characteristic: Characteristic;

  private manufacturer: string
  private serial: string
  private model: string
  private firmware: string
  
  private readonly LockService: Service;
  private readonly NfcAccessService: Service;

  private readonly infoLockService: Service;
  private readonly infoNfcAccessService: Service;

  constructor(log: Logging, config: AccessoryConfig, api: API) {
    this.log = log;
    this.name = config.name;
    this.api = api;

    this.name = config.name
    this.infoLockService = new hap.Service.AccessoryInformation()
    this.infoNfcAccessService = new hap.Service.AccessoryInformation()

    this.manufacturer = config.manufacturer || "new_inventor"
    this.serial = config.serial || "000000001"
    this.model = config.model || "homebridge-nfc-card"
    this.firmware = config.firmware || "0.0.1"

    this.LockService = new hap.Service.LockMechanism("Computer Lock")
    // create handlers for required characteristics
    this.LockService.getCharacteristic(hap.Characteristic.LockCurrentState)
      .onGet(this.handleLockCurrentStateGet.bind(this));

    this.LockService.getCharacteristic(hap.Characteristic.LockTargetState)
      .onGet(this.handleLockTargetStateGet.bind(this))
      .onSet(this.handleLockTargetStateSet.bind(this));

    this.NfcAccessService = new hap.Service.NFCAccess(this.name)
    this.NfcAccessService.setCharacteristic(hap.Characteristic.NFCAccessSupportedConfiguration, "AQEQAgEQ");

    log.info("Switch finished initializing!");
  }

  /**
  * Handle requests to get the current value of the "Lock Current State" characteristic
  */
  handleLockCurrentStateGet() {
    this.log.debug('Triggered GET LockCurrentState');

    // set this to a valid value for LockCurrentState
    const currentValue = hap.Characteristic.LockCurrentState.UNSECURED;

    return currentValue;
  }


  /**
   * Handle requests to get the current value of the "Lock Target State" characteristic
   */
  handleLockTargetStateGet() {
    this.log.debug('Triggered GET LockTargetState');

    // set this to a valid value for LockTargetState
    const currentValue = hap.Characteristic.LockTargetState.UNSECURED;

    return currentValue;
  }

  /**
   * Handle requests to set the "Lock Target State" characteristic
   */
  handleLockTargetStateSet(value: any) {
    this.log.debug('Triggered SET LockTargetState:' + value);
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
  identify(): void {
    this.log("Identify!");
  }

  /*
   * This method is called directly after creation of this instance.
   * It should return all services which should be added to the accessory.
   */
  getServices(): Service[] {
    this.infoLockService
      .setCharacteristic(hap.Characteristic.Manufacturer, "new_inventor")
      .setCharacteristic(hap.Characteristic.Model, "ComputerCard")
      .setCharacteristic(hap.Characteristic.SerialNumber, this.serial)
      .setCharacteristic(hap.Characteristic.FirmwareRevision, this.firmware)

    this.infoNfcAccessService
      .setCharacteristic(hap.Characteristic.Manufacturer, "new_inventor")
      .setCharacteristic(hap.Characteristic.Model, "ComputerCard")
      .setCharacteristic(hap.Characteristic.SerialNumber, this.serial)
      .setCharacteristic(hap.Characteristic.FirmwareRevision, this.firmware)

    this.NfcAccessService.setCharacteristic(hap.Characteristic.NFCAccessSupportedConfiguration, "AQEQAgEQ");

    // this.NfcAccessService
    //     .getCharacteristic(hap.Characteristic.ConfigurationState)
    //     .on(CharacteristicEventTypes.GET, callback => {
    //       console.log("Queried config state: ");
    //       callback(undefined, 2);
    //     });
    this.NfcAccessService
      .getCharacteristic(hap.Characteristic.NFCAccessControlPoint)
      .on(CharacteristicEventTypes.SET, (value, callback) => {
        console.log("Control Point Write: " + value);
        callback(undefined, "");
      });

    // this.service.setCharacteristic(hap.Characteristic.NFCAccessSupportedConfiguration, "okmabiche")

    this.NfcAccessService.getCharacteristic(hap.Characteristic.ConfigurationState)
      .onGet(this.handleConfigurationStateGet.bind(this))

    // this.service.getCharacteristic(hap.Characteristic.NFCAccessControlPoint)
    //   .on(CharacteristicEventTypes.SET, (value, callback) => {
    //     console.log("Control Point Write: " + value);
    //     callback(undefined, "");
    //   });

    return [this.infoLockService, this.LockService, this.infoNfcAccessService, this.NfcAccessService ]
  }

}
