import { TestBot } from "../testBot/testBot.js";
import { Vector } from "../components/vector.js";
import { AnimationFrame } from "../components/animationFrame.js";
import { StickAnimation } from "../components/stickAnimation.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const stickAnimationTests = testRunner.createSuite("Tests StickAnimation");

stickAnimationTests.addTest("allows for adding new frames", () => {
  const anim = new StickAnimation();

  // Should be 0
  let sumLength = anim.getFrameLength();

  const frame0 = new AnimationFrame(1);

  anim.setFrameAt(0, frame0);

  // Should be 0 + 1 = 1
  sumLength += anim.getFrameLength();

  const frame1 = new AnimationFrame(1);

  anim.setFrameAt(1, frame1);

  // Should be 1 + 2 = 3
  sumLength += anim.getFrameLength();

  testRunner.assertStrictlyEquals(3, sumLength);
});

stickAnimationTests.addTest(
  "resolves linear interpolation between two frames based on current ticNumber",
  () => {
    const boneVectors = {
      boneA: new Vector(0, 0),
      boneB: new Vector(10, 0),
    };
    const anim = new StickAnimation();
    const currentTic = 1;

    const frame0 = new AnimationFrame(2, {
      boneA: new Vector(-10, 0),
      boneB: new Vector(-18, 10),
    });
    anim.setFrameAt(0, frame0);

    const frame1 = new AnimationFrame(2, {
      boneA: new Vector(0, 0),
      boneB: new Vector(10, 0),
    });
    anim.setFrameAt(1, frame1);

    anim.resolve(currentTic, boneVectors);

    const expected = [new Vector(-5, 0), new Vector(-4, 5)];
    const actual = [boneVectors.boneA, boneVectors.boneB];

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

stickAnimationTests.addTest(
  "can cycle through animations even if ticnumber > frame animation length",
  () => {
    const boneVectors = {
      boneA: new Vector(0, 0),
      boneB: new Vector(10, 0),
    };
    const anim = new StickAnimation();
    const currentTic = 5;

    const frame0 = new AnimationFrame(2, {
      boneA: new Vector(-10, 0),
      boneB: new Vector(-18, 10),
    });
    anim.setFrameAt(0, frame0);

    const frame1 = new AnimationFrame(2, {
      boneA: new Vector(0, 0),
      boneB: new Vector(10, 0),
    });
    anim.setFrameAt(1, frame1);

    anim.resolve(currentTic, boneVectors);

    const expected = [new Vector(-5, 0), new Vector(-4, 5)];
    const actual = [boneVectors.boneA, boneVectors.boneB];

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

testRunner.run();
