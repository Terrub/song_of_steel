// @ts-check
import { Utils } from "../utils.js";
import { Vector } from "./vector.js";

// TODO Add tests for Bone class
export class Bone {
  /** @type {Vector} */
  point;
  /** @type {?Bone} */
  parent;
  /** @type {String} */
  name;
  /** @type {Bone[]} */
  children;

  /**
   * @param {String} name
   * @param {?Bone} parent
   */
  constructor(name, parent) {
    this.name = name;
    this.parent = parent;
    this.children = [];

    if (!Utils.isNull(parent)) {
      // @ts-ignore We check for parent existing dangit...
      parent.children.push(this);
    }
  }

  /**
   * @param {Number} angle
   * @param {Number} length
   * @param {String} name
   * @param {?Bone} parent
   * @returns {Bone}
   */
  static fromPolar(angle, length, name, parent) {
    const bone = new Bone(name, parent);
    bone.point = Vector.fromPolar(angle, length);

    return bone;
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {String} name
   * @param {?Bone} parent
   * @returns {Bone}
   */
  static fromPos(x, y, name, parent) {
    const bone = new Bone(name, parent);
    bone.point = new Vector(x, y);

    return bone;
  }
}
