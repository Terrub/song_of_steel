import { TestBot } from "../testBot/testBot.js";
import { Vector } from "../components/vector.js";
import { Utils } from "../utils.js";
import { IKSolver } from "../components/ikSolver.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const iKSolverTests = testRunner.createSuite("Tests IKSolver");

iKSolverTests.addTest("has local solve function", () => {
  testRunner.assertStrictlyEquals("function", typeof IKSolver.local);
});

iKSolverTests.addTest("has global solve function", () => {
  testRunner.assertStrictlyEquals("function", typeof IKSolver.global);
});

iKSolverTests.addTest("calc knee from origin", () => {
  // This is origin so (0, 0)
  const hip = new Vector(0, 0);
  // This is determined so initialise with (0, 0) we move it with IKSolver
  const knee = new Vector(0, 0);
  // This is the end effector, we position it at (8, 0)
  const foot = new Vector(8, 0);

  // Now if we put the length of both limbs at 5, then pythagorem should tell us knee should end
  // up at exactly (4, 3);
  IKSolver.local(knee, 5, 5, foot);
  // knee = {x: 4, y: 2.999999999999999}...
  // Ok, maybe not _exactly_... close enough!
  const actual = knee;

  const expected = new Vector(4, 3);

  testRunner.assertStrictlyEquals(true, Vector.equal(expected, actual));
});

iKSolverTests.addTest("calc knee in global space", () => {
  // Origin is now placed 100 to the right
  const hip = new Vector(100, 8);
  // Foot is now directly underneath hip, 100 to the right
  const foot = new Vector(100, 0);
  // Initialise knee vector;
  const actual = new Vector(0, 0);

  // Now iksolve it:
  IKSolver.global(actual, 5, 5, foot, hip);

  const expected = new Vector(103, 4);

  testRunner.assertStrictlyEquals(true, Vector.equal(expected, actual));
});

testRunner.run();
