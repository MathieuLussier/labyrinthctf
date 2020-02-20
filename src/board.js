const fs = require('fs');

const startPoint = 'S';
const endPoint = 'E';
const corridor = ',';
const wall = '+';


const Board = function() {
    this.data;
    this.lines = [];
    this.board = [];
};

Board.prototype.loadJsonBoard = () => {
    return new Promise((resolve, reject) => {
       try {
           const file = fs.readFileSync('board.json');
           this.lines = JSON.parse(file);
           resolve();
       } catch (e) {
           throw new Error(e);
       }
    });
};

Board.prototype.getTcpData = (data) => {
    this.data += data;
};

Board.prototype.formatLines = () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (this.data == null || typeof this.data === 'undefined') { reject(new Error('Data from server is empty ?')); return }
            let arr = this.data.split(/\r?\n/);
            arr = arr.filter((a) => {return a!=='' });
            arr.shift();arr.shift();
            this.lines = arr;
            await fs.writeFileSync('board.json', JSON.stringify(arr), { encoding: 'utf-8' });
            resolve();
        } catch (e) {
            throw new Error(e);
        }
    });
};

Board.prototype.create2DBoard = () => {
    return new Promise(async (resolve, reject) => {
       try {
           const arr2D = [];
           await this.lines.map((line , index) => {
               const arr = line.split(',');
               arr2D.push(arr);
           });
           this.board = arr2D;
           resolve();
       } catch (e) {
           throw new Error(e);
       }
    });
};

Board.prototype.printBoard = () => {
    return new Promise(async (resolve, reject) => {
        try {
            console.table(this.board);
            resolve();
        } catch (e) {
            throw new Error(e);
        }
    });
};

Board.prototype.getStartPoint = () => {
    return new Promise((resolve, reject) => {
        try {
            for (let i = 0; i < this.board.length; i++) {

            }
            resolve({ x: 0, y: 0 });
        } catch (e) {
            throw new Error(e);
        }
    });
};

const singleton = new Board();

Object.freeze(singleton);

module.exports = singleton;
