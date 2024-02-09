export class Lerp {
  static linear(x) {
    return () => x;
  }

  static linear2(min, max, val) {
    return min + (max - min) * val;
  }

  static squared(x) {
    return () => x * x;
  }

  static sqrt(x) {
    return () => Math.sqrt(x);
  }

  static quadraticEaseOut(x) {
    return () => 1.0 - (1.0 - x) * (1.0 - x);
  }

  static parabola(x, k = 2) {
    return () => Math.pow(4.0 * x * (1.0 - x), k);
  }

  static triangle(x) {
    return () => 1.0 - 2.0 * Math.abs(x - 0.5);
  }

  static elasticOut(x) {
    return () => {
      return (
        Math.sin(-13.0 * (x + 1.0) * (Math.PI * 0.5)) *
          Math.pow(2.0, -10.0 * x) +
        1.0
      );
    };
  }

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

  static smootheStep(x) {
    return () => Lerp.calc(Lerp.squared(x)(), Lerp.sqrt(x)(), Lerp.linear(x));
  }

  static smootheStep2(x) {
    return () =>
      Lerp.calc(Lerp.squared(x)(), Lerp.quadraticEaseOut(x)(), Lerp.linear(x));
  }

  static calc(a, b, f) {
    return a + (b - a) * f();
  }
}
