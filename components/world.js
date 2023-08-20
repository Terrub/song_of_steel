// @ts-check
import { Utils } from "../utils.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { CanvasRendererTypeError } from "../errors/typeErrors/canvasRendererTypeError.js";
import { NumberTypeError } from "../errors/typeErrors/numberTypeError.js";
import { StickFigure } from "./stickFigure.js";
import { IKSolver } from "./ikSolver.js";
import { Vector } from "./vector.js";
import { Bone } from "./bone.js";

export class World {
  /** @type {?CanvasRenderer} */
  #backdrop;
  /** @type {?CanvasRenderer} */
  #background;
  /** @type {?CanvasRenderer} */
  #wall;
  /** @type {CanvasRenderer} */
  #interactables;
  /** @type {CanvasRenderer} */
  #debugLayer;
  /** @type {?CanvasRenderer} */
  #foreground;
  /** @type {Number} */
  #floorHeight = 0;
  /** @type {Object.<string, Vector>} */
  #boneVectors = {};

  /** @type {Boolean} */
  debug = false;
  /** @type {Number} */
  width;
  /** @type {Number} */
  height;

  /**
   * @param {Number} width
   * @param {Number} height
   * @param {CanvasRenderer} interactables
   * @param {CanvasRenderer | null} [backdrop=null]
   * @param {CanvasRenderer | null} [background=null]
   * @param {CanvasRenderer | null} [foreground=null]
   * @param {CanvasRenderer | null} [wall=null]
   */
  constructor(
    width,
    height,
    interactables,
    backdrop = null,
    background = null,
    wall = null,
    foreground = null
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

  /**
   * @param {Number} height
   * @returns {void}
   */
  setFloor(height) {
    if (!Utils.isNumber(height)) {
      throw new NumberTypeError("height", height);
    }

    this.#floorHeight = Utils.constrain(height, 0, this.height);
  }

  /**
   * @returns {void}
   */
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

  /**
   * @param {StickFigure} player
   * @returns {void}
   */
  loadPlayer(player) {
    for (const boneName in player.bones) {
      this.#boneVectors[boneName] = new Vector(0, 0);
    }
  }

  /**
   * @param {Object.<string, Bone>} bones
   * @returns {void}
   */
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

  /**
   * @param {StickFigure} player
   * @param {Vector} position
   * @returns {void}
   */
  #debugRenderInfo(player, position) {
    const bones = player.bones;

    this.#debugDrawBoneColours(bones);
    this.#debugDrawPlayerPosition(position);

    const pelvisPos = this.#boneVectors[StickFigure.BONE_PELVIS];
    this.#debugDrawPoint(pelvisPos);

    const l1 = bones[StickFigure.BONE_RIGHT_KNEE].point.magnitude();
    const l2 = bones[StickFigure.BONE_RIGHT_FOOT].point.magnitude();
    const b = pelvisPos.y - this.#floorHeight - position.y;
    const c = l1 + l2;
    const s = Math.sqrt(c * c - b * b);

    this.#debugDrawEstimate(position.x + s, position.y + this.#floorHeight);
    this.#debugDrawEstimate(position.x - s, position.y + this.#floorHeight);

    this.#drawIKEstimate(
      l1,
      l2,
      this.#boneVectors[StickFigure.BONE_RIGHT_HIP],
      this.#boneVectors[StickFigure.BONE_RIGHT_FOOT]
    );

