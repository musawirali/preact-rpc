'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _redux = require('redux');

var _api = require('../api');

var _component = require('./component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var store = (0, _redux.createStore)(_component.reducer, (0, _api.getStoreHydrationData)('counter'));

// TODO:
_reactDom2.default.render(_react2.default.createElement(_component2.default, { store: store }), document.getElementById('counter'));