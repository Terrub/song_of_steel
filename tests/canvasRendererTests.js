import { CanvasRenderer } from "../components/canvasRenderer.js";
import { TestBot } from "../testBot/testBot.js";
import { CanvasTypeError } from "../errors/typeErrors/canvasTypeError.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const canvasRendererTests = testRunner.createSuite("Tests CanvasRenderer");

canvasRendererTests.addTest(
  "throws CanvasTypeError when instantiated without HTMLCanvasElement",
  () => {
    testRunner.assertThrowsExpectedError(CanvasTypeError);
    new CanvasRenderer();
  }
);

canvasRendererTests.addTest(
  'drawsRect(0, 0, 100, 50, "red") draws red rectangle in context at bottom left corner',
  () => {
    let actualParams;
    const mockGlib = {
      fillStyle: "white",
      fillRect: (x, y, w, h) => {
        actualParams = {
          x: x,
          y: y,
          w: w,
          h: h,
        };
      },
    };

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    canvas.getContext = () => mockGlib;

    const canvasRenderer = new CanvasRenderer(canvas);
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
