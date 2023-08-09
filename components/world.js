import { Utils } from "../utils.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { ParamTypeError } from "../errors/paramTypeError.js";

export class World {
  #renderer;

  #floorHeight = 70;

  constructor(canvasRenderer) {
    if (!Utils.isInstanceOf(CanvasRenderer, canvasRenderer)) {
      throw new ParamTypeError(CanvasRenderer, canvasRenderer);
    }

    this.#renderer = canvasRenderer;
  }

  setSolidColor(color) {
    this.#renderer.fill(color);
  }

  drawFloor(color, height = undefined) {
    if (Utils.isDefined(height)) {
      if (!Utils.isNumber(height)) {
        throw new ParamTypeError(Number, height);
      }

      this.#floorHeight = Utils.constrain(height, 0, this.#renderer.height);
    }

    this.#renderer.drawRect(
      0,
      this.#renderer.height,
      this.#renderer.width,
      -this.#floorHeight,
      color
    );
  }

  drawPlayer(x, y) {
    this.#renderer.drawRect(
      x - 15,
      this.#renderer.height - this.#floorHeight + y,
      30,
      -100,
      "#933"
    );
  }
}