// Thanks https://radzion.com/blog/linear-algebra/vectors

export class Vector {
  static EPSILON = 0.00000001;

  constructor(/** @type {Number} */ x, /** @type {Number} */ y) {
    this.x = x;
    this.y = y;
  }

  static getShortestTorusDeltaVector(
    /** @type {Vector} */ v1,
    /** @type {Vector} */ v2,
    /** @type {Number} */ w,
    /** @type {Number} */ h
  ) {
    const cvx = v2.x - v1.x;
    const cvy = v2.y - v1.y;
    const tvx = ((v2.x + w * 0.5) % w) - ((v1.x + w * 0.5) % w);
    const tvy = ((v2.y + h * 0.5) % h) - ((v1.y + h * 0.5) % h);

    if (cvx * cvx + cvy * cvy > tvx * tvx + tvy * tvy) {
      return new Vector(tvx, tvy);
    }

    return new Vector(cvx, cvy);
  }

  static getWrappedDistance(
    /** @type {Vector} */ v1,
    /** @type {Vector} */ v2,
    /** @type {Number} */ w,
    /** @type {Number} */ h
  ) {
    const dX = Math.abs(v1.x - v2.x);
    const dY = Math.abs(v1.y - v2.y);
    const lH = Math.min(dX, w - dX);
    const lV = Math.min(dY, h - dY);

    return Math.hypot(lH, lV);
  }

  static add(/** @type {Vector} */ v1, /** @type {Vector} */ v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  static subtract(/** @type {Vector} */ v1, /** @type {Vector} */ v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  static scale(/** @type {Vector} */ vector, /** @type {Number} */ value) {
    return new Vector(vector.x * value, vector.y * value);
  }

  static fromPolar(
    /** @type {Number} */ angle,
    /** @type {Number} */ magnitude
  ) {
    return new Vector(Math.cos(angle), Math.sin(angle)).scale(magnitude);
  }

  static normalise(/** @type {Vector} */ v) {
    return new Vector(v.x, v.y).normalise();
  }

  static angle(/** @type {Vector} */ v) {
    return Math.atan2(v.y, v.x);
  }

  static length(/** @type {Vector} */ v) {
    return Math.hypot(v.x, v.y);
  }

  static setPolar(
    /** @type {Vector} */ v,
    /** @type {Number} */ angle,
    /** @type {Number} */ mag
  ) {
    v.x = Math.cos(angle);
    v.y = Math.sin(angle);
    v.scale(mag);
  }

  static isApproximate(/** @type {Number} */ val1, /** @type {Number} */ val2) {
    return Math.abs(val1 - val2) < Vector.EPSILON;
  }

  static equal(/** @type {Vector} */ vector1, /** @type {Vector} */ vector2) {
    const v1Norm = Vector.normalise(vector1);
    const v2Norm = Vector.normalise(vector2);
    return Vector.isApproximate(v1Norm.dotProduct(v2Norm), 1);
  }

  copyFrom(/** @type {Vector} */ v) {
    this.x = v.x;
    this.y = v.y;
  }

  add(/** @type {Vector} */ v) {
    this.x += v.x;
    this.y += v.y;

    return this;
  }

  subtract(/** @type {Vector} */ v) {
    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  dotProduct(/** @type {Vector} */ v) {
    return this.x * v.x + this.y * v.y;
  }

  scale(/** @type {Number} */ value) {
    this.x *= value;
    this.y *= value;

    return this;
  }

  length() {
    return Vector.length(this);
  }

  angle() {
    return Vector.angle(this);
  }

  normalise() {
    // Cannot devide by 0
    if (this.x === 0 && this.y === 0) {
      return this;
    }

    return this.scale(1 / this.length());
  }

  limit(/** @type {Number} */ value) {
    if (value * value < this.x * this.x + this.y * this.y) {
      this.normalise().scale(value);
    }

    return this;
  }
}
