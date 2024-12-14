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
import IKSolver from "./components/ikSolver.js";

// /**
//  * @param {Line} sword
//  */
// function updateSword(sword, elapsed) {
//     // const animSpeed = 0.25;
//     const animSpeed = 1;
//     if (CheekyTicCounter > 1.3 * animSpeed) {
//         CheekyTicCounter = 0;
//     }

//     CheekyTicCounter += elapsed;
//     const animationTic = CheekyTicCounter / animSpeed;
//     const newStart = new Vector(sword.start.x, sword.start.y);
//     const newEnd = new Vector(sword.end.x, sword.end.y);

//     const otherAnimX = Lerp.calc(-50, 50, Lerp.parabola(animationTic))
//     const otherAnimY = Lerp.calc(0, -50, Lerp.linear(animationTic));
//     const x1Offset = 0 + otherAnimX;
//     const y1Offset = 0 + otherAnimY;
//     const x2Offset = Lerp.calc(-150, 200, Lerp.parabola(animationTic)) + otherAnimX;
//     const y2Offset = Lerp.calc(0, -250, Lerp.linear(animationTic)) + otherAnimY;

//     newStart.x += x1Offset;
//     newStart.y += y1Offset;
//     newEnd.x += x2Offset;
//     newEnd.y += y2Offset;

//     return new Line(newStart, newEnd, sword.c, sword.lw);
// }

// function updateSword2(sword, elapsed) {
//     let xStartOffset = 0;
//     let yStartOffset = 0;
//     let xEndOffset = 0;
//     let yEndOffset = 0;

//     for (const animation of animations) {
//         animation.progress += elapsed;
//         const tic = animation.progress % animation.duration / animation.duration;
//         xStartOffset += animation.xStart(tic);
//         yStartOffset += animation.yStart(tic);
//         xEndOffset += animation.xEnd(tic);
//         yEndOffset += animation.yEnd(tic);
//     }

//     return new Line(
//         new Vector(sword.start.x + xStartOffset, sword.start.y + yStartOffset),
//         new Vector(sword.end.x + xEndOffset, sword.end.y + yEndOffset),
//         sword.c, sword.lw
//     )
// }

/**
 * @param {Line} sword
 * @param {Array} animations
 * @param {Number} progress
 */
function updateSword3(sword, animations, progress) {
    let xStartOffset = 0;
    let yStartOffset = 0;
    let xEndOffset = 0;
    let yEndOffset = 0;

    for (const animation of animations) {
        xStartOffset += animation.xStart(progress);
        yStartOffset += animation.yStart(progress);
        xEndOffset += animation.xEnd(progress);
        yEndOffset += animation.yEnd(progress);
    }

    sword.x1 += playerPosition.x + xStartOffset;
    sword.y1 += playerPosition.y + yStartOffset;
    sword.x2 += playerPosition.x + xEndOffset;
    sword.y2 += playerPosition.y + yEndOffset;
}

/**
 * @param {Line} newLine
 * @param {Line} originalLine
 */
function resetSword(newLine, originalLine) {
    newLine.x1 = originalLine.x1;
    newLine.y1 = originalLine.y1;
    newLine.x2 = originalLine.x2;
    newLine.y2 = originalLine.y2;
    newLine.color = originalLine.color;
    newLine.lineWidth = originalLine.lineWidth;
}

/**
 * @param {Number} elapsed
 */
function updateGame(elapsed) {
    stateManager.update(elapsed);
    if (mouseDown && !isAttacking) {
        isAttacking = true;
        stateManager.setEntityIntent(entity, swinging);
    }

    if (!mouseDown && isAttacking) {
        isAttacking = false;
    }

    // playerPosition.x = xMouse * scale;
    // playerPosition.y = yMouse * scale;

    const curState = stateManager.getEntityState(entity);
    if ((1 <= curState.progress) && (false === curState.canLoop)) {
        stateManager.setEntityState(entity, idleingState);
    }

    const currentState = stateManager.getEntityState(entity);
    const currentAnimations = animations[currentState.name];
    resetSword(animatedSword, sword);
    updateSword3(animatedSword, currentAnimations, currentState.progress);
}

function adjustHandToSword(bone, sword, pos) {
    // create vector of sword itself
    const swordVector = Vector.subtract(new Vector(sword.x2, sword.y2), new Vector(sword.x1, sword.y1));

    // scale vector to pos,
    swordVector.scale(pos);

    // set bone to sword start coords + scaled vector
    bone.x2 = sword.x1 + swordVector.x;
    bone.y2 = sword.y1 + swordVector.y;
}

