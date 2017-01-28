var BG_COLOR = '#fff';
var DRAW_COLOR = gray(170, 0.9);

var PERIOD = 8000; // ms
var PERIOD_FRAMES = Math.floor(PERIOD * 60 / 1000);
var HEIGHT;
var WIDTH;
var CENTER;

var canvas, ctx;

// --------------------------------------------------
// Custom functions
// --------------------------------------------------
function draw(ctx, frame) {
    var RADIUS = WIDTH/4;
    var prog = progress(frame);

    hexagon(ctx, RADIUS * prog, Math.PI/2);
}

function hexagon(ctx, radius, rotation) {
    polygon(ctx, 6, radius, { x: CENTER, y: CENTER }, rotation);
    ctx.strokeStyle = 'black';
    ctx.stroke()
}

// --------------------------------------------------
// Main functions
// --------------------------------------------------

function main(){

    var frame = 0;

    // Calls draw every frame
    function loop() {
        var time = frame * 1000 / 60;
        clear();

        draw(ctx, frame);

        frame++;

        if (time > PERIOD) frame = 0;
        window.requestAnimationFrame(loop);
    }

    canvas = document.getElementById('canvas');
    if (canvas.getContext){
        ctx = canvas.getContext('2d');

        HEIGHT = canvas.height;
        WIDTH = canvas.width;
        CENTER = HEIGHT/2;

        ctx.strokeStyle = DRAW_COLOR;
        window.requestAnimationFrame(loop);
    }
}

// --------------------------------------------------
// Util functions
// --------------------------------------------------

function clear() {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
}

function progress(frame) {
    return (frame % PERIOD_FRAMES) / PERIOD_FRAMES;
}

/**
 * Draw a regular polygon
 * @param {CanvasContext} ctx
 * @param {Number} sides
 * @param {Object<x, y>} center
 * @param {Number} rotation rad
 */
function polygon(ctx, sides, radius, center, rotation) {
    var x = center.x;
    var y = center.y;
    var stepAngle = 2 * Math.PI / sides;

    var vertices = createArray(sides, function (i) {
        return {
            x: x + radius * Math.cos(rotation + i * stepAngle),
            y: y + radius * Math.sin(rotation + i * stepAngle)
        };
    });

    ctx.beginPath();

    ctx.moveTo(vertices[0].x, vertices[0].y);

    vertices.forEach(function (vertex) {
        console.log(vertex);
        ctx.lineTo(vertex.x, vertex.y);
    });

    ctx.closePath();
}

function gray(v, alpha) {
    alpha = alpha || 0;
    return 'rgba('+v+','+v+','+v+','+alpha+')';
}

function createArray(n, init) {
    init = init || function (index) {}
    var a = [];
    for (var i = 0; i < n; ++i) {
        a.push(init(i));
    }
    return a;
}
