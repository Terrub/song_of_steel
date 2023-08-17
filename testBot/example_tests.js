import { TestBot } from "./testBot.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);

const testRunner = new TestBot(resultRenderer);

const assertEqualsTest = testRunner.createSuite("Tests assertStrictlyEquals");
assertEqualsTest.addTest("succeeding shows green", () => {
  const expected = "foo";
  const actual = "foo";

  testRunner.assertStrictlyEquals(expected, actual);
});

assertEqualsTest.addTest("failing shows red", () => {
  const expected = "foo";
  const actual = "bar";

  testRunner.assertStrictlyEquals(expected, actual);
});

assertEqualsTest.addTest("shows orange when encountering an error", () => {
  throw new Error("This should cause an error and show orange in TestBot.");
});

const assertStrictlyNotEqualsTests = testRunner.createSuite(
  "Tests assertStrictlyNotEquals"
);

assertStrictlyNotEqualsTests.addTest("succeeding shows green", () => {
  const expected = "foo";
  const actual = "bar";

  testRunner.assertStrictlyNotEquals(expected, actual);
});

assertStrictlyNotEqualsTests.addTest("failing shows red", () => {
  const expected = "foo";
  const actual = "foo";

  testRunner.assertStrictlyNotEquals(expected, actual);
});

assertStrictlyNotEqualsTests.addTest(
  "shows orange when encountering an error",
  () => {
    throw new Error("This should cause an error and show orange in TestBot.");
  }
);

const assertObjectDeepCompareTest = testRunner.createSuite(
  "Tests assertDeepCompareObjects"
);
assertObjectDeepCompareTest.addTest("of same objects shows green", () => {
  const expected = {
    name: "deep compared object 1",
    id: 1,
    values: ["a", "b", "c"],
  };
  const actual = {
    id: 1,
    name: "deep compared object 1",
    values: ["a", "b", "c"],
  };

  testRunner.assertDeepCompareObjects(expected, actual);
});

assertObjectDeepCompareTest.addTest("of different objects shows red", () => {
  const expected = {
    name: "deep compared object 2",
    id: 2,
    values: ["a", "b", "c"],
  };
  const actual = {
    name: "deep compared object 2",
    id: 2,
    values: [1, 2, 3],
  };

  testRunner.assertDeepCompareObjects(expected, actual);
});

assertObjectDeepCompareTest.addTest(
  "shows orange when encountering an error",
  () => {
    throw new Error("This should cause an error and show orange in TestBot.");
  }
);

const assertNotObjectDeepCompareTest = testRunner.createSuite(
  "Tests assertNotDeepCompareObjects"
);
assertNotObjectDeepCompareTest.addTest(
  "of different objects shows green",
  () => {
    const expected = {
      name: "deep compared object 2",
      id: 2,
      values: ["a", "b", "c"],
    };
    const actual = {
      name: "deep compared object 2",
      id: 2,
      values: [1, 2, 3],
    };

    testRunner.assertNotDeepCompareObjects(expected, actual);
  }
);

assertNotObjectDeepCompareTest.addTest("of same objects shows red", () => {
  const expected = {
    name: "deep compared object 1",
    id: 1,
    values: ["a", "b", "c"],
  };
  const actual = {
    id: 1,
    name: "deep compared object 1",
    values: ["a", "b", "c"],
  };

  testRunner.assertNotDeepCompareObjects(expected, actual);
});

assertNotObjectDeepCompareTest.addTest(
  "shows orange when encountering an error",
  () => {
    throw new Error("This should cause an error and show orange in TestBot.");
  }
);

const assertErrorTest = testRunner.createSuite(
  "Tests assertThrowsExpectedError"
);
assertErrorTest.addTest("shows green when expected error is thrown", () => {
  testRunner.assertThrowsExpectedError(TypeError);

  throw new TypeError(
    "This error should not show up in console but show up green in tests."
  );
});

assertErrorTest.addTest("shows red when unexpected error is thrown", () => {
  testRunner.assertThrowsExpectedError(RangeError);

  throw new TypeError(
    "This error should show up in console but show up red in tests."
  );
});

assertErrorTest.addTest("shows red when no error is thrown", () => {
  testRunner.assertThrowsExpectedError(TypeError);
});

const assertRangeTest = testRunner.createSuite("Tests assertInRange");
assertRangeTest.addTest("shows green when value in given range", () => {
  const actual = 0.1;
  const expectedMin = 0.0;
  const expectedMax = 0.2;

  testRunner.assertInRange(expectedMin, actual, expectedMax);
});

assertRangeTest.addTest(
  "shows red when value less than provided minimum",
  () => {
    const actual = 0.1;
    const expectedMin = 0.2;
    const expectedMax = 0.3;

    testRunner.assertInRange(expectedMin, actual, expectedMax);
  }
);

assertRangeTest.addTest(
  "shows red when value greater than provided maximum",
  () => {
    const actual = 0.2;
    const expectedMin = 0.0;
    const expectedMax = 0.1;

    testRunner.assertInRange(expectedMin, actual, expectedMax);
  }
);

assertRangeTest.addTest("throws error when given value is not a Number", () => {
  const actual = "";
  const expectedMin = 1.0;
  const expectedMax = 10.0;

  testRunner.assertInRange(expectedMin, actual, expectedMax);
});

const assertGreaterThanTests = testRunner.createSuite(
  "Tests assertGreaterThan"
);

assertGreaterThanTests.addTest(
  "shows green when given value greater than expected value",
  () => {
    testRunner.assertGreaterThan(1, 2);
  }
);

assertGreaterThanTests.addTest(
  "shows red when given value not greater than expected value",
  () => {
    testRunner.assertGreaterThan(2, 1);
  }
);

assertGreaterThanTests.addTest(
  "shows red when given value is exactly same as expected value",
  () => {
    testRunner.assertGreaterThan(1, 1);
  }
);

assertGreaterThanTests.addTest(
  "throws TypeError when provided expected value is not a number",
  () => {
    testRunner.assertGreaterThan("", 1);
  }
);

assertGreaterThanTests.addTest(
  "throws TypeError when given actual value is not a number",
  () => {
    testRunner.assertGreaterThan(1, "");
  }
);

const assertLessThanTests = testRunner.createSuite("Tests assertLessThan");

assertLessThanTests.addTest(
  "shows green when given value less than expected value",
  () => {
    testRunner.assertLessThan(2, 1);
  }
);

assertLessThanTests.addTest(
  "shows red when given value not less than expected value",
  () => {
    testRunner.assertLessThan(1, 2);
  }
);

assertLessThanTests.addTest(
  "shows red when given value is exactly same as expected value",
  () => {
    testRunner.assertLessThan(1, 1);
  }
);

assertLessThanTests.addTest(
  "throws TypeError when provided expected value is not a number",
  () => {
    testRunner.assertLessThan("", 1);
  }
);

assertLessThanTests.addTest(
  "throws TypeError when given actual value is not a number",
  () => {
    testRunner.assertLessThan(1, "");
  }
);

testRunner.run();
