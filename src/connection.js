'use strict';

const net = require('net');
const index = require('./index');
const board = require('./board');

const client = net.createConnection({port: process.env.CTF_PORT, host: process.env.CTF_HOST}, function() {
    console.log('Connected');
});

client.on('data', function(data) {
    board.getTcpData(data.toString());
});

setTimeout(() => {
    index.main();
}, 2000);

client.on('error', function(err) { throw err });

client.on('close', function() {
    console.log('Connection closed');
});

client.on('end', function() {
    console.log('disconnected from server');
});

module.exports = client;
