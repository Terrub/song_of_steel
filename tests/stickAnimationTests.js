import { TestBot } from "../testBot/testBot.js";
import { StickAnimation } from "../components/stickAnimation.js";
import { Utils } from "../utils.js";
import { Lerp } from "../components/lerp.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const stickAnimationTests = testRunner.createSuite("Tests StickAnimation");

stickAnimationTests.addTest("foo", () => {
  const anim = new StickAnimation();
  const numTics = 0;

  anim.resolve(numTics);
  const x = 0;
  const lerp = Lerp.calc(start.x, end.x, Lerp.linear(x));
});

testRunner.run();
