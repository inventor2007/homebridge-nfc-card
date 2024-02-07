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

    // extract name from config
    this.name = config.name;

    // create a new Nfc Access service
    this.service = new this.Service(this.Service.NFCAccess);

    // create handlers for required characteristics
    this.service.getCharacteristic(this.Characteristic.ConfigurationState)
      .onGet(this.handleConfigurationStateGet.bind(this));

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


}