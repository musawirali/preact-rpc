import { createStore } from 'redux';
import { registerComponent, registerReduxStore } from '../api';
import Counter, { reducer } from './component';

// Register the redux store creator
registerReduxStore('counter', initialState => {
  return createStore(reducer, initialState);
});

// Register component for pre-rendering
registerComponent('counter', Counter);
