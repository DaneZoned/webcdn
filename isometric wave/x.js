window.onload = function () {

    "use strict";

    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        width = canvas.width = window.innerWidth,
        height = canvas.height = window.innerHeight,
        timer = 0,
        deltaTime = 0,
        lastTime = Date.now(),
        z;

    window.onresize = function () {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        ctx.translate(width / 2, 100);
    };

    ctx.translate(width / 2, 100);

    update();

    function update() {
        deltaTime = Date.now() - lastTime;
        lastTime = Date.now();
        timer += myOptions.speed * deltaTime / 1000;

        ctx.clearRect(-width / 2, -100, width, height);

        for (let x = 0; x < myOptions.mapSize; x++) {
            for (let y = 0; y < myOptions.mapSize; y++) {
                if (myOptions.type == "x") {
                    z = 1.25 + Math.sin(timer + Math.sin((y - x) * myOptions.strength / 10));
                } else if (myOptions.type == "y") {
                    z = 1.25 + Math.cos(timer + Math.cos((y + x) * myOptions.strength / 10));
                }
                drawBlock(x, y, z);
            }
        }
        requestAnimationFrame(update);
    }

    function drawBlock(x, y, z) {
        var top = "#eea",
            right = "#f50",
            left = "#f10";

        ctx.save();
        ctx.translate((x - y) * myOptions.tileWidth / 2, (x + y) * myOptions.tileHeight / 2);

        ctx.beginPath();
        ctx.moveTo(0, -z * myOptions.tileHeight);
        ctx.lineTo(myOptions.tileWidth / 2, myOptions.tileHeight / 2 - z * myOptions.tileHeight);
        ctx.lineTo(0, myOptions.tileHeight - z * myOptions.tileHeight);
        ctx.lineTo(-myOptions.tileWidth / 2, myOptions.tileHeight / 2 - z * myOptions.tileHeight);
        ctx.closePath();
        ctx.fillStyle = top;
        ctx.fill();
        ctx.strokeStyle = left;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-myOptions.tileWidth / 2, myOptions.tileHeight / 2 - z * myOptions.tileHeight);
        ctx.lineTo(0, myOptions.tileHeight - z * myOptions.tileHeight);
        ctx.lineTo(0, myOptions.tileHeight);
        ctx.lineTo(-myOptions.tileWidth / 2, myOptions.tileHeight / 2);
        ctx.closePath();
        ctx.fillStyle = left;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(myOptions.tileWidth / 2, myOptions.tileHeight / 2 - z * myOptions.tileHeight);
        ctx.lineTo(0, myOptions.tileHeight - z * myOptions.tileHeight);
        ctx.lineTo(0, myOptions.tileHeight);
        ctx.lineTo(myOptions.tileWidth / 2, myOptions.tileHeight / 2);
        ctx.closePath();
        ctx.fillStyle = right;
        ctx.fill();

        ctx.restore();
    }

}

var Options = function () {
    this.mapSize = 12;
    this.tileHeight = 25;
    this.tileWidth = 50;
    this.speed = 5;
    this.strength = 2;
    this.type = "x";
};

var myOptions = new Options(),
    gui = new dat.GUI();
gui.open();

var mapSize = gui.add(myOptions, 'mapSize', 5, 20).name('Grid size'),
    tileHeight = gui.add(myOptions, 'tileHeight', 15, 30).name('Tile height'),
    tileWidth = gui.add(myOptions, 'tileWidth', 30, 60).name('Tile width'),
    speed = gui.add(myOptions, 'speed', 1, 10).name('Speed'),
    strength = gui.add(myOptions, 'strength', 1, 5).name('Strength'),
    type = gui.add(myOptions, 'type', ['x', 'y']).name('Direction');