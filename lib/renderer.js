'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.processRenderRequest = undefined;

var _util = require('./util');

/**
 * This function takes a JSON payload string containing the
 * render request details.
 * @param {socket} socket - The client socket to send response
 * @param {string} payload - The JSON payload
 */
var processRenderRequest = exports.processRenderRequest = function processRenderRequest(socket, payload) {
  // Parse JSON payload
  try {
    json = JSON.parse(payload);
  } catch (err) {
    console.log('Invalid payload', payload);
    return (0, _util.writeJSON)(socket, {
      error: 'Invalid payload'
    });
  };

  // Check request details

  // Call render method

  // Return rendered HTML string
  (0, _util.writeJSON)(socket, {
    id: 0,
    html: '<div>Hello World</div>'
  });
};

exports.default = {};