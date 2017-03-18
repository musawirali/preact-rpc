import { writeJSON } from './util';

/**
 * This function takes a JSON payload string containing the
 * render request details.
 * @param {socket} socket - The client socket to send response
 * @param {string} payload - The JSON payload
 */
export const processRenderRequest = (socket, payload) => {
  // Parse JSON payload
  try {
    json = JSON.parse(payload);
  } catch(err) {
    console.log('Invalid payload', payload);
    return writeJSON(socket, {
      error: 'Invalid payload',
    });
  };

  // Check request details

  // Call render method

  // Return rendered HTML string
  writeJSON(socket, {
    id: 0,
    html: '<div>Hello World</div>',
  });
};

export default {};
