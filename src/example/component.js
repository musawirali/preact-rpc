import React from 'react';
import { combineReducers } from 'redux';
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
export const reducer = combineReducers({
  count,
});

// A simple React component
class Counter extends React.Component {
  render() {
    return React.createElement(
      'div',
      null,
      this.props.count,
      React.createElement(
        'button',
        { onClick: () => this.props.dispatch({ type: 'increment' }) },
        'inc'
      ),
      React.createElement(
        'button',
        { onClick: () => this.props.dispatch({ type: 'decrement' }) },
        'dec'
      )
    );
  }
}

export default connect(state => ({...state}))(Counter);
