// @ts-check
import { Utils } from "../utils.js";
import { AnimationFrame } from "./animationFrame.js";
import { Bone } from "./bone.js";
import { StickAnimation } from "./stickAnimation.js";
import { Vector } from "./vector.js";

export class StickFigure {
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
      -21,
      StickFigure.BONE_LEFT_KNEE,
      this.bones[StickFigure.BONE_LEFT_HIP]
    );
    this.bones[StickFigure.BONE_LEFT_FOOT] = Bone.fromPos(
      0,
      -23,
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
      -21,
      StickFigure.BONE_RIGHT_KNEE,
      this.bones[StickFigure.BONE_RIGHT_HIP]
    );
    this.bones[StickFigure.BONE_RIGHT_FOOT] = Bone.fromPos(
      0,
      -23,
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
  #getRunningAnimation() {
    if (Utils.isUndefined(this.#animations["running"])) {
      const running = new StickAnimation();

      const bonesLeft = {};
      bonesLeft[StickFigure.BONE_HEAD] = new Vector(3, -1);
      bonesLeft[StickFigure.BONE_NECK] = new Vector(5, -2);
      bonesLeft[StickFigure.BONE_PELVIS] = new Vector(0, -6);

      const bonesRight = {};
      bonesRight[StickFigure.BONE_HEAD] = new Vector(3, -1);
      bonesRight[StickFigure.BONE_NECK] = new Vector(5, -2);
      bonesRight[StickFigure.BONE_PELVIS] = new Vector(0, -6);

      running.setFrameAt(0, new AnimationFrame(20, bonesLeft));
      running.setFrameAt(1, new AnimationFrame(20, bonesRight));

      this.#animations["running"] = running;
    }

    return this.#animations["running"];
  }

  /**
   * @returns {StickAnimation}
   */
  #getIdleAnimation() {
    if (Utils.isUndefined(this.#animations["idle"])) {
      const idle = new StickAnimation();

      const brInVecs = {};
      brInVecs[StickFigure.BONE_PELVIS] = new Vector(0, -1);
      brInVecs[StickFigure.BONE_LEFT_SHOULDER] = new Vector(8, 0);
      brInVecs[StickFigure.BONE_RIGHT_SHOULDER] = new Vector(-8, 0);
      brInVecs[StickFigure.BONE_LEFT_HAND] = new Vector(15, 8);
      brInVecs[StickFigure.BONE_RIGHT_HAND] = new Vector(-5, 8);
      brInVecs[StickFigure.BONE_LEFT_HIP] = new Vector(8, 0);
      brInVecs[StickFigure.BONE_RIGHT_HIP] = new Vector(-8, 0);
      brInVecs[StickFigure.BONE_LEFT_FOOT] = new Vector(8, 0);
      brInVecs[StickFigure.BONE_RIGHT_FOOT] = new Vector(-5, 0);
      const breathIn = new AnimationFrame(40, brInVecs);

      const brOutVecs = {};
      brOutVecs[StickFigure.BONE_PELVIS] = new Vector(0, -5);
      brOutVecs[StickFigure.BONE_LEFT_SHOULDER] = new Vector(8, 0);
      brOutVecs[StickFigure.BONE_RIGHT_SHOULDER] = new Vector(-8, 0);
      brOutVecs[StickFigure.BONE_LEFT_HAND] = new Vector(15, 5);
      brOutVecs[StickFigure.BONE_RIGHT_HAND] = new Vector(-5, 5);
      brOutVecs[StickFigure.BONE_LEFT_FOOT] = new Vector(8, 0);
      brOutVecs[StickFigure.BONE_RIGHT_FOOT] = new Vector(-5, 0);
      brOutVecs[StickFigure.BONE_LEFT_HIP] = new Vector(8, 0);
      brOutVecs[StickFigure.BONE_RIGHT_HIP] = new Vector(-8, 0);
      const breathOut = new AnimationFrame(40, brOutVecs);

      idle.setFrameAt(0, breathIn);
      idle.setFrameAt(1, breathOut);

      this.#animations["idle"] = idle;
    }

    return this.#animations["idle"];
  }

  /**
   * @returns {StickAnimation}
   */
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

    if (this.velocity.x !== 0 && this.velocity.y === 0) {
      return this.#getRunningAnimation();
    }

    return this.#getIdleAnimation();
  }
}
