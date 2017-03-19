"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// React component registry
var ReactComponents = void 0;

// Expose the registry globally
(function () {
  if (!global.preactRPCGetComponent) {
    ReactComponents = {};
    global.preactRPCGetComponent = function (id) {
      return ReactComponents[id];
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

exports.default = {};