function addPlayer(arr, sword) {
    const bones = {
        "neck": {
            "x1": 0,
            "y1": -40.9,
            "x2": 0,
            "y2": -70.9,
            "color": "red",
            "lineWidth": 1
        },
        "headRect": {
            "x": -8,
            "y": -96.9,
            "width": 16,
            "height": 20,
            "color": "red"
        },
        "head": {
            "x1": 0,
            "y1": -70.9,
            "x2": 0,
            "y2": -86.9,
            "color": "red",
            "lineWidth": 1
        },
        "leftHip": {
            "x1": 0,
            "y1": -40.9,
            "x2": 8,
            "y2": -42.9,
            "color": "red",
            "lineWidth": 1
        },
        "leftKnee": {
            "x1": 8,
            "y1": -42.9,
            "x2": 27.6868279518407,
            "y2": -27.491275030210204,
            "color": "red",
            "lineWidth": 1
        },
        "leftFoot": {
            "x1": 27.6868279518407,
            "y1": -27.491275030210204,
            "x2": 33,
            "y2": 0,
            "color": "red",
            "lineWidth": 1
        },
        "rightHip": {
            "x1": 0,
            "y1": -40.9,
            "x2": -8,
            "y2": -42.9,
            "color": "red",
            "lineWidth": 1
        },
        "rightKnee": {
            "x1": -8,
            "y1": -42.9,
            "x2": -11.700864156165679,
            "y2": -18.17544531245086,
            "color": "red",
            "lineWidth": 1
        },
        "rightFoot": {
            "x1": -11.700864156165679,
            "y1": -18.17544531245086,
            "x2": -33,
            "y2": 0,
            "color": "red",
            "lineWidth": 1
        },
        "leftShoulder": {
            "x1": 0,
            "y1": -70.9,
            "x2": 8,
            "y2": -70.9,
            "color": "red",
            "lineWidth": 1
        },
        "leftElbow": {
            "x1": 8,
            "y1": -70.9,
            "x2": 7.074582329637769,
            "y2": -52.923804570060405,
            "color": "red",
            "lineWidth": 1
        },
        "leftHand": {
            "x1": 7.074582329637769,
            "y1": -52.923804570060405,
            "x2": 23,
            "y2": -40.825,
            "color": "red",
            "lineWidth": 1
        },
        "rightShoulder": {
            "x1": 0,
            "y1": -70.9,
            "x2": -8,
            "y2": -70.9,
            "color": "red",
            "lineWidth": 1
        },
        "rightElbow": {
            "x1": -8,
            "y1": -70.9,
            "x2": -21.459169643852487,
            "y2": -58.94798123754821,
            "color": "red",
            "lineWidth": 1
        },
        "rightHand": {
            "x1": -21.459169643852487,
            "y1": -58.94798123754821,
            "x2": -13,
            "y2": -40.825,
            "color": "red",
            "lineWidth": 1
        }
    }
    const localBones = {};
    for (const boneName in bones) {
        const bone = bones[boneName];
        if (bone.lineWidth) {
            localBones[boneName] = new Line(
                playerPosition.x + Math.floor(bone.x1 / 4),
                playerPosition.y + Math.floor(bone.y1 / 4),
                playerPosition.x + Math.floor(bone.x2 / 4),
                playerPosition.y + Math.floor(bone.y2 / 4),
                bone.color,
                bone.lineWidth
            );
        } else {
            localBones[boneName] = new Rectangle(
                playerPosition.x + Math.floor(bone.x / 4),
                playerPosition.y + Math.floor(bone.y / 4),
                Math.floor(bone.width / 4),
                Math.floor(bone.height / 4),
                bone.color
            );
        }
    }

    adjustHandToSword(localBones["rightHand"], sword, 0.1);
    adjustHandToSword(localBones["leftHand"], sword, 0);

    const leftElbowVector = new Vector(0, 0);
    const length1 = 4;
    const length2 = 5;
    const leftHandVector = new Vector(
        localBones["leftHand"].x2,
        localBones["leftHand"].y2
    );
    const leftShoulderVector = new Vector(
        localBones["leftElbow"].x1,
        localBones["leftElbow"].y1
    );
    IKSolver.global(leftElbowVector, length1, length2, leftHandVector, leftShoulderVector, 1);
    localBones["leftElbow"].x2 = leftElbowVector.x;
    localBones["leftElbow"].y2 = leftElbowVector.y;
    localBones["leftHand"].x1 = leftElbowVector.x;
    localBones["leftHand"].y1 = leftElbowVector.y;

    const rightElbowVector = new Vector(0, 0);
    const rightHandVector = new Vector(
        localBones["rightHand"].x2,
        localBones["rightHand"].y2
    );
    const rightShoulderVector = new Vector(
        localBones["rightElbow"].x1,
        localBones["rightElbow"].y1
    );
    IKSolver.global(rightElbowVector, length1, length2, rightHandVector, rightShoulderVector, 1);
    localBones["rightElbow"].x2 = rightElbowVector.x;
    localBones["rightElbow"].y2 = rightElbowVector.y;
    localBones["rightHand"].x1 = rightElbowVector.x;
    localBones["rightHand"].y1 = rightElbowVector.y;

    for (const boneName in localBones) {
        arr.push(localBones[boneName]);
    }

}

