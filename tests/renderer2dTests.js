//@ts-check
import Renderer2d from "../components/renderer2d.js";
import CanvasTypeError from "../errors/typeErrors/canvasTypeError.js";
import TestBot from "../testBot/testBot.js";
import Utils from "../utils.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const renderer2dTests = testRunner.createSuite("Tests Renderer2d");

// renderer2dTests.addTest(
//   "throws CanvasTypeError when instantiated without HTMLCanvasElement",
//   () => {
//     // @ts-ignore This is javascript stuff, not typescript
//     testRunner.assertThrowsExpectedError(CanvasTypeError);
//     // @ts-ignore We intend to cause a CanvasTypeError by providing no argument
//     new CanvasRenderer();
//   }
// );

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
  "something something attempts to draw rectangle when given rectangle drawable",
  () => {
    let actual;
    /** @type {CanvasRenderingContext2D} */
    const mockGlib = TestBot.createMock(CanvasRenderingContext2D, {
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

    const drawables = [];
    const rectangle = {
      type: 'rectangle',
      x: 0,
      y: 0,
      width: 1,
      height: 1,
      color: 'black',
    };

    drawables.push(rectangle);
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

    const drawables = [];
    const drawableLine = {
      type: 'line',
      x1: 10,
      y1: 10,
      x2: 20,
      y2: 20,
      color: 'red',
      lineWidth: 2,
    };
    drawables.push(drawableLine);
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

testRunner.run();
