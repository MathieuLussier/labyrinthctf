const net = require('net');
const board = require('./board');
const pawn = require('./pawn');
const client = new net.Socket();

client.connect({port: 17017, host: 'csi.cstjean.qc.ca'}, function() {
    console.log('Connected');
});

client.on('data', function(data) {
    console.log(data.toString());
    board.getTcpData(data.toString());
});

setTimeout(() => {
    client.destroy();
}, 2000);

client.on('error', function(err) { throw new Error(err) });

client.on('close', function() {
    console.log('Connection closed');
    main();
});

// main();

async function main() {
    await board.formatLines();
    // await board.loadJsonBoard();
    await board.create2DBoard();
    await board.printBoard();
    await pawn.init();
}
