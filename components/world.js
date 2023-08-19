import { Utils } from "../utils.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { CanvasRendererTypeError } from "../errors/typeErrors/canvasRendererTypeError.js";
import { NumberTypeError } from "../errors/typeErrors/numberTypeError.js";
import { StickFigure } from "./stickFigure.js";
import { IKSolver } from "./ikSolver.js";
import { Vector } from "./vector.js";
import { Bone } from "./bone.js";

export class World {
  /** @type {CanvasRenderer} */
  #backdrop;
  /** @type {CanvasRenderer} */
  #background;
  /** @type {CanvasRenderer} */
  #wall;
  /** @type {CanvasRenderer} */
  #interactables;
  /** @type {CanvasRenderer} */
  #debugLayer;
  /** @type {CanvasRenderer} */
  #foreground;
  /** @type {Number} */
  #floorHeight = 0;
  #boneVectors = {};

  /** @type {Boolean} */
  debug = false;
  /** @type {Number} */
  width;
  /** @type {Number} */
  height;

  constructor(
    /** @type {Number} */ width,
    /** @type {Number} */ height,
    /** @type {CanvasRenderer} */ interactables,
    /** @type {CanvasRenderer} */ backdrop = null,
    /** @type {CanvasRenderer} */ background = null,
    /** @type {CanvasRenderer} */ wall = null,
    /** @type {CanvasRenderer} */ foreground = null
  ) {
    this.width = width;
    this.height = height;

    if (!Utils.isInstanceOf(CanvasRenderer, interactables)) {
      throw new CanvasRendererTypeError("interactables", interactables);
    }
    this.#interactables = interactables;
    // TODO Add a separate debug render layer... Please
    this.#debugLayer = interactables;

    if (
      !Utils.isNull(backdrop) &&
      !Utils.isInstanceOf(CanvasRenderer, backdrop)
    ) {
      throw new CanvasRendererTypeError("backDrop", backdrop);
    }
    this.#backdrop = backdrop;

    if (
      !Utils.isNull(background) &&
      !Utils.isInstanceOf(CanvasRenderer, background)
    ) {
      throw new CanvasRendererTypeError("backGround", background);
    }
    this.#background = background;

    if (!Utils.isNull(wall) && !Utils.isInstanceOf(CanvasRenderer, wall)) {
      throw new CanvasRendererTypeError("wall", wall);
    }
    this.#wall = wall;

    if (
      !Utils.isNull(foreground) &&
      !Utils.isInstanceOf(CanvasRenderer, foreground)
    ) {
      throw new CanvasRendererTypeError("foreground", foreground);
    }
    this.#foreground = foreground;
  }

  setFloor(/** @type {Number} */ height) {
    if (!Utils.isNumber(height)) {
      throw new NumberTypeError("height", height);
    }

    this.#floorHeight = Utils.constrain(height, 0, this.height);
  }

  setup() {
    if (this.#backdrop) {
      this.#backdrop.fill("#888");
    }

    if (this.#background) {
      this.#background.drawRect(0, 0, this.width, 150, "#555");
    }

    if (this.#wall) {
      let wallWidth = 8;
      for (let i = 100; i < this.width; i += 350) {
        wallWidth = wallWidth === 8 ? 15 : 8;
        this.#wall.drawRect(i, 0, wallWidth, 300, "#222");
      }
    }

    if (this.#foreground) {
      let foregroundWidth = 20;
      for (let i = -20; i < this.width; i += 400) {
        foregroundWidth = foregroundWidth === 45 ? 20 : 45;
        this.#foreground.drawRect(i, 0, foregroundWidth, 500, "#000");
      }
    }
  }

  loadPlayer(/** @type {StickFigure} */ player) {
    for (const boneName in player.bones) {
      this.#boneVectors[boneName] = new Vector(0, 0);
    }
  }

  #getResolvedBoneVector(boneName, /** @type {Bone} */ node, tree) {
    /** @type {Vector} */
    let v;

