import { Utils } from "../utils.js";

export class Vector {
  #x;
  #y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get x() {
    return this.#x;
  }

  set x(value) {
    if (!Utils.isNumber(value)) {
      throw new NumberTypeError('x', value);
    }

    this.#x = value;
  }

  get y() {
    return this.#y;
  }

  set y(value) {
    if (!Utils.isNumber(value)) {
      throw new NumberTypeError('y', value);
    }

    this.#y = value;
  }
}