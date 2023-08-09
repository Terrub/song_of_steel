import { TestBot } from "../testBot/testBot.js";
import { ParamTypeError } from "../errors/paramTypeError.js";
import { CanvasRenderer } from "../components/canvasRenderer.js";
import { Wall } from "../components/wall.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const wallTests = testRunner.createSuite("Tests wall");

wallTests.addTest(
  "instantiating without CanvasRenderer should throw ParamTypeError",
  () => {
    testRunner.assertThrowsExpectedError(ParamTypeError);
    new Wall;
  }
);

wallTests.addTest(
  "has method setSolidColor that calls fill on renderer",
  () => {
    let actualColor;

    const mockRenderer = TestBot.createMock(CanvasRenderer);
    mockRenderer.fill = (color) => {
      actualColor = color;
    };

    const wall = new Wall(mockRenderer);
    wall.setSolidColor("#000");

    testRunner.assertStrictlyEquals("#000", actualColor);
  }
);

wallTests.addTest(
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

    const wall = new Wall(mockRenderer);
    wall.drawPost(50, 5, 60, "#933");

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
