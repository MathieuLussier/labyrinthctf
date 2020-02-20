'use strict';
const fs = require('fs');

const Board = function() {
    this.startPointChar = 'S';
    this.endPointChar = 'E';
    this.startPoint = { x: 0, y: 0 };
    this.endPoint = { x: 0, y: 0 };
    this.corridor = ',';
    this.wall = '+';
    this.data;
    this.lines = [];
    this.labyrinth = [];
};

Board.prototype.loadJsonBoard = function() {
    return new Promise((resolve, reject) => {
       try {
           const file = JSON.parse(fs.readFileSync('labyrinth.json'));
           this.lines = file;
           resolve();
       } catch (e) {
           throw new Error(e);
       }
    });
};

Board.prototype.getTcpData = function(data) {
    this.data += data;
};

Board.prototype.formatLines = function() {
    return new Promise(async (resolve, reject) => {
        try {
            if (this.data == null || typeof this.data === 'undefined') { reject(new Error('Data from server is empty ?')); return }
            let arr = this.data.split(/\r?\n/);
            arr = arr.filter((a) => {return a!=='' });
            arr.shift();arr.shift();
            this.lines = arr;
            await fs.writeFileSync('labyrinth.json', JSON.stringify(arr), { encoding: 'utf-8' });
            resolve();
        } catch (e) {
            throw new Error(e);
        }
    });
};

Board.prototype.create2DBoard = function() {
    return new Promise(async (resolve, reject) => {
       try {
           const arr2D = [];
           await this.lines.map((line , index) => {
               const arr = line.split(',');
               arr2D.push(arr);
           });
           this.labyrinth = arr2D;
           resolve();
       } catch (e) {
           throw new Error(e);
       }
    });
};

Board.prototype.printBoard = function() {
    return new Promise(async (resolve, reject) => {
        try {
            console.table(this.labyrinth);
            resolve();
        } catch (e) {
            throw new Error(e);
        }
    });
};

Board.prototype.defineStartEndPoint= function() {
  return new Promise(async (resolve, reject) => {
    try {
        this.startPoint = await this.getPoint(this.startPointChar);
        this.endPoint = await this.getPoint(this.endPointChar);
        resolve();
    } catch (e) {
        throw e;
    }
  });
};

Board.prototype.getPoint = function(char) {
    return new Promise((resolve, reject) => {
        try {
            for (let i = 0; i < this.labyrinth.length; i++) {
                for (let j = 0; j < this.labyrinth[i].length; j++) {
                    if (this.labyrinth[i][j] === char) {
                        resolve({ x: j, y: i });
                        break;
                    }
                }
            }
            reject('Cant found the point: ' + char);
        } catch (e) {
            throw new Error(e);
        }
    });
};

const instance = new Board();

module.exports = instance;
