import { TestBot } from "../testBot/testBot.js";
import { Vector } from "../components/vector.js";
import { Utils } from "../utils.js";
import { IKSolver } from "../components/ikSolver.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const iKSolverTests = testRunner.createSuite("Tests IKSolver");

iKSolverTests.addTest("is a function", () => {
  testRunner.assertStrictlyEquals('function', typeof IKSolver);
});

testRunner.run();
