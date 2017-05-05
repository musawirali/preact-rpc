'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processRenderRequest = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * This function takes a JSON payload string containing the
 * render request details.
 * @param {socket} socket - The client socket to send response
 * @param {string} payload - The JSON payload
 */
var processRenderRequest = exports.processRenderRequest = function processRenderRequest(socket, payload) {
  // Parse JSON payload
  var json = void 0;
  try {
    json = JSON.parse(payload);
  } catch (err) {
    _winston2.default.error('Invalid payload', payload);
    return (0, _util.writeJSON)(socket, {
      error: 'Invalid payload'
    });
  };

  // Check request details
  var component = global.preactRPCGetComponent(json.component);
  if (!component) {
    _winston2.default.error('Component ' + json.component + ' not found in registry');
    return (0, _util.writeJSON)(socket, {
      id: json.id,
      error: 'Component ' + json.component + ' not found in registry'
    });
  }

  var store = null;
  if (!!json.store) {
    var createStore = global.preactRPCGetStoreCreator(json.store);
    if (!createStore) {
      _winston2.default.error('Store creator with ID ' + json.store + ' not found in registry');
      return (0, _util.writeJSON)(socket, {
        id: json.id,
        error: 'Store creator with ID ' + json.store + ' not found in registry'
      });
    }

    try {
      store = createStore(json.props);
      if (!store) {
        _winston2.default.error('Store creation error [' + json.store + ']: returned null');
        return (0, _util.writeJSON)(socket, {
          id: json.id,
          error: 'Store creation error [' + json.store + ']: returned null'
        });
      }
    } catch (err) {
      _winston2.default.error('Store creation error [' + json.store + ']: ' + err.toString());
      return (0, _util.writeJSON)(socket, {
        id: json.id,
        error: 'Store creation error [' + json.store + ']: ' + err.toString()
      });
    }
  }

  // Call render method
  var html = void 0;
  try {
    html = _server2.default.renderToString(_react2.default.createElement(component, store ? { store: store } : json.props || {}));
  } catch (err) {
    _winston2.default.error('Render error [' + json.component + ']: ' + err.toString() + ' ' + err.stack);
    return (0, _util.writeJSON)(socket, {
      id: json.id,
      error: 'Render error [' + json.component + ']: ' + err.toString()
    });
  }

  // Return rendered HTML string
  (0, _util.writeJSON)(socket, {
    id: json.id,
    html: html
  });
  _winston2.default.info('Render response sent');
};

exports.default = {};