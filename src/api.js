// React component registry
let ReactComponents;

// Expose the registry globally
(function() {
  if (!global.preactRPCGetComponent) {
    ReactComponents = {};
    global.preactRPCGetComponent = id => ReactComponents[id];
  }
})();

/**
 * Register a component to make it available for RPC rendering.
 * @param {string} id - A unique ID for component
 * @param {comp} component - A React component
 */
export const registerComponent = (id, component) => (
  ReactComponents[id] = component
);

export default {};
