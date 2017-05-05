var api = require('./lib/api')

module.exports = {
  registerComponent: api.registerComponent,
  registerReduxStore: api.registerReduxStore,
  getStoreHydrationData: api.getStoreHydrationData,
};
