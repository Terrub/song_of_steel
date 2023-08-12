import { Utils } from "../utils.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { CanvasRendererTypeError } from "../errors/typeErrors/canvasRendererTypeError.js";

export class Wall {
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

  drawPost(x, w, h, c) {
    this.#renderer.drawRect(x, this.#renderer.height, w, -h, c);
  }
}
