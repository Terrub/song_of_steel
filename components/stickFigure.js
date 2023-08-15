import { Utils } from "../utils.js";
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

  velocity;

  constructor(velocity) {
    this.velocity = velocity;

    this.color = "#444";
    this.thickness = 6;
    this.bones = {};

    this.bones[StickFigure.BONE_HEAD] = {
      point: new Vector(0, 96),
      connection: null,
    };
    this.bones[StickFigure.BONE_NECK] = {
      point: new Vector(0, 80),
      connection: StickFigure.BONE_HEAD,
    };
    this.bones[StickFigure.BONE_LEFT_SHOULDER] = {
      point: new Vector(-10, 78),
      connection: StickFigure.BONE_NECK,
    };
    this.bones[StickFigure.BONE_RIGHT_SHOULDER] = {
      point: new Vector(10, 78),
      connection: StickFigure.BONE_NECK,
    };
    this.bones[StickFigure.BONE_LEFT_ELBOW] = {
      point: new Vector(-18, 60),
      connection: StickFigure.BONE_LEFT_SHOULDER,
    };
    this.bones[StickFigure.BONE_RIGHT_ELBOW] = {
      point: new Vector(12, 60),
      connection: StickFigure.BONE_RIGHT_SHOULDER,
    };
    this.bones[StickFigure.BONE_LEFT_HAND] = {
      point: new Vector(-15, 42),
      connection: StickFigure.BONE_LEFT_ELBOW,
    };
    this.bones[StickFigure.BONE_RIGHT_HAND] = {
      point: new Vector(15, 42),
      connection: StickFigure.BONE_RIGHT_ELBOW,
    };
    this.bones[StickFigure.BONE_PELVIS] = {
      point: new Vector(0, 42),
      connection: StickFigure.BONE_NECK,
    };
    this.bones[StickFigure.BONE_LEFT_HIP] = {
      point: new Vector(-10, 47),
      connection: StickFigure.BONE_PELVIS,
    };
    this.bones[StickFigure.BONE_RIGHT_HIP] = {
      point: new Vector(10, 47),
      connection: StickFigure.BONE_PELVIS,
    };
    this.bones[StickFigure.BONE_LEFT_KNEE] = {
      point: new Vector(-15, 23),
      connection: StickFigure.BONE_LEFT_HIP,
    };
    this.bones[StickFigure.BONE_RIGHT_KNEE] = {
      point: new Vector(25, 23),
      connection: StickFigure.BONE_RIGHT_HIP,
    };
    this.bones[StickFigure.BONE_LEFT_FOOT] = {
      point: new Vector(-30, 0),
      connection: StickFigure.BONE_LEFT_KNEE,
    };
    this.bones[StickFigure.BONE_RIGHT_FOOT] = {
      point: new Vector(30, 0),
      connection: StickFigure.BONE_RIGHT_KNEE,
    };
  }

  #resolveIdle(numTics) {
    // assume idle pose
    const breathOffset = Math.cos(numTics * 0.0625) * 0.0625;

    this.bones[StickFigure.BONE_HEAD].point.y += breathOffset;
    this.bones[StickFigure.BONE_NECK].point.y += breathOffset;
    this.bones[StickFigure.BONE_PELVIS].point.y += breathOffset;
    this.bones[StickFigure.BONE_LEFT_SHOULDER].point.y += -breathOffset;
    this.bones[StickFigure.BONE_RIGHT_SHOULDER].point.y += -breathOffset;
    this.bones[StickFigure.BONE_LEFT_KNEE].point.x += -breathOffset;
    this.bones[StickFigure.BONE_RIGHT_KNEE].point.x += -breathOffset;
  }

  #resolveRun(numTics) {
    const frame = Math.floor(numTics / 6) % 6;
  }

  #offsetBones(numTics) {
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
      this.#resolveRun(numTics);
      return;
    }

    this.#resolveIdle(numTics);
  }

  draw(renderer, position, numTics) {
    this.#offsetBones(numTics);

    for (const boneName in this.bones) {
      const bone = this.bones[boneName];
      const connection = this.bones[bone.connection];
      if (Utils.isDefined(connection)) {
        renderer.drawLine(
          position.x + bone.point.x,
          position.y + bone.point.y,
          position.x + connection.point.x,
          position.y + connection.point.y,
          this.color,
          this.thickness
        );
      } else {
        renderer.drawRect(
          position.x + bone.point.x - 8,
          position.y + bone.point.y - 10,
          16,
          20,
          this.color
        );
      }
    }
  }
}
