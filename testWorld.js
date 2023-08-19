import { Utils } from "./utils.js";
import { CanvasRenderer } from "./components/canvasRenderer.js";
import { World } from "./components/world.js";
import { createMainloop } from "./components/mainloop.js";
import { Vector } from "./components/vector.js";
import { StickFigure } from "./components/stickFigure.js";

/**
 * What do I need to separate game from browser?
 * *  Right now I render to a canvas using a 2d context so my game should never call that context
 *    directly. I need an interface that connects the game draw cycle to something the canvas
 *    understands. I have the canvasRenderer for that right now so I probably do not need all those
 *    separate components that just invoke the canvasRenderer itself anyway...
 * *  I also want to detach the actual human interfacing as well (Inputs). As I currently have to
 *    attach keyboard event capture to the browser to read userinput but those inputs should call
 *    the game's API instead, creating yet another interface layer between user input from browser
 *    to an input the game recognises.
 */

const gameWidth = 640;
const gameHeight = 480;
const gravity = 0.98;
const playerRunSpeed = 10;
const playerJumpHeight = 15;
let numTics = 0;
let ticsPerFrame = 5;

const EVENT_KEYDOWN = "keydown";
const EVENT_KEYUP = "keyup";
const EVENT_TYPE_KEYDOWN = "keydown";
const EVENT_TYPE_KEYUP = "keyup";

const mainCanvas = document.createElement("canvas");
mainCanvas.id = "mainCanvas";
mainCanvas.width = gameWidth;
mainCanvas.height = gameHeight;

const backDropCanvas = document.createElement("canvas");
backDropCanvas.id = "backDropCanvas";
backDropCanvas.width = gameWidth;
backDropCanvas.height = gameHeight;

const content = document.createElement("div");
content.appendChild(backDropCanvas);
content.appendChild(mainCanvas);

document.body.appendChild(content);

const interactables = new CanvasRenderer(mainCanvas);
const backDrop = new CanvasRenderer(backDropCanvas);

const testWorld = new World(gameWidth, gameHeight, interactables, backDrop);

const playerPosition = new Vector(gameWidth * 0.5, gameHeight * 0.5);
const playerInitialVelocity = new Vector(0, 0);

const player = new StickFigure(playerInitialVelocity);

testWorld.debug = true;
testWorld.setFloor(0);
testWorld.setup();
testWorld.loadPlayer(player);

function renderGame() {
  numTics += 1;
  testWorld.draw(numTics);
  testWorld.drawPlayer(player, playerPosition, numTics);
}

function gameTic() {
  renderGame();
}

const mainLoop = createMainloop(gameTic);
mainLoop.setDebug(true);

// /*
mainLoop.start();
/*/
mainLoop.next();
// */
