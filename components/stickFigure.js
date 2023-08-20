// @ts-check
import { Utils } from "../utils.js";
import { AnimationFrame } from "./animationFrame.js";
import { Bone } from "./bone.js";
import { StickAnimation } from "./stickAnimation.js";
import { Vector } from "./vector.js";

export class StickFigure {
  static BONE_HEAD = "head";
  static BONE_NECK = "neck";
  static BONE_LEFT_SHOULDER = "leftShoulder";
  static BONE_RIGHT_SHOULDER = "rightShoulder";
  static BONE_LEFT_ELBOW = "leftElbow";
  static BONE_RIGHT_ELBOW = "rightElbow";
  static BONE_LEFT_HAND = "leftHand";
  static BONE_RIGHT_HAND = "rightHand";
  static BONE_PELVIS = "pelvis";
  static BONE_LEFT_HIP = "leftHip";
  static BONE_RIGHT_HIP = "rightHip";
  static BONE_LEFT_KNEE = "leftKnee";
  static BONE_RIGHT_KNEE = "rightKnee";
  static BONE_LEFT_FOOT = "leftFoot";
  static BONE_RIGHT_FOOT = "rightFoot";

  /** @type {Vector} */
  velocity;
  /** @type {Object.<string, Bone>} */
  bones;
  /** @type {Object.<string, StickAnimation>} */
  #animations;

  /**
   * @param {Vector} velocity
   */
  constructor(velocity) {
    this.velocity = velocity;
    this.bones = {};
    this.#animations = {};

    // TODO Remove the work from the constructor
    this.bones[StickFigure.BONE_PELVIS] = Bone.fromPos(
      0,
      42,
      StickFigure.BONE_PELVIS,
      null
    );

    this.bones[StickFigure.BONE_NECK] = Bone.fromPolar(
      0.5 * Math.PI,
      30,
      StickFigure.BONE_NECK,
      this.bones[StickFigure.BONE_PELVIS]
    );
    this.bones[StickFigure.BONE_HEAD] = Bone.fromPolar(
      0.5 * Math.PI,
      16,
      StickFigure.BONE_HEAD,
      this.bones[StickFigure.BONE_NECK]
    );
    this.bones[StickFigure.BONE_RIGHT_HIP] = Bone.fromPos(
      11,
      2,
      StickFigure.BONE_RIGHT_HIP,
      this.bones[StickFigure.BONE_PELVIS]
    );
    this.bones[StickFigure.BONE_RIGHT_KNEE] = Bone.fromPolar(
      1.5 * Math.PI,
      21,
      StickFigure.BONE_RIGHT_KNEE,
      this.bones[StickFigure.BONE_RIGHT_HIP]
    );
    this.bones[StickFigure.BONE_RIGHT_FOOT] = Bone.fromPolar(
      1.5 * Math.PI,
      23,
      StickFigure.BONE_RIGHT_FOOT,
      this.bones[StickFigure.BONE_RIGHT_KNEE]
    );
    this.bones[StickFigure.BONE_LEFT_HIP] = Bone.fromPos(
      -11,
      2,
      StickFigure.BONE_LEFT_HIP,
      this.bones[StickFigure.BONE_PELVIS]
    );
    this.bones[StickFigure.BONE_LEFT_KNEE] = Bone.fromPolar(
      1.5 * Math.PI,
      21,
      StickFigure.BONE_LEFT_KNEE,
      this.bones[StickFigure.BONE_LEFT_HIP]
    );
    this.bones[StickFigure.BONE_LEFT_FOOT] = Bone.fromPolar(
      1.5 * Math.PI,
      23,
      StickFigure.BONE_LEFT_FOOT,
      this.bones[StickFigure.BONE_LEFT_KNEE]
    );
    this.bones[StickFigure.BONE_RIGHT_SHOULDER] = Bone.fromPolar(
      0,
      10,
      StickFigure.BONE_RIGHT_SHOULDER,
      this.bones[StickFigure.BONE_NECK]
    );
    this.bones[StickFigure.BONE_RIGHT_ELBOW] = Bone.fromPolar(
      0,
      20,
      StickFigure.BONE_RIGHT_ELBOW,
      this.bones[StickFigure.BONE_RIGHT_SHOULDER]
    );
    this.bones[StickFigure.BONE_RIGHT_HAND] = Bone.fromPolar(
      0,
      18,
      StickFigure.BONE_RIGHT_HAND,
      this.bones[StickFigure.BONE_RIGHT_ELBOW]
    );
    this.bones[StickFigure.BONE_LEFT_SHOULDER] = Bone.fromPolar(
      Math.PI,
      10,
      StickFigure.BONE_LEFT_SHOULDER,
      this.bones[StickFigure.BONE_NECK]
    );
    this.bones[StickFigure.BONE_LEFT_ELBOW] = Bone.fromPolar(
      Math.PI,
      20,
      StickFigure.BONE_LEFT_ELBOW,
      this.bones[StickFigure.BONE_LEFT_SHOULDER]
    );
    this.bones[StickFigure.BONE_LEFT_HAND] = Bone.fromPolar(
      Math.PI,
      18,
      StickFigure.BONE_LEFT_HAND,
      this.bones[StickFigure.BONE_LEFT_ELBOW]
    );
  }

  /**
   * @param {number} numTics
   * @param {Object.<string, Vector>} boneVectors
   * @returns {void}
   */
  animateBoneVectors(numTics, boneVectors) {
    const animation = this.#getAnimation();
    animation.resolve(numTics, boneVectors);
  }

  /**
   * @returns {StickAnimation}
   */
  #getIdleAnimation() {
    if (Utils.isUndefined(this.#animations["idle"])) {
      const idle = new StickAnimation();

      const brInVecs = {};
      brInVecs[StickFigure.BONE_PELVIS] = new Vector(0, -1);
      brInVecs[StickFigure.BONE_LEFT_FOOT] = new Vector(-5, 0);
      brInVecs[StickFigure.BONE_RIGHT_FOOT] = new Vector(8, 0);
      brInVecs[StickFigure.BONE_LEFT_HAND] = new Vector(35, -20);
      brInVecs[StickFigure.BONE_RIGHT_HAND] = new Vector(-15, -20);
      const breathIn = new AnimationFrame(40, brInVecs);

      const brOutVecs = {};
      brOutVecs[StickFigure.BONE_PELVIS] = new Vector(0, -5);
      brOutVecs[StickFigure.BONE_LEFT_FOOT] = new Vector(-5, 0);
      brOutVecs[StickFigure.BONE_RIGHT_FOOT] = new Vector(8, 0);
      brOutVecs[StickFigure.BONE_LEFT_HAND] = new Vector(38, -20);
      brOutVecs[StickFigure.BONE_RIGHT_HAND] = new Vector(-18, -20);
      const breathOut = new AnimationFrame(40, brOutVecs);

      idle.setFrameAt(0, breathIn);
      idle.setFrameAt(1, breathOut);

      this.#animations["idle"] = idle;
    }

    return this.#animations["idle"];
  }

  #getAnimation() {
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
    // if (this.velocity.x !== 0 && this.velocity.y === 0) {
    //   this.#resolveRun(numTics);
    //   return;
    // }

    return this.#getIdleAnimation();
  }
}
