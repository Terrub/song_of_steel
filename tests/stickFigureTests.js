import { TestBot } from "../testBot/testBot.js";
import { StickFigure } from "../components/stickFigure.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const stickFigureTests = testRunner.createSuite("Tests StickFigure");

stickFigureTests.addTest(
  "foo",
  () => {
    new StickFigure();
  }
);

testRunner.run();
