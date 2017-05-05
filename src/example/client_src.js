import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import Counter, { reducer } from './component';

const storeHydrationData = storeName => {
  const elms = document.getElementsByClassName('preact-rpc-store');
  for (var i = 0; i < elms.length; i++) {
    if (elms[i].dataset.storeName === storeName) {
      return JSON.parse(elms[i].dataset.props);
    }
  }
  return null;
}

const store = createStore(reducer, storeHydrationData('counter'));

// TODO:
ReactDOM.render(
  React.createElement(Counter, {store}),
  document.getElementById('counter')
);
