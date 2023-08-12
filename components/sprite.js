import { VectorTypeError } from "../errors/typeErrors/vectorTypeError.js";
import { ImageTypeError } from "../errors/typeErrors/imageTypeError.js";
import { NumberTypeError } from "../errors/typeErrors/numberTypeError.js";
import { Utils } from "../utils.js";
import { Vector } from "./vector.js";

export class Sprite {
  #image;
  #frameDimensions;
  #dimensions;
  #offset;
  #frameOffset;
  #scale;

  constructor(image, frameDimensions, dimensions, offset, scale = 1) {
    this.image = image;
    this.frameDimensions = frameDimensions;
    this.dimensions = dimensions;

    if (!Utils.isInstanceOf(Vector, offset)) {
      throw new VectorTypeError('offset', offset);
    }
    this.#offset = offset;

    if (!Utils.isNumber(scale)) {
      throw new NumberTypeError('scale', scale);
    }
    this.scale = scale;

    this.#frameOffset = new Vector(0, 0);
  }

  get image() {
    return this.#image;
  }

  set image(image) {
    if (!Utils.isInstanceOf(Image, image)) {
      throw new ImageTypeError("image", image);
    }

    this.#image = image;
  }

  get frameDimensions() {
    return this.#frameDimensions;
  }

  set frameDimensions(vector) {
    if (!Utils.isInstanceOf(Vector, vector)) {
      throw new VectorTypeError("frameDimensions", vector);
    }

    this.#frameDimensions = vector;
  }

  get dimensions() {
    return this.#dimensions;
  }

  set dimensions(vector) {
    if (!Utils.isInstanceOf(Vector, vector)) {
      throw new VectorTypeError("dimensions", vector)
    }

    this.#dimensions = vector;
  }

  get frameOffset() {
    return this.#frameOffset;
  }

  set frameOffset(vector) {
    if (!Utils.isInstanceOf(Vector, vector)) {
      throw new VectorTypeError("frameOffset", vector);
    }

    this.#frameOffset = vector;
  }

  get scale() {
    return this.#scale;
  }

  set scale(value) {
    if (!Utils.isNumber(value)) {
      throw new NumberTypeError("scale", value);
    }

    this.#scale = value;
  }

  draw(renderer, position) {
    if (!Utils.isInstanceOf(Vector, position)) {
      throw new VectorTypeError("position", position);
    }

    // [S]election rectangle
    const sX = this.#offset.x + this.#frameOffset.x;
    const sY = this.#offset.y + this.#frameOffset.y;
    const sW = this.#dimensions.x;
    const sH = this.#dimensions.y;

    const scaledWidth = this.#dimensions.x * this.#scale;
    // [D]estination rectangle
    const dX = position.x - (scaledWidth * 0.5);
    const dY = position.y;
    const dW = scaledWidth;
    const dH = this.#dimensions.y * this.#scale;

    renderer.drawImage(this.image, sX, sY, sW, sH, dX, dY, dW, dH);
  }
}
