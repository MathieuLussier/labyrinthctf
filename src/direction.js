const Direction = {
    UP: { x: 0, y: -1 },
    RIGHT: { x: 1, y: 0 },
    LEFT: { x: -1, y: 0 },
    DOWN: { x: 0, y: 1 },
    formatString: function(dir) {
        switch(dir) {
            case this.UP:
                return 'UP';
            case this.RIGHT:
                return 'RIGHT';
            case this.LEFT:
                return 'LEFT';
            case this.DOWN:
                return 'DOWN';
            default:
                return 'UNKNOWN';
        }
    },
    getLeftPos: function(pos, dir) {
        return new Promise(async (resolve, reject) => {
            try {
                if (dir === this.RIGHT) {
                    resolve({
                        pos: await this.getPosPlusDir(pos, this.UP),
                        direction: this.UP
                    });
                } else if (dir === this.UP) {
                    resolve({
                        pos: await this.getPosPlusDir(pos, this.LEFT),
                        direction: this.LEFT
                    });
                } else if (dir === this.LEFT) {
                    resolve({
                        pos: await this.getPosPlusDir(pos, this.DOWN),
                        direction: this.DOWN
                    });
                } else if (dir === this.DOWN) {
                    resolve({
                        pos: await this.getPosPlusDir(pos, this.RIGHT),
                        direction: this.RIGHT
                    });
                } else {
                    reject('Cannot find the left pos of the pawn !');
                }
            } catch(e) {
                throw e;
            }
        });
    },
    getRightPos: function(pos, dir) {
        return new Promise(async (resolve, reject) => {
            try {
                if (dir === this.RIGHT) {
                    resolve({
                        pos: await this.getPosPlusDir(pos, this.DOWN),
                        direction: this.DOWN
                    });
                } else if (dir === this.UP) {
                    resolve({
                        pos: await this.getPosPlusDir(pos, this.RIGHT),
                        direction: this.RIGHT
                    });
                } else if (dir === this.LEFT) {
                    resolve({
                        pos: await this.getPosPlusDir(pos, this.UP),
                        direction: this.UP
                    });
                } else if (dir === this.DOWN) {
                    resolve({
                        pos: await this.getPosPlusDir(pos, this.LEFT),
                        direction: this.LEFT
                    });
                } else {
                    reject('Cannot find the right pos of the pawn !');
                }
            } catch(e) {
                throw e;
            }
        });
    },
    getPosPlusDir: function(pos, dir) {
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
    }
};

module.exports = Direction;
