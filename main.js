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

// Draw the grid
for (let i = 0; i <= width; i += cellWidth) {
    background.lineStyle(1, 0xffffff, 1, 1)
        .moveTo(i, 0)
        .lineTo(i, height)
        .moveTo(0, i)
        .lineTo(width, i);
}

background.endFill();

let g = new Grid();

function Redraw(pieces) {
    pieces.clear();

    for (let y = 0; y < g.grid.length; y++) {
        for (let x = 0; x < g.grid[y].length; x++) {
            if (g.grid[y][x] === 1) { // White
                pieces
                    .beginFill(0xffffff)
                    .drawCircle((x + 0.5) * cellWidth, (y + 0.5) * cellWidth, cellWidth * 0.4, cellWidth * 0.4)
            }
            else if (g.grid[y][x] === 2) {
                pieces
                    .beginFill(0x000000)
                    .drawCircle((x + 0.5) * cellWidth, (y + 0.5) * cellWidth, cellWidth * 0.4, cellWidth * 0.4)
            }
        }
    }

    pieces.endFill();
}

function onClick(event) {
    let x = Math.floor(event.data.global.x / cellWidth);
    let y = Math.floor(event.data.global.y / cellWidth);

    if(g.makeMove(x, y)) {
        Redraw(pieces);
    }
}

turn = 1;
Redraw(pieces);









