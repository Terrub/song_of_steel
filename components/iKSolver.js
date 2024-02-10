// @ts-check
import Vector from "./vector.js";

// for (let i = 0; i <= 10; i += 1) {
//   const x = (i - 5) / 4;
//   const v = Math.acos(x);
//   console.log(x, v, v / Math.PI * 180);
// }

export default class IKSolver {
  /** @type {Vector} */
  static #localPosEE = new Vector(0, 0);

  /**
   * @param {Vector} v
   * @param {number} l1
   * @param {number} l2
   * @param {Vector} posEE
   * @param {number} [dirBend=1]
   * @returns {Vector}
   */
  static local(v, l1, l2, posEE, dirBend = 1) {
    /**
     *      / l1^2 + tx^2 + ty^2 - l2^2 \
     * acos| --------------------------- |  =>  ±[0, π]
     *      \  2 * l1 * √(tx^2 + ty^2)  /
     */
    const numerator = l1 * l1 + posEE.x * posEE.x + posEE.y * posEE.y - l2 * l2;
    const denominator = 2 * l1 * posEE.magnitude();

    let angleBendLocal = dirBend * Math.acos(numerator / denominator);
    if (isNaN(angleBendLocal)) {
      angleBendLocal = 0;
    }

    return Vector.setPolar(v, angleBendLocal + posEE.angle(), l1);
  }

  /**
   * @param {Vector} v
   * @param {number} l1
   * @param {number} l2
   * @param {Vector} posEE
   * @param {Vector} origin
   * @param {number} [dirBend=1]
   * @returns {Vector}
   */
  static global(v, l1, l2, posEE, origin, dirBend = 1) {
    // we need to translate the whole thing to (0, 0), so subtract 'origin' from everything
    // but we only receive the end effector 'posEE'
    // so we just need to subtract origin from the posEE vector
    IKSolver.#localPosEE.copyFrom(posEE);
    IKSolver.#localPosEE.subtract(origin);

    // Now iksolve it locally:
    IKSolver.local(v, l1, l2, IKSolver.#localPosEE, dirBend);

    // But now we have v in local space, so add origin to that to place back in global space
    return v.add(origin);
  }
}
