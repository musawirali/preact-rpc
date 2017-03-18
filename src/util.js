import * as Config from './config';

export const writeJSON = (socket, json) => {
  const payload = JSON.stringify(json) + Config.DATA_END_MARKER;
  socket.write(payload);
}

export default {};
