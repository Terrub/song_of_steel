import { TestBot } from "../testBot/testBot.js";
import { CanvasRendererTypeError } from "../errors/typeErrors/canvasRendererTypeError.js";
import { CanvasRenderer } from "../components/canvasRenderer.js";
import { Foreground } from "../components/foreground.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const foregroundTests = testRunner.createSuite("Tests foreground");

foregroundTests.addTest(
  "instantiating without CanvasRenderer should throw CanvasRendererTypeError",
  () => {
    testRunner.assertThrowsExpectedError(CanvasRendererTypeError);
    new Foreground();
  }
);

foregroundTests.addTest(
  "has method setSolidColor that calls fill on renderer",
  () => {
    let actualColor;

    const mockRenderer = TestBot.createMock(CanvasRenderer);
    mockRenderer.fill = (color) => {
      actualColor = color;
    };

    const foreground = new Foreground(mockRenderer);
    foreground.setSolidColor("#000");

    testRunner.assertStrictlyEquals("#000", actualColor);
  }
);

foregroundTests.addTest(
  "has method drawPost which calls renderer drawRect with inverted height and given color",
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

    const foreground = new Foreground(mockRenderer);
    foreground.drawPost(50, 5, 60, "#933");

    const expected = {
        startX: 50,
        startY: 100,
        width: 5,
        height: -60,
        color: "#933"
    };

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

testRunner.run();
