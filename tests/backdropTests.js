import { Backdrop } from "../components/backdrop.js";
import { CanvasRenderer } from "../components/canvasRenderer.js";
import { CanvasRendererTypeError } from "../errors/typeErrors/canvasRendererTypeError.js"
import { TestBot } from "../testBot/testBot.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const backdropTests = testRunner.createSuite("Tests Backdrop");

backdropTests.addTest(
  "instantiating without CanvasRenderer should throw CanvasRendererTypeError",
  () => {
    testRunner.assertThrowsExpectedError(CanvasRendererTypeError);
    new Backdrop();
  }
);

backdropTests.addTest(
  "has method setSolidColor that calls fill on renderer",
  () => {
    let actualColor;

    const mockRenderer = TestBot.createMock(CanvasRenderer);
    mockRenderer.fill = (color) => {
      actualColor = color;
    };

    const backdrop = new Backdrop(mockRenderer);
    backdrop.setSolidColor("#000");

    testRunner.assertStrictlyEquals("#000", actualColor);
  }
);

testRunner.run();
