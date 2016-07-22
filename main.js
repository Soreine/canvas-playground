
var x = 1;

var canvas, ctx;

var HEIGHT = 500;
var WIDTH = false || HEIGHT;
var CENTER = HEIGHT/2;

var BG_COLOR = '#fff';
var DRAW_COLOR = '#999';

var N = 100;
var SIZE = 300;
var STEP_ANGLE = 2*Math.PI/N;
var STEP_SIZE = SIZE/N;

var PERIOD = 4000;
var ANIMATION = 1000;

var t = 0;

function loop () {
    var time = t*1000/60;
    clear();

    ctx.beginPath();


    for (var i = 0; i < N; ++i) {
        drawSquare(i, time);
    }

    ctx.stroke();
    ctx.closePath();

    t++;
    if (time > PERIOD) t = 0;
    window.requestAnimationFrame(loop);
}

function drawSquare(i, time) {
    var angle = i*STEP_ANGLE;
    var startTime = i*(PERIOD - ANIMATION)/N;

    var progress;
    if (time < startTime) {
        progress = 0;
    } else if (time > startTime + ANIMATION) {
        progress = 1;
    } else {
        progress = (time - startTime)/ANIMATION;
    }

    var size = SIZE - i*STEP_SIZE - 1;
    var height = size;
    var width = size*Math.sin(Math.PI*(0.5 - progress));

    square(CENTER, CENTER, angle, width, height);
}
function square(cx, cy, rotation, width, height) {
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.rect(-width/2, -height/2, width, height);
    resetTransform();
}

function resetTransform() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function clear() {
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
}

function main(){
    canvas = document.getElementById('canvas');
    if (canvas.getContext){
        ctx = canvas.getContext('2d');
        ctx.strokeStyle = DRAW_COLOR;
        window.requestAnimationFrame(loop);
    }
}
