'use strict';

var _redux = require('redux');

var _api = require('../api');

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Register the redux store creator
(0, _api.registerReduxStore)('counter', function (initialState) {
  return (0, _redux.createStore)(_component.reducer, initialState);
});

// Register component for pre-rendering
(0, _api.registerComponent)('counter', _component2.default);