    if (!Utils.isNull(node.connection)) {
      v = this.#getResolvedBoneVector(boneName, tree[node.connection], tree);
    } else {
      v = this.#boneVectors[boneName];
      // reset the bone
      v.x = 0;
      v.y = 0;
    }

    v.add(node.point);

    return v;
  }

  #debugDrawBoneColours(bones) {
    let offsetX = 10;
    let offsetY = 10;

    for (const boneName in bones) {
      const color = this.#debugGetColorForBone(boneName);
      this.#debugLayer.drawRect(offsetX, offsetY, 10, 10, color);
      this.#debugLayer.text(offsetX + 15, offsetY + 2, boneName, "white");
      offsetY += 15;
    }
  }

  // TODO Refactor the shit out of #debugRenderInfo
  #debugRenderInfo(player, position, numTics) {
    const bones = player.bones;
    const radius = 3;
    const color = "yellow";
    this.#debugDrawBoneColours(bones);
    this.#debugDrawOrigin(position);

    const pelvisPos = this.#boneVectors[StickFigure.BONE_PELVIS];
    this.#debugDrawPoint(pelvisPos);
    const rightHip = this.#boneVectors[StickFigure.BONE_RIGHT_HIP];
    const rightFoot = this.#boneVectors[StickFigure.BONE_RIGHT_FOOT];
    const leftHip = this.#boneVectors[StickFigure.BONE_LEFT_HIP];
    const leftFoot = this.#boneVectors[StickFigure.BONE_LEFT_FOOT];

    const b = bones[StickFigure.BONE_PELVIS].point.y;
    const l1 = bones[StickFigure.BONE_LEFT_KNEE].point.length();
    const l2 = bones[StickFigure.BONE_LEFT_FOOT].point.length();
    const c = l1 + l2;
    const s = Math.sqrt(c * c - b * b);
    this.#debugLayer.strokeCircle(
      position.x + s,
      this.#floorHeight + position.y,
      radius,
      color
    );
    this.#debugLayer.strokeCircle(
      position.x - s,
      this.#floorHeight + position.y,
      radius,
      color
    );
    const vDebugRightKnee = new Vector(0, 0);
    IKSolver.global(vDebugRightKnee, l1, l2, rightFoot, rightHip);
    this.#debugLayer.strokeCircle(
      vDebugRightKnee.x,
      vDebugRightKnee.y,
      radius,
      "limegreen"
    );
    const vDebugLeftKnee = new Vector(0, 0);
    IKSolver.global(vDebugLeftKnee, l1, l2, leftFoot, leftHip);
    this.#debugLayer.strokeCircle(
      vDebugLeftKnee.x,
      vDebugLeftKnee.y,
      radius,
      "limegreen"
    );
  }

  #debugDrawOrigin(position) {
    const radius = 3;
    const color = "orange";

    this.#debugLayer.strokeCircle(
      position.x,
      this.#floorHeight + position.y,
      radius,
      color
    );
  }

  #debugDrawPoint(point) {
    const radius = 5;
    const color = "yellow";

    this.#debugLayer.strokeCircle(point.x, point.y, radius, color);
  }

  #debugGetColorForBone(/** @type {String} */ boneName) {
    const cOffset = 360 / 14;
    const bc = {};
    bc[StickFigure.BONE_HEAD] = `hsl(${0 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_NECK] = `hsl(${8 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_PELVIS] = `hsl(${1 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_LEFT_SHOULDER] = `hsl(${9 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_LEFT_ELBOW] = `hsl(${2 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_LEFT_HAND] = `hsl(${10 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_LEFT_HIP] = `hsl(${3 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_LEFT_KNEE] = `hsl(${11 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_LEFT_FOOT] = `hsl(${4 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_RIGHT_SHOULDER] = `hsl(${12 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_RIGHT_ELBOW] = `hsl(${5 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_RIGHT_HAND] = `hsl(${13 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_RIGHT_HIP] = `hsl(${6 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_RIGHT_KNEE] = `hsl(${14 * cOffset}, 100%, 50%)`;
    bc[StickFigure.BONE_RIGHT_FOOT] = `hsl(${7 * cOffset}, 100%, 50%)`;

    return bc[boneName];
  }

  draw(numTics) {
    this.#interactables.clear();
    this.#interactables.drawRect(0, 0, this.width, this.#floorHeight, "#111");
  }

  drawPlayer(
    /** @type {StickFigure} */ player,
    /** @type {Vector} */ playerPosition,
    /** @type {Number} */ numTics
  ) {
    const bones = player.bones;
    const position = playerPosition;
    let color = "red";
    const thickness = 6;

    // Do the resolving here for all the bones
    // We can even exit out early if we've already done any of the bones in the three
    for (const boneName in bones) {
      const bone = bones[boneName];
      const resolvedBone = this.#getResolvedBoneVector(boneName, bone, bones);

      // TODO Consider adding playerPosition and floor height to #getResolvedBoneVector?
      resolvedBone.add(playerPosition);
      resolvedBone.y += this.#floorHeight;
    }

    // Once the bones have been resolved from T-pose, we can simply apply all the animation frame
    // vectors to this set of bones, so we don't alter the originals, just working with our
    // internal set that we reset every frame anyway.
    player.animateBoneVectors(numTics, this.#boneVectors);

    // OK that works! we have bones, resolved and well and even animated them!
    // Time to solve some Inverse Kinematics!
    // TODO implement IKSolver here
    this.solveIK(bones);
    // Once all bones have been resolved and placed, we simply just draw them here.
    // Though we should loop over the resolved bones, not the originals!
    for (const boneName in bones) {
      /** @type {Bone} */
      const bone = bones[boneName];

      if (Utils.isNull(bone.connection)) {
        continue;
      }

      /** @type {Vector} */
      const boneVector = this.#boneVectors[boneName];
      /** @type {Vector} */
      const parentVector = this.#boneVectors[bone.connection];

      if (this.debug) {
        color = this.#debugGetColorForBone(boneName);
      }

      // TODO Consider allowing bones to determine how they are rendered.
      if (boneName === StickFigure.BONE_HEAD) {
        this.#interactables.drawRect(
          boneVector.x - 8,
          boneVector.y - 10,
          16,
          20,
          color
        );
      }

      this.#interactables.drawLine(
        boneVector.x,
        boneVector.y,
        parentVector.x,
        parentVector.y,
        color,
        thickness
      );
    }

    if (this.debug === true) {
      this.#debugRenderInfo(player, position, numTics);
    }
  }

  solveIK(bones) {
    const limbs = [
      {
        endEffector: StickFigure.BONE_RIGHT_FOOT,
        joint: StickFigure.BONE_RIGHT_KNEE,
        base: StickFigure.BONE_RIGHT_HIP,
        dir: 1
      },
      {
        endEffector: StickFigure.BONE_LEFT_FOOT,
        joint: StickFigure.BONE_LEFT_KNEE,
        base: StickFigure.BONE_LEFT_HIP,
        dir: 1
      },
      {
        endEffector: StickFigure.BONE_RIGHT_HAND,
        joint: StickFigure.BONE_RIGHT_ELBOW,
        base: StickFigure.BONE_RIGHT_SHOULDER,
        dir: -1
      },
      {
        endEffector: StickFigure.BONE_LEFT_HAND,
        joint: StickFigure.BONE_LEFT_ELBOW,
        base: StickFigure.BONE_LEFT_SHOULDER,
        dir: -1
      },
    ];

    for (const limb of limbs) {
      IKSolver.global(
        this.#boneVectors[limb.joint],
        bones[limb.joint].point.length(),
        bones[limb.endEffector].point.length(),
        this.#boneVectors[limb.endEffector],
        this.#boneVectors[limb.base],
        limb.dir,
      );
    }
  }
}
