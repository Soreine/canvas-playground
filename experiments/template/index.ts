const BG_COLOR = 'white';
let HEIGHT: number;
let WIDTH: number;

// --------------------------------------------------
// Custom functions
// --------------------------------------------------

// --------------------------------------------------
// Main functions
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

function main() {
  const { canvas, ctx } = findCanvas();

  HEIGHT = canvas.height;
  WIDTH = canvas.width;

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

// --------------------------------------------------
// Util functions
// --------------------------------------------------

function clear(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
}

function setup(ctx: CanvasRenderingContext2D) {
  return undefined;
}

function draw(ctx: CanvasRenderingContext2D, time: number, epsilon: number) {
  clear(ctx);
  document.body.innerHTML = `time:  ${time}ms ${epsilon}ms`;
  return undefined;
}

export default main;
