'use strict';

const LOAD_ONLINE = true;
const net = require('net');
const fs = require('fs');
const path = require('path');
const board = require('./board');
const pawn = require('./pawn');

if (LOAD_ONLINE) {
    const client = net.createConnection({ port: 17017, host: 'csi.cstjean.qc.ca' });

    client.on('connect', async function() {
        console.log('Connected');
        await main();
        const pathing = await JSON.parse(fs.readFileSync(path.join(__dirname, '/path.json')));
        console.log('Writing to server');
        console.table(pathing);
        await client.write(pathing);
    });

    client.on('data', function(data) {
        board.getTcpData(data.toString());
    });

    setTimeout(() => {
        client.destroy();
    }, 10000);

    client.on('error', function(err) { throw err });

    client.on('close', function() {
        console.log('Connection closed');
    });

    client.on('end', function() {
        console.log('disconnected from server');
    });
}

async function main() {
    return new Promise(async (resolve, reject) => {
       try {
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
           resolve();
       } catch(e) {
           throw e;
       }
    });
}

if (!LOAD_ONLINE) {
    main();
}

module.exports.main = main;
