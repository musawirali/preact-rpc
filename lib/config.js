'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Max number of simultaneous connections to allow.
var DEFAULT_MAX_CONNECTIONS = exports.DEFAULT_MAX_CONNECTIONS = 5;
// Max data buffer size for render requests.
var MAX_DATA_BUFFER_SIZE = exports.MAX_DATA_BUFFER_SIZE = 2048;
// Character sequence to mark end of request data.
var DATA_END_MARKER = exports.DATA_END_MARKER = '\r\n.';

exports.default = {};