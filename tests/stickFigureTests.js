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

// player contains the bones needed for animation
// player has animations for given set of 'actions'
// player transformes bones based on given action and current number of game tics

testRunner.run();
