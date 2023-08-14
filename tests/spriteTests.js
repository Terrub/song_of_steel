import { Sprite } from "../components/sprite.js";
import { TestBot } from "../testBot/testBot.js";
import { ImageTypeError } from "../errors/typeErrors/imageTypeError.js";
import { VectorTypeError } from "../errors/typeErrors/vectorTypeError.js";
import { Vector } from "../components/vector.js";
import { NumberTypeError } from "../errors/typeErrors/numberTypeError.js";
import { CanvasRenderer } from "../components/canvasRenderer.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const spriteTests = testRunner.createSuite("Tests Sprite");

spriteTests.addTest(
  "throws ImageTypeError when initiating without Image",
  () => {
    testRunner.assertThrowsExpectedError(ImageTypeError);
    new Sprite();
  }
);

spriteTests.addTest(
  "throws VectorTyperError when instantiating without frameDimensions",
  () => {
    testRunner.assertThrowsExpectedError(VectorTypeError);
    const image = new Image();
    new Sprite(image);
  }
);

spriteTests.addTest(
  "throws VectorTyperError when instantiating without dimensions",
  () => {
    testRunner.assertThrowsExpectedError(VectorTypeError);
    const image = new Image();
    new Sprite(image, new Vector(0, 0));
  }
);

spriteTests.addTest(
  "throws VectorTyperError when instantiating without offset",
  () => {
    testRunner.assertThrowsExpectedError(VectorTypeError);
    const image = new Image();
    new Sprite(image, new Vector(0, 0), new Vector(0, 0));
  }
);

spriteTests.addTest(
  "throws NumberTypeError when instantiating with non-number scale",
  () => {
    testRunner.assertThrowsExpectedError(NumberTypeError);
    const image = new Image();
    new Sprite(image, new Vector(0, 0), new Vector(0, 0), new Vector(0, 0), "");
  }
);

spriteTests.addTest("foo", () => {
  const mockRenderer = TestBot.createMock(CanvasRenderer);
  mockRenderer.canvas = { clientWidth: 640, clientHeight: 480 };

  let actualParams;
  mockRenderer.drawImage = (image, sX, sY, sW, sH, dX, dY, dW, dH) => {
    actualParams = {
      image: image,
      sX: sX,
      sY: sY,
      sW: sW,
      sH: sH,
      dX: dX,
      dY: dY,
      dW: dW,
      dH: dH,
    };
  };

  // Lets say image is a PNG that has dim: (200, 200)
  // We only want to display the Centre 100px X 100px:
  // +--------------------+
  // |     50             |
  // | 50  +--------+     |
  // |     |        | 100 | 200
  // |     |        |     |
  // |     +--------+     |
  // |        100         |
  // +--------------------+
  //          200
  const image = new Image();

  // The frame we clip from has dim: (200, 200) as we clip from the whole image, but...
  const frameDim = new Vector(200, 200);

  // ... the bit we want to render is only (100, 100)
  const dim = new Vector(100, 100);

  // So we also need to offset by (50, 50)
  const offset = new Vector(50, 50);
  const sprite = new Sprite(image, frameDim, dim, offset);

  // Now that we have a sprite we can set the current starting point of our 200x200 frame to (0, 0)
  sprite.frameOffset.x = 0;
  sprite.frameOffset.y = 0;

  // And we want to place our 100x100 selection at (x: 100, y: 0) of our renderspace
  const outputPosition = new Vector(100, 0);
  sprite.draw(mockRenderer, outputPosition);

  const expectedParams = {
    image: image,
    sX: 50, // 50px into frame on X axis
    sY: 50, // 50px into frame on Y axis
    sW: 100, // 100px width
    sH: 100, // 100px height
    dX: 50, // half selected width left of outputPosition X => sW / 2 + outputPosition.x
    dY: 0, // just outputPosition.y
    dW: 100, // selection width * scale
    dH: 100, // selection height * scale
  };

  testRunner.assertDeepCompareObjects(expectedParams, actualParams);
});

/**
 * new Image();
    this.image.src = src;
 */

testRunner.run();
