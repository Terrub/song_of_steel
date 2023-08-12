import { TestBot } from "../testBot/testBot.js";
import { CanvasRendererTypeError } from "../errors/typeErrors/canvasRendererTypeError.js";
import { CanvasRenderer } from "../components/canvasRenderer.js";
import { Background } from "../components/background.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const backgroundTests = testRunner.createSuite("Tests Background");

backgroundTests.addTest(
  "instantiating without CanvasRenderer should throw CanvasRendererTypeError",
  () => {
    testRunner.assertThrowsExpectedError(CanvasRendererTypeError);
    new Background();
  }
);

backgroundTests.addTest(
  "has method setSolidColor that calls fill on renderer",
  () => {
    let actualColor;

    const mockRenderer = TestBot.createMock(CanvasRenderer);
    mockRenderer.fill = (color) => {
      actualColor = color;
    };

    const background = new Background(mockRenderer);
    background.setSolidColor("#000");

    testRunner.assertStrictlyEquals("#000", actualColor);
  }
);

backgroundTests.addTest(
  "has method drawFloor which calls renderer drawRect with inverted height and given color",
  () => {
    let actual;

    const mockRenderer = TestBot.createMock(CanvasRenderer);
    mockRenderer.canvas = {clientWidth: 160, clientHeight: 100};
    mockRenderer.drawRect = (x, y, w, h, c) => {
      actual = {
        startX: x,
        startY: y,
        width: w,
        height: h,
        color: c
      };
    };

    const background = new Background(mockRenderer);
    background.drawFloor(25, "#000");

    const expected = {
        startX: 0,
        startY: 100,
        width: 160,
        height: -25,
        color: "#000"
    };

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

testRunner.run();
