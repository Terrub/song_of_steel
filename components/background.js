import { Utils } from "../utils.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { CanvasRendererTypeError } from "../errors/typeErrors/canvasRendererTypeError.js";

export class Background {
  #renderer;

  constructor(canvasRenderer) {
    if (!Utils.isInstanceOf(CanvasRenderer, canvasRenderer)) {
      throw new CanvasRendererTypeError(canvasRenderer);
    }

    this.#renderer = canvasRenderer;
  }

  setSolidColor(color) {
    this.#renderer.fill(color);
  }

  drawFloor(height, color) {
    this.#renderer.drawRect(
      0,
      this.#renderer.height,
      this.#renderer.width,
      -height,
      color
    );
  }
}
