import React from 'react';
import ReactDOMServer from 'react-dom/server';
import winston from 'winston';
import { writeJSON } from './util';

/**
 * This function takes a JSON payload string containing the
 * render request details.
 * @param {socket} socket - The client socket to send response
 * @param {string} payload - The JSON payload
 */
export const processRenderRequest = (socket, payload) => {
  // Parse JSON payload
  let json;
  try {
    json = JSON.parse(payload);
  } catch(err) {
    winston.error('Invalid payload', payload);
    return writeJSON(socket, {
      error: 'Invalid payload',
    });
  };

  // Check request details
  const component = global.preactRPCGetComponent(json.component);
  if (!component) {
    winston.error(`Component ${json.component} not found in registry`);
    return writeJSON(socket, {
      id: json.id,
      error: `Component ${json.component} not found in registry`,
    });
  }

  let store = null;
  if (!!json.store) {
    const createStore = global.preactRPCGetStoreCreator(json.store);
    if (!createStore) {
      winston.error(`Store creator with ID ${json.store} not found in registry`);
      return writeJSON(socket, {
        id: json.id,
        error: `Store creator with ID ${json.store} not found in registry`,
      });
    }

    try {
      store = createStore(json.props);
      if (!store) {
        winston.error(`Store creation error [${json.store}]: returned null`);
        return writeJSON(socket, {
          id: json.id,
          error: `Store creation error [${json.store}]: returned null`,
        });
      }
    } catch (err) {
      winston.error(`Store creation error [${json.store}]: ${err.toString()}`);
      return writeJSON(socket, {
        id: json.id,
        error: `Store creation error [${json.store}]: ${err.toString()}`,
      });
    }
  }

  // Call render method
  let html;
  try {
    html = ReactDOMServer.renderToString(
      React.createElement(
        component,
        store ? {store} : (json.props || {})
      )
    );
  } catch(err) {
    winston.error(`Render error [${json.component}]: ${err.toString()} ${err.stack}`);
    return writeJSON(socket, {
      id: json.id,
      error: `Render error [${json.component}]: ${err.toString()}`,
    });
  }

  // Return rendered HTML string
  writeJSON(socket, {
    id: json.id,
    html,
  });
  winston.info('Render response sent');
};

export default {};
