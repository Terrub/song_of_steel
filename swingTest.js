//@ts-check

import Vector from "./components/vector.js";
import Lerp from "./components/lerp.js";
import StateManager from "./components/stateManager.js";
import State from "./components/state.js";
import Entity from "./components/entity.js";
import Intent from "./components/intent.js";
import createMainloop from "./components/mainloop.js";
import Renderer2d from "./components/renderer2d.js";
import Line from "./components/line.js";
import Rectangle from "./components/rectangle.js";
import IKSolver from "./components/iKSolver.js";
import Utils from "./utils.js";
import Drawable from "./components/drawable.js";

/**
 * @param {*} bones
 * @param {Array} animations
 * @param {Number} progress
 */
function updateBones(original, bones, animations, progress, elapsed) {
    for (const animation of animations) {
        for (const boneName in animation) {
            for (const point in animation[boneName]) {
                // TODO: Consider making this value affected by stamina to portrait tiredness
                const decayRate = 30;

                const newVal = original[boneName][point] + (animation[boneName][point](progress) * 4);
                bones[boneName][point] = Lerp.expDecay(bones[boneName][point], newVal, decayRate, elapsed);
            }
        }
    }
}

/**
 * @param {Number} elapsed
 * @param {Array} drawables Reference array to be filled with updated drawables
 * @param {Array} originals Array containing original entities with drawables (T-pose)
 */
function updateGame(elapsed, drawables, originals) {
    // State machine stuff
    stateManager.update(elapsed);
    if (mouseDown && !isAttacking) {
        isAttacking = true;
        stateManager.setEntityIntent(entity, swinging);
    }

    if (!mouseDown && isAttacking) {
        isAttacking = false;
    }

    const curState = stateManager.getEntityState(entity);
    if ((1 <= curState.progress) && (false === curState.canLoop)) {
        stateManager.setEntityState(entity, idleingState);
    }

    for (const original of originals) {
        addPlayer(drawables, original, elapsed);
    }

}

/**
 * @param {Line} bone
 * @param {Line} sword
 * @param {Number} pos
 */
function adjustHandToSword(bone, sword, pos) {
    // create vector of sword itself
    const swordVector = Vector.subtract(new Vector(sword.x2, sword.y2), new Vector(sword.x1, sword.y1));

    // scale vector to pos,
    swordVector.scale(pos);

    // set bone to sword start coords + scaled vector
    bone.x2 = sword.x1 + swordVector.x;
    bone.y2 = sword.y1 + swordVector.y;
}

/**
 * @param {Line} hand
 * @param {Line} elbow
 * @param {Number} dir
 */
function adjustElbowIK(hand, elbow, dir) {
    const elbowVector = new Vector(0, 0);
    const length1 = 20;
    const length2 = 20;
    const handVector = new Vector(
        hand.x2,
        hand.y2
    );
    const shoulderVector = new Vector(
        elbow.x1,
        elbow.y1
    );
    IKSolver.global(elbowVector, length1, length2, handVector, shoulderVector, dir);
    elbow.x2 = elbowVector.x;
    elbow.y2 = elbowVector.y;
    hand.x1 = elbowVector.x;
    hand.y1 = elbowVector.y;
}

function addPlayer(arr, original, elapsed) {
    const currentState = stateManager.getEntityState(entity);
    const currentAnimations = animations[currentState.name];

    updateBones(original, localBones, currentAnimations, currentState.progress, elapsed);

    adjustHandToSword(localBones.rightHand, localBones.sword, 0.1);
    adjustHandToSword(localBones.leftHand, localBones.sword, 0);
    adjustElbowIK(localBones.leftHand, localBones.leftElbow, -1);
    adjustElbowIK(localBones.rightHand, localBones.rightElbow, 1);

    for (const boneName in localBones) {
        const bone = localBones[boneName];
        if (Utils.isInstanceOf(Line, bone)) {
            arr.push(new Line(
                bone.x1 + playerPosition.x,
                bone.y1 + playerPosition.y,
                bone.x2 + playerPosition.x,
                bone.y2 + playerPosition.y,
                bone.color,
                bone.lineWidth));
        }

        if (Utils.isInstanceOf(Rectangle, bone)) {
            arr.push(new Rectangle(
                bone.x + playerPosition.x,
                bone.y + playerPosition.y,
                bone.width,
                bone.height,
                bone.color
            ));
        }
    }
}

