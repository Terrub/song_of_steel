import { Utils } from "./utils.js";
import { CanvasRenderer } from "./components/canvasRenderer.js";

const gameWidth = window.innerWidth;
const gameHeight = Utils.floor(gameWidth * 0.5636160714285714);

const farBackgroundCanvas = document.createElement("canvas");
farBackgroundCanvas.width = gameWidth;
farBackgroundCanvas.height = gameHeight;

const backgroundCanvas = document.createElement("canvas");
backgroundCanvas.width = gameWidth;
backgroundCanvas.height = gameHeight;

const wallsCanvas = document.createElement("canvas");
wallsCanvas.width = gameWidth;
wallsCanvas.height = gameHeight;

const mainCanvas = document.createElement("canvas");
mainCanvas.width = gameWidth;
mainCanvas.height = gameHeight;

const foregroundCanvas = document.createElement("canvas");
foregroundCanvas.width = gameWidth;
foregroundCanvas.height = gameHeight;

const content = document.createElement("div");
content.appendChild(farBackgroundCanvas);
content.appendChild(backgroundCanvas);
content.appendChild(wallsCanvas);
content.appendChild(mainCanvas);
content.appendChild(foregroundCanvas);

document.body.appendChild(content);

const canvasRenderer = new CanvasRenderer(mainCanvas);
