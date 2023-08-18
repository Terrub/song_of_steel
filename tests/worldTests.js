import { TestBot } from "../testBot/testBot.js";
import { CanvasRendererTypeError } from "../errors/typeErrors/canvasRendererTypeError.js";
import { CanvasRenderer } from "../components/canvasRenderer.js";
import { World } from "../components/world.js";
import { NumberTypeError } from "../errors/typeErrors/numberTypeError.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const worldTests = testRunner.createSuite("Tests world");

worldTests.addTest(
  "instantiating without interactables<CanvasRenderer> should throw CanvasRendererTypeError",
  () => {
    testRunner.assertThrowsExpectedError(CanvasRendererTypeError);
    const canvas = document.createElement("canvas");

    const width = 100;
    const height = 100;

    new World(width, height);
  }
);

worldTests.addTest(
  "instantiating with invalid backdrop should throw CanvasRendererTypeError",
  () => {
    testRunner.assertThrowsExpectedError(CanvasRendererTypeError);
    const canvas = document.createElement("canvas");

    const width = 100;
    const height = 100;
    const interactables = new CanvasRenderer(canvas);

    new World(
      width,
      height,
      interactables,
      'not a backdrop',
    );
  }
);

worldTests.addTest(
  "instantiating with invalid background should throw CanvasRendererTypeError",
  () => {
    testRunner.assertThrowsExpectedError(CanvasRendererTypeError);
    const canvas = document.createElement("canvas");

    const width = 100;
    const height = 100;
    const interactables = new CanvasRenderer(canvas);
    const backdrop = new CanvasRenderer(canvas);

    new World(
      width,
      height,
      interactables,
      backdrop,
      'not a background',
    );
  }
);

worldTests.addTest(
  "instantiating with invalid wall should throw CanvasRendererTypeError",
  () => {
    testRunner.assertThrowsExpectedError(CanvasRendererTypeError);
    const canvas = document.createElement("canvas");

    const width = 100;
    const height = 100;
    const interactables = new CanvasRenderer(canvas);
    const backdrop = new CanvasRenderer(canvas);
    const background = new CanvasRenderer(canvas);

    new World(
      width,
      height,
      interactables,
      backdrop,
      background,
      'not a wall',
    );
  }
);

worldTests.addTest(
  "instantiating with invalid foreground should throw CanvasRendererTypeError",
  () => {
    testRunner.assertThrowsExpectedError(CanvasRendererTypeError);
    const canvas = document.createElement("canvas");

    const width = 100;
    const height = 100;
    const interactables = new CanvasRenderer(canvas);
    const backdrop = new CanvasRenderer(canvas);
    const background = new CanvasRenderer(canvas);
    const wall = new CanvasRenderer(canvas);

    new World(
      width,
      height,
      interactables,
      backdrop,
      background,
      wall,
      'not a foreground',
    );
  }
);

worldTests.addTest(
  "setFloor method throws NumberTypeError when given non-number",
  () => {
    testRunner.assertThrowsExpectedError(NumberTypeError);
    const canvas = document.createElement("canvas");

    const width = 100;
    const height = 100;
    const backdrop = new CanvasRenderer(canvas);
    const background = new CanvasRenderer(canvas);
    const wall = new CanvasRenderer(canvas);
    const interactables = new CanvasRenderer(canvas);
    const foreground = new CanvasRenderer(canvas);

    const world = new World(
      width,
      height,
      interactables,
      backdrop,
      background,
      wall,
      foreground,
    );

    world.setFloor();
  }
);

testRunner.run();
