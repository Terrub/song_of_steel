//@ts-check
import createMainloop from "./components/mainloop.js";
import Rectangle from "./components/rectangle.js";
import Renderer2d from "./components/renderer2d.js";
import Vector from "./components/vector.js";
import Lerp from "./components/lerp.js";
import Utils from "./utils.js";
import Level from "./components/level.js";
import Engine from "./components/engine.js";

const EVENT_KEYDOWN = "keydown";
const EVENT_KEYUP = "keyup";
const EVENT_TYPE_KEYDOWN = "keydown";
const EVENT_TYPE_KEYUP = "keyup";
const EVENT_FOCUS = "focus";
const EVENT_BLUR = "blur";

const METER = 50;
const MPS = METER; // Effectively 50px per 1 second, i.e. converted meters per second
const KMH = 1 / 3.6 * MPS;
const aspectRatio = 0.5636160714285714;

const screenWidth = window.innerWidth;
const screenHeight = Utils.floor(screenWidth * aspectRatio);
/* 
const gravity = 4.9 * MPS;  /*/
const gravity = Utils.floor(9.8 * MPS); // */
const playerWalkSpeed = Utils.floor(5 * KMH);
const playerRunSpeed = Utils.floor(12 * KMH);
const playerSprintSpeed = Utils.floor(30 * KMH);
const playerJumpHeight = Utils.floor(0.7 * METER);
const playerWidth = Utils.floor(0.6 * METER);
const playerHeight = Utils.floor(1.7 * METER);

let playerMoveLeftBtnDown;
let playerMoveRightBtnDown;
let playerJumpBtnDown;
let playerSprintBtnDown;
let playerWalkBtnDown;

const mainCanvas = document.createElement("canvas");
mainCanvas.id = "mainCanvas";
mainCanvas.width = screenWidth;
mainCanvas.height = screenHeight;
const mainGLib = mainCanvas.getContext("2d");

const content = document.createElement("div");
content.appendChild(mainCanvas);
document.body.appendChild(content);

const playerVelocity = new Vector(0, 0);
const screenPosition = new Vector(0, 0);

const level = new Level();
const player = new Rectangle(50, level.height - level.floorHeight - playerHeight - 2, playerWidth, playerHeight, 'red');

const drawables = []
drawables.push(level.skybox);
drawables.push(level.background);
drawables.push(...level.backWall);
drawables.push(...level.levelData);
drawables.push(player);
drawables.push(...level.forground);

/**
 * @param {boolean} buttonDown
 */
function playerJump(buttonDown) {
  playerJumpBtnDown = buttonDown;
}

/**
 * @param {boolean} buttonDown
 */
function playerMoveLeft(buttonDown) {
  playerMoveLeftBtnDown = buttonDown;
}

/**
 * @param {boolean} buttonDown
 */
function playerMoveRight(buttonDown) {
  playerMoveRightBtnDown = buttonDown;
}

/**
 * @param {boolean} buttonDown
 */
function playerSprint(buttonDown) {
  playerSprintBtnDown = buttonDown;
}

/**
 * @param {boolean} buttonDown
 */
function playerWalk(buttonDown) {
  playerWalkBtnDown = buttonDown;
}

function resetInputState(focusEvent) {
  playerMoveLeftBtnDown = false;
  playerMoveRightBtnDown = false;
  playerJumpBtnDown = false;
  playerSprintBtnDown = false;
  playerWalkBtnDown = false;
};

const keyBinds = {
  Space: playerJump,
  KeyA: playerMoveLeft,
  KeyD: playerMoveRight,
  ShiftLeft: playerSprint,
  ControlLeft: playerWalk,
};

/**
 * @param {Number} elapsed Number of seconds elapsed since last frame
 */
function updatePlayerPosition(elapsed) {
  let targetVelocityX = 0;
  
  if (
    playerMoveLeftBtnDown &&
    !playerMoveRightBtnDown
  ) {
    if (playerSprintBtnDown) {
      targetVelocityX = -playerSprintSpeed;
    } else if (playerWalkBtnDown) {
      targetVelocityX = -playerWalkSpeed;
    } else {
      targetVelocityX = -playerRunSpeed;
    }
  }

  if (
    playerMoveRightBtnDown &&
    !playerMoveLeftBtnDown
  ) {
    if (playerSprintBtnDown) {
      targetVelocityX = playerSprintSpeed;
    } else if (playerWalkBtnDown) {
      targetVelocityX = playerWalkSpeed;
    } else {
      targetVelocityX = playerRunSpeed;
    }
  }

  if (playerJumpBtnDown && playerVelocity.y === 0) {
    playerVelocity.y += -playerJumpHeight;
  }

  playerVelocity.y += gravity * elapsed;
  playerVelocity.x = targetVelocityX * elapsed;
}

/**
 * @param {Number} elapsed Number of seconds elapsed since last frame
 */
function updateScreenPosition(elapsed) {
  const halfScreenWidth = 0.5 * screenWidth;
  const halfScreenHeight = 0.5 * screenHeight;
  let targetX = player.x - halfScreenWidth;
  let targetY = player.y - halfScreenHeight;

  if (player.x < halfScreenWidth) {
    targetX = 0;
  }
  if (player.x > level.width - halfScreenWidth) {
    targetX = level.width - screenWidth;
  }

  if (player.y > halfScreenHeight) {
    targetY = level.height - screenHeight;
  }
  if (player.y < level.height - halfScreenHeight) {
    targetY = level.height - screenHeight;
  }

  screenPosition.x = Lerp.expDecay(screenPosition.x, targetX, 4, elapsed);
  screenPosition.y = Lerp.expDecay(screenPosition.y, targetY, 4, elapsed);
}

/**
 * @param {KeyboardEvent} keyboardEvent
 * @returns {void}
 */
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
    console.warn(`Button press not in keybinds: '${keyCode}'`);
    return;
  }
  keyboardEvent.preventDefault();
  keyBinds[keyCode](eventType === EVENT_TYPE_KEYDOWN);
}

/**
 * @param {FocusEvent} focusEvent
 */
function blurEventHandler(focusEvent) {
  resetInputState();
  mainLoop.stop();
}

/**
 * @param {FocusEvent} focusEvent
 */
function focusEventHandler(focusEvent) {
  mainLoop.start();
}

document.addEventListener(EVENT_KEYDOWN, keyPressEventHandler, false);
document.addEventListener(EVENT_KEYUP, keyPressEventHandler, false);
window.addEventListener(EVENT_BLUR, blurEventHandler);
window.addEventListener(EVENT_FOCUS, focusEventHandler);

/**
 * @param {number} elapsed Number of milliseconds since last frame
 */
function gameTic(elapsed) {
  // Convert elapsed milliseconds to seconds instead.
  const elapsedSeconds = elapsed * 0.001;

  updatePlayerPosition(elapsedSeconds);
  Engine.resolveCollisions(player, playerVelocity, level.levelData);

  player.x += playerVelocity.x;
  player.y += playerVelocity.y;

  updateScreenPosition(elapsedSeconds);

  if (mainGLib) {
    Renderer2d.render(mainGLib, screenPosition, drawables);
  }
}

const mainLoop = createMainloop(gameTic);
mainLoop.setDebug(true);
resetInputState();
// /*
mainLoop.start();
/*/
mainLoop.next();
// */
