//@ts-check
import Entity from "../components/entity.js";
import StringTypeError from "../errors/typeErrors/stringTypeError.js";
import TestBot from "../testBot/testBot.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const entityTests = testRunner.createSuite("Tests Entity");

entityTests.addTest(
    "`constructor` throws StringParameterTypeError",
    () => {
        testRunner.assertThrowsExpectedError(StringTypeError);

        // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
        new Entity();
    }
);

entityTests.addTest(
    "has name",
    () => {
        const entity = new Entity('foo');
        
        const actual = entity.name;

        const expected = 'foo';
        testRunner.assertStrictlyEquals(expected, actual);
    }
);

testRunner.run();
