import { Utils } from "../utils.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { CanvasRendererTypeError } from "../errors/typeErrors/canvasRendererTypeError.js";
import { NumberTypeError } from "../errors/typeErrors/numberTypeError.js";

export class World {
  #backdrop;
  #background;
  #wall;
  #interactables;
  #debugLayer;
  #foreground;
  #floorHeight = 0;

  debug = true;
  // debug = false;

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
    // TODO: Add a separate debug render layer
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

  setFloor(height) {
    if (!Utils.isNumber(height)) {
      throw new NumberTypeError("height", height);
    }

    this.#floorHeight = Utils.constrain(height, 0, this.height);
  }

  draw(numTics) {
    this.#interactables.clear();

    this.#backdrop.fill("#888");

    this.#background.drawRect(0, 0, this.width, 150, "#555");

    let wallWidth = 8;
    for (let i = 100; i < this.width; i += 350) {
      wallWidth = wallWidth === 8 ? 15 : 8;
      this.#wall.drawRect(i, 0, wallWidth, 300, "#222");
    }

    this.#interactables.drawRect(0, 0, this.width, this.#floorHeight, "#111");

    let foregroundWidth = 20;
    for (let i = -20; i < this.width; i += 400) {
      foregroundWidth = foregroundWidth === 45 ? 20 : 45;
      this.#foreground.drawRect(i, 0, foregroundWidth, 500, "#000");
    }
  }

  drawPlayer(player, playerPosition, numTics) {
    this.#interactables.save();
    this.#interactables.translate(0, this.#floorHeight);
    player.draw(this.#interactables, playerPosition, numTics);
    this.#interactables.restore();
  }
}
