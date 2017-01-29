var BG_COLOR = '#fafafa';
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
var N_HEXAGON = 6;

function setup(ctx) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
}

function draw(ctx, frame) {
    var RADIUS = WIDTH/4;
    var prog = progress(frame);

    var progs = createArray(6, function (i) { return nProgress(prog, i, N_HEXAGON); })


    progs.forEach(function (prog, i) {
        ctx.strokeStyle = grayPercent(prog);
        hexagon(ctx, RADIUS * prog, i*Math.PI/2);
    });

}

function nProgress(prog, i, n) {
    var res = prog + i/n;

    return res < 1
        ? res
        : res - 1;
}

function hexagon(ctx, radius, rotation, holePercent) {
    var shape = polygon(6, radius, new Coord(CENTER, CENTER), rotation);
    var segments = getSegments(shape);
    var withHole = segments.map(
        function (segment) {
            return holeSegment(segment[0], segment[1], holePercent);
        }
    ).reduce( // Reduce to a list of segments
        function (segs, segsWithHole) {
            segs.push(
                [segsWithHole[0], segsWithHole[1]],
                [segsWithHole[2], segsWithHole[3]]
            );

            return segs;
        }, []
    );

    withHole.forEach(function (segment) {
        drawShape(ctx, segment, true);
        ctx.stroke();
    });
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
    ctx = canvas.getContext('2d');

    HEIGHT = canvas.height;
    WIDTH = canvas.width;
    CENTER = HEIGHT/2;

    setup(ctx);

    window.requestAnimationFrame(loop);
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
 * @param {Number} sides
 * @param {Object<x, y>} center
 * @param {Number} rotation rad
 */
function polygon(sides, radius, center, rotation) {
    var x = center.x;
    var y = center.y;
    var stepAngle = 2 * Math.PI / sides;

    return createArray(sides, function (i) {
        return new Coord(
            x + radius * Math.cos(rotation + i * stepAngle),
            y + radius * Math.sin(rotation + i * stepAngle)
        );
    });
}

/**
 * @param {CanvasContext} ctx
 * @param {Array<Coord>} vertices
 * @param {Boolean} open
 */
function drawShape(ctx, vertices, open) {
    ctx.beginPath();

    ctx.moveTo(vertices[0].x, vertices[0].y);

    vertices.forEach(function (vertex) {
        ctx.lineTo(vertex.x, vertex.y);
    });

    if (!open) {
        ctx.closePath();
    }
}

function gray(v, alpha) {
    alpha = alpha || 100;
    return 'rgba('+v+','+v+','+v+','+alpha+')';
}

function grayPercent(percent, alpha) {
    var v = Math.floor(255*percent);
    alpha = alpha || 100;
    return 'rgba('+v+','+v+','+v+','+alpha+')';
}

/**
 * @param {Coord} pos1
 * @param {Coord} pos2
 * @param {Number} percent The percentage of the segment the hole will occupy
 * @return {Array<Coord>} The 4 coordinates of the two segments to draw
 */
function holeSegment(pos1, pos2, percent) {
    return [
        pos1,
        lerp(pos1, pos2, 0.5 - percent/2),
        lerp(pos1, pos2, 0.5 + percent/2),
        pos2
    ]
}

function lerp(pos1, pos2, percent) {
    return new Coord(
        (1 - percent * pos1.x) + pos2.x,
        (1 - percent * pos1.y) + pos2.y
    );
}

function createArray(n, init) {
    init = init || function (index) {}

    var a = [];
    for (var i = 0; i < n; ++i) {
        a.push(init(i));
    }
    return a;
}

function Coord(x, y) {
    this.x = x;
    this.y = y;
}

function getSegments(vertices) {
    var res = [];
    for(var i = 0; i < vertices.length - 1; ++i) {
        res.push([
            vertices[i],
            vertices[i+1]
        ]);
    }
    res.push([
        vertices[vertices.length - 1],
        vertices[0]
    ]);

    return res;
}
