//@ts-check
import Intent from "../components/intent.js";
import StringTypeError from "../errors/typeErrors/stringTypeError.js";
import TestBot from "../testBot/testBot.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const intentTests = testRunner.createSuite("Tests Intent");

intentTests.addTest(
    "`constructor` throws StringParameterTypeError",
    () => {
        testRunner.assertThrowsExpectedError(StringTypeError);

        // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
        new Intent();
    }
);

intentTests.addTest(
    "has name",
    () => {
        const intent = new Intent('foo');
        
        const actual = intent.name;

        const expected = 'foo';
        testRunner.assertStrictlyEquals(expected, actual);
    }
);

testRunner.run();
