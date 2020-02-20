const board = require('./board');

const Pawn = function() {
  this.currentPosition = { x: 0, y: 0 };
};

Pawn.prototype.init = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await board.getStartPoint().then((v) => { this.currentPosition = v });
            console.log(this.currentPosition);
            resolve();
        } catch (e) {
            throw new Error(e);
        }
    });
};

const singleton = new Pawn();

Object.freeze(singleton);

module.exports = singleton;
