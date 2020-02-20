'use strict';

require('dotenv').config({ path: __dirname + '../.env', encoding: 'utf-8'});
console.log('Is loading online: ' + Boolean(process.env.LOAD_ONLINE));
if (Boolean(process.env.LOAD_ONLINE)) {
    require('./connection');
}
const board = require('./board');
const pawn = require('./pawn');

async function main() {
    if (Boolean(process.env.LOAD_ONLINE)) {
        await board.formatLines();
    }
    await board.loadJsonBoard();
    await board.create2DBoard();
    await board.printBoard();
    await board.defineStartEndPoint();
    await pawn.init();
}

if (!Boolean(process.env.LOAD_ONLINE)) {
    main();
}

module.exports.main = main;
