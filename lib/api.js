"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// React component registry
var ReactComponents = void 0;
// Redux store registry
var ReduxStores = void 0;

// Expose the registry globally
(function () {
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
 * @param {function} createStore - A function that returns a redux store
 */
var registerReduxStore = exports.registerReduxStore = function registerReduxStore(id, createStore) {
  return ReduxStores[id] = createStore;
};

exports.default = {};