'use strict';
const fs = require('fs');
const board = require('./board');
const Direction = require('./direction');

const Pawn = function() {
    this.pawnChar = '\u1F68';
    this.pos = { x: 0, y: 0 };
    this.path = [];
    this.backtrack = [];
    this.direction = { x: 1, y: 0 };
    this.history = {
            count: 0,
            pos: []
        };
    this.isFinish = false;
};

Pawn.prototype.init = function() {
    return new Promise(async (resolve, reject) => {
        try {
            this.pos = board.startPoint;
            this.direction = Direction.RIGHT;
            // await this.printPosDirection();
            // await this.setPawnPosOnBoard();
            resolve();
        } catch (e) {
            throw new Error(e);
        }
    });
};

Pawn.prototype.walk = function() {
    return new Promise(async (resolve, reject) => {
        try {
            // console.log('Walking ...');

            // scan for adjacent potential route for later
            await this.scanCurrentPos();

            // Check the colision on front of the pawn depend on the direction
            const isColision = await this.checkColision();
            // console.log(isColision);
            if (isColision === false) {
                await this.move();
            } else {
                this.pos = this.backtrack[this.backtrack.length - 1].pos;
                this.direction = this.backtrack[this.backtrack.length - 1].direction;
                await this.removeJunkPath(this.backtrack[this.backtrack.length - 1]);
                this.backtrack.pop();
                await this.move();
            }

            const win = await this.checkWin();
            if (win) {
                this.isFinish = true;
                console.log('End point reach !');
                console.log(await this.getPosPlusDir(this.pos, this.direction));
                console.table(this.path);
                // let x = board.startPoint.x;
                // let y = board.startPoint.y;
                // for (let i = 0; i < this.path.length; i++) {
                //     console.log(this.path[i]);
                //     console.log(x + ' ' + y);
                //     // board[y][x] = '#';
                //     switch(this.path[i]) {
                //         case 'UP':
                //             y--;
                //             break;
                //         case 'DOWN':
                //             y++;
                //             break;
                //         case 'RIGHT':
                //             x++;
                //             break;
                //         case 'LEFT':
                //             x--;
                //             break;
                //     }
                // }
                console.log(this.path.length);
                await this.pathToString();
                // console.log(this.path);
                await fs.writeFileSync('path.json', JSON.stringify(this.path, null, 4), { encoding: 'utf-8' });
                board.printBoard();
                console.timeEnd('RunTime');
            }

            // console.dir(this.backtrack);
            // board.printBoard();
            // this.printPosDirection();
            resolve(!this.isFinish);
        } catch (e) {
            throw new Error(e);
        }
    });
};

Pawn.prototype.removeJunkPath = function(backtrack) {
    return new Promise(async (resolve, reject) => {
        try {
            while(this.history.count > backtrack.count) {
                this.path.pop();
                await this.removePawnPosOnBoard(this.history.pos[this.history.pos.length - 1]);
                this.history.pos.pop();
                this.history.count--;
            }
            resolve();
        } catch (e) {
            throw e;
        }
    });
};

Pawn.prototype.move = function() {
    return new Promise(async (resolve, reject) => {
        try {
            this.pos = await this.getPosPlusDir(this.pos, this.direction);
            await this.setPawnPosOnBoard();
            this.path.push(await Direction.formatString(this.direction));
            const historyPos = { x: this.pos.x, y: this.pos.y };
            this.history.pos.push(historyPos);
            this.history.count++;
            resolve();
        } catch (e) {
            throw e;
        }
    });
};

Pawn.prototype.checkColision = function() {
    return new Promise(async (resolve, reject) => {
        try {
            let colisionPos = await this.getPosPlusDir(this.pos, this.direction);
            if (board.labyrinth[colisionPos.y][colisionPos.x] === board.wall) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            throw e;
        }
    });
};

Pawn.prototype.checkWin = function() {
    return new Promise(async (resolve, reject) => {
        try {
            let colisionPos = await this.getPosPlusDir(this.pos, this.direction);
            if (board.labyrinth[colisionPos.y][colisionPos.x] === board.endPointChar) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            throw e;
        }
    });
};

Pawn.prototype.scanCurrentPos = function() {
    return new Promise(async (resolve, reject) => {
        try {
            const left = await Direction.getLeftPos(this.pos, this.direction);
            const right = await Direction.getRightPos(this.pos, this.direction);
            // console.log('leftPos' + left.pos.x + left.pos.y);
            // console.log('rightPos' + right.pos.x + right.pos.y);
            if (board.labyrinth[left.pos.y][left.pos.x] === ' ') {
                this.backtrack.push({pos: this.pos, direction: left.direction, count: this.history.count});
            }
            if (board.labyrinth[right.pos.y][right.pos.x] === ' ') {
                this.backtrack.push({pos: this.pos, direction: right.direction, count: this.history.count});
            }
            resolve();
        } catch (e) {
            throw e;
        }
    });
};

Pawn.prototype.printPosDirection = function() {
    return new Promise((resolve, reject) => {
        try {
            console.log(`Position: x: ${this.pos.x} y: ${this.pos.y}`);
            console.log(`Direction: ${Direction.formatString(this.direction)}`);
            resolve();
        } catch (e) {
            throw e;
        }
    });
};

Pawn.prototype.getPosPlusDir = function(pos, dir) {
    return new Promise((resolve, reject) => {
        try {
            let returnedResult = { x: 0, y: 0};
            returnedResult.x = pos.x + dir.x;
            returnedResult.y = pos.y + dir.y;
            resolve(returnedResult);
        } catch (e) {
            throw e;
        }
    });
};

Pawn.prototype.setPawnPosOnBoard = function() {
    return new Promise((resolve, reject) => {
        try {
            board.labyrinth[this.pos.y][this.pos.x] = this.pawnChar;
            resolve();
        } catch (e) {
            throw e;
        }
    });
};

Pawn.prototype.removePawnPosOnBoard = function(pos) {
    return new Promise((resolve, reject) => {
        try {
            board.labyrinth[pos.y][pos.x] = ' ';
            resolve();
        } catch (e) {
            throw e;
        }
    });
};

Pawn.prototype.pathToString = function() {
    return new Promise(async (resolve, reject) => {
        try {
            this.path = await this.path.join(',');
            resolve();
        } catch (e) {
            throw e;
        }
    });
};

const instance = new Pawn();

module.exports = instance;
