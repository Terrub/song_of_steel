//@ts-check
import TestBot from "../testBot/testBot.js";
import Game from "../components/game.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const gameTests = testRunner.createSuite("Tests Game");

gameTests.addTest(
  "instantiating without CanvasRenderer should throw ParamTypeError",
  () => {
    new Game();
  }
);

testRunner.run();
