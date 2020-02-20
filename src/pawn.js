'use strict';
const board = require('./board');
const Direction = require('./direction');


const Pawn = function() {
    this.pawn = 'P';
    this.currentPosition = { x: 0, y: 0 };
    this.path = [];
    this.backtrack = [];
    this.direction = { x: 1, y: 0 };
};

Pawn.prototype.init = () => {
    return new Promise(async (resolve, reject) => {
        try {
            this.currentPosition = await board.getStartPoint();
            console.log(this.currentPosition);
            resolve();
        } catch (e) {
            throw new Error(e);
        }
    });
};

Pawn.prototype.scanStartDirection = () => {
    return new Promise((resolve, reject) => {
        try {
            resolve(Direction.RIGHT);
        } catch (e) {
            throw e;
        }
    });
};

const singleton = new Pawn();

Object.freeze(singleton);

module.exports = singleton;
