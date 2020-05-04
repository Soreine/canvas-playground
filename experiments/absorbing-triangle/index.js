import { noise, initPerlin } from './perlin';

initPerlin(this);
noise.seed(Math.random());

const x = 1;

let canvas;
let ctx;

let HEIGHT;
let WIDTH;
let CENTER;

const BG_COLOR = '#fff';
const DRAW_COLOR = gray(170, 0.9);

const N = 100;
const SIZE = 240;
const STEP_ANGLE = (0.8 * 2 * Math.PI) / N;
const STEP_SIZE = SIZE / N;

const PERIOD = 2700;
const ANIMATION = 1200;

let t = 0;

function loop() {
  const time = (t * 1000) / 60;
  clear();

  ctx.beginPath();

  for (let i = 0; i < N; ++i) {
    drawSquare(i, time);
  }

  ctx.stroke();
  ctx.closePath();

  t++;
  if (time > PERIOD) t = 0;
  window.requestAnimationFrame(loop);
}

function drawSquare(i, time) {
  const angle = i * STEP_ANGLE;
  const startTime = (i * PERIOD) / N;
  let absoluteTime = time - startTime;
  absoluteTime = modulo(absoluteTime, PERIOD);

  let progress = absoluteTime / ANIMATION;
  progress *= progress;
  if (progress > 1) progress = 1;
  if (progress < 0) progress = 0;

  const size = SIZE - i * STEP_SIZE - 1;
  const height = size;
  const width = -size * Math.abs(Math.sin(Math.PI * (0.5 + progress)));

  triangle(CENTER, CENTER, angle, width, height);
}

function modulo(x, y) {
  return x - Math.floor(x / y) * y;
}

function square(cx, cy, rotation, width, height) {
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.rect(-width / 2, -height / 2, width, height);
  resetTransform();
}

function triangle(cx, cy, rotation, width) {
  ctx.translate(cx, cy);
  const height = width;
  ctx.rotate(rotation);
  ctx.moveTo(0, height);
  ctx.rotate((Math.PI * 2) / 3);
  ctx.lineTo(0, height);
  ctx.rotate((Math.PI * 2) / 3);
  ctx.lineTo(0, height);
  ctx.rotate((Math.PI * 2) / 3);
  ctx.lineTo(0, height);
  resetTransform();
}

function resetTransform() {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

let BG_IMAGE;
function createBg() {
  BG_IMAGE = ctx.createImageData(canvas.width, canvas.height);
  const { data } = BG_IMAGE;
  for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
      const xr = x - WIDTH / 2;
      const yr = y - WIDTH / 2;
      const radius = Math.sqrt(xr * xr + yr * yr);

      // All noise functions return values in the range of -1 to 1.
      const value = (noise.simplex2(x, y) + 1) / 2; // [0; 1]
      const color = 256 * (value * 0.2 + 0.8);

      const cell = (x + y * canvas.width) * 4;
      data[cell] = data[cell + 1] = data[cell + 2] = color;
      // transparency
      data[cell + 3] =
        (1 - smoothSin(WIDTH / 2 - 120, WIDTH / 2, radius)) * color;
    }
  }
}

function drawBg() {
  ctx.putImageData(BG_IMAGE, 0, 0);
}

function clear() {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
}

function smoothSin(min, max, x) {
  if (x < min) return 0;
  if (x > max) return 1;
  const r = (x - min) / (max - min);
  return Math.sin(-Math.PI * 0.5 + Math.PI * r);
}

function gray(v, alpha = 0) {
  return `rgba(${v},${v},${v},${alpha})`;
}

function main() {
  canvas = document.getElementById('canvas');
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');

    HEIGHT = canvas.height;
    WIDTH = canvas.width;
    CENTER = HEIGHT / 2;

    ctx.strokeStyle = DRAW_COLOR;
    createBg();
    window.requestAnimationFrame(loop);
  }
}
