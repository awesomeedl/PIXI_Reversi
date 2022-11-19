let cellWidth = 100;
let height = width = cellWidth * 8;

let app = new PIXI.Application({ width: width, height: height, backgroundColor: 0x123b26 });
document.body.appendChild(app.view);

let background = new PIXI.Graphics();
let pieces = new PIXI.Graphics();
app.stage.addChild(background);
app.stage.addChild(pieces);
app.stage.interactive = true;
app.stage.hitArea = app.screen;
app.stage.on('pointerdown', onClick);

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

// Draw the grid
for (let i = 0; i <= width; i += cellWidth) {
    background.lineStyle(1, 0xffffff, 1, 1)
        .moveTo(i, 0)
        .lineTo(i, height)
        .moveTo(0, i)
        .lineTo(width, i);
}

background.endFill();

let grid = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
]

function Init(grid) {
    // Starting pieces arrangement
    grid[3][3] = 1;
    grid[4][4] = 1;
    grid[3][4] = 2;
    grid[4][3] = 2;
}

function Redraw(pieces) {
    pieces.clear();

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 1) { // White
                pieces
                    .beginFill(0xffffff)
                    .drawCircle((x + 0.5) * cellWidth, (y + 0.5) * cellWidth, cellWidth * 0.4, cellWidth * 0.4)
            }
            else if (grid[y][x] === 2) {
                pieces
                    .beginFill(0x000000)
                    .drawCircle((x + 0.5) * cellWidth, (y + 0.5) * cellWidth, cellWidth * 0.4, cellWidth * 0.4)
            }
        }
    }

    pieces.endFill();
}

function getAffectedSquares(grid, turn, x, y) {
    let affected = [];
    let opponent = turn === 1 ? 2 : 1;

    for (let dir of directionVectors) {
        let potential = [];
        let itor = { x: x + dir.x, y: y + dir.y };

        while(getPiece(grid, itor.x, itor.y) === opponent) {
            potential.push({x: itor.x, y: itor.y});
            itor = { x: itor.x + dir.x, y: itor.y + dir.y };
        }

        if(getPiece(grid, itor.x, itor.y) === turn) {
            affected.push(...potential);
        }
    }

    return affected
}

function isWithinBounds(x, y) {
    return x >= 0 && x < 8 && y >= 0 && y < 8;
}

function getPiece(grid, x, y) {
    return isWithinBounds(x, y) ? grid[y][x] : -1;
}

function onClick(event) {
    let x = Math.floor(event.data.global.x / cellWidth);
    let y = Math.floor(event.data.global.y / cellWidth);

    if(getPiece(grid, x, y) !== 0) return;

    let test = getAffectedSquares(grid, turn, x, y);
    if(test.length > 0) { // valid move
        grid[y][x] = turn;
        test.forEach((a) => {
            grid[a.y][a.x] = turn;
        })
        Redraw(pieces);
        turn = turn === 1 ? 2 : 1;
    }
}

turn = 1;
Init(grid);
Redraw(pieces);









