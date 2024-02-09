import { AnimationFrame } from "./components/animationFrame.js";
import { CanvasRenderer } from "./components/canvasRenderer.js";
import { createMainloop } from "./components/mainloop.js";
import { StickAnimation } from "./components/stickAnimation.js";
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

const ANIMATING = "animating";
const EDITING = "editing";

const gameWidth = 640;
const gameHeight = 480;
const gravity = 0.98;
const playerRunSpeed = 10;
const playerJumpHeight = 15;

const EVENT_KEYDOWN = "keydown";
const EVENT_KEYUP = "keyup";
const EVENT_MOUSEDOWN = "mousedown";
const EVENT_MOUSEUP = "mouseup";
const EVENT_MOUSEMOVE = "mousemove";

const mainCanvas = document.createElement("canvas");
const backDropCanvas = document.createElement("canvas");
const currentModeElement = document.createElement("span");
const content = document.createElement("div");

const interactables = new CanvasRenderer(mainCanvas);
const backDrop = new CanvasRenderer(backDropCanvas);

const testWorld = new World(gameWidth, gameHeight, interactables, backDrop);

const playerPosition = new Vector(gameWidth * 0.5, 0);
const playerInitialVelocity = new Vector(0, 0);

const player = new StickFigure(playerInitialVelocity);

const animationKeyBinds = {
  Space: playerJump,
  KeyA: playerMoveLeft,
  KeyD: playerMoveRight,
  // KeyI: playerJabLeft,
  // KeyO: playerJabRight,
  KeyK: playerSwingLeft,
  KeyL: playerSwingRight,
  KeyE: toggleMode,
};

const editingKeyBinds = {
  KeyE: toggleMode,
  KeyA: prevFrame,
  KeyD: nextFrame,
  KeyN: newFrame,
  KeyX: removeFrame,
};

let keyBinds = animationKeyBinds;
let numTics = 0;
let currentMode = ANIMATING;

/** @type {Vector} */
let selectedBone;
/** @type {AnimationFrame} */
let selectedFrame;

let playerMoveLeftBtnDown = false;
let playerMoveRightBtnDown = false;
let playerSwingLeftBtnDown = false;
let playerSwingRightBtnDown = false;
let playerJumpBtnDown = false;

/**
 * @param {string} text
 */
function setCurrentModeText(text) {
  currentModeElement.innerText = text;
}

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

function enableEditMode() {
  currentMode = EDITING;
  setCurrentModeText("EDITING");

  numTics = 0;
  keyBinds = editingKeyBinds;
  const stickAnimation = new StickAnimation();
  selectedFrame = new AnimationFrame(1);
  stickAnimation.setFrameAt(0, selectedFrame);
  player.fixedAnimation = stickAnimation;
}

function enableAnimateMode() {
  currentMode = ANIMATING;
  setCurrentModeText("ANIMATING");

  numTics = 0;
  keyBinds = animationKeyBinds;
}

function toggleMode(buttonDown) {
  if (buttonDown === false) {
    if (currentMode === ANIMATING) {
      enableEditMode();
    } else if (currentMode === EDITING) {
      enableAnimateMode();
    }
  }
}

function newFrame(buttonDown) {
  // TODO Consider adding Ctrl or Shift to keybind for new animation and without for new frame?
  if (buttonDown === false) {
  }
}

function removeFrame(buttonDown) {}

function prevFrame(buttonDown) {}

function nextFrame(buttonDown) {}

/**
 * @param {KeyboardEvent} keyboardEvent
 * @returns {void}
 */
function keyPressEventHandler(keyboardEvent) {
  const eventType = keyboardEvent.type;
  if (eventType !== EVENT_KEYDOWN && eventType !== EVENT_KEYUP) {
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

  keyBinds[keyCode](eventType === EVENT_KEYDOWN);
}

/**
 * @param {MouseEvent} mouseEvent
 * @returns {void}
 */
function mouseClickEventHandler(mouseEvent) {
  if (mouseEvent.type !== EVENT_MOUSEUP) {
    return;
  }

  const mouseX = mouseEvent.clientX;
  const mouseY = mouseEvent.clientY;
  if (0 > mouseX || mouseX > gameWidth || 0 > mouseY || mouseY > gameHeight) {
    // Outside our canvas, ignore
    return;
  }

  const boneName = player.getDebugInfoAtMouse(mouseX, gameHeight - mouseY);

  if (boneName) {
    selectedBone = boneName;
    console.log(`Selected bone: '${boneName}'`);
  } else {
    // TODO Make this check if a setBone button is pressed first?
    // TODO Make a keybind to deselect bone as well ... X'D
    setBonePointingTo(selectedBone, mouseX, gameHeight - mouseY);
  }
}

/**
 * @param {string} boneName
 * @param {number} rawX
 * @param {number} rawY
 */
function setBonePointingTo(boneName, rawX, rawY) {
  if (currentMode !== EDITING) {
    return;
  }

  const bone = player.bones[boneName];
  if (!bone) {
    throw new Error(`Could not find boneVector for bone named: '${boneName}'`);
  }
  
  /** @type {Vector} */
  let boneVector = selectedFrame.bonesVectors[boneName];
  
  if (!boneVector) {
    boneVector = new Vector(bone.x, bone.y);
  }
  
  boneVector.x = bone.x - rawX;
  boneVector.y = bone.y - rawY;
  // boneVector.normalise();
  // boneVector.scale(bone.length);

  console.log(bone, boneVector);
  selectedFrame.bonesVectors[boneName] = boneVector;
}

/**
 * @param {MouseEvent} mouseEvent
 */
function mouseMoveEventHandler(mouseEvent) {
  if (currentMode !== EDITING) {
    return;
  }
}

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
  if (currentMode === ANIMATING) {
    numTics += 1;
  }
  testWorld.draw(numTics, playerPosition);
}

function gameTic() {
  resolveGameState();
  renderGame();
}

mainCanvas.id = "mainCanvas";
mainCanvas.width = gameWidth;
mainCanvas.height = gameHeight;

backDropCanvas.id = "backDropCanvas";
backDropCanvas.width = gameWidth;
backDropCanvas.height = gameHeight;

currentModeElement.style.position = "absolute";

content.appendChild(backDropCanvas);
content.appendChild(mainCanvas);
content.appendChild(currentModeElement);
enableAnimateMode();

document.body.appendChild(content);
document.addEventListener(EVENT_KEYDOWN, keyPressEventHandler, false);
document.addEventListener(EVENT_KEYUP, keyPressEventHandler, false);
document.addEventListener(EVENT_MOUSEDOWN, mouseClickEventHandler, false);
document.addEventListener(EVENT_MOUSEUP, mouseClickEventHandler, false);
// document.addEventListener(EVENT_MOUSEMOVE, mouseMoveEventHandler, false);

player.debug = true;

testWorld.setFloor(gameHeight * 0.5);
testWorld.setup();
testWorld.loadPlayer(player);

const mainLoop = createMainloop(gameTic);
mainLoop.setDebug(true);

// /*
mainLoop.start();
/*/
mainLoop.next();
// */
