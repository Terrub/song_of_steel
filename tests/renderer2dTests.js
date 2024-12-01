//@ts-check
import DrawText from "../components/drawText.js";
import Line from "../components/line.js";
import Rectangle from "../components/rectangle.js";
import Renderer2d from "../components/renderer2d.js";
import ParamTypeError from "../errors/typeErrors/paramTypeError.js";
import TestBot from "../testBot/testBot.js";
import Utils from "../utils.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const renderer2dTests = testRunner.createSuite("Tests Renderer2d");


renderer2dTests.addTest(
  "has method 'render'",
  () => {
    testRunner.assertStrictlyEquals(true, Utils.isFunction(Renderer2d.render));
  }
);

renderer2dTests.addTest(
  "yells when provided drawables array is empty",
  () => {
    // @ts-ignore TypeScript specific errors, we're using ts-check for javascript
    testRunner.assertThrowsExpectedError(Error);

    const mockGlib = TestBot.createMock(CanvasRenderingContext2D, {});
    const emptyArray = [];

    Renderer2d.render(mockGlib, emptyArray);
  }
)

renderer2dTests.addTest(
  "yells when provided drawables contain a non-drawable",
  () => {
    const mockGlib = TestBot.createMock(CanvasRenderingContext2D, {
      reset: () => { },
    });

    // Given an array with an empty object instead of an actual drawable
    const invalidDrawables = [{}];

    // Then we expect a paramater type error
    // @ts-ignore TypeScript specific errors, we're using ts-check for javascript
    testRunner.assertThrowsExpectedError(ParamTypeError);

    // When we try to render
    Renderer2d.render(mockGlib, invalidDrawables);
  }
)

renderer2dTests.addTest(
  "yells when a param for drawing rectangle is wrong",
  () => {
    // @ts-ignore TypeScript specific errors, we're using ts-check for javascript
    testRunner.assertThrowsExpectedError(ParamTypeError);

    const mockGlib = TestBot.createMock(CanvasRenderingContext2D, {
      reset: () => { },
    });
    const nonDrawableRectangle = {
      type: 'rectangle',
      x: undefined, y: undefined,
      width: undefined, height: undefined,
      color: undefined,
    }
    Renderer2d.render(mockGlib, [nonDrawableRectangle]);
  }
)

renderer2dTests.addTest(
  "something something attempts to draw rectangle when given rectangle drawable",
  () => {
    let actual;
    /** @type {CanvasRenderingContext2D} */
    const mockGlib = TestBot.createMock(CanvasRenderingContext2D, {
      reset: () => { },
      fillStyle: "white",
      fillRect: (x, y, w, h) => {
        actual = {
          x: x,
          y: y,
          w: w,
          h: h,
        };
      },
    });

    const drawables = [new Rectangle(0, 0, 1, 1, 'black')];
    Renderer2d.render(mockGlib, drawables);

    const expected = {
      x: 0, y: 0,
      w: 1, h: 1,
    };
    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

renderer2dTests.addTest(
  "something something attempts to draw line when given line drawable",
  () => {
    let actual = {
      beginPathCalled: false,
      moveToParams: { x: 0, y: 0 },
      lineToParams: { x: 0, y: 0 },
      strokeCalled: false,
      lineWidth: 0,
      strokeStyle: 'white',
    };

    const testContext = {
      reset: () => { },
      strokeStyle: "white",
      lineWidth: 0,
      beginPath: () => {
        actual.beginPathCalled = true;
      },
      moveTo: (x, y) => {
        actual.moveToParams.x = x;
        actual.moveToParams.y = y;
      },
      lineTo: (x, y) => {
        actual.lineToParams.x = x;
        actual.lineToParams.y = y;
      },
      stroke: () => {
        actual.strokeCalled = true;
        actual.lineWidth = testContext.lineWidth;
        actual.strokeStyle = testContext.strokeStyle;
      }
    };
    /** @type {CanvasRenderingContext2D} */
    const mockGlib = TestBot.createMock(CanvasRenderingContext2D, testContext);

    const drawables = [new Line(10, 10, 20, 20, 'red', 2)];
    Renderer2d.render(mockGlib, drawables);

    const expected = {
      beginPathCalled: true,
      moveToParams: { x: 10, y: 10 },
      lineToParams: { x: 20, y: 20 },
      strokeCalled: true,
      lineWidth: 2,
      strokeStyle: 'red',
    };
    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

renderer2dTests.addTest(
  "something something attempts to draw text when given text drawable",
  () => {
    let actual = {
      fillStyle: '',
      fillTextParams: { text: '', x: 0, y: 0 },
    };

    const testContext = {
      reset: () => { },
      fillStyle: "white",
      fillText: (text, x, y) => {
        actual.fillTextParams.text = text;
        actual.fillTextParams.x = x;
        actual.fillTextParams.y = y;
        actual.fillStyle = testContext.fillStyle;
      },
    };
    /** @type {CanvasRenderingContext2D} */
    const mockGlib = TestBot.createMock(CanvasRenderingContext2D, testContext);

    const drawables = [
      new DrawText('test text', 10, 10, 'green')
    ];
    Renderer2d.render(mockGlib, drawables);

    const expected = {
      fillStyle: 'green',
      fillTextParams: { text: 'test text', x: 10, y: 10 },
    };
    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

testRunner.run();
