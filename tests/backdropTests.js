import { Backdrop } from "../components/backdrop.js";
import { CanvasRenderer } from "../components/canvasRenderer.js";
import { ParamTypeError } from "../errors/paramTypeError.js";
import { TestBot } from "../testBot/testBot.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const backdropTests = testRunner.createSuite("Tests Backdrop");

backdropTests.addTest(
  "Instantiating without CanvasRenderer should throw ParamTypeError",
  () => {
    testRunner.assertThrowsExpectedError(ParamTypeError);
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