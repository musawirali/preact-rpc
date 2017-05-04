// React component registry
let ReactComponents;
// Redux store registry
let ReduxStores;

// Expose the registry globally
(function() {
  if (!global.preactRPCGetComponent) {
    ReactComponents = {};
    ReduxStores = {};
    global.preactRPCGetComponent = id => ReactComponents[id];
    global.preactRPCGetStoreCreator = id => ReduxStores[id];
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

/**
 * Register a store to make it available for RPC rendering.
 * @param {string} id - A unique ID for store
 * @param {function} createStore - A function that returns a redux store
 */
export const registerReduxStore = (id, createStore) => (
  ReduxStores[id] = createStore
);

export default {};
