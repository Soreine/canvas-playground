const BG_COLOR = 'white';
const PERIOD = 8000; // ms
const PERIOD_FRAMES = Math.floor((PERIOD * 60) / 1000);
let HEIGHT;
let WIDTH;
let CENTER;

let canvas;
let ctx;

// --------------------------------------------------
// Custom functions
// --------------------------------------------------

let IMAGES;
const YELLOW = {
  img: new Image(),
  path: './strokes/intersperse/yellow.jpg',
  loaded: false,
};
const BLUE = {
  img: new Image(),
  path: './strokes/intersperse/blue.jpg',
  loaded: false,
};

// Wait for all images object to be loaded.
function loadImages(images, then) {
  function attemptStart() {
    const allLoaded = images.every(function (image) {
      return image.loaded;
    });

    if (allLoaded) {
      then();
    }
  }

  images.forEach(function (image) {
    image.img.onload = function () {
      image.loaded = true;
      attemptStart();
    };
    // Load image
    image.img.src = image.path;
  });
}

function setup(ctx) {}

function draw(ctx, frame) {
  const SLICES = 50;
  sliceImages(ctx, [
    {
      img: BLUE.img,
      heightStep: 10,
    },
    {
      img: YELLOW.img,
      heightStep: 2,
    },
  ]);
}

function sliceImages(ctx, images) {
  let offset = 0;
  let imgIndex = 0;

  while (offset < HEIGHT) {
    const currentImage = images[imgIndex];

    ctx.drawImage(
      currentImage.img,
      // Source
      0,
      offset,
      WIDTH,
      currentImage.heightStep,
      // Canvas
      0,
      offset,
      WIDTH,
      currentImage.heightStep
    );

    offset += currentImage.heightStep;
    imgIndex++;
    if (imgIndex >= images.length) {
      imgIndex = 0;
    }
  }
}

// --------------------------------------------------
// Main functions
// --------------------------------------------------

function main() {
  let frame = 0;

  // Calls draw every frame
  function loop() {
    const time = (frame * 1000) / 60;
    clear();

    draw(ctx, frame);

    frame++;

    if (time > PERIOD) frame = 0;
  }

  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  HEIGHT = canvas.height;
  WIDTH = canvas.width;
  CENTER = HEIGHT / 2;

  // Loading of the home test image - img1
  loadImages([YELLOW, BLUE], function () {
    setup(ctx);
    window.requestAnimationFrame(loop);
  });
}

// --------------------------------------------------
// Util functions
// --------------------------------------------------

function clear() {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
}

module.exports = {
  main,
};
