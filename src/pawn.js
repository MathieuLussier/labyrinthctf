'use strict';
const board = require('./board');
const Direction = require('./direction');

const Pawn = function() {
    this.pawn = 'P';
    this.pos = { x: 0, y: 0 };
    this.path = [];
    this.backtrack = [];
    this.direction = { x: 1, y: 0 };
};

Pawn.prototype.init = function() {
    return new Promise(async (resolve, reject) => {
        try {
            this.pos = board.startPoint;
            console.log(this.pos);
            this.direction = await this.scanStartDirection();
            console.log(this.direction);
            resolve();
        } catch (e) {
            throw new Error(e);
        }
    });
};

Pawn.prototype.scanStartDirection = function() {
    return new Promise((resolve, reject) => {
        try {
            resolve(Direction.RIGHT);
        } catch (e) {
            throw e;
        }
    });
};

const instance = new Pawn();

module.exports = instance;
