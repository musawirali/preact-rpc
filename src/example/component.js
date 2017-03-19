import React from 'react';
import { registerComponent } from '../api';

// A simple React component
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

// Register component for pre-rendering
registerComponent('hello', Hello);
