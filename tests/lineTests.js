//@ts-check
import Drawable from "../components/drawable.js";
import Line from "../components/line.js";
import TestBot from "../testBot/testBot.js";
import Utils from "../utils.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const lineTests = testRunner.createSuite("Tests Line");

lineTests.addTest(
    "has recognisable drawable type: line",
    () => {
        const line = new Line(0, 0, 1, 1, 'white');

        const actual = line.type;

        const expected = Drawable.LINE;
        testRunner.assertStrictlyEquals(expected, actual);
    }
);

testRunner.run();
