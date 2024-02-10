//@ts-check
import CanvasRenderer from "../components/canvasRenderer.js";
import CanvasTypeError from "../errors/typeErrors/canvasTypeError.js";
import TestBot from "../testBot/testBot.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const canvasRendererTests = testRunner.createSuite("Tests CanvasRenderer");

canvasRendererTests.addTest(
  "throws CanvasTypeError when instantiated without HTMLCanvasElement",
  () => {
    // @ts-ignore This is javascript stuff, not typescript
    testRunner.assertThrowsExpectedError(CanvasTypeError);
    // @ts-ignore We intend to cause a CanvasTypeError by providing no argument
    new CanvasRenderer();
  }
);

canvasRendererTests.addTest(
  'drawsRect(0, 0, 100, 50, "red") draws red rectangle in context at bottom left corner',
  () => {
    let actualParams;
    /** @type {CanvasRenderingContext2D} */
    const mockGlib = TestBot.createMock(CanvasRenderingContext2D, {
      fillStyle: "white",
      fillRect: (x, y, w, h) => {
        actualParams = {
          x: x,
          y: y,
          w: w,
          h: h,
        };
      },
    });

    /** @type {HTMLCanvasElement} */
    const mockCanvas = TestBot.createMock(HTMLCanvasElement, {
      width: 640,
      height: 480,
      getContext: () => mockGlib,
    });

    const canvasRenderer = new CanvasRenderer(mockCanvas);
    canvasRenderer.drawRect(0, 0, 100, 50, "red");

    const expectedParams = {
      x: 0,
      y: 480,
      w: 100,
      h: -50,
    };

    testRunner.assertStrictlyEquals("red", mockGlib.fillStyle);
    testRunner.assertDeepCompareObjects(expectedParams, actualParams);
  }
);

testRunner.run();
