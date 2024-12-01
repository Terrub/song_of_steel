//@ts-check
import Drawable from "../components/drawable.js";
import DrawText from "../components/drawText.js";
import TestBot from "../testBot/testBot.js";
import Utils from "../utils.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const DrawTextTests = testRunner.createSuite("Tests DrawText");

DrawTextTests.addTest(
    "has recognisable drawable type: text",
    () => {
        const drawText = new DrawText('text', 0, 0, 'white');

        const actual = drawText.type;

        const expected = Drawable.TEXT;
        testRunner.assertStrictlyEquals(expected, actual);
    }
);

testRunner.run();
