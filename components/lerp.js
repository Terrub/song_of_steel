//@ts-check
export default class Lerp {
  /**
   * @param {Number} x
   * @returns {Function}
   */
  static linear(x) {
    return () => x;
  }

  /**
   * @param {Number} min
   * @param {Number} max
   * @param {Number} val
   * @returns {Number}
   */
  static linear2(min, max, val) {
    return min + (max - min) * val;
  }

  /**
   * @param {Number} x
   * @returns {Function}
   */
  static squared(x) {
    return () => x * x;
  }

  /**
   * @param {Number} x
   * @returns {Function}
   */
  static sqrt(x) {
    return () => Math.sqrt(x);
  }

  /**
   * @param {Number} x
   * @returns {Function}
   */
  static quadraticEaseOut(x) {
    return () => 1.0 - (1.0 - x) * (1.0 - x);
  }

  /**
   * @param {Number} x
   * @param {Number} k
   * @returns {Function}
   */
  static parabola(x, k = 2) {
    return () => Math.pow(4.0 * x * (1.0 - x), k);
  }

  /**
   * @param {Number} x
   * @returns {Function}
   */
  static triangle(x) {
    return () => 1.0 - 2.0 * Math.abs(x - 0.5);
  }

  /**
   * @param {Number} x
   * @returns {Function}
   */
  static elasticOut(x) {
    return () => {
      return (
        Math.sin(-13.0 * (x + 1.0) * (Math.PI * 0.5)) *
          Math.pow(2.0, -10.0 * x) +
        1.0
      );
    };
  }

  /**
   * @param {Number} x
   * @returns {Function}
   */
  static bounceOut(x) {
    const nl = 7.5625;
    const dl = 2.75;

    return () => {
      if (1.0 / dl > x) {
        return nl * x * x;
      } else if (2.0 / dl > x) {
        x -= 1.5 / dl;
        return nl * x * x + 0.75;
      } else if (2.5 / dl > x) {
        x -= 2.25 / dl;
        return nl * x * x + 0.9375;
      } else {
        x -= 2.625 / dl;
        return nl * x * x + 0.984375;
      }
    };
  }

  /**
   * @param {Number} x
   * @returns {Function}
   */
  static smootheStep(x) {
    return () => Lerp.calc(Lerp.squared(x)(), Lerp.sqrt(x)(), Lerp.linear(x));
  }

  /**
   * @param {Number} x
   * @returns {Function}
   */
  static smootheStep2(x) {
    return () =>
      Lerp.calc(Lerp.squared(x)(), Lerp.quadraticEaseOut(x)(), Lerp.linear(x));
  }

  // TODO: Consider creating typeDef or class type for LERP functions themselves
  /**
   * @param {Number} a
   * @param {Number} b
   * @param {Function} f
   * @returns {Number}
   */
  static calc(a, b, f) {
    return a + (b - a) * f();
  }
}
