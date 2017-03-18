#!/usr/bin/env node

var net = require('net');
var _ = require('underscore');

var client = net.connect('server.sock', function() {
  console.log('Connected');
  _.times(20, function() {
    client.write('This is my data\r\n.');
  });
});

client.on('error', function(err) {
  console.log('Error', err);
});

client.on('data', function(data) {
  console.log('===DATA===');
  console.log(data.toString());
});
