//@ts-check
import createMainloop from "./components/mainloop.js";
import Rectangle from "./components/rectangle.js";
import Renderer2d from "./components/renderer2d.js";
import Vector from "./components/vector.js";
import Utils from "./utils.js";

const gameWidth = window.innerWidth;
const gameHeight = Utils.floor(gameWidth * 0.5636160714285714);
let numTics = 0;

const backgroundCanvas = document.createElement("canvas");
backgroundCanvas.id = "backgroundCanvas";
backgroundCanvas.width = gameWidth;
backgroundCanvas.height = gameHeight;
const bgGLib = backgroundCanvas.getContext("2d");

const mainCanvas = document.createElement("canvas");
mainCanvas.id = "mainCanvas";
mainCanvas.width = gameWidth;
mainCanvas.height = gameHeight;
const mainGLib = mainCanvas.getContext("2d");

const content = document.createElement("div");
content.appendChild(backgroundCanvas);
content.appendChild(mainCanvas);
document.body.appendChild(content);

const playerPosition = new Vector(0, 0);

const bgDraws = [new Rectangle(0, 0, gameWidth, gameHeight, "#999")];
const drawables = [new Rectangle(0, gameHeight, gameWidth, -70, "#333")];
function renderGame(elapsed) {
  numTics += 1;

  if (bgGLib) {
    Renderer2d.render(bgGLib, bgDraws);
  }

  if (mainGLib) {
    Renderer2d.render(mainGLib, drawables);
  }
}

/**
 * @param {number} elapsed
 */
function gameTic(elapsed) {
  renderGame(elapsed);
}

const mainLoop = createMainloop(gameTic);
mainLoop.setDebug(true);

// /*
mainLoop.start();
/*/
mainLoop.next();
// */
