// @ts-check
// Thanks https://radzion.com/blog/linear-algebra/vectors

export default class Vector {
  static EPSILON = 0.00000001;

  /**
   * @param {Number} x
   * @param {Number} y
   */
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * @param {Vector} v1
   * @param {Vector} v2
   * @param {Number} w
   * @param {Number} h
   * @returns {Vector}
   */
  static getShortestTorusDeltaVector(v1, v2, w, h) {
    const cvx = v2.x - v1.x;
    const cvy = v2.y - v1.y;
    const tvx = ((v2.x + w * 0.5) % w) - ((v1.x + w * 0.5) % w);
    const tvy = ((v2.y + h * 0.5) % h) - ((v1.y + h * 0.5) % h);

    if (cvx * cvx + cvy * cvy > tvx * tvx + tvy * tvy) {
      return new Vector(tvx, tvy);
    }

    return new Vector(cvx, cvy);
  }

  /**
   * @param {Vector} v1
   * @param {Vector} v2
   * @param {Number} w
   * @param {Number} h
   * @returns {Number}
   */
  static getWrappedDistance(v1, v2, w, h) {
    const dX = Math.abs(v1.x - v2.x);
    const dY = Math.abs(v1.y - v2.y);
    const lH = Math.min(dX, w - dX);
    const lV = Math.min(dY, h - dY);

    return Math.hypot(lH, lV);
  }

  /**
   * @param {Vector} v1
   * @param {Vector} v2
   * @returns {Vector}
   */
  static add(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  /**
   * @param {Vector} v1
   * @param {Vector} v2
   * @returns {Vector}
   */
  static subtract(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  /**
   * @param {Vector} vector
   * @param {Number} value
   * @returns {Vector}
   */
  static scale(vector, value) {
    return new Vector(vector.x * value, vector.y * value);
  }

  /**
   * @param {Number} angle
   * @param {Number} magnitude
   * @returns {Vector}
   */
  static fromPolar(angle, magnitude) {
    return new Vector(Math.cos(angle), Math.sin(angle)).scale(magnitude);
  }

  /**
   * @param {Vector} v
   * @returns {Vector}
   */
  static normalise(v) {
    return new Vector(v.x, v.y).normalise();
  }

  /**
   * @param {Vector} v
   * @returns {Number}
   */
  static angle(v) {
    return Math.atan2(v.y, v.x);
  }

  /**
   * @param {Vector} v
   * @returns {Number}
   */
  static magnitude(v) {
    return Math.hypot(v.x, v.y);
  }

  /**
   * @param {Vector} v
   * @param {number} angle
   * @param {number} mag
   * @returns {Vector}
   */
  static setPolar(v, angle, mag) {
    v.x = Math.cos(angle);
    v.y = Math.sin(angle);
    v.scale(mag);

    return v;
  }

  /**
   * @param {Number} val1
   * @param {Number} val2
   * @returns {Boolean}
   */
  static isApproximate(val1, val2) {
    return Math.abs(val1 - val2) < Vector.EPSILON;
  }

  /**
   * @param {Vector} vector1
   * @param {Vector} vector2
   * @returns {Boolean}
   */
  static equal(vector1, vector2) {
    const v1Norm = Vector.normalise(vector1);
    const v2Norm = Vector.normalise(vector2);
    return Vector.isApproximate(v1Norm.dotProduct(v2Norm), 1);
  }

  /**
   * @param {Vector} v
   */
  copyFrom(v) {
    this.x = v.x;
    this.y = v.y;
  }

  /**
   * @param {Vector} v
   * @returns {Vector}
   */
  add(v) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  /**
   * @param {Vector} v
   * @returns {Vector}
   */
  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  /**
   * @param {Vector} v
   * @returns {Number}
   */
  dotProduct(v) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * @param {Number} value
   * @returns {Vector}
   */
  scale(value) {
    this.x *= value;
    this.y *= value;

    return this;
  }

  /**
   * @returns {Number}
   */
  magnitude() {
    return Vector.magnitude(this);
  }

  /**
   * @returns {Number}
   */
  angle() {
    return Vector.angle(this);
  }

  /**
   * @returns {Vector}
   */
  normalise() {
    // Cannot devide by 0
    if (this.x === 0 && this.y === 0) {
      return this;
    }

    return this.scale(1 / this.magnitude());
  }

  /**
   * @param {Number} value
   * @returns {Vector}
   */
  limit(value) {
    if (value * value < this.x * this.x + this.y * this.y) {
      this.normalise().scale(value);
    }

    return this;
  }
}
