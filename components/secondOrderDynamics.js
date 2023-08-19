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
  #xp = 0; // Previous x component
  #y = 0; // the to be calculated y component
  #yd = 0; // Derivative of y (velocity)
  #k1; // Configurable constant to influence Zeta
  #k2; // Configurable constant to influence Frequency
  #k3; // Configurable constant to influence Response

  constructor(frequency, zeta, response) {
    // Compute the constants for our later update.
    this.#k1 = zeta / (Math.PI * frequency);
    this.#k2 = 1 / (2 * Math.PI * frequency * (2 * Math.PI * frequency));
    this.#k3 = (response * zeta) / (2 * Math.PI * frequency);
  }

  update(timeElapsed, x, xd = null) {
    // No derivative of x (velocity), estimate it based on previous x
    if (xd === null) {
      xd = (x - this.#xp) / timeElapsed;
      this.#xp = x;
    }

    // Clamping k2 to prevent shit from flying off to friggin narnia
    const k2Stable = Math.max(
      this.#k2,
      (timeElapsed * timeElapsed) / 2 + (timeElapsed * this.#k1) / 2,
      timeElapsed * this.#k1
    );
    // Integrate position by velocity
    this.#y = this.#y + timeElapsed * this.#yd;
    // integrate velocity by acceleration
    this.#yd =
      this.#yd +
      (timeElapsed * (x + this.#k3 * xd - this.#y - this.#k1 * this.#yd)) /
        k2Stable;

    return this.#y;
  }
}
