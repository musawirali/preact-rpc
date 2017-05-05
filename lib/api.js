'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// React component registry
var ReactComponents = void 0;
// Redux store registry
var ReduxStores = void 0;

// Expose the registry globally
(function () {
  if ('undefined' !== typeof global) {
    // Only on server side
    if (!global.preactRPCGetComponent) {
      ReactComponents = {};
      ReduxStores = {};
      global.preactRPCGetComponent = function (id) {
        return ReactComponents[id];
      };
      global.preactRPCGetStoreCreator = function (id) {
        return ReduxStores[id];
      };
    }
  }
})();

/**
 * Register a component to make it available for RPC rendering.
 * @param {string} id - A unique ID for component
 * @param {comp} component - A React component
 */
var registerComponent = exports.registerComponent = function registerComponent(id, component) {
  return ReactComponents[id] = component;
};

/**
 * Register a store to make it available for RPC rendering.
 * @param {string} id - A unique ID for store
 * @param {function} createStore - A function that returns a Redux store
 */
var registerReduxStore = exports.registerReduxStore = function registerReduxStore(id, createStore) {
  return ReduxStores[id] = createStore;
};

/**
 * Get the Redux store hydration data, that is rendered from
 * server side to initialize client side.
 * @param {string} storeName - The registered store name
 */
var getStoreHydrationData = exports.getStoreHydrationData = function getStoreHydrationData(storeName) {
  var elms = document.getElementsByClassName('preact-rpc-store');
  for (var i = 0; i < elms.length; i++) {
    if (elms[i].dataset.storeName === storeName) {
      return JSON.parse(elms[i].dataset.props);
    }
  }
  return null;
};

exports.default = {};