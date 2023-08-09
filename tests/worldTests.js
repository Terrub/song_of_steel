import { TestBot } from "../testBot/testBot.js";
import { ParamTypeError } from "../errors/paramTypeError.js";
import { CanvasRenderer } from "../components/canvasRenderer.js";
import { World } from "../components/world.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const worldTests = testRunner.createSuite("Tests world");

worldTests.addTest(
  "instantiating without CanvasRenderer should throw ParamTypeError",
  () => {
    testRunner.assertThrowsExpectedError(ParamTypeError);
    new World();
  }
);

worldTests.addTest(
  "has method setSolidColor that calls fill on renderer",
  () => {
    let actualColor;

    const mockRenderer = TestBot.createMock(CanvasRenderer);
    mockRenderer.fill = (color) => {
      actualColor = color;
    };

    const world = new World(mockRenderer);
    world.setSolidColor("#000");

    testRunner.assertStrictlyEquals("#000", actualColor);
  }
);

worldTests.addTest(
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

    const world = new World(mockRenderer);
    world.drawFloor("#000", 25);

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
