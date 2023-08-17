import { Vector } from "./vector.js";

// for (let i = 0; i <= 10; i += 1) {
//   const x = (i - 5) / 4;
//   const v = Math.acos(x);
//   console.log(x, v, v / Math.PI * 180);
// }

export function IKSolver(v, l1, l2, posEE, dirBend = 1) {
  /**
   *      / l1^2 + tx^2 + ty^2 - l2^2 \
   * acos| --------------------------- |  =>  ±[0, π]
   *      \  2 * l1 * √(tx^2 + ty^2)  /
   */
  const numerator = l1 * l1 + posEE.x * posEE.x + posEE.y * posEE.y - l2 * l2;
  const denominator = 2 * l1 * posEE.length();

  let angleBendLocal = dirBend * Math.acos(numerator / denominator);
  if (isNaN(angleBendLocal)) {
    angleBendLocal = 0;
  }

  return Vector.setPolar(v, angleBendLocal + posEE.angle(), l1);
}
