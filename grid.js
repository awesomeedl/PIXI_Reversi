const directionVectors = [
    { x: 1, y: 0 }, // Right
    { x: 1, y: 1 }, // Up right
    { x: 0, y: 1 }, // Up
    { x: -1, y: 1 }, // Up left
    { x: -1, y: 0 }, // Left
    { x: -1, y: -1 }, // Down left
    { x: 0, y: -1 }, // Down
    { x: 1, y: -1 } // Down right
]

class Grid {
    static size = 8;

    turn = 1;

    #grid = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];

    makeMove(x, y) {
        let test = this.getAffectedSquares(x, y);

        if(test.length === 0) {
            return false;
        }
        else
        {
            this.grid[y][x] = this.turn;
            test.forEach((a) => {
                this.grid[a.y][a.x] = this.turn;
            });
            this.turn = this.turn === 1 ? 2 : 1;
            return true;
        }
    }

    getNextPossibleMoves() {
        let moves = [];

        for(let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid.length; x++) {
                if(this.getAffectedSquares(this.turn, x, y) > 0 ) {
                    moves.push({x: x, y: y})
                }
            }
        }

        return moves;
    }

    #getAffectedSquares(x, y) {
        let affected = [];
        let opponent = this.turn === 1 ? 2 : 1;
    
        for (let dir of directionVectors) {
            let potential = [];
            let itor = { x: x + dir.x, y: y + dir.y };
    
            while(this.getPiece(itor.x, itor.y) === opponent) {
                potential.push({x: itor.x, y: itor.y});
                itor = { x: itor.x + dir.x, y: itor.y + dir.y };
            }
    
            if(this.getPiece(itor.x, itor.y) === this.turn) {
                affected.push(...potential);
            }
        }
    
        return affected;
    }

    static isWithinBounds(x, y) {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }
    
    getPiece(x, y) {
        return this.isWithinBounds(x, y) ? this.grid[y][x] : -1;
    }

}