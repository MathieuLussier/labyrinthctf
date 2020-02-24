'use strict';

const LOAD_ONLINE = true;
const net = require('net');
const fs = require('fs');
const path = require('path');
const board = require('./board');
const pawn = require('./pawn');

let client;
if (LOAD_ONLINE) {
    client = net.createConnection({ port: 17017, host: 'csi.cstjean.qc.ca' });

    client.on('connect', function() {
        console.log('Connected');
        startTimeout();
    });

    client.on('data', function(data) {
        console.log(data.toString());
        board.getTcpData(data.toString());
    });

    client.on('error', function(err) { throw err });

    client.on('close', function() {
        console.log('Connection closed');
    });

    client.on('end', function() {
        console.log('disconnected from server');
    });
}

function startTimeout() {
    setTimeout(async () => {
        await main(async () => {
            console.log('Writing to server');
            pawn.path += ',RIGHT';
            console.log(pawn.path);
            client.write(pawn.path);
            client.end();
        });
    }, 1000);

    setTimeout(() => {
        client.destroy();
    }, 60000);
}

async function main(callback) {
       console.time('RunTime');
       if (LOAD_ONLINE) {
           await board.formatLines();
       }
       await board.loadJsonBoard();
       await board.create2DBoard();
       await board.printBoard();
       await board.defineStartEndPoint();
       await pawn.init();
       let loop = true;
       while (loop) {
           loop = await pawn.walk();
       }
       callback();
}

if (!LOAD_ONLINE) {
    main(() => {
        console.log('finished');
    });
}

module.exports.main = main;
