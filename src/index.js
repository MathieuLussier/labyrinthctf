'use strict';

require('dotenv').config();
const net = require('net');
const board = require('./board');
const pawn = require('./pawn');


// const client = net.createConnection({port: process.env.CTF_PORT, host: process.env.CTF_HOST}, function() {
//     console.log('Connected');
// });
//
// client.on('data', function(data) {
//     console.log(data.toString());
//     labyrinth.getTcpData(data.toString());
// });
//
// setTimeout(() => {
//     client.destroy();
// }, 2000);
//
// client.on('error', function(err) { throw err });
//
// client.on('close', function() {
//     console.log('Connection closed');
//     main();
// });
//
// client.on('end', function() {
//     console.log('disconnected from server');
// });

main();

async function main() {
    // await labyrinth.formatLines();
    await board.loadJsonBoard();
    await board.create2DBoard();
    await board.printBoard();
    await board.defineStartEndPoint();
    await pawn.init();
}
