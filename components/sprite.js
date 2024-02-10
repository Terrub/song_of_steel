//@ts-check
import VectorTypeError from "../errors/typeErrors/vectorTypeError.js";
import ImageTypeError from "../errors/typeErrors/imageTypeError.js";
import NumberTypeError from "../errors/typeErrors/numberTypeError.js";
import Utils from "../utils.js";
import Vector from "./vector.js";
import CanvasRenderer from "./canvasRenderer.js";

export default class Sprite {
  /** @type {CanvasImageSource} */
  #image;
  /** @type {Vector} */
  #frameDimensions;
  /** @type {Vector} */
  #dimensions;
  /** @type {Vector} */
  #offset;
  /** @type {Vector} */
  #frameOffset;
  /** @type {Number} */
  #scale;

  /**
   * @param {CanvasImageSource} image
   * @param {Vector} frameDimensions
   * @param {Vector} dimensions
   * @param {Vector} offset
   * @param {Number} scale
   */
  constructor(image, frameDimensions, dimensions, offset, scale = 1) {
    this.#frameDimensions = frameDimensions;
    this.#dimensions = dimensions;

    if (!Utils.isInstanceOf(Image, image)) {
      throw new ImageTypeError("image", image);
    }
    this.#image = image;

    if (!Utils.isInstanceOf(Vector, offset)) {
      throw new VectorTypeError("offset", offset);
    }
    this.#offset = offset;

    if (!Utils.isNumber(scale)) {
      throw new NumberTypeError("scale", scale);
    }
    this.#scale = scale;

    this.#frameOffset = new Vector(0, 0);
  }

  /**
   * @returns {CanvasImageSource}
   */
  get image() {
    return this.#image;
  }

  /**
   * @param {CanvasImageSource} image
   */
  set image(image) {
    if (!Utils.isInstanceOf(Image, image)) {
      throw new ImageTypeError("image", image);
    }

    this.#image = image;
  }

  /**
   * @returns {Vector}
   */
  get frameDimensions() {
    return this.#frameDimensions;
  }

  /**
   * @param {Vector} vector
   */
  set frameDimensions(vector) {
    if (!Utils.isInstanceOf(Vector, vector)) {
      throw new VectorTypeError("frameDimensions", vector);
    }

    this.#frameDimensions = vector;
  }

  /**
   * @returns {Vector}
   */
  get dimensions() {
    return this.#dimensions;
  }

  /**
   * @param {Vector} vector
   */
  set dimensions(vector) {
    if (!Utils.isInstanceOf(Vector, vector)) {
      throw new VectorTypeError("dimensions", vector);
    }

    this.#dimensions = vector;
  }

  /**
   * @returns {Vector}
   */
  get frameOffset() {
    return this.#frameOffset;
  }

  /**
   * @param {Vector} vector
   */
  set frameOffset(vector) {
    if (!Utils.isInstanceOf(Vector, vector)) {
      throw new VectorTypeError("frameOffset", vector);
    }

    this.#frameOffset = vector;
  }

  /**
   * @returns {Number}
   */
  get scale() {
    return this.#scale;
  }

  /**
   * @param {Number} value
   */
  set scale(value) {
    if (!Utils.isNumber(value)) {
      throw new NumberTypeError("scale", value);
    }

    this.#scale = value;
  }

  /**
   * @param {CanvasRenderer} renderer
   * @param {Vector} position
   */
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
    const dX = position.x - scaledWidth * 0.5;
    const dY = position.y;
    const dW = scaledWidth;
    const dH = this.#dimensions.y * this.#scale;

    renderer.drawImage(this.#image, sX, sY, sW, sH, dX, dY, dW, dH);
  }
}
