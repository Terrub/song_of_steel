//@ts-check
import Drawable from "../components/drawable.js";
import Rectangle from "../components/rectangle.js";
import TestBot from "../testBot/testBot.js";
import Utils from "../utils.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const rectangleTests = testRunner.createSuite("Tests rectangle");

rectangleTests.addTest(
    "has recognisable drawable type: rectangle",
    () => {
        const rectangle = new Rectangle(0, 0, 1, 1, 'white');

        const actual = rectangle.type;

        const expected = Drawable.RECTANGLE;
        testRunner.assertStrictlyEquals(expected, actual);
    }
);

testRunner.run();
