//@ts-check

import TestBot from "../testBot/testBot.js";
import Lerp from "../components/lerp.js";
import Utils from "../utils.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const lerpTests = testRunner.createSuite("Tests Lerp");

lerpTests.addTest("has method calc", () => {
  testRunner.assertStrictlyEquals(true, Utils.isFunction(Lerp.calc));
});

lerpTests.addTest("has method linear2", () => {
  testRunner.assertStrictlyEquals(true, Utils.isFunction(Lerp.linear2));
});

lerpTests.addTest("returns 0 when calling `Lerp.linear2(0, 100, 0))`", () => {
  const expected = 0;

  const actual = Lerp.linear2(0, 100, 0);

  testRunner.assertStrictlyEquals(expected, actual);
});

lerpTests.addTest("returns 50 when calling `Lerp.linear(0, 100, 0.5))`", () => {
  const expected = 50;

  const actual = Lerp.linear2(0, 100, 0.5);

  testRunner.assertStrictlyEquals(expected, actual);
});

lerpTests.addTest(
  "returns 75 when calling `Lerp.linear(0, 100, 0.75))`",
  () => {
    const expected = 75;

    const actual = Lerp.linear2(0, 100, 0.75);

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

// Properties I want to be able to change
// * positive
// * integer
// * asc order
// [√] I want to be able to use floats not just integers
// [√] I want to be able to use negative numbers
// [√] I want to be able to swap the order
lerpTests.addTest("can work with floating point numbers", () => {
  const expected = 40.25;

  const actual = Lerp.linear2(10.0, 70.5, 0.5);

  testRunner.assertStrictlyEquals(expected, actual);
});

lerpTests.addTest("can work with negative numbers", () => {
  const expected = 10;

  const actual = Lerp.linear2(-20, 20, 0.75);

  testRunner.assertStrictlyEquals(expected, actual);
});

lerpTests.addTest("can work with numbers in descending order", () => {
  const expected = -10;

  const actual = Lerp.linear2(20, -20, 0.75);

  testRunner.assertStrictlyEquals(expected, actual);
});

lerpTests.addTest("can work with numbers less than 1", () => {
  const expected = -0.12;

  const actual = Lerp.linear2(0.2, -0.2, 0.8);

  testRunner.assertInRange(-0.125, actual, -0.115);
});

lerpTests.addTest("has method linear", () => {
  testRunner.assertStrictlyEquals(true, Utils.isFunction(Lerp.linear));
});

lerpTests.addTest(
  "returns 0 when calling `Lerp.calc(0, 100, Lerp.linear(0.0))`",
  () => {
    const expected = 0;
    const actual = Lerp.calc(0, 100, Lerp.linear(0.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 100 when calling `Lerp.calc(0, 100, Lerp.linear(1.0))`",
  () => {
    const expected = 100;
    const actual = Lerp.calc(0, 100, Lerp.linear(1.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest("has method squared", () => {
  testRunner.assertStrictlyEquals(true, Utils.isFunction(Lerp.squared));
});

lerpTests.addTest(
  "returns 0 when calling `Lerp.calc(0, 100, Lerp.squared(0.0))`",
  () => {
    const expected = 0;
    const actual = Lerp.calc(0, 100, Lerp.squared(0.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 100 when calling `Lerp.calc(0, 100, Lerp.squared(1.0))`",
  () => {
    const expected = 100;
    const actual = Lerp.calc(0, 100, Lerp.squared(1.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest("has method sqrt", () => {
  testRunner.assertStrictlyEquals(true, Utils.isFunction(Lerp.sqrt));
});

lerpTests.addTest(
  "returns 0 when calling `Lerp.calc(0, 100, Lerp.sqrt(0.0))`",
  () => {
    const expected = 0;
    const actual = Lerp.calc(0, 100, Lerp.sqrt(0.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 100 when calling `Lerp.calc(0, 100, Lerp.sqrt(1.0))`",
  () => {
    const expected = 100;
    const actual = Lerp.calc(0, 100, Lerp.sqrt(1.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest("has method quadraticEaseOut", () => {
  testRunner.assertStrictlyEquals(
    true,
    Utils.isFunction(Lerp.quadraticEaseOut)
  );
});

lerpTests.addTest(
  "returns 0 when calling `Lerp.calc(0, 100, Lerp.quadraticEaseOut(0.0))`",
  () => {
    const expected = 0;
    const actual = Lerp.calc(0, 100, Lerp.quadraticEaseOut(0.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 100 when calling `Lerp.calc(0, 100, Lerp.quadraticEaseOut(1.0))`",
  () => {
    const expected = 100;
    const actual = Lerp.calc(0, 100, Lerp.quadraticEaseOut(1.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest("has method parabola", () => {
  testRunner.assertStrictlyEquals(true, Utils.isFunction(Lerp.parabola));
});

lerpTests.addTest(
  "returns 0 when calling `Lerp.calc(0, 100, Lerp.parabola(0.0))`",
  () => {
    const expected = 0;
    const actual = Lerp.calc(0, 100, Lerp.parabola(0.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 0 when calling `Lerp.calc(0, 100, Lerp.parabola(1.0))`",
  () => {
    const expected = 0;
    const actual = Lerp.calc(0, 100, Lerp.parabola(1.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest("has method triangle", () => {
  testRunner.assertStrictlyEquals(true, Utils.isFunction(Lerp.triangle));
});

lerpTests.addTest(
  "returns 0 when calling `Lerp.calc(0, 100, Lerp.triangle(0.0))`",
  () => {
    const expected = 0;
    const actual = Lerp.calc(0, 100, Lerp.triangle(0.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 100 when calling `Lerp.calc(0, 100, Lerp.triangle(0.5))`",
  () => {
    const expected = 100;
    const actual = Lerp.calc(0, 100, Lerp.triangle(0.5));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 0 when calling `Lerp.calc(0, 100, Lerp.triangle(1.0))`",
  () => {
    const expected = 0;
    const actual = Lerp.calc(0, 100, Lerp.triangle(1.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest("has method elasticOut", () => {
  testRunner.assertStrictlyEquals(true, Utils.isFunction(Lerp.elasticOut));
});

lerpTests.addTest(
  "returns 0 when calling `Lerp.calc(0, 100, Lerp.elasticOut(0.0))`",
  () => {
    const expected = 0;
    const actual = Lerp.calc(0, 100, Lerp.elasticOut(0.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 100 when calling `Lerp.calc(0, 100, Lerp.elasticOut(1.0))`",
  () => {
    const expected = 100;
    const actual = Lerp.calc(0, 100, Lerp.elasticOut(1.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest("has method bounceOut", () => {
  testRunner.assertStrictlyEquals(true, Utils.isFunction(Lerp.bounceOut));
});

lerpTests.addTest(
  "returns 0 when calling `Lerp.calc(0, 100, Lerp.bounceOut(0.0))`",
  () => {
    const expected = 0;
    const actual = Lerp.calc(0, 100, Lerp.bounceOut(0.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 100 when calling `Lerp.calc(0, 100, Lerp.bounceOut(1.0))`",
  () => {
    const expected = 100;
    const actual = Lerp.calc(0, 100, Lerp.bounceOut(1.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 0.0 when calling `Lerp.calc(Lerp.squared(x)(), Lerp.sqrt(x)(), Lerp.linear(x))` and x = 0.0",
  () => {
    const expected = 0.0;
    const x = 0.0;
    const actual = Lerp.calc(Lerp.squared(x)(), Lerp.sqrt(x)(), Lerp.linear(x));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 1.0 when calling `Lerp.calc(Lerp.squared(x)(), Lerp.sqrt(x)(), Lerp.linear(x))` and x = 1.0",
  () => {
    const expected = 1;
    const x = 1.0;
    const actual = Lerp.calc(Lerp.squared(x)(), Lerp.sqrt(x)(), Lerp.linear(x));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 0.0 when calling `Lerp.calc(0, 100, Lerp.smootheStep(0.0))`",
  () => {
    const expected = 0.0;
    const actual = Lerp.calc(0, 100, Lerp.smootheStep(0.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 100.0 when calling `Lerp.calc(0, 100, Lerp.smootheStep(1.0))`",
  () => {
    const expected = 100.0;
    const actual = Lerp.calc(0, 100, Lerp.smootheStep(1.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 0.0 when calling `Lerp.calc(0, 100, Lerp.smootheStep2(0.0))`",
  () => {
    const expected = 0.0;
    const actual = Lerp.calc(0, 100, Lerp.smootheStep2(0.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

lerpTests.addTest(
  "returns 100.0 when calling `Lerp.calc(0, 100, Lerp.smootheStep2(1.0))`",
  () => {
    const expected = 100.0;
    const actual = Lerp.calc(0, 100, Lerp.smootheStep2(1.0));

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

testRunner.run();
