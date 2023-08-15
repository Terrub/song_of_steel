import { TestBot } from "../testBot/testBot.js";
import { StickFigure } from "../components/stickFigure.js";
import { Vector } from "../components/vector.js";
import { Utils } from "../utils.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const stickFigureTests = testRunner.createSuite("Tests StickFigure");

stickFigureTests.addTest("has velocity vector", () => {
  const playerVelocity = new Vector(0, 0);
  const player = new StickFigure(playerVelocity);

  testRunner.assertStrictlyEquals(true, player.velocity instanceof Vector);
});

stickFigureTests.addTest("has draw method", () => {
  const playerVelocity = new Vector(0, 0);
  const player = new StickFigure(playerVelocity);

  testRunner.assertStrictlyEquals(true, Utils.isFunction(player.draw));
})

testRunner.run();
