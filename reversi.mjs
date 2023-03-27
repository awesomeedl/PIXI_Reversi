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

// class Grid {
//     static size = 8;

//     constructor() {
//         /**
//          * @type {Number}
//          */
//         this.turn = 1

//         /**
//          * @type {Number[][]}
//          */
//         this.grid = [
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 1, 2, 0, 0, 0],
//             [0, 0, 0, 2, 1, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0],
//             [0, 0, 0, 0, 0, 0, 0, 0]
//         ];
//     }   

//     /**
//      * 
//      * @param {Number} x
//      * @param {Number} y
//      * @returns {Boolean}
//      */
//     makeMove(x, y) {
//         let test = this.getAffectedSquares(x, y);

//         if(test.length === 0) {
//             return false;
//         }
//         else
//         {
//             this.grid[y][x] = this.turn;
//             test.forEach((a) => {
//                 this.grid[a.y][a.x] = this.turn;
//             });
//             this.turn = this.turn === 1 ? 2 : 1;
//             return true;
//         }
//     }

//     getNextPossibleMoves() {
//         let moves = [];

//         for(let y = 0; y < grid.length; y++) {
//             for (let x = 0; x < grid.length; x++) {
//                 if(this.getAffectedSquares(this.turn, x, y) > 0 ) {
//                     moves.push({x: x, y: y})
//                 }
//             }
//         }

//         return moves;
//     }

//     /**
//      * 
//      * @param {Number} x 
//      * @param {Number} y 
//      */
//     getAffectedSquares(x, y) {
//         let affected = [];
//         let opponent = this.turn === 1 ? 2 : 1;
    
//         for (let dir of directionVectors) {
//             let potential = [];
//             let itor = { x: x + dir.x, y: y + dir.y };
    
//             while(this.getPiece(itor.x, itor.y) === opponent) {
//                 potential.push({x: itor.x, y: itor.y});
//                 itor = { x: itor.x + dir.x, y: itor.y + dir.y };
//             }
    
//             if(this.getPiece(itor.x, itor.y) === this.turn) {
//                 affected.push(...potential);
//             }
//         }
    
//         return affected;
//     }

//     isWithinBounds(x, y) {
//         return x >= 0 && x < 8 && y >= 0 && y < 8;
//     }
    
//     getPiece(x, y) {
//         return this.isWithinBounds(x, y) ? this.grid[y][x] : -1;
//     }

// }

class Reversi {
    constructor() {
      // Initialize the bitboards for both players, with all bits set to 0
      this.player1Pieces = 0n;
      this.player2Pieces = 0n;
  
      // Set the starting player to player 1 (black)
      this.currentPlayer = 1;
  
      // Set up initial board state by placing four pieces at the center
      const center = 3n * 8n + 3n;
      this.set(center, 2n << center); // place a white piece
      this.set(center - 1n, 1n << center - 1n); // place a black piece
      this.set(center - 8n, 1n << center - 8n); // place a black piece
      this.set(center - 9n, 2n << center - 9n); // place a white piece
    }
  
    // Get the bitboard for a given player
    get(player) {
      if (player === 1) {
        return this.player1Pieces;
      } else if (player === 2) {
        return this.player2Pieces;
      }
    }
  
    // Set a bit in the appropriate bitboard for the current player
    set(index, value) {
      if (this.currentPlayer === 1) {
        this.player1Pieces |= value;
        this.player2Pieces &= ~value;
      } else if (this.currentPlayer === 2) {
        this.player2Pieces |= value;
        this.player1Pieces &= ~value;
      }
    }
  
    // Make a move at the given index
    makeMove(index) {
      // Calculate the affected squares of the move
      const affectedSquares = this.getAffectedSquares(index, this.get(this.currentPlayer), this.get(3 - this.currentPlayer));
  
      // If there are affected squares, the move is valid
      if (affectedSquares) {
        // Place the new piece on the board
        this.set(index, 1n << index);
  
        // Flip over the affected squares to the current player's color
        while (affectedSquares) {
          const bit = affectedSquares & -affectedSquares;
          this.set(bit, 1n << bit);
          affectedSquares &= ~bit;
        }
  
        // Switch to the other player's turn
        this.currentPlayer = 3 - this.currentPlayer;
  
        // Signal that the move was successful
        return true;
      } else {
        // Signal that the move was invalid
        return false;
      }
    }

    // Calculate the affected squares of a move using bitboards
    getAffectedSquares(move, myPieces, opponentPieces) {
        let affected = 0n;

        for (let dir of directionVectors) {
            let mask = getMask(move, dir, myPieces, opponentPieces);
            affected |= mask;
        }

        return affected;
    }

    getMask(move, dir, myPieces, opponentPieces) {
        let mask = 0n;
        let flip = 0n;
    
        let shift = dir.x + dir.y * 8n;
        let opponent = myPieces ^ opponentPieces;
    
        mask = shift > 0n ? opponent << shift : opponent >> -shift;
    
        for (let i = 0n; mask; i += dir.x + dir.y * 8n) {
            flip |= mask & shiftMask(move + i);
            mask &= shift > 0n ? mask << shift : mask >> -shift;
        }
    
        return flip & opponentPieces;
    }

    shiftMask(index) {
        return index >= 0n && index < 64n ? 1n << index : 0n;
    }
  }
  




export { Grid, directionVectors }