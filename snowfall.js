/* **** Canvas Manager ***** */
let snowfallCanvasWidth = null;
let snowfallCanvasHeight = null;
let snowfallCanvasFps = 60;
let snowfallCanvas = null;
let snowfallContext = null;

function initSnowfallCanvas() {
  const canvas = document.getElementById("snowfall-canvas");

  if (!canvas) {
    throw Error("Cannot find element by '#snowfall-canvas'");
  }

  const context = canvas.getContext("2d");

  snowfallCanvas = canvas;
  snowfallContext = context;

  setCanvasSize();

  return setInterval(drawSnowfallCanvas, 1000 / snowfallCanvasFps);
}

function drawSnowfallCanvas() {
  snowfallContext.clearRect(0, 0, snowfallCanvasWidth, snowfallCanvasHeight);
  snowfallContext.fillStyle = "#fff";

  snowManager.drawSnows();
  snowManager.dropSnows();
}

function setCanvasSize() {
  snowfallCanvasWidth = window.innerWidth;
  snowfallCanvasHeight = window.innerHeight;

  snowfallCanvas.width = snowfallCanvasWidth;
  snowfallCanvas.height = snowfallCanvasHeight;
}

function setResize() {
  setCanvasSize();
  snowManager.initialize();
}

function snowfallCanvasMain() {
  initSnowfallCanvas();
  snowManager.initialize();
}
/* **** Canvas Manager ***** */

/* **** Snow Manager ***** */
class Snow {
  constructor(snowfallCanvasFps) {
    const radius = getRandomInteger(2, 4);

    this.radius = radius;
    this.frequencyX = getRandomInteger(5, 10);
    this.speedY = getRandomInteger(100, 200) / snowfallCanvasFps;
    this.x = getSnowInitialX(radius);
    this.y = getSnowInitialY(radius);
  }
}

class SnowManager {
  snows = [];

  constructor() {
    this.initialize();
  }

  initialize() {
    const count = Math.floor(snowfallCanvasWidth / 10);

    this.snows = [
      ...this.snows,
      ...Array.from({ length: count })
        .fill(null)
        .map(() => new Snow(snowfallCanvasFps)),
    ].slice(0, count);
  }

  dropSnows() {
    for (const snow of snowManager.snows) {
      snow.x = generateSnowX(snow);
      snow.y = generateSnowY(snow);

      if (snow.y > snowfallCanvasHeight + snow.radius / 2) {
        snow.x = getSnowInitialX(snow.radius);
        snow.y = getSnowInitialY(snow.radius);
      }
    }
  }

  drawSnows() {
    for (const snow of snowManager.snows) {
      const x = snow.x;
      const y = snow.y;
      const radius = snow.radius;
      const startAngle = 0;
      const endAngle = 2 * Math.PI;

      snowfallContext.beginPath();
      snowfallContext.arc(x, y, radius, startAngle, endAngle);
      snowfallContext.fill();
    }
  }
}

const snowManager = new SnowManager();

function getSnowInitialX(radius) {
  return getRandomInteger(0 + radius / 2, snowfallCanvasWidth - radius / 2);
}

function getSnowInitialY(radius) {
  return getRandomInteger(
    -(snowfallCanvasHeight / 2) + radius / 2,
    0 - radius / 2
  );
}

function generateSnowX(snow) {
  return Math.sin(snow.y / (snow.frequencyX * 10)) / snow.radius + snow.x;
}

function generateSnowY(snow) {
  return snow.y + snow.speedY;
}
/* **** Snow Manager ***** */

/* **** Util ***** */
function getRandomInteger(min, max) {
  min = Math.floor(min || 0);
  max = Math.ceil(max || 0);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/* **** Util ***** */

window.addEventListener("load", snowfallCanvasMain);
window.addEventListener("resize", setResize);
