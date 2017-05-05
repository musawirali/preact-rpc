import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { getStoreHydrationData } from '../api';
import Counter, { reducer } from './component';

const store = createStore(reducer, getStoreHydrationData('counter'));

// TODO:
ReactDOM.render(
  React.createElement(Counter, {store}),
  document.getElementById('counter')
);
