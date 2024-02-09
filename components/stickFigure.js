// @ts-check
import { Utils } from "../utils.js";
import { AnimationFrame } from "./animationFrame.js";
import { Bone } from "./bone.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { IKSolver } from "./ikSolver.js";
import { Player } from "./player.js";
import { StickAnimation } from "./stickAnimation.js";
import { Vector } from "./vector.js";

const DEBUG_BONE_COLOUR_GAP = 5;
const DEBUG_BONE_COLOUR_WIDTH = 10;
const DEBUG_BONE_COLOUR_HEIGHT = 10;
const DEBUG_BONE_COLOUR_OFFSET_X = 10;
const DEBUG_BONE_COLOUR_OFFSET_Y = 10;
export class StickFigure extends Player {
  static BONE_HEAD = "head";
  static BONE_NECK = "neck";
  static BONE_RIGHT_SHOULDER = "rightShoulder";
  static BONE_LEFT_SHOULDER = "leftShoulder";
  static BONE_RIGHT_ELBOW = "rightElbow";
  static BONE_LEFT_ELBOW = "leftElbow";
  static BONE_RIGHT_HAND = "rightHand";
  static BONE_LEFT_HAND = "leftHand";
  static BONE_PELVIS = "pelvis";
  static BONE_RIGHT_HIP = "rightHip";
  static BONE_LEFT_HIP = "leftHip";
  static BONE_RIGHT_KNEE = "rightKnee";
  static BONE_LEFT_KNEE = "leftKnee";
  static BONE_RIGHT_FOOT = "rightFoot";
  static BONE_LEFT_FOOT = "leftFoot";

  /** @type {Object.<string, Bone>} */
  bones;
  /** @type {Object.<string, Vector>} */
  #boneVectors;
  /** @type {Object.<string, Vector>} */
  #feetVectors;
  /** @type {Object.<string, StickAnimation>} */
  #animations;
  /** @type {Object.<string, Vector>} */
  #debugBoneColourOffset;
  /** @type {?StickAnimation} */
  fixedAnimation;

  /**
   * @param {Vector} velocity
   */
  constructor(velocity) {
    super(velocity);
    this.bones = {};
    this.#boneVectors = {};
    this.#feetVectors = {};
    this.#animations = {};
    this.#debugBoneColourOffset = {};
    this.fixedAnimation = null;
  }