/**
 * @param {Number} elapsed
 */
function animationLoop(elapsed) {
    const elapsedSeconds = elapsed * 0.001;
    updateGame(elapsedSeconds);

    const drawables = [];
    addPlayer(drawables, animatedSword);
    drawables.push(animatedSword);

    if (gl) {
        Renderer2d.render(gl, camPos, drawables);
    }
}

const stickFigure = {
    "headRect": new Rectangle(-2, -25, 4, 5, "red"),
    "neck": new Line(0, -11, 0, -18, "red", 1),
    "head": new Line(0, -18, 0, -22, "red", 1),
    "leftHip": new Line(0, -11, 2, -11, "red", 1),
    "leftKnee": new Line(2, -11, 6, -7, "red", 1),
    "leftFoot": new Line(6, -7, 8, 0, "red", 1),
    "rightHip": new Line(0, -11, -2, -11, "red", 1),
    "rightKnee": new Line(2, -11, -3, -5, "red", 1),
    "rightFoot": new Line(3, -5, -9, 0, "red", 1),
    "leftShoulder": new Line(0, -18, 2, -18, "red", 1),
    "leftElbow": new Line(2, -18, 1, -14, "red", 1),
    "leftHand": new Line(1, -14, 5, -11, "red", 1),
    "rightShoulder": new Line(0, -18, -2, -18, "red", 1),
    "rightElbow": new Line(2, -18, -6, -15, "red", 1),
    "rightHand": new Line(6, -15, -4, -11, "red", 1),
    "sword": new Line(8, -16, 8, 0, "red", 1),
};

const content = document.createElement("div");
const canvas = document.createElement('canvas');
const scale = 1 / 4;
const canvasWidth = 800 * scale;
const canvasHeight = 600 * scale;
const gl = canvas.getContext("2d");

const playerPosition = new Vector(60, 82);
const camPos = new Vector(0, 0);
const animatedSword = new Line(0, 0, 0, 0, "white");

const stateManager = new StateManager();
const entity = new Entity("foo");
const swinging = new Intent("swinging");
const swingingState = new State('swinging', 0.5);
const swingingBackState = new State('swingingBack', 0.3);
const jabForwardState = new State('jabForward', 0.3);
const idleingState = new State('idleing', 1, true);

const animations = {
    idleing: [
        {
            xStart: (t) => -4,
            yStart: (t) => Lerp.calc(2, 1, Lerp.parabola(t)),
            xEnd: (t) => -24,
            yEnd: (t) => Lerp.calc(2, 1, Lerp.parabola(t)),
        },
    ],
    swinging: [
        {
            xStart: (t) => Lerp.calc(-6, 0, Lerp.sin(t)),
            yStart: (t) => Lerp.calc(-6, 0, Lerp.linear(t)),
            xEnd: (t) => Lerp.calc(-24, 31, Lerp.sin(t)),
            yEnd: (t) => Lerp.calc(0, -41, Lerp.linear(t)),
        },
    ],
    swingingBack: [
        {
            xStart: (t) => Lerp.calc(-6, 0, Lerp.sin(t)),
            yStart: (t) => Lerp.calc(-6, 0, Lerp.linear(t)),
            xEnd: (t) => Lerp.calc(-30, 37, Lerp.sin(t)),
            yEnd: (t) => Lerp.calc(-45, 0, Lerp.linear(t)),
        }
    ],
    jabForward: [
        {
            xStart: (t) => Lerp.calc(-12, 18, Lerp.parabola(t)),
            yStart: (t) => Lerp.calc(-6, 0, Lerp.linear(t)),
            xEnd: (t) => Lerp.calc(13, 43, Lerp.parabola(t)),
            yEnd: (t) => Lerp.calc(-23, -17, Lerp.linear(t)),
        }
    ]
};

idleingState.addIntent(swinging, swingingState, { min1: 0, min2: 0, max2: 1, max1: 1 });
swingingState.addIntent(swinging, swingingBackState, { min1: 0.7, min2: 0.8, max2: 1, max1: 1 });
swingingBackState.addIntent(swinging, jabForwardState, { min1: 0.4, min2: 0.45, max2: 0.55, max1: 0.6 });
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
