import { CanvasRenderer } from "./components/canvasRenderer.js";
import { createMainloop } from "./components/mainloop.js";
import { StickFigure } from "./components/stickFigure.js";
import { Vector } from "./components/vector.js";
import { World } from "./components/world.js";

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

const playerPosition = new Vector(gameWidth * 0.5, 0);
const playerInitialVelocity = new Vector(0, 0);

const player = new StickFigure(playerInitialVelocity);
player.debug = true;

testWorld.setFloor(gameHeight * 0.5);
testWorld.setup();
testWorld.loadPlayer(player);

let playerMoveLeftBtnDown = false;
let playerMoveRightBtnDown = false;
let playerSwingLeftBtnDown = false;
let playerSwingRightBtnDown = false;
let playerJumpBtnDown = false;

function playerJump(buttonDown) {
  playerJumpBtnDown = buttonDown;
}

function playerMoveLeft(buttonDown) {
  playerMoveLeftBtnDown = buttonDown;
}

function playerMoveRight(buttonDown) {
  playerMoveRightBtnDown = buttonDown;
}

function playerJabLeft(buttonDown) {
  console.log("Jab Left");
}

function playerJabRight(buttonDown) {
  console.log("Jab Right");
}

function playerSwingLeft(buttonDown) {
  playerSwingLeftBtnDown = buttonDown;
}

function playerSwingRight(buttonDown) {
  playerSwingRightBtnDown = buttonDown;
}

const keyBinds = {
  Space: playerJump,
  KeyA: playerMoveLeft,
  KeyD: playerMoveRight,
  // KeyI: playerJabLeft,
  // KeyO: playerJabRight,
  KeyK: playerSwingLeft,
  KeyL: playerSwingRight,
};

function keyPressEventHandler(keyboardEvent) {
  const eventType = keyboardEvent.type;
  if (eventType !== EVENT_TYPE_KEYDOWN && eventType !== EVENT_TYPE_KEYUP) {
    console.warn(
      `Unrecognised call to keyboardEventHandler. Event type: '${eventType}'`
    );
    return;
  }

  const keyCode = keyboardEvent.code;
  if (!(keyCode in keyBinds)) {
    // console.warn(`Button press not in keybinds: '${keyCode}'`);
    return;
  }

  keyBinds[keyCode](eventType === EVENT_TYPE_KEYDOWN);
}

document.addEventListener(EVENT_KEYDOWN, keyPressEventHandler, false);
document.addEventListener(EVENT_KEYUP, keyPressEventHandler, false);

function resolveGameState() {
  player.velocity.x = 0;
  if (playerPosition.y > 0) {
    player.velocity.y -= gravity;
  } else {
    player.velocity.y = 0;
  }

  if (
    playerMoveLeftBtnDown &&
    !playerMoveRightBtnDown &&
    playerPosition.x > 0
  ) {
    player.velocity.x = -playerRunSpeed;
  }

  if (
    playerMoveRightBtnDown &&
    !playerMoveLeftBtnDown &&
    playerPosition.x < gameWidth
  ) {
    player.velocity.x = playerRunSpeed;
  }

  if (playerJumpBtnDown && playerPosition.y === 0) {
    player.velocity.y = playerJumpHeight;
  }

  if (playerSwingLeftBtnDown && !playerSwingRightBtnDown) {
    // player.attackLeft();
    console.log("player.attackLeft()");
  }

  if (playerSwingRightBtnDown && !playerSwingLeftBtnDown) {
    // player.attackRight();
    console.log("player.attackRight()");
  }
}

function renderGame() {
  numTics += 1;
  testWorld.draw(numTics, playerPosition);
}

function gameTic() {
  resolveGameState();
  renderGame();
}

const mainLoop = createMainloop(gameTic);
mainLoop.setDebug(true);

// /*
mainLoop.start();
/*/
mainLoop.next();
// */
