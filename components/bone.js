import { Vector } from "./vector.js";

// TODO Add tests for Bone class
export class Bone {
  /** @type {Vector} */
  point;
  /** @type {String} */
  connection;

  constructor(/** @type {String} */ connection) {
    this.connection = connection;
  }

  static fromPolar(
    /** @type {Number} */ angle,
    /** @type {Number} */ length,
    /** @type {String} */ connection
  ) {
    const bone = new Bone(connection);
    bone.point = Vector.fromPolar(angle, length);

    return bone;
  }

  static fromPos(
    /** @type {Number} */ x,
    /** @type {Number} */ y,
    /** @type {String} */ connection
  ) {
    const bone = new Bone(connection);
    bone.point = new Vector(x, y);

    return bone;
  }
}
