import { Utils } from "./utils.js";
import { CanvasRenderer } from "./components/canvasRenderer.js";
import { Backdrop } from "./components/backdrop.js";
import { Background } from "./components/background.js";
import { Wall } from "./components/wall.js";
import { World } from "./components/world.js";
import { Foreground } from "./components/foreground.js";
import { createMainloop } from "./components/mainloop.js";

const gameWidth = window.innerWidth;
const gameHeight = Utils.floor(gameWidth * 0.5636160714285714);

const EVENT_KEYDOWN = "keydown";
const EVENT_KEYUP = "keyup";
const EVENT_TYPE_KEYDOWN = "keydown";
const EVENT_TYPE_KEYUP = "keyup";

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
const background = new Background(new CanvasRenderer(backgroundCanvas));
const wall = new Wall(new CanvasRenderer(wallsCanvas));
const world = new World(new CanvasRenderer(mainCanvas));
const foreground = new Foreground(new CanvasRenderer(foregroundCanvas));

let playerMovingLeft = false;
let playerMovingRight = false;
let playerSwingingLeft = false;
let playerSwingingRight = false;

function playerJump(buttonDown) {
  if (buttonDown) {
    console.log("JUMP!!!");
  }
}

function playerMoveLeft(buttonDown) {
  playerMovingLeft = buttonDown;
}

function playerMoveRight(buttonDown) {
  playerMovingRight = buttonDown;
}

function playerJabLeft(buttonDown) {
  console.log("Jab Left");
}

function playerJabRight(buttonDown) {
  console.log("Jab Right");
}

function playerSwingLeft(buttonDown) {
  playerSwingingLeft = buttonDown;
}

function playerSwingRight(buttonDown) {
  playerSwingingRight = buttonDown;
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

let charPosH = 300;
let charPosV = 0;
let weaponAngle = Math.PI - Math.sin(85/155);
let weaponVelocity = 0;
let weaponAcceleration = 0;

function fnRender() {
  if (playerMovingLeft && !playerMovingRight && charPosH > 0) {
    charPosH -= 8;
  }

  if (playerMovingRight && !playerMovingLeft && charPosH < gameWidth) {
    charPosH += 8;
  }

  if (playerSwingingLeft && !playerSwingingRight) {
    weaponAcceleration -= 2 ** -7;
  }

  if (playerSwingingRight && !playerSwingingLeft) {
    weaponAcceleration += 2 ** -7;
  }

  if (!playerSwingingLeft && !playerSwingingRight) {
    weaponAcceleration = 0;
  }

  weaponVelocity += weaponAcceleration;
  weaponAngle += weaponVelocity;
  weaponVelocity *= 0.85;
  weaponVelocity = Math.round(weaponVelocity * 1024) / 1024;
  weaponAcceleration *= 0.85;
  weaponAcceleration = Math.round(weaponAcceleration * 1024) / 1024;
  // Utils.report(weaponVelocity, weaponAcceleration);

  world.clear();

  backdrop.setSolidColor("#888");
  background.drawFloor(150, "#555");
  wall.drawPost(100, 15, 300, "#222");
  wall.drawPost(480, 8, 300, "#222");
  wall.drawPost(860, 15, 300, "#222");

  world.drawFloor("#111", 70);
  world.drawPlayer(charPosH, charPosV);
  world.drawSword(charPosH, charPosV, weaponAngle);

  foreground.drawPost(-20, 45, gameHeight, "#000");
  foreground.drawPost(400, 20, gameHeight, "#000");
  foreground.drawPost(890, 45, gameHeight, "#000");
}

const mainLoop = createMainloop(fnRender);
mainLoop.setDebug(true);

// /*
mainLoop.start();
/*/
mainLoop.next();
// */