    this.#drawIKEstimate(
      l1,
      l2,
      this.#boneVectors[StickFigure.BONE_LEFT_HIP],
      this.#boneVectors[StickFigure.BONE_LEFT_FOOT]
    );
  }

  /**
   * @param {number} l1
   * @param {number} l2
   * @param {Vector} base
   * @param {Vector} endEffector
   * @returns {void}
   */
  #drawIKEstimate(l1, l2, base, endEffector) {
    const radius = 3;
    const color = "limegreen";

    const vector = new Vector(0, 0);
    IKSolver.global(vector, l1, l2, endEffector, base);
    this.#debugLayer.strokeCircle(vector.x, vector.y, radius, color);
  }

  /**
   * @param {number} x
   * @param {number} y
   * @returns {void}
   */
  #debugDrawEstimate(x, y) {
    const radius = 3;
    const color = "limegreen";

    this.#debugLayer.strokeCircle(x, y, radius, color);
  }

  /**
   * @param {Vector} position
   * @returns {void}
   */
  #debugDrawPlayerPosition(position) {
    const radius = 3;
    const color = "orange";

    this.#debugLayer.strokeCircle(
      position.x,
      this.#floorHeight + position.y,
      radius,
      color
    );
  }

  /**
   * @param {Vector} point
   * @returns {void}
   */
  #debugDrawPoint(point) {
    const radius = 5;
    const color = "yellow";

    this.#debugLayer.strokeCircle(point.x, point.y, radius, color);
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

  /**
   * @param {Object.<string, Bone>} bones
   * @param {Object.<string, Vector>} boneVectors
   * @returns {void}
   */
  #resetBoneVectors(bones, boneVectors) {
    for (const boneName in bones) {
      boneVectors[boneName].x = bones[boneName].point.x;
      boneVectors[boneName].y = bones[boneName].point.y;
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
        endEffector: StickFigure.BONE_RIGHT_FOOT,
        joint: StickFigure.BONE_RIGHT_KNEE,
        base: StickFigure.BONE_RIGHT_HIP,
        dir: 1,
      },
      {
        endEffector: StickFigure.BONE_LEFT_FOOT,
        joint: StickFigure.BONE_LEFT_KNEE,
        base: StickFigure.BONE_LEFT_HIP,
        dir: 1,
      },
      {
        endEffector: StickFigure.BONE_RIGHT_HAND,
        joint: StickFigure.BONE_RIGHT_ELBOW,
        base: StickFigure.BONE_RIGHT_SHOULDER,
        dir: -1,
      },
      {
        endEffector: StickFigure.BONE_LEFT_HAND,
        joint: StickFigure.BONE_LEFT_ELBOW,
        base: StickFigure.BONE_LEFT_SHOULDER,
        dir: -1,
      },
      {
        endEffector: StickFigure.BONE_RIGHT_HAND,
        joint: StickFigure.BONE_RIGHT_ELBOW,
        base: StickFigure.BONE_RIGHT_SHOULDER,
        dir: -1,
      },
    ];

    for (const limb of limbs) {
      IKSolver.global(
        boneVectors[limb.joint],
        bones[limb.joint].point.magnitude(),
        bones[limb.endEffector].point.magnitude(),
        boneVectors[limb.endEffector],
        boneVectors[limb.base],
        limb.dir
      );
    }
  }

  /**
   *
   * @param {Object.<string, Bone>} bones
   * @param {Object.<string, Vector>} boneVectors
   * @param {string} color
   * @param {number} thickness
   * @returns {void}
   */
  #drawBoneVectors(bones, boneVectors, color, thickness) {
    for (const boneName in bones) {
      /** @type {Bone} */
      const bone = bones[boneName];

      if (Utils.isNull(bone.parent)) {
        continue;
      }

      /** @type {Vector} */
      const boneVector = boneVectors[boneName];
      /** @type {Vector} */
      // @ts-ignore We early exit if bone.parent is null
      const parentVector = boneVectors[bone.parent.name];

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
  }

  /**
   * @param {number} numTics
   * @returns {void}
   */
  draw(numTics) {
    this.#interactables.clear();
    this.#interactables.drawRect(0, 0, this.width, this.#floorHeight, "#111");
  }

  // TODO Refactor StickFigure logic back to its own class.
  //      Player is now hard-coupled with stickfigure.
  /**
   * @param {StickFigure} player
   * @param {Vector} playerPosition
   * @param {number} numTics
   * @returns {void}
   */
  drawPlayer(player, playerPosition, numTics) {
    /**
     * Isn't this entire thing the classical back n forth draw cycle algorithm???
     * 1) Something changes our current state.  -> Animation frame
     * 2) Resolve properties (top-down)         -> Forward Kinematics
     * 3) Resolve measurements (bottom-up)      -> Inverse Kinematics
     * 4) Draw actuals (top-down)               -> Draw cycle
     */
    const bones = player.bones;
    const color = "red";
    const thickness = 6;

    // clear last buffer.
    this.#resetBoneVectors(bones, this.#boneVectors);

    // 1) Add absolute property changes to bones based on animation
    //     This introduces the changes and causes properties to be changed.
    player.animateBoneVectors(numTics, this.#boneVectors);

    // 2) Forward Kinematics resolve property changes and propegate them down the node tree
    this.#boneVectors[StickFigure.BONE_PELVIS].add(playerPosition);
    this.#boneVectors[StickFigure.BONE_PELVIS].y += this.#floorHeight;
    this.#forwardKinematics(bones[StickFigure.BONE_PELVIS]);

    // NOTE That means this bit could be moved to the property update
    // Keep yer feet on the grauwnd
    const rightFoot = this.#boneVectors[StickFigure.BONE_RIGHT_FOOT];
    rightFoot.y = Math.max(this.#floorHeight, rightFoot.y);
    const leftFoot = this.#boneVectors[StickFigure.BONE_LEFT_FOOT];
    leftFoot.y = Math.max(this.#floorHeight, leftFoot.y);

    // 3) Inverse Kinematics resolve any measurements that have to happen in between
    this.#inverseKinematics(bones, this.#boneVectors);

    // 4) Now we just draw the whole node tree
    this.#drawBoneVectors(bones, this.#boneVectors, color, thickness);

    if (this.debug === true) {
      this.#debugRenderInfo(player, playerPosition);
    }
  }
}
