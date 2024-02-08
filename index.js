// Example Nfc Access Plugin

module.exports = (api) => {
  api.registerAccessory('nfc-card', ExampleNFCAccessAccessory);
};

class ExampleNFCAccessAccessory {

  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;

    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;
    console.log(this.Characteristic);

    // extract name from config
    this.name = config.name;

    // create a new Nfc Access service
    this.service = new this.Service.NFCAccess(this.name);

    this.service.setCharacteristic(Characteristic.NFCAccessSupportedConfiguration, 1);

    // create handlers for required characteristics
    this.service.getCharacteristic(this.Characteristic.ConfigurationState)
      .onGet(console.log(this));

    this.service.getCharacteristic(this.Characteristic.NFCAccessControlPoint)
      .onGet(console.log(this))
      .onSet(console.log(this));

    this.service.getCharacteristic(this.Characteristic.NFCAccessSupportedConfiguration)
      .onGet(console.log(this));

  }
}