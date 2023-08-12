import { Utils } from "./utils.js";
import { CanvasRenderer } from "./components/canvasRenderer.js";
import { Backdrop } from "./components/backdrop.js";
import { Background } from "./components/background.js";
import { Wall } from "./components/wall.js";
import { World } from "./components/world.js";
import { Foreground } from "./components/foreground.js";
import { createMainloop } from "./components/mainloop.js";
import { AnimatedSprite } from "./components/animatedSprite.js";
import { Character } from "./components/character.js";
import { Vector } from "./components/vector.js";
import { Sprite } from "./components/sprite.js";

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

const gameWidth = window.innerWidth;
const gameHeight = Utils.floor(gameWidth * 0.5636160714285714);
const gravity = 0.98;
const playerRunSpeed = 10;
const playerJumpHeight = 15;
let numTics = 0;
let ticsPerFrame = 5;

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

const tyMsgContainer = document.createElement("div");
tyMsgContainer.style.position = "absolute";
tyMsgContainer.style.padding = "10px";
tyMsgContainer.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
const tyMsg = document.createElement("span");
tyMsg.style.display = "block";
tyMsg.innerText = "Animated Sprite belongs to LuizMelo";
const assetLink = document.createElement("a");
assetLink.href = "https://luizmelo.itch.io/hero-knight";
assetLink.innerText = "https://luizmelo.itch.io/hero-knight";
tyMsgContainer.append(tyMsg, assetLink);
document.body.appendChild(tyMsgContainer);

const backdrop = new Backdrop(new CanvasRenderer(backdropCanvas));
const background = new Background(new CanvasRenderer(backgroundCanvas));
const wall = new Wall(new CanvasRenderer(wallsCanvas));
const world = new World(new CanvasRenderer(mainCanvas));
const foreground = new Foreground(new CanvasRenderer(foregroundCanvas));

const playerScale = 3;
const playerPosition = new Vector(250, 0);
const playerDimensions = new Vector(50, 55);
const playerInitialVelocity = new Vector(0, 0);
const playerIdleImage = new Image();
playerIdleImage.src = "./sprites/seraphine/idle.png";
const playerIdleFrameDimensions = new Vector(180, 180);
const playerIdleDimensions = new Vector(50, 54);
const playerIdleOffset = new Vector(72, 60);
const playerIdleSprite = new Sprite(
  playerIdleImage,
  playerIdleFrameDimensions,
  playerIdleDimensions,
  playerIdleOffset,
  playerScale
);
const playerIdleAnimation = new AnimatedSprite(
  playerIdleSprite,
  11,
  ticsPerFrame
);

const playerRunImage = new Image();
playerRunImage.src = "./sprites/seraphine/run.png";
const playerRunFrameDimensions = new Vector(180, 180);
const playerRunDimensions = new Vector(50, 58);
const playerRunOffset = new Vector(70, 56);
const playerRunSprite = new Sprite(
  playerRunImage,
  playerRunFrameDimensions,
  playerRunDimensions,
  playerRunOffset,
  playerScale
);
const playerRunAnimation = new AnimatedSprite(playerRunSprite, 8, ticsPerFrame);

const playerJumpImage = new Image();
playerJumpImage.src = "./sprites/seraphine/jump.png";
const playerJumpFrameDimensions = new Vector(180, 180);
const playerJumpDimensions = new Vector(50, 60);
const playerJumpOffset = new Vector(70, 56);
const playerJumpSprite = new Sprite(
  playerJumpImage,
  playerJumpFrameDimensions,
  playerJumpDimensions,
  playerJumpOffset,
  playerScale
);
const playerJumpAnimation = new AnimatedSprite(
  playerJumpSprite,
  3,
  ticsPerFrame
);

const playerFallImage = new Image();
playerFallImage.src = "./sprites/seraphine/fall.png";
const playerFallFrameDimensions = new Vector(180, 180);
const playerFallDimensions = new Vector(50, 68);
const playerFallOffset = new Vector(70, 47);
const playerFallSprite = new Sprite(
  playerFallImage,
  playerFallFrameDimensions,
  playerFallDimensions,
  playerFallOffset,
  playerScale
);
const playerFallAnimation = new AnimatedSprite(
  playerFallSprite,
  3,
  ticsPerFrame
);

function resetAttack() {
  player.resetAttacks();
}

const playerAttackLeftImage = new Image();
playerAttackLeftImage.src = "./sprites/seraphine/attack1.png";
const playerAttackLeftFrameDimensions = new Vector(180, 180);
const playerAttackLeftDimensions = new Vector(77, 70);
const playerAttackLeftOffset = new Vector(55, 43);
const playerAttackLeftSprite = new Sprite(
  playerAttackLeftImage,
  playerAttackLeftFrameDimensions,
  playerAttackLeftDimensions,
  playerAttackLeftOffset,
  playerScale
);

const playerAttackLeftAnimation = new AnimatedSprite(
  playerAttackLeftSprite,
  7,
  ticsPerFrame,
  false,
  resetAttack
);

const playerAttackRightImage = new Image();
playerAttackRightImage.src = "./sprites/seraphine/attack2.png";
const playerAttackRightFrameDimensions = new Vector(180, 180);
const playerAttackRightDimensions = new Vector(135, 100);
const playerAttackRightOffset = new Vector(42, 14);
const playerAttackRightSprite = new Sprite(
  playerAttackRightImage,
  playerAttackRightFrameDimensions,
  playerAttackRightDimensions,
  playerAttackRightOffset,
  playerScale
);

const playerAttackRightAnimation = new AnimatedSprite(
  playerAttackRightSprite,
  7,
  ticsPerFrame,
  false,
  resetAttack
);

const playerSprites = {
  // idle: playerFallAnimation,
  idle: playerIdleAnimation,
  run: playerRunAnimation,
  jump: playerJumpAnimation,
  fall: playerFallAnimation,
  attack1: playerAttackLeftAnimation,
  attack2: playerAttackRightAnimation,
};
const player = new Character(
  playerDimensions,
  playerInitialVelocity,
  playerSprites
);

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
    player.attackLeft();
  }

  if (playerSwingRightBtnDown && !playerSwingLeftBtnDown) {
    player.attackRight();
  }

  playerPosition.x += player.velocity.x;
  playerPosition.y = Math.max(playerPosition.y + player.velocity.y, 0);
}

function renderGame() {
  numTics += 1;

  world.clear();

  backdrop.setSolidColor("#888");
  background.drawFloor(150, "#555");

  wall.drawPost(100, 15, 300, "#222");
  wall.drawPost(480, 8, 300, "#222");
  wall.drawPost(860, 15, 300, "#222");

  world.drawFloor("#111", 70);

  player.draw(world, playerPosition, numTics);

  foreground.drawPost(-20, 45, gameHeight, "#000");
  foreground.drawPost(400, 20, gameHeight, "#000");
  foreground.drawPost(890, 45, gameHeight, "#000");
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
