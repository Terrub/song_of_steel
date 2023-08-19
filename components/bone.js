import { Utils } from "../utils.js";
import { Vector } from "./vector.js";

// TODO Add tests for Bone class
export class Bone {
  /** @type {Vector} */
  point;
  /** @type {Bone} */
  parent;
  /** @type {String} */
  name;
  /** @type {Array} */
  children;

  constructor(/** @type {String} */ name, /** @type {Bone} */ parent) {
    this.parent = parent;
    this.name = name;
    this.children = [];

    if (!Utils.isNull(parent)) {
      parent.children.push(this);
    }
  }

  static fromPolar(
    /** @type {Number} */ angle,
    /** @type {Number} */ length,
    /** @type {String} */ name,
    /** @type {Bone} */ parent
  ) {
    const bone = new Bone(name, parent);
    bone.point = Vector.fromPolar(angle, length);

    return bone;
  }

  static fromPos(
    /** @type {Number} */ x,
    /** @type {Number} */ y,
    /** @type {String} */ name,
    /** @type {Bone} */ parent
  ) {
    const bone = new Bone(name, parent);
    bone.point = new Vector(x, y);

    return bone;
  }
}
