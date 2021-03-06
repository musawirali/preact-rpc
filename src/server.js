import net from 'net';
import fs from 'fs';
import _ from 'underscore';
import winston from 'winston';
import * as Config from './config';
import { processRenderRequest } from './renderer';

/**
 * Start the RPC server to handle React rendering requests.
 * @param {string} port - Port for the server to listen on.
 *                        If a numeric value is provided, a TCP socket is created.
 *                        Else, a file socket is created.
 * @param {number} maxConnections - Max simultaneous connects allowed.
 */
export const startServer = (port, maxConnections = Config.DEFAULT_MAX_CONNECTIONS) => {
  // Create server and register socket event handlers
  const server = net.createServer(socket => {
    winston.info('Client connected');

    // Error on client socket
    socket.on('error', err => winston.error(err));

    // Intermediate data buffer for this socket.
    let dataBuff = '';
    let buffLen = 0;
    // Read the full render call payload.
    socket.on('data', data => {
      const strData = data.toString();
      const dataLen = strData.length;
      if ((buffLen + dataLen) > Config.MAX_DATA_BUFFER_SIZE) {
        // Reject
        winston.error('Buffer length exceded, resetting.');
      } else {
        const chunks = strData.split(Config.DATA_END_MARKER);
        dataBuff += _.first(chunks);
        if (chunks.length > 1) {
          let payloads = [dataBuff];
          payloads = payloads.concat(chunks.slice(1, -1));
          dataBuff = _.last(chunks);
          buffLen = dataBuff.length;

          _.each(payloads, payload => {
            winston.info('Received', payload);
            processRenderRequest(socket, payload);
          });
        }
      }
    });
  });

  // Set max connections.
  server.maxConnections = maxConnections;

  const isFileSocket = !_.isFinite(parseInt(port, 10));

  // Logging to see server is listening.
  server.on('listening', () => {
    winston.info('Listening on port', port);
    // For file socket, set permissions
    if (isFileSocket) {
      fs.chmodSync(port, '777');
    }
  });

  // Handle re-listening for file socket by unlinking existing file.
  server.on('error', err => {
    if (isFileSocket && err.code === 'EADDRINUSE') {
      winston.info('Address in use, deleting socket file.');
      fs.unlinkSync(port);
      winston.info('Start server again');
      server.listen(port);
    } else {
      // Some other error has occurred. Handle it here.
      throw err;
    }
  });

  // Start server.
  winston.info('Start server');
  server.listen(port);
};

export default {};
