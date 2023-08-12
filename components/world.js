import { Utils } from "../utils.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { CanvasRendererTypeError } from "../errors/typeErrors/canvasRendererTypeError.js";

export class World {
  #renderer;

  #floorHeight = 70;

  constructor(canvasRenderer) {
    if (!Utils.isInstanceOf(CanvasRenderer, canvasRenderer)) {
      throw new CanvasRendererTypeError(canvasRenderer);
    }

    this.#renderer = canvasRenderer;
  }

  clear() {
    this.#renderer.clear();
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

  drawRect(x, y, w, h, c) {
    this.#renderer.drawRect(x, this.#renderer.height - y, w, -h, c);
  }

  drawImage(image, sX, sY, sW, sH, dX, dY, dW, dH) {
    // this.#renderer.drawRect(sX, sY, sW, sH, "rgba(255, 0, 0, 0.2");
    // this.#renderer.drawRect(dX, this.#renderer.height - this.#floorHeight - dY, dW, -dH, "rgba(0, 255, 0, 0.2");
    this.#renderer.drawImage(
      image,
      sX,
      sY,
      sW,
      sH,
      dX,
      this.#renderer.height - this.#floorHeight - dY,
      dW,
      -dH
    );
  }
}
