let cellWidth = 100;
let height = width = cellWidth * 8;

let Application = new PIXI.Application({width: width, height: height});

document.body.appendChild(Application.view);

let Graphics = new PIXI.Graphics();

Application.stage.addChild(Graphics);

let grid = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
]

for(let i = 0; i <= width; i += cellWidth) {
    Graphics.lineStyle(1, 0xffffff, 1, 1)
    .moveTo(i, 0)
    .lineTo(i, height)
    .moveTo(0, i)
    .lineTo(width, i);
}

Graphics.endFill();





