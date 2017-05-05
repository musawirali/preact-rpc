// React component registry
let ReactComponents;
// Redux store registry
let ReduxStores;

// Expose the registry globally
(function() {
  if ('undefined' !== typeof global) { // Only on server side
    if (!global.preactRPCGetComponent) {
      ReactComponents = {};
      ReduxStores = {};
      global.preactRPCGetComponent = id => ReactComponents[id];
      global.preactRPCGetStoreCreator = id => ReduxStores[id];
    }
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
 * @param {function} createStore - A function that returns a Redux store
 */
export const registerReduxStore = (id, createStore) => (
  ReduxStores[id] = createStore
);

/**
 * Get the Redux store hydration data, that is rendered from
 * server side to initialize client side.
 * @param {string} storeName - The registered store name
 */
export const getStoreHydrationData = (storeName) => {
  const elms = document.getElementsByClassName('preact-rpc-store');
  for (var i = 0; i < elms.length; i++) {
    if (elms[i].dataset.storeName === storeName) {
      return JSON.parse(elms[i].dataset.props);
    }
  }
  return null;
}

export default {};
