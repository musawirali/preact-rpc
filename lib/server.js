'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startServer = undefined;

var _net = require('net');

var _net2 = _interopRequireDefault(_net);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _config = require('./config');

var Config = _interopRequireWildcard(_config);

var _renderer = require('./renderer');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Start the RPC server to handle React rendering requests.
 * @param {string} port - Port for the server to listen on.
 *                        If a numeric value is provided, a TCP socket is created.
 *                        Else, a file socket is created.
 * @param {number} maxConnections - Max simultaneous connects allowed.
 */
var startServer = exports.startServer = function startServer(port) {
  var maxConnections = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Config.DEFAULT_MAX_CONNECTIONS;

  // Create server and register socket event handlers
  var server = _net2.default.createServer(function (socket) {
    console.log('Client connected');

    // Error on client socket
    socket.on('error', function (err) {
      return console.log('Error');
    });

    // Intermediate data buffer for this socket.
    var dataBuff = '';
    var buffLen = 0;
    // Read the full render call payload.
    socket.on('data', function (data) {
      var strData = data.toString();
      var dataLen = strData.length;
      if (buffLen + dataLen > Config.MAX_DATA_BUFFER_SIZE) {
        // Reject
        console.log('Buffer length exceded, resetting.');
      } else {
        var chunks = strData.split(Config.DATA_END_MARKER);
        dataBuff += _underscore2.default.first(chunks);
        if (chunks.length > 1) {
          var payloads = [dataBuff];
          payloads = payloads.concat(chunks.slice(1, -1));
          dataBuff = _underscore2.default.last(chunks);
          buffLen = dataBuff.length;

          _underscore2.default.each(payloads, function (payload) {
            console.log('Received', payload);
            (0, _renderer.processRenderRequest)(socket, payload);
          });
        }
      }
    });
  });

  // Set max connections.
  server.maxConnections = maxConnections;

  var isFileSocket = !_underscore2.default.isFinite(parseInt(port, 10));

  // Logging to see server is listening.
  server.on('listening', function () {
    console.log('Listening on port', port);
    // For file socket, set permissions
    if (isFileSocket) {
      _fs2.default.chmodSync(port, '777');
    }
  });

  // Handle re-listening for file socket by unlinking existing file.
  server.on('error', function (err) {
    if (isFileSocket && err.code === 'EADDRINUSE') {
      console.log('Address in use, deleting socket file.');
      _fs2.default.unlinkSync(port);
      console.log('Start server again');
      server.listen(port);
    } else {
      // Some other error has occurred. Handle it here.
      throw err;
    }
  });

  // Start server.
  console.log('Start server');
  server.listen(port);
};

exports.default = {};