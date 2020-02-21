'use strict';

const LOAD_ONLINE = true;
const net = require('net');
const board = require('./board');
const pawn = require('./pawn');

if (LOAD_ONLINE) {
    const client = net.createConnection({ port: 17017, host: '52.235.37.30' });

    client.on('connect', function() {
        console.log('Connected')
    });

    client.on('data', function(data) {
        board.getTcpData(data.toString());
    });

    setTimeout(() => {
        main();
    }, 1700);

    client.on('error', function(err) { throw err });

    client.on('close', function() {
        console.log('Connection closed');
    });

    client.on('end', function() {
        console.log('disconnected from server');
    });
}

async function main() {
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
}

if (!LOAD_ONLINE) {
    main();
}

module.exports.main = main;
