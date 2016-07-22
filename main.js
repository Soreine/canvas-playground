
var x = 1;

var canvas, ctx;

var HEIGHT = 500;
var WIDTH = false || HEIGHT;
var CENTER = HEIGHT/2;

var BG_COLOR = '#ddd';
var DRAW_COLOR = '#555';

var N = 100;
var SIZE = 300;
var STEP_ANGLE = 2*Math.PI/N;
var STEP_SIZE = SIZE/N;
function loop () {
    clear();

    ctx.beginPath();

    for (var i = 0; i < N; ++i) {
        var size = SIZE - i*STEP_SIZE - 1;
        square(CENTER, CENTER,
               i*STEP_ANGLE, size*Math.sin(x + i*0.01), size);
    }

    ctx.stroke();
    ctx.closePath();

    x += 0.01;
    if (x > WIDTH) x = -50;
    window.requestAnimationFrame(loop);
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
