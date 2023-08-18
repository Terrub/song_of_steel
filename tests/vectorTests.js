import { TestBot } from "../testBot/testBot.js";
import { Vector } from "../components/vector.js";
import { Utils } from "../utils.js";

// TODO: Lots of Vector tests are object based, needs static/non-destructive versions as well.
const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const vectorTests = testRunner.createSuite("Tests Vector");

vectorTests.addTest("can add another vector to itself (in place)", () => {
  const actual = new Vector(0, 5);
  actual.add(new Vector(6, 2));
  const expected = new Vector(6, 7);

  testRunner.assertDeepCompareObjects(expected, actual);
});

vectorTests.addTest("can create a new vector by adding two", () => {
  const vector1 = new Vector(0, 5);
  const vector2 = new Vector(6, 2);

  const actual = Vector.add(vector1, vector2);
  const expected = new Vector(6, 7);

  testRunner.assertDeepCompareObjects(expected, actual);
});

vectorTests.addTest("does not care about order when adding 2 vectors", () => {
  const v1 = new Vector(0, 5);
  const v2 = new Vector(6, 2);

  const vector1 = Vector.add(v1, v2);
  const vector2 = Vector.add(v2, v1);

  testRunner.assertDeepCompareObjects(vector1, vector2);
});

vectorTests.addTest(
  "can subtract another vector from itself (in place)",
  () => {
    const actual = new Vector(0, 5);
    actual.subtract(new Vector(6, 2));
    const expected = new Vector(-6, 3);

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

vectorTests.addTest("can create a new vector by subtracting two", () => {
  const vector1 = new Vector(0, 5);
  const vector2 = new Vector(6, 7);

  const actual = Vector.subtract(vector1, vector2);
  const expected = new Vector(-6, -2);

  testRunner.assertDeepCompareObjects(expected, actual);
});

vectorTests.addTest("does care about order when subtracting 2 vectors", () => {
  const v1 = new Vector(0, 5);
  const v2 = new Vector(6, 2);

  const vector1 = Vector.subtract(v1, v2);
  const vector2 = Vector.subtract(v2, v1);

  testRunner.assertNotDeepCompareObjects(vector1, vector2);
});

/**
 * Scaling
 * We can also scale a vector by any number α ∈ R, where each component is multiplied by the
 * scaling factor α.
 * If α > 1 the vector will get longer,
 * and if 0 ≤ α < 1 then the vector will become shorter.
 * If α is a negative number, the scaled vector will point in the opposite direction.
 */
vectorTests.addTest("can scale up with value 1 < x", () => {
  const actual = new Vector(2, 4);
  actual.scale(2);
  const expected = new Vector(4, 8);

  testRunner.assertDeepCompareObjects(expected, actual);
});

vectorTests.addTest("can scale down with value 0 ≤ x < 1 ", () => {
  const actual = new Vector(2, 4);
  actual.scale(0.5);
  const expected = new Vector(1, 2);

  testRunner.assertDeepCompareObjects(expected, actual);
});

vectorTests.addTest(
  "can scale down and reverse direction with value -1 ≤ x < 0 ",
  () => {
    const actual = new Vector(2, 4);
    actual.scale(-0.5);
    const expected = new Vector(-1, -2);

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

vectorTests.addTest(
  "can directly reverse direction with value x = -1, keeping the magnitude intact",
  () => {
    const actual = new Vector(2, 4);
    actual.scale(-1);
    const expected = new Vector(-2, -4);

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

vectorTests.addTest(
  "can scale up and reverse direction with value x < -1",
  () => {
    const actual = new Vector(2, 4);
    actual.scale(-2);
    const expected = new Vector(-4, -8);

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

/**
 * Length
 * A vector length is obtained from Pythagoras’ theorem.
 */
vectorTests.addTest("has length based off of its components", () => {
  const vector = new Vector(3, 4);
  const actual = vector.length();
  const expected = 5;

  testRunner.assertStrictlyEquals(expected, actual);
});

vectorTests.addTest("length works even with x component = 0", () => {
  const vector = new Vector(0, 5);
  const actual = vector.length();
  const expected = 5;

  testRunner.assertStrictlyEquals(expected, actual);
});

vectorTests.addTest("length works even with y component = 0", () => {
  const vector = new Vector(3, 0);
  const actual = vector.length();
  const expected = 3;

  testRunner.assertStrictlyEquals(expected, actual);
});

vectorTests.addTest(
  "length gives a positive value '5' when given vector with a negative component '(-3, 4)'",
  () => {
    const vector = new Vector(-3, 4);
    const actual = vector.length();
    const expected = 5;

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

vectorTests.addTest("length can be 0 ≤ x < 1", () => {
  const vector = new Vector(0.3, 0.4);
  const actual = vector.length();
  const expected = 0.5;

  testRunner.assertStrictlyEquals(expected, actual);
});

/**
 * Dot Product
 * The dot product tells us how similar two vectors are to each other.
 * It takes two vectors as input and produces a single number as an output.
 * The dot product between two vectors is the sum of the products of corresponding components.
 */

vectorTests.addTest("dotProduct works with positive vector components", () => {
  const vector1 = new Vector(0, 5);
  const vector2 = new Vector(6, 2);
  const actual = vector1.dotProduct(vector2);
  const expected = 10;

  testRunner.assertStrictlyEquals(expected, actual);
});

vectorTests.addTest(
  "calling dotProduct with canceling vectors result in 0",
  () => {
    const vector1 = new Vector(-2, 5);
    const vector2 = new Vector(5, 2);
    const actual = vector1.dotProduct(vector2);
    const expected = 0;

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

vectorTests.addTest(
  "dotProduct can be positive with all negative components",
  () => {
    const vector1 = new Vector(-2, -1);
    const vector2 = new Vector(-3, -9);
    const actual = vector1.dotProduct(vector2);
    const expected = 15;

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

vectorTests.addTest(
  "dotProduct works with both positive and negative vectors",
  () => {
    const vector1 = new Vector(-2, -1);
    const vector2 = new Vector(3, 9);
    const actual = vector1.dotProduct(vector2);
    const expected = -15;

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

/**
 * Normalise
 */
vectorTests.addTest(
  "has method normalise to scale it down a unit vector",
  () => {
    const actual = new Vector(10, -1);
    actual.normalise();
    const expected = new Vector(0.9950371902099892, -0.09950371902099892);

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

vectorTests.addTest("normalise will cause its magnitude to be 1", () => {
  const vector = new Vector(5, 5);
  vector.normalise();
  const actual = vector.length();
  const expected = 1;

  testRunner.assertStrictlyEquals(expected, actual);
});

vectorTests.addTest(
  "normalise is an approximation and magnitude may not always be strictly equal to 1",
  () => {
    const vector = new Vector(10, -1);
    vector.normalise();
    const actual = vector.length();
    const expected = 0.9999999999999999;

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

vectorTests.addTest(
  "has a means to equate two vectors to combat the approximation without changing the original vectors",
  () => {
    const vector1 = new Vector(5, 5);
    const vector2 = new Vector(6, 6);

    const actual = Vector.equal(vector1, vector2);
    const expected = true;

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

/**
 *
 */

testRunner.run();