  load() {
    this.bones[StickFigure.BONE_PELVIS] = Bone.fromPos(
      0,
      42,
      StickFigure.BONE_PELVIS,
      null
    );
    this.bones[StickFigure.BONE_NECK] = Bone.fromPos(
      0,
      30,
      StickFigure.BONE_NECK,
      this.bones[StickFigure.BONE_PELVIS]
    );
    this.bones[StickFigure.BONE_HEAD] = Bone.fromPos(
      0,
      16,
      StickFigure.BONE_HEAD,
      this.bones[StickFigure.BONE_NECK]
    );
    this.bones[StickFigure.BONE_LEFT_HIP] = Bone.fromPos(
      0,
      2,
      StickFigure.BONE_LEFT_HIP,
      this.bones[StickFigure.BONE_PELVIS]
    );
    this.bones[StickFigure.BONE_LEFT_KNEE] = Bone.fromPos(
      0,
      -25,
      StickFigure.BONE_LEFT_KNEE,
      this.bones[StickFigure.BONE_LEFT_HIP]
    );
    this.bones[StickFigure.BONE_LEFT_FOOT] = Bone.fromPos(
      0,
      -28,
      StickFigure.BONE_LEFT_FOOT,
      this.bones[StickFigure.BONE_LEFT_KNEE]
    );
    this.bones[StickFigure.BONE_RIGHT_HIP] = Bone.fromPos(
      0,
      2,
      StickFigure.BONE_RIGHT_HIP,
      this.bones[StickFigure.BONE_PELVIS]
    );
    this.bones[StickFigure.BONE_RIGHT_KNEE] = Bone.fromPos(
      0,
      -25,
      StickFigure.BONE_RIGHT_KNEE,
      this.bones[StickFigure.BONE_RIGHT_HIP]
    );
    this.bones[StickFigure.BONE_RIGHT_FOOT] = Bone.fromPos(
      0,
      -28,
      StickFigure.BONE_RIGHT_FOOT,
      this.bones[StickFigure.BONE_RIGHT_KNEE]
    );
    this.bones[StickFigure.BONE_LEFT_SHOULDER] = Bone.fromPos(
      0,
      0,
      StickFigure.BONE_LEFT_SHOULDER,
      this.bones[StickFigure.BONE_NECK]
    );
    this.bones[StickFigure.BONE_LEFT_ELBOW] = Bone.fromPos(
      0,
      -18,
      StickFigure.BONE_LEFT_ELBOW,
      this.bones[StickFigure.BONE_LEFT_SHOULDER]
    );
    this.bones[StickFigure.BONE_LEFT_HAND] = Bone.fromPos(
      0,
      -20,
      StickFigure.BONE_LEFT_HAND,
      this.bones[StickFigure.BONE_LEFT_ELBOW]
    );
    this.bones[StickFigure.BONE_RIGHT_SHOULDER] = Bone.fromPos(
      0,
      0,
      StickFigure.BONE_RIGHT_SHOULDER,
      this.bones[StickFigure.BONE_NECK]
    );
    this.bones[StickFigure.BONE_RIGHT_ELBOW] = Bone.fromPos(
      0,
      -18,
      StickFigure.BONE_RIGHT_ELBOW,
      this.bones[StickFigure.BONE_RIGHT_SHOULDER]
    );
    this.bones[StickFigure.BONE_RIGHT_HAND] = Bone.fromPos(
      0,
      -20,
      StickFigure.BONE_RIGHT_HAND,
      this.bones[StickFigure.BONE_RIGHT_ELBOW]
    );

    this.#animations["running_left"] = this.#getRunningLeftAnimation();
    this.#animations["running_right"] = this.#getRunningRightAnimation();
    this.#animations["idle"] = this.#getIdleAnimation();

    const offsetX = DEBUG_BONE_COLOUR_OFFSET_X;
    let offsetY = DEBUG_BONE_COLOUR_OFFSET_Y;
    for (const boneName in this.bones) {
      this.#boneVectors[boneName] = new Vector(0, 0);
      this.#debugBoneColourOffset[boneName] = new Vector(offsetX, offsetY);
      offsetY += DEBUG_BONE_COLOUR_HEIGHT + DEBUG_BONE_COLOUR_GAP;
    }

    this.#feetVectors[StickFigure.BONE_RIGHT_FOOT] = new Vector(0, 0);
    this.#feetVectors[StickFigure.BONE_LEFT_FOOT] = new Vector(0, 0);
    this.#feetVectors[StickFigure.BONE_RIGHT_HAND] = new Vector(0, 0);
    this.#feetVectors[StickFigure.BONE_LEFT_HAND] = new Vector(0, 0);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {?string}
   */
  getDebugInfoAtMouse(x, y) {
    if (DEBUG_BONE_COLOUR_OFFSET_X < x && 100 > x) {
      for (const boneName in this.#debugBoneColourOffset) {
        const offset = this.#debugBoneColourOffset[boneName];
        if (offset.y < y && offset.y + DEBUG_BONE_COLOUR_HEIGHT > y) {
          return boneName;
        }
      }
    }

    // We couldn't find anything at this location
    return null;
  }

  /**
   * @param {Object.<string, Bone>} bones
   * @param {Object.<string, Vector>} boneVectors
   * @returns {void}
   */
  #resetBoneVectors(bones, boneVectors) {
    for (const boneName in bones) {
      boneVectors[boneName].x = bones[boneName].x;
      boneVectors[boneName].y = bones[boneName].y;
    }
  }

