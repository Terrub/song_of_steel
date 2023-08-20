// @ts-check
import { Utils } from "../utils.js";
import { Vector } from "./vector.js";

// TODO Add tests for Bone class
export class Bone {
  /** @type {Vector} */
  #point;
  /** @type {?Bone} */
  parent;
  /** @type {String} */
  name;
  /** @type {number} */
  x;
  /** @type {number} */
  y;
  /** @type {number} */
  length;
  /** @type {number} */
  angle;
  /** @type {Bone[]} */
  children;

  /**
   * @param {String} name
   * @param {?Bone} parent
   * @param {Vector} point
   */
  constructor(name, parent, point) {
    this.name = name;
    this.parent = parent;
    this.#point = point;
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
    const bone = new Bone(name, parent, Vector.fromPolar(angle, length));
    bone.x = bone.#point.x;
    bone.y = bone.#point.y;
    bone.length = length;
    bone.angle = angle;

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
    const bone = new Bone(name, parent, new Vector(x, y));
    bone.x = x;
    bone.y = y;
    bone.length = bone.#point.magnitude();
    bone.angle = bone.#point.angle();

    return bone;
  }
}