/**
 * @param {Number} elapsed
 */
function animationLoop(elapsed) {
    const elapsedSeconds = elapsed * 0.001;

    // playerPosition.x = xMouse * scale;
    // playerPosition.y = yMouse * scale;

    const drawables = [];
    const originals = [stickFigure];
    updateGame(elapsedSeconds, drawables, originals);

    if (gl) {
        Renderer2d.render(gl, camPos, drawables);
    }
}

const stickFigure = {
    "headRect": new Rectangle(-2, -25, 4, 5, "red"),
    "neck": new Line(0, -11, 0, -18, "red", 1),
    "head": new Line(0, -18, 0, -22, "red", 1),
    "leftHip": new Line(0, -11, 3, -12, "red", 1),
    "leftKnee": new Line(3, -12, 6, -7, "red", 1),
    "leftFoot": new Line(6, -7, 8, 0, "red", 1),
    "rightHip": new Line(0, -11, -3, -12, "red", 1),
    "rightKnee": new Line(-3, -12, -3, -5, "red", 1),
    "rightFoot": new Line(-3, -5, -9, 0, "red", 1),
    "leftShoulder": new Line(0, -18, 3, -18, "red", 1),
    "leftElbow": new Line(3, -18, 1, -14, "red", 1),
    "leftHand": new Line(1, -14, 5, -11, "red", 1),
    "rightShoulder": new Line(0, -18, -3, -18, "red", 1),
    "rightElbow": new Line(-3, -18, -6, -15, "red", 1),
    "rightHand": new Line(-6, -15, -4, -11, "red", 1),
    "sword": new Line(8, -16, 8, 0, "red", 1),
};

for (const boneName in stickFigure) {
    const bone = stickFigure[boneName];
    if (Utils.isInstanceOf(Line, bone)) {
        bone.x1 *= 4;
        bone.y1 *= 4;
        bone.x2 *= 4;
        bone.y2 *= 4;
        bone.lineWidth *= 4;
    }

    if (Utils.isInstanceOf(Rectangle, bone)) {
        bone.x *= 4;
        bone.y *= 4;
        bone.width *= 4;
        bone.height *= 4;
    }
}


const localBones = {};
for (const boneName in stickFigure) {
    const bone = stickFigure[boneName];
    if (Utils.isInstanceOf(Line, bone)) {
        localBones[boneName] = new Line(bone.x1, bone.y1, bone.x2, bone.y2, bone.color, bone.lineWidth);
    }

    if (Utils.isInstanceOf(Rectangle, bone)) {
        localBones[boneName] = new Rectangle(bone.x, bone.y, bone.width, bone.height, bone.color);
    }
}

const content = document.createElement("div");
const canvas = document.createElement('canvas');
const scale = 1;
const canvasWidth = 800 * scale;
const canvasHeight = 600 * scale;
// Consider 640 x 360 or 320 x 180?
const gl = canvas.getContext("2d");

const playerPosition = new Vector(200, 200);
const camPos = new Vector(0, 0);

const stateManager = new StateManager();
const entity = new Entity("foo");
const swinging = new Intent("swinging");
const swingingState = new State('swinging', 0.5);
const swingingBackState = new State('swingingBack', 0.3);
const jabForwardState = new State('jabForward', 0.3);
const idleingState = new State('idleing', 2, true);

