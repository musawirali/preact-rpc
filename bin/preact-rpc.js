#!/usr/bin/env node
var StartServer = require('../lib/server').startServer;

//StartServer(3232);
StartServer('server.sock');