  /**
   * @param {Bone} base
   * @returns {void}
   */
  #forwardKinematics(base) {
    for (const child of base.children) {
      this.#boneVectors[child.name].add(this.#boneVectors[base.name]);

      if (child.children.length > 0) {
        this.#forwardKinematics(child);
      }
    }
  }

  /**
   * @param {Object.<string, Bone>} bones
   * @param {Object.<string, Vector>} boneVectors
   * @returns {void}
   */
  #inverseKinematics(bones, boneVectors) {
    const limbs = [
      {
        endEffector: StickFigure.BONE_LEFT_FOOT,
        joint: StickFigure.BONE_LEFT_KNEE,
        base: StickFigure.BONE_LEFT_HIP,
        dir: 0 <= this.velocity.x ? 1 : -1,
      },
      {
        endEffector: StickFigure.BONE_RIGHT_FOOT,
        joint: StickFigure.BONE_RIGHT_KNEE,
        base: StickFigure.BONE_RIGHT_HIP,
        dir: 0 <= this.velocity.x ? 1 : -1,
      },
      {
        endEffector: StickFigure.BONE_LEFT_HAND,
        joint: StickFigure.BONE_LEFT_ELBOW,
        base: StickFigure.BONE_LEFT_SHOULDER,
        dir: 0 > this.velocity.x ? 1 : -1,
      },
      {
        endEffector: StickFigure.BONE_RIGHT_HAND,
        joint: StickFigure.BONE_RIGHT_ELBOW,
        base: StickFigure.BONE_RIGHT_SHOULDER,
        dir: 0 > this.velocity.x ? 1 : -1,
      },
    ];

    for (const limb of limbs) {
      IKSolver.global(
        boneVectors[limb.joint],
        bones[limb.joint].length,
        bones[limb.endEffector].length,
        boneVectors[limb.endEffector],
        boneVectors[limb.base],
        limb.dir
      );
    }
  }

  /**
   * @param {string} boneName
   * @returns {string}
   */
  #debugGetColorForBone(boneName) {
    const cOffset = 360 / 14;
    const bc = {};
    bc[StickFigure.BONE_HEAD] = `hsl(${0 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_NECK] = `hsl(${8 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_PELVIS] = `hsl(${1 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_RIGHT_SHOULDER] = `hsl(${9 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_RIGHT_ELBOW] = `hsl(${2 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_RIGHT_HAND] = `hsl(${10 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_RIGHT_HIP] = `hsl(${3 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_RIGHT_KNEE] = `hsl(${11 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_RIGHT_FOOT] = `hsl(${4 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_LEFT_SHOULDER] = `hsl(${12 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_LEFT_ELBOW] = `hsl(${5 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_LEFT_HAND] = `hsl(${13 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_LEFT_HIP] = `hsl(${6 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_LEFT_KNEE] = `hsl(${14 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_LEFT_FOOT] = `hsl(${7 * cOffset}, 100%, 50%)`;

    return bc[boneName];
  }

  /**
   * @param {CanvasRenderer} renderer
   * @param {Vector} position
   * @param {number} floorHeight
   * @returns {void}
   */
  #drawBoneVectors(renderer, position, floorHeight) {
    const thickness = 6;
    let color = "red";
    for (const boneName in this.#boneVectors) {
      /** @type {Bone} */
      const bone = this.bones[boneName];

      if (Utils.isNull(bone.parent)) {
        continue;
      }

      /** @type {Vector} */
      const boneVector = this.#boneVectors[boneName];
      /** @type {Vector} */
      // @ts-ignore We early exit if bone.parent is null
      const parentVector = this.#boneVectors[bone.parent.name];

      if (this.debug) {
        color = this.#debugGetColorForBone(boneName);
      }

      // TODO Consider allowing bones to determine how they are rendered.
      if (boneName === StickFigure.BONE_HEAD) {
        renderer.drawRect(
          boneVector.x - 8 + position.x,
          boneVector.y - 10 + position.y + floorHeight,
          16,
          20,
          color
        );
      }

      renderer.drawLine(
        boneVector.x + position.x,
        boneVector.y + position.y + floorHeight,
        parentVector.x + position.x,
        parentVector.y + position.y + floorHeight,
        color,
        thickness
      );
    }
  }

  /**
   * @param {CanvasRenderer} renderer
   * @param {Object.<string, Bone>} bones
   * @returns {void}
   */
  #debugDrawBoneColours(renderer, bones) {
    for (const boneName in bones) {
      const color = this.#debugGetColorForBone(boneName);
      const offset = this.#debugBoneColourOffset[boneName];
      renderer.drawRect(
        offset.x,
        offset.y,
        DEBUG_BONE_COLOUR_WIDTH,
        DEBUG_BONE_COLOUR_HEIGHT,
        color
      );
      renderer.text(
        offset.x + DEBUG_BONE_COLOUR_WIDTH + DEBUG_BONE_COLOUR_GAP,
        offset.y + 2,
        boneName,
        "white"
      );
    }
  }

  /**
   * @param {CanvasRenderer} renderer
   * @param {Vector} position
   * @param {number} floorHeight
   * @returns {void}
   */
  #debugRenderInfo(renderer, position, floorHeight) {
    const bones = this.bones;

    this.#debugDrawBoneColours(renderer, bones);
    this.#debugDrawPlayerPosition(renderer, position, floorHeight);

    const pelvisPos = this.#boneVectors[StickFigure.BONE_PELVIS];
    this.#debugDrawPoint(renderer, pelvisPos);

    const l1 = bones[StickFigure.BONE_RIGHT_KNEE].length;
    const l2 = bones[StickFigure.BONE_RIGHT_FOOT].length;
    const b = pelvisPos.y - floorHeight - position.y;
    const c = l1 + l2;
    const s = Math.sqrt(c * c - b * b);

    this.#debugDrawEstimate(renderer, position.x + s, position.y + floorHeight);
    this.#debugDrawEstimate(renderer, position.x - s, position.y + floorHeight);

    this.#drawIKEstimate(
      renderer,
      l1,
      l2,
      this.#boneVectors[StickFigure.BONE_LEFT_HIP],
      this.#boneVectors[StickFigure.BONE_LEFT_FOOT]
    );

    this.#drawIKEstimate(
      renderer,
      l1,
      l2,
      this.#boneVectors[StickFigure.BONE_RIGHT_HIP],
      this.#boneVectors[StickFigure.BONE_RIGHT_FOOT]
    );
  }

  /**
   * @param {CanvasRenderer} renderer
   * @param {number} l1
   * @param {number} l2
   * @param {Vector} base
   * @param {Vector} endEffector
   * @returns {void}
   */
  #drawIKEstimate(renderer, l1, l2, base, endEffector) {
    const radius = 3;
    const color = "limegreen";

    const vector = new Vector(0, 0);
    IKSolver.global(
      vector,
      l1,
      l2,
      endEffector,
      base,
      0 <= this.velocity.x ? 1 : -1
    );
    renderer.strokeCircle(vector.x, vector.y, radius, color);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {void}
   */
  #debugDrawEstimate(renderer, x, y) {
    const radius = 3;
    const color = "limegreen";

    renderer.strokeCircle(x, y, radius, color);
  }

  /**
   * @param {CanvasRenderer} renderer
   * @param {Vector} position
   * @param {number} floorHeight
   * @returns {void}
   */
  #debugDrawPlayerPosition(renderer, position, floorHeight) {
    const radius = 3;
    const color = "orange";

    renderer.strokeCircle(position.x, floorHeight + position.y, radius, color);
  }

  /**
   * @param {CanvasRenderer} renderer
   * @param {Vector} point
   * @returns {void}
   */
  #debugDrawPoint(renderer, point) {
    const radius = 5;
    const color = "yellow";

    renderer.strokeCircle(point.x, point.y, radius, color);
  }

  /**
   * @param {CanvasRenderer} renderer
   * @param {Vector} position
   * @param {number} numTics
   * @param {number} floorHeight
   */
  draw(renderer, position, numTics, floorHeight) {
    /**
     * Isn't this entire thing the classical back n forth draw cycle algorithm???
     * 1) Something changes our current state.  -> Animation frame
     * 2) Resolve properties (top-down)         -> Forward Kinematics
     * 3) Resolve measurements (bottom-up)      -> Inverse Kinematics
     * 4) Draw actuals (top-down)               -> Draw cycle
     */
    const bones = this.bones;
    const boneVectors = this.#boneVectors;

    // clear last buffer.
    this.#resetBoneVectors(bones, boneVectors);

    // 1) Add absolute property changes to bones based on animation
    //     This introduces the changes and causes properties to be changed.

    const animation = this.#getAnimation();
    animation.resolve(numTics, boneVectors);

    // 2) Forward Kinematics resolve property changes and propegate them down the node tree
    const pelvisPos = boneVectors[StickFigure.BONE_PELVIS];
    const b = pelvisPos.y;
    this.#forwardKinematics(bones[StickFigure.BONE_PELVIS]);

    this.#adjustLimbs(b);

    // 3) Inverse Kinematics resolve any measurements that have to happen in between
    this.#inverseKinematics(bones, boneVectors);

    // 4) Now we just draw the whole node tree
    this.#drawBoneVectors(renderer, position, floorHeight);

    if (this.debug === true) {
      this.#debugRenderInfo(renderer, position, floorHeight);
    }
  }

  /**
   * @param {number} b
   * @returns {void}
   */
  #adjustLimbs(b) {
    const bones = this.bones;
    const boneVectors = this.#boneVectors;

    const l1 = bones[StickFigure.BONE_RIGHT_KNEE].length;
    const l2 = bones[StickFigure.BONE_RIGHT_FOOT].length;
    const c = l1 + l2;
    const s = Math.sqrt(c * c - b * b);

    const rightFoot = boneVectors[StickFigure.BONE_RIGHT_FOOT];
    const leftFoot = boneVectors[StickFigure.BONE_LEFT_FOOT];
    // Keep yer feet on the grauwnd
    rightFoot.y = 0;
    leftFoot.y = 0;

    const lastRFV = this.#feetVectors[StickFigure.BONE_RIGHT_FOOT];
    const lastLFV = this.#feetVectors[StickFigure.BONE_LEFT_FOOT];

    // Not standing still and not jumping/falling either
    if (this.velocity.x !== 0 && this.velocity.y === 0) {
      rightFoot.x = lastRFV.x;
      leftFoot.x = lastLFV.x;
      if (0 < this.velocity.x) {
        if (-s > leftFoot.x || (lastLFV.y > 0 && leftFoot.x < s)) {
          leftFoot.x += this.velocity.x * 2;
          lastLFV.y = (1 + Math.cos((leftFoot.x / (2 * s)) * Math.PI)) * 5;
          leftFoot.y += lastLFV.y;
        } else {
          leftFoot.x -= this.velocity.x;
          lastLFV.y = 0;
        }

        if (-s > rightFoot.x || (lastRFV.y > 0 && rightFoot.x < s)) {
          rightFoot.x += this.velocity.x * 2;
          lastRFV.y = (1 + Math.cos((rightFoot.x / (2 * s)) * Math.PI)) * 5;
          rightFoot.y += lastRFV.y;
        } else {
          rightFoot.x -= this.velocity.x;
          lastRFV.y = 0;
        }
      }

      if (0 > this.velocity.x) {
        if (s < leftFoot.x || (lastLFV.y > 0 && leftFoot.x > -s)) {
          leftFoot.x += this.velocity.x * 2;
          lastLFV.y = (1 + Math.cos((leftFoot.x / (2 * s)) * Math.PI)) * 5;
          leftFoot.y += lastLFV.y;
        } else {
          leftFoot.x -= this.velocity.x;
          lastLFV.y = 0;
        }

        if (s < rightFoot.x || (lastRFV.y > 0 && rightFoot.x > -s)) {
          rightFoot.x += this.velocity.x * 2;
          lastRFV.y = (1 + Math.cos((rightFoot.x / (2 * s)) * Math.PI)) * 5;
          rightFoot.y += lastRFV.y;
        } else {
          rightFoot.x -= this.velocity.x;
          lastRFV.y = 0;
        }
      }
    }
    lastRFV.x = rightFoot.x;
    lastLFV.x = leftFoot.x;
  }

  /**
   * @returns {StickAnimation}
   */
  #getRunningLeftAnimation() {
    const runningLeft = new StickAnimation();

    const animVecs = {};
    animVecs[StickFigure.BONE_HEAD] = new Vector(-3, -1);
    animVecs[StickFigure.BONE_NECK] = new Vector(-5, -2);
    animVecs[StickFigure.BONE_PELVIS] = new Vector(-15, -5);
    animVecs[StickFigure.BONE_LEFT_HAND] = new Vector(-5, 20);
    animVecs[StickFigure.BONE_RIGHT_HAND] = new Vector(-5, 20);

    runningLeft.setFrameAt(0, new AnimationFrame(1, animVecs));

    return runningLeft;
  }

  /**
   * @returns {StickAnimation}
   */
  #getRunningRightAnimation() {
    const runningRight = new StickAnimation();

    const animVecs = {};
    animVecs[StickFigure.BONE_HEAD] = new Vector(3, -1);
    animVecs[StickFigure.BONE_NECK] = new Vector(5, -2);
    animVecs[StickFigure.BONE_PELVIS] = new Vector(15, -5);
    animVecs[StickFigure.BONE_LEFT_HAND] = new Vector(5, 20);
    animVecs[StickFigure.BONE_RIGHT_HAND] = new Vector(5, 20);

    runningRight.setFrameAt(0, new AnimationFrame(1, animVecs));

    return runningRight;
  }

  /**
   * @returns {StickAnimation}
   */
  #getIdleAnimation() {
    const idle = new StickAnimation();

    const brInVecs = {};
    brInVecs[StickFigure.BONE_PELVIS] = new Vector(0, -1);
    brInVecs[StickFigure.BONE_LEFT_FOOT] = new Vector(25, 0);
    brInVecs[StickFigure.BONE_RIGHT_FOOT] = new Vector(-25, 0);
    brInVecs[StickFigure.BONE_LEFT_HIP] = new Vector(8, 0);
    brInVecs[StickFigure.BONE_RIGHT_HIP] = new Vector(-8, 0);
    brInVecs[StickFigure.BONE_LEFT_SHOULDER] = new Vector(8, 0);
    brInVecs[StickFigure.BONE_RIGHT_SHOULDER] = new Vector(-8, 0);
    brInVecs[StickFigure.BONE_LEFT_HAND] = new Vector(15, 8);
    brInVecs[StickFigure.BONE_RIGHT_HAND] = new Vector(-5, 8);
    const breathIn = new AnimationFrame(40, brInVecs);

    const brOutVecs = {};
    brOutVecs[StickFigure.BONE_PELVIS] = new Vector(0, -5);
    brOutVecs[StickFigure.BONE_LEFT_FOOT] = new Vector(25, 0);
    brOutVecs[StickFigure.BONE_RIGHT_FOOT] = new Vector(-25, 0);
    brOutVecs[StickFigure.BONE_LEFT_HIP] = new Vector(8, 0);
    brOutVecs[StickFigure.BONE_RIGHT_HIP] = new Vector(-8, 0);
    brOutVecs[StickFigure.BONE_LEFT_SHOULDER] = new Vector(8, 0);
    brOutVecs[StickFigure.BONE_RIGHT_SHOULDER] = new Vector(-8, 0);
    brOutVecs[StickFigure.BONE_LEFT_HAND] = new Vector(15, 5);
    brOutVecs[StickFigure.BONE_RIGHT_HAND] = new Vector(-5, 5);
    const breathOut = new AnimationFrame(40, brOutVecs);

    idle.setFrameAt(0, breathIn);
    idle.setFrameAt(1, breathOut);

    return idle;
  }

  /**
   * @returns {StickAnimation}
   */
  #getAnimation() {
    if (this.debug && this.fixedAnimation) {
      return this.fixedAnimation;
    }

    // if (this.#attacking === Character.ATTACK_RIGHT) {
    //   currentSprite = this.#sprites[Character.ATTACK_RIGHT];
    //   return;
    // }

    // if (this.#attacking === Character.ATTACK_LEFT) {
    //   currentSprite = this.#sprites[Character.ATTACK_LEFT];
    //   return;
    // }

    // if (this.velocity.y <= 0 && position.y !== 0) {
    //   currentSprite = this.#sprites.fall;
    //   return;
    // }

    // if (this.velocity.y > 0 && position.y > 0) {
    //   currentSprite = this.#sprites.jump;
    //   return;
    // }

    if (0 < this.velocity.x && 0 === this.velocity.y) {
      return this.#animations["running_right"];
    }

    if (0 > this.velocity.x && 0 === this.velocity.y) {
      return this.#animations["running_left"];
    }

    return this.#animations["idle"];
  }
}