const animations = {
    idleing: [
        {
            headRect: {
                y: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t)),
            },
            neck: {
                y1: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t)),
                y2: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t))
            },
            head: {
                y1: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t)),
                y2: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t))
            },
            leftHip: {
                y1: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t)),
                y2: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t))
            },
            leftKnee: {
                y1: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t)),
            },
            // leftFoot: {},
            rightHip: {
                y1: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t)),
                y2: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t))
            },
            rightKnee: {
                y1: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t)),
            },
            // rightFoot: {},
            leftShoulder: {
                x1: (t) => 0,
                y1: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t)),
                x2: (t) => 0,
                y2: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t))
            },
            leftElbow: {
                x1: (t) => 0,
                y1: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t)),
            },
            // leftHand: {},
            rightShoulder: {
                x1: (t) => 0,
                y1: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t)),
                x2: (t) => 0,
                y2: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t))
            },
            rightElbow: {
                x1: (t) => 0,
                y1: (t) => Lerp.calc(0.5, 0, Lerp.parabola(t)),
            },
            // rightHand: {},
            sword: {
                x1: (t) => -7,
                y1: (t) => Lerp.calc(3, 4, Lerp.parabola(t)),
                x2: (t) => -27,
                y2: (t) => Lerp.calc(0, 1, Lerp.parabola(t)),
            },
        },
    ],
    swinging: [
        {
            leftShoulder: {
                x2: (t) => Lerp.calc(0, -6, Lerp.sqrt(t)),
            },
            leftElbow: {
                x1: (t) => Lerp.calc(0, -6, Lerp.sqrt(t)),
            },
            rightShoulder: {
                x2: (t) => Lerp.calc(0, 6, Lerp.sqrt(t)),
                y2: (t) => Lerp.calc(0, 1, Lerp.parabola(t)),
            },
            rightElbow: {
                x1: (t) => Lerp.calc(0, 6, Lerp.sqrt(t)),
                y1: (t) => Lerp.calc(0, 1, Lerp.parabola(t)),
            },
            sword: {
                x1: (t) => Lerp.calc(-6, 0, Lerp.sin(t)),
                y1: (t) => Lerp.calc(-6, 0, Lerp.linear(t)),
                x2: (t) => Lerp.calc(-24, 31, Lerp.sin(t)),
                y2: (t) => Lerp.calc(0, -41, Lerp.linear(t)),
            }
        },
    ],
    swingingBack: [
        {
            sword: {
                x1: (t) => Lerp.calc(-6, 0, Lerp.sin(t)),
                y1: (t) => Lerp.calc(-6, 0, Lerp.linear(t)),
                x2: (t) => Lerp.calc(-30, 37, Lerp.sin(t)),
                y2: (t) => Lerp.calc(-45, 0, Lerp.linear(t)),
            }
        }
    ],
    jabForward: [
        {
            sword: {
                x1: (t) => Lerp.calc(-12, 18, Lerp.parabola(t)),
                y1: (t) => Lerp.calc(-3, 3, Lerp.linear(t)),
                x2: (t) => Lerp.calc(13, 43, Lerp.parabola(t)),
                y2: (t) => Lerp.calc(-20, -12, Lerp.linear(t)),
            }
        }
    ]
};

idleingState.addIntent(swinging, swingingState, { min1: 0, min2: 0, max2: 1, max1: 1 });
swingingState.addIntent(swinging, swingingBackState, { min1: 0.7, min2: 0.8, max2: 1, max1: 1 });
swingingBackState.addIntent(swinging, jabForwardState, { min1: 0.5, min2: 0.55, max2: 0.65, max1: 0.7 });
stateManager.addEntity(entity, idleingState);

let mouseDown = false;
let isAttacking = false;
let xMouse;
let yMouse;

window.addEventListener("mousemove", (mouseEvent) => {
    xMouse = mouseEvent.layerX;
    yMouse = mouseEvent.layerY;
});

/**
 * @param {MouseEvent} mouseEvent
 */
function mouseClickHandler(mouseEvent) {
    mouseDown = (mouseEvent.type === 'mousedown');
}
document.addEventListener("mousedown", mouseClickHandler);
document.addEventListener("mouseup", mouseClickHandler);

window.addEventListener("blur", (focusEvent) => {
    ml.stop();
});
window.addEventListener("focus", (focusEvent) => {
    ml.start();
});

canvas.width = canvasWidth;
canvas.height = canvasHeight;

content.append(canvas);
document.body.append(content);

const ml = createMainloop(animationLoop);
ml.setDebug(true);
ml.start();
