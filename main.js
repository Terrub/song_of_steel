import { Utils } from "./utils.js";
import { CanvasRenderer } from "./components/canvasRenderer.js";
import { Backdrop } from "./components/backdrop.js";

const gameWidth = window.innerWidth;
const gameHeight = Utils.floor(gameWidth * 0.5636160714285714);

const backdropCanvas = document.createElement("canvas");
backdropCanvas.id = "backdropCanvas";
backdropCanvas.width = gameWidth;
backdropCanvas.height = gameHeight;

const backgroundCanvas = document.createElement("canvas");
backgroundCanvas.id = "backgroundCanvas";
backgroundCanvas.width = gameWidth;
backgroundCanvas.height = gameHeight;

const wallsCanvas = document.createElement("canvas");
wallsCanvas.id = "wallsCanvas";
wallsCanvas.width = gameWidth;
wallsCanvas.height = gameHeight;

const mainCanvas = document.createElement("canvas");
mainCanvas.id = "mainCanvas";
mainCanvas.width = gameWidth;
mainCanvas.height = gameHeight;

const foregroundCanvas = document.createElement("canvas");
foregroundCanvas.id = "foregroundCanvas";
foregroundCanvas.width = gameWidth;
foregroundCanvas.height = gameHeight;

const content = document.createElement("div");
content.appendChild(backdropCanvas);
content.appendChild(backgroundCanvas);
content.appendChild(wallsCanvas);
content.appendChild(mainCanvas);
content.appendChild(foregroundCanvas);

document.body.appendChild(content);

const backdrop = new Backdrop(new CanvasRenderer(backdropCanvas));
const backgroundCanvasRenderer = new CanvasRenderer(backgroundCanvas);
const wallsCanvasRenderer = new CanvasRenderer(wallsCanvas);
const mainCanvasRenderer = new CanvasRenderer(mainCanvas);
const foregroundCanvasRenderer = new CanvasRenderer(foregroundCanvas);

backdrop.setSolidColor("#888");

backgroundCanvasRenderer.drawRect(0, 0, gameWidth, 150, "#555");

wallsCanvasRenderer.drawRect(100, 0, 15, 300, "#222");
wallsCanvasRenderer.drawRect(480, 0, 8, 300, "#222");
wallsCanvasRenderer.drawRect(860, 0, 15, 300, "#222");

mainCanvasRenderer.drawRect(0, 0, gameWidth, 70, "#111");
mainCanvasRenderer.drawRect(300, 70, 30, 100, "#933");

foregroundCanvasRenderer.drawRect(-20, 0, 45, gameHeight, "#000")
foregroundCanvasRenderer.drawRect(400, 0, 20, gameHeight, "#000");
foregroundCanvasRenderer.drawRect(890, 0, 45, gameHeight, "#000");