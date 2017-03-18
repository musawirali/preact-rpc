'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeJSON = undefined;

var _config = require('./config');

var Config = _interopRequireWildcard(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var writeJSON = exports.writeJSON = function writeJSON(socket, json) {
  var payload = JSON.stringify(json) + Config.DATA_END_MARKER;
  socket.write(payload);
};

exports.default = {};