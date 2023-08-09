import { Utils } from "./utils.js";
import { CanvasRenderer } from "./components/canvasRenderer.js";
import { Backdrop } from "./components/backdrop.js";
import { Background } from "./components/background.js";
import { Wall } from "./components/wall.js";
import { World } from "./components/world.js";
import { Foreground } from "./components/foreground.js";

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
const background = new Background(new CanvasRenderer(backgroundCanvas))
const wall = new Wall(new CanvasRenderer(wallsCanvas));
const world = new World(new CanvasRenderer(mainCanvas));
const foreground = new Foreground(new CanvasRenderer(foregroundCanvas));

backdrop.setSolidColor("#888");
background.drawFloor(150, "#555");
wall.drawPost(100, 15, 300, "#222");
wall.drawPost(480, 8, 300, "#222");
wall.drawPost(860, 15, 300, "#222");

world.drawFloor("#111", 70);
world.drawPlayer(300, 0);

foreground.drawPost(-20, 45, gameHeight, "#000");
foreground.drawPost(400, 20, gameHeight, "#000");
foreground.drawPost(890, 45, gameHeight, "#000");
