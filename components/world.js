// @ts-check
import { CanvasRendererTypeError } from "../errors/typeErrors/canvasRendererTypeError.js";
import { NumberTypeError } from "../errors/typeErrors/numberTypeError.js";
import { Utils } from "../utils.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { Player } from "./player.js";
import { Vector } from "./vector.js";

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
  /** @type {?Player} */
  player;

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
   * @param {Player} player
   * @returns {void}
   */
  loadPlayer(player) {
    this.player = player;
    this.player.load();
  }

  /**
   * @param {number} numTics
   * @param {?Vector} playerPosition
   * @returns {void}
   */
  draw(numTics, playerPosition) {
    this.#interactables.clear();
    this.#interactables.drawRect(0, 0, this.width, this.#floorHeight, "#111");
    if (this.player && playerPosition) {
      this.player.draw(
        this.#interactables,
        playerPosition,
        numTics,
        this.#floorHeight
      );
    }
  }
}
