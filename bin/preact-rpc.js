#!/usr/bin/env node

var fs = require('fs');
var sh = require('shelljs');
var StartServer = require('../lib/server').startServer;

/**
 * Parse command line args
 * Sample usage:
 * preact-rpc --bundle=./my-bundle.js --port=./tmp/server.sock
 */
var bundle = null;
var port = null;

for (var i = 0; i < process.argv.length; i++) {
  var arg = (process.argv[i] || '').split('=');
  if (arg.length === 2) {
    if (!bundle && (arg[0] || '').trim() == '--bundle') {
      bundle = (arg[1] || '').trim();
    } else if (!port && (arg[0] || '').trim() == '--port') {
      port = (arg[1] || '').trim();
    }
  }

  // Found required args, break.
  if (bundle && port) {
    break;
  }
}

// Check arg validity
if (!bundle || !port) {
  console.error('Required arguments not found.');
  console.error('Usage: preact-rpc --bundle=[path to JS bundle file] --port=[port number or socket file name]');
  console.error('Example: preact-rpc --bundle=./my-bundle.js --port=./tmp/server.sock');
  process.exit();
}

// Load bundle file
try {
  require(sh.pwd() + '/' + bundle);
} catch (err) {
  console.error('Failed to load bundle file:', bundle);
  console.error(err.toString());
  process.exit();
}

// Check for gloabl component registry getter function
if (!global.preactRPCGetComponent) {
  console.error('Invalid bundle file', bundle);
  process.exit();
}

/**
 * Start RPC server
 */
StartServer(port);
