import Complex from 'complex.js';
import * as R from 'rambda';

const BG_COLOR = 'white';
let HEIGHT: number;
let WIDTH: number;
let CENTER: {
  x: number;
  y: number;
};

// --------------------------------------------------
// Custom functions
// --------------------------------------------------

function mandelbrot(c: Complex, z: Complex = new Complex(0, 0)): Complex {
  const result = z.mul(z).add(c);
  return result;
}

function isMandelbrot(x: number, y: number): boolean {
  const c = new Complex(x, y);
  let fcn = new Complex(0, 0);

  if (fcn.abs() > 2) return false;

  for (let i = 0; i < 20; i += 1) {
    fcn = mandelbrot(c, fcn);
    if (fcn.abs() > 2) return false;
  }

  return true;
}

function setup(ctx: CanvasRenderingContext2D) {
  clear(ctx);
  R.range(0, WIDTH).forEach((px) => {
    R.range(0, HEIGHT).forEach((py) => {
      const x = (px - CENTER.x) / (WIDTH / 4);
      const y = (py - CENTER.y) / (HEIGHT / 4);

      const inSet = isMandelbrot(x, y);
      if (inSet) {
        drawPixel(ctx, px, py, '#000000');
      } else {
        drawPixel(ctx, px, py, '#ffffff');
      }
    });
  });
}

function draw(ctx: CanvasRenderingContext2D, time: number, epsilon: number) {
  // clear(ctx);
  return undefined;
}

// --------------------------------------------------
// Main function
// --------------------------------------------------

function main() {
  const { canvas, ctx } = findCanvas();

  HEIGHT = canvas.height;
  WIDTH = canvas.width;
  CENTER = {
    x: Math.floor(WIDTH / 2),
    y: Math.floor(HEIGHT / 2),
  };

  setup(ctx);

  const DATE_START = Date.now();

  function time(): number {
    return Date.now() - DATE_START;
  }

  let lastFrameTime = DATE_START;

  // Calls draw every frame
  function renderFrame() {
    const nextFrameTime = time();
    const epsilon = nextFrameTime - lastFrameTime;
    draw(ctx, nextFrameTime, epsilon);
    lastFrameTime = nextFrameTime;
  }

  function loop() {
    renderFrame();
    window.requestAnimationFrame(loop);
  }
  window.requestAnimationFrame(loop);
}

window.onload = () => main();

// --------------------------------------------------
// Util functions
// --------------------------------------------------

function findCanvas() {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    throw new Error('Cannot find canvas in HTML page');
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Cannot retrieve 2D canvas context');
  }

  return {
    canvas,
    ctx,
  };
}

function clear(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
}

function drawPixel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color = '#000000'
) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

export default main;
