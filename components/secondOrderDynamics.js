//@ts-check
/**
 * This mathmatical diarrhea is credit due to t3ssel8r:
 * https://youtu.be/KPoeNZZ6H4s
 *
 * The original uses X and Y to house two separate vectors. I believe this current implementation
 * would simply work as a f(x) = y. If it does, I can probably consider adding more logic to my
 * current Vector class and allow for Vectors to be passed as well which would mean this would
 * work for 2d animations, which is what I intend to use this for!
 *
 * We'll see. This Maths is ... _slightly_ beyond my grasp.
 */

// TODO Add tests for SecondOrderDynamics class, if we can... X_X
export class SecondOrderDynamics {
  /** @type {number} */
  #xp = 0; // Previous x component
  /** @type {number} */
  #y = 0; // the to be calculated y component
  /** @type {number} */
  #yd = 0; // Derivative of y (velocity)
  /** @type {number} */
  #k1; // Configurable constant to influence Zeta
  /** @type {number} */
  #k2; // Configurable constant to influence Frequency
  /** @type {number} */
  #k3; // Configurable constant to influence Response

  /**
   * @param {number} frequency
   * @param {number} zeta
   * @param {number} response
   */
  constructor(frequency, zeta, response) {
    // Compute the constants for our later update.
    this.#k1 = zeta / (Math.PI * frequency);
    this.#k2 = 1 / (2 * Math.PI * frequency * (2 * Math.PI * frequency));
    this.#k3 = (response * zeta) / (2 * Math.PI * frequency);
  }

  /**
   *
   * @param {number} timeElapsed
   * @param {number} x
   * @param {?number} xd
   * @returns {number}
   */
  update(timeElapsed, x, xd = null) {
    // No derivative of x (velocity), estimate it based on previous x
    if (xd === null) {
      xd = (x - this.#xp) / timeElapsed;
      this.#xp = x;
    }

    // Clamping k2 to prevent shit from flying off to friggin narnia
    const k2StableJitter = Math.max(
      this.#k2,
      timeElapsed * timeElapsed * 0.5 + timeElapsed * this.#k1 * 0.5,
      timeElapsed * this.#k1
    );

    if (isNaN(this.#yd)) {
      debugger;
    }

    // Integrate position by velocity
    this.#y += timeElapsed * this.#yd;

    if (isNaN(this.#y)) {
      debugger;
    }

    // integrate velocity by acceleration
    this.#yd +=
      (timeElapsed * (x + this.#k3 * xd - this.#y - this.#k1 * this.#yd)) /
      k2StableJitter;

    if (isNaN(this.#yd)) {
      debugger;
    }

    return this.#y;
  }
}
