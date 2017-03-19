import React from 'react';
import ReactDOMServer from 'react-dom/server';
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
    console.log('Invalid payload', payload, err);
    return writeJSON(socket, {
      error: 'Invalid payload',
    });
  };

  // Check request details
  const component = global.preactRPCGetComponent(json.component);
  if (!component) {
    return writeJSON(socket, {
      id: json.id,
      error: `Component ${json.component} not found in registry`,
    });
  }

  // Call render method
  let html;
  try {
    html = ReactDOMServer.renderToString(
      React.createElement(
        component,
        json.props || {}
      )
    );
  } catch(err) {
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
};

export default {};
