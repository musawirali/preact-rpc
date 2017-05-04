import React from 'react';
import { registerComponent, registerReduxStore } from '../api';
import { createStore, combineReducers } from 'redux';
import { connect } from 'react-redux';

// Count reducer
const count = (state = 10, action) => {
  switch (action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state -1;
    default:
      return state;
  }
}

// The store reducer for our Counter component.
const mainReducer = combineReducers({
  count,
});

// Register the redux store creator
registerReduxStore('counter', initialState => {
  return createStore(mainReducer, initialState);
});

// A simple React component
class Counter extends React.Component {
  render() {
    return React.createElement(
      "div",
      null,
      this.props.count
    );
  }
}

// Register component for pre-rendering
registerComponent('counter', connect(state => ({...state}))(Counter));
