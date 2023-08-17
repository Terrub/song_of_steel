import { Utils } from "../utils.js";
import { DivResultsRenderer } from "./resultRenderers/DivResultsRenderer.js";

class Suite {
  name;

  tests = [];

  constructor(suiteName) {
    this.name = suiteName;
  }

  addTest(testName, testMethod) {
    this.tests.push({
      name: testName,
      fnTest: testMethod,
    });
  }
}

export class TestBot {
  static TEST_SUCCEEDED = 0;
  static TEST_FAILED = 1;
  static TEST_ERROR = 2;
  static TEST_MISSING = 3;

  testSuites = [];

  expected;

  expectedError;

  actual;

  result;

  constructor(resultRenderer) {
    this.resultRenderer = resultRenderer;
  }

  static renderResultsInDiv(container) {
    return new DivResultsRenderer(container);
  }

  static createMock(targetClass) {
    const mockedClass = {};

    const mockingSuccessful = Reflect.setPrototypeOf(
      mockedClass,
      targetClass.prototype
    );

    if (!mockingSuccessful) {
      // TODO: Failing to mock a target class should have it's own specific error
      throw new Error(`CRITICAL: TestBot Failed to mock '${targetClass.name}'`);
    }

    return mockedClass;
  }

  createSuite(testSuiteName) {
    const newSuite = new Suite(testSuiteName);
    this.testSuites.push(newSuite);

    return newSuite;
  }

  runSuite(suite) {
    const tests = suite.tests;
    tests.forEach((test) => {
      this.expected = undefined;
      this.actual = undefined;
      this.expectedError = undefined;
      this.result = TestBot.TEST_MISSING;
      let caughtError = undefined;

      try {
        test.fnTest();
      } catch (error) {
        caughtError = error;
      }

      if (Utils.isDefined(this.expectedError) && Utils.isDefined(caughtError)) {
        if (Utils.isInstanceOf(this.expectedError, caughtError)) {
          this.result = TestBot.TEST_SUCCEEDED;
        } else {
          this.result = TestBot.TEST_FAILED;
          this.expected = this.expectedError.name;
          this.actual = caughtError.name;
        }
      }

      if (
        Utils.isUndefined(this.expectedError) &&
        Utils.isDefined(caughtError)
      ) {
        this.result = TestBot.TEST_ERROR;
      }

      if (
        Utils.isDefined(this.expectedError) &&
        Utils.isUndefined(caughtError)
      ) {
        this.expected = this.expectedError.name;
        this.result = TestBot.TEST_FAILED;
      }

      if (TestBot.TEST_ERROR === this.result) {
        console.log(
          `"${suite.name} ${test.name}" caused the following unexpected error:`
        );
        console.error(caughtError);
      }

      if (TestBot.TEST_FAILED === this.result) {
        console.log(
          `"${suite.name} ${test.name}" failed:\n\tExpected:\n\t\t`,
          this.expected,
          "\n\tActual:\n\t\t",
          this.actual
        );
        if (Utils.isDefined(caughtError)) {
          console.error(caughtError);
        }
      }

      this.resultRenderer.addResult(
        suite.name,
        test.name,
        this.result,
        this.expected,
        this.actual
      );
    });
  }

  run() {
    this.testSuites.forEach((suite) => {
      this.runSuite(suite);
    });
  }

  assertStrictlyEquals(expected, actual) {
    this.expected = expected;
    this.actual = actual;
    this.result =
      expected === actual ? TestBot.TEST_SUCCEEDED : TestBot.TEST_FAILED;
  }

  assertStrictlyNotEquals(expected, actual) {
    this.expected = expected;
    this.actual = actual;
    this.result =
      expected !== actual ? TestBot.TEST_SUCCEEDED : TestBot.TEST_FAILED;
  }

  assertThrowsExpectedError(expectedError) {
    this.expectedError = expectedError;
  }

  assertDeepCompareObjects(object1, object2) {
    this.expected = object1;
    this.actual = object2;
    this.result = Utils.objectEquals(object1, object2)
      ? TestBot.TEST_SUCCEEDED
      : TestBot.TEST_FAILED;
  }

  assertNotDeepCompareObjects(object1, object2) {
    this.expected = object1;
    this.actual = object2;
    this.result = !Utils.objectEquals(object1, object2)
      ? TestBot.TEST_SUCCEEDED
      : TestBot.TEST_FAILED;
  }

  assertInRange(min, actual, max) {
    if (!Utils.isNumber(actual)) {
      throw new TypeError(
        `Provided 'actual' value must be of type number, '${actual}' given.`
      );
    }

    if (!Utils.isNumber(min)) {
      throw new TypeError(
        `Minimum range value must be of type number, '${min}' given.`
      );
    }

    if (!Utils.isNumber(max)) {
      throw new TypeError(
        `Maximum range value must be of type number, '${max}' given.`
      );
    }

    this.expected = `[${min}, ${max}]`;
    this.actual = actual;
    this.result =
      actual < min || max < actual
        ? TestBot.TEST_FAILED
        : TestBot.TEST_SUCCEEDED;
  }

  assertGreaterThan(expected, actual) {
    if (!Utils.isNumber(expected)) {
      throw new TypeError(
        `Expected value must be number, '${typeof expected}' given.`
      );
    }

    if (!Utils.isNumber(actual)) {
      throw new TypeError(
        `Actual value must be number, '${typeof actual}' given.`
      );
    }

    this.expected = `> ${expected}`;
    this.actual = actual;
    this.result =
      actual > expected ? TestBot.TEST_SUCCEEDED : TestBot.TEST_FAILED;
  }

  assertLessThan(expected, actual) {
    if (!Utils.isNumber(expected)) {
      throw new TypeError(
        `Expected value must be number, '${typeof expected}' given.`
      );
    }

    if (!Utils.isNumber(actual)) {
      throw new TypeError(
        `Actual value must be number, '${typeof actual}' given.`
      );
    }

    this.expected = `< ${expected}`;
    this.actual = actual;
    this.result =
      actual < expected ? TestBot.TEST_SUCCEEDED : TestBot.TEST_FAILED;
  }
}
