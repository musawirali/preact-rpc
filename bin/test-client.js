#!/usr/bin/env node

var net = require('net');
var _ = require('underscore');
var marker = require('../lib/config').DATA_END_MARKER;

var client = net.connect('server.sock', function() {
  console.log('Connected');
  client.write(JSON.stringify({
    id: 1,
    component: 'hello',
    props: {
      toWhat: 'Universe',
    },
  }) + marker);
});

client.on('error', function(err) {
  console.log('Error', err);
});

client.on('data', function(data) {
  console.log('===DATA===');
  console.log(data.toString());
});
