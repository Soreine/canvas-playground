var TWO_PI = Math.PI*2;
var canvas, ctx;

var HEIGHT;
var WIDTH;
var WCENTER;
var HCENTER;

// float
var angle = 0;
var radius;
// Arrays
var dots = [];
var origPos = [];
var endPos = [];
var NUM = 200;

var frame = 0;
var ANIMATION_FRAME = 90;
var NB_FRAME = 2 * ANIMATION_FRAME;
var getMaxLineWidth = function () { return Math.floor(WIDTH/25); };
var mouse;

function setup () {
    ctx.lineJoin = 'round';

    radius = Math.min(WIDTH * 0.4, HEIGHT * 0.4);

    origPos = randomShape();
    initDots();
    initEnd();
}

function loop () {
    // Blur effect
    clear(0.2);
    draw(frame);
    frame++;
    window.requestAnimationFrame(loop);
}

function draw (frame) {
    // Are we expanding, or resorbing ?
    var expanding = isExpanding(frame);

    // Init next positions ?
    if (frame % NB_FRAME === ANIMATION_FRAME) {
        origPos = randomShape(mouse);
    }
    ctx.lineWidth = getLineWidth(frame);

    // Draw the Shape
    var destination, start;
    if (expanding) {
        destination = endPos;
        start = origPos;
    } else {
        destination = origPos;
        start = endPos;
    }

    for (var i = 0; i < NUM; ++i) {
        dots[i].x = interpolate(start[i].x, destination[i].x, frame);
        dots[i].y = interpolate(start[i].y, destination[i].y, frame);
    }

    var color;
    if (expanding) {
        color = gray(255 - Math.floor(constrain(frame % ANIMATION_FRAME, 0, ANIMATION_FRAME/2)*1.5));
    } else {
        color = gray(255 - Math.floor(constrain(ANIMATION_FRAME - (frame % ANIMATION_FRAME), 0, ANIMATION_FRAME/2)*1.5));
    }
    path(ctx, function () {
        ctx.strokeStyle = color;
        shape(ctx, dots);
        ctx.stroke();
    });

    // Restrict drawing to a white circle
    path(ctx, function () {
        ctx.globalCompositeOperation = 'destination-atop';
        ctx.strokeStyle = gray(255);
        ctx.lineWidth = 1;
        circle(ctx, WCENTER, HCENTER, radius);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
    });
}

function isExpanding(frame) {
    return frame % NB_FRAME <= ANIMATION_FRAME;
}
function getAnimationProgress(frame) {
    return (frame % ANIMATION_FRAME)/ANIMATION_FRAME;
}

// Get a coordinate for a dot, at a given frame
function interpolate(min, max, frame) {
    var progress = getAnimationProgress(frame);
    var tween = isExpanding(frame) ? quadIn : quadOut;
    return lerp(min, max, tween(progress));
}

function getLineWidth(frame) {
    var progress = getAnimationProgress(frame);

    if (!isExpanding(frame)) {
        progress = 1 - progress;
    }

    return (1 - Math.sqrt(progress))*getMaxLineWidth();
}

function randomShape(center) {
    center = center || { x: WCENTER, y: HCENTER };
    // Init start position
    var dots = [];
    var maxR = radius * 0.66;
    for (var i = 0; i < NUM; ++i) {
        // Random inside a circle
        // http://www.anderswallin.net/2009/05/uniform-random-points-in-a-circle-using-polar-coordinates/
        var r = maxR * Math.sqrt(Math.random());
        var angle = TWO_PI * Math.random();
        var dot = {
            x: center.x + r * Math.cos(angle),
            y: center.y + r * Math.sin(angle)
        };
        dots.push(dot);
    }
    return dots;
}

function initEnd() {
    // Init end position
    for (var i = 0; i < NUM; ++i) {
        endPos.push({
            x: WCENTER + Math.sin(angle)*radius,
            y: HCENTER + Math.cos(angle)*radius
        });
        angle += TWO_PI/NUM;
    }
}

function initDots() {
    dots = [];
    // Init end position
    for (var i = 0; i < NUM; ++i) {
        dots.push({
            x: 0,
            y: 0
        });
    }
}

function clear(alpha) {
    ctx.fillStyle = gray(255, alpha);
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

function main(ref){
    canvas = document.getElementById(ref);
    if (canvas.getContext){
        ctx = canvas.getContext('2d');

        HEIGHT = canvas.height;
        WIDTH = canvas.width;
        WCENTER = WIDTH/2;
        HCENTER = HEIGHT/2;

        mouse = recordMouse(canvas);

        setup();

        window.requestAnimationFrame(loop);
    }
}

// UTILS

function gray(v, alpha) {
    alpha = alpha || 1;
    return 'rgba('+v+','+v+','+v+','+alpha+')';
}

function shape(ctx, vertices) {
    if (vertices.length > 0) {
        ctx.moveTo(vertices[0].x, vertices[0].y);
    }

    for (var i = 1; i < vertices.length; ++i) {
        ctx.lineTo(vertices[i].x, vertices[i].y);
    }

    if (vertices.length > 0) {
        ctx.lineTo(vertices[0].x, vertices[0].y);
    }
}

function constrain(x, min, max) {
    if (x < min) {
        return min;
    } else if ( x > max) {
        return max;
    } else {
        return x;
    }
}

function circle(ctx, x, y, radius) {
    ctx.arc(x, y, radius, 0, TWO_PI, false);
}

function lerp(min, max, amount) {
    return ((max - min) * amount) + min;
}

function quadOut(percent) {
    return percent * percent * percent * percent * percent * percent;
}

function quadIn(percent) {
    percent = 1 - percent;
    return 1 - quadOut(percent);
}

function path(ctx, fun) {
    ctx.beginPath();
    fun();
    ctx.closePath();
}


// Watch mouse position
// Return an updated object
function recordMouse(canvas) {
    var mouse = {
        x: 0,
        y: 0
    };

    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    canvas.addEventListener('mousemove', function(evt) {
        var mousePos = getMousePos(canvas, evt);
        mouse.x = mousePos.x;
        mouse.y = mousePos.y;

        var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
        console.log(message);
    }, false);

    return mouse;
}
