//@ts-check
import Intent from "../components/intent.js";
import State from "../components/state.js";
import DuplicateIntentError from "../errors/fooErrors/duplicateIntentError.js";
import InvalidIntentError from "../errors/fooErrors/invalidIntentError.js";
import InvalidStateError from "../errors/fooErrors/invalidStateError.js";
import UnknownIntentError from "../errors/fooErrors/unknownIntentError.js";
import NumberTypeError from "../errors/typeErrors/numberTypeError.js";
import StringTypeError from "../errors/typeErrors/stringTypeError.js";
import TestBot from "../testBot/testBot.js";
import Utils from "../utils.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const stateTests = testRunner.createSuite("Tests State");

stateTests.addTest(
    "`constructor` throws StringParameterTypeError",
    () => {
        testRunner.assertThrowsExpectedError(StringTypeError);

        // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
        new State();
    }
);

stateTests.addTest(
    "`constructor` throws ParameterTypeError when second constructor param duration is provided but isNaN",
    () => {
        testRunner.assertThrowsExpectedError(NumberTypeError);

        // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
        new State('foo', '');
    }
);

stateTests.addTest(
    "has property `name`",
    () => {
        const state = new State('foo');
        const actual = state.name;
        const expected = 'foo';
        testRunner.assertStrictlyEquals(expected, actual);
    }
);

stateTests.addTest(
    "has property `duration`",
    () => {
        const state = new State('foo', 5);
        const actual = state.duration;
        const expected = 5;
        testRunner.assertStrictlyEquals(expected, actual);
    }
);

stateTests.addTest(
    "has property `progress`",
    () => {
        const state = new State('foo', 2);
        const actual = state.progress;
        const expected = 0;
        testRunner.assertStrictlyEquals(expected, actual);
    }
);

stateTests.addTest(
    "has property `canLoop`",
    () => {
        const state = new State('foo', 1, true);
        const actual = state.canLoop;
        const expected = true;
        testRunner.assertStrictlyEquals(expected, actual);
    }
);

stateTests.addTest(
    "throws TypeError when attempted to set name of existing state",
    () => {
        const state = new State('foo');

        testRunner.assertThrowsExpectedError(TypeError);

        // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
        state.name = 'bar';
    }
);

stateTests.addTest(
    "has method `hasIntent`",
    () => {
        const state = new State('foo');
        testRunner.assertStrictlyEquals(true, Utils.isFunction(state.hasIntent));
    }
);

stateTests.addTest(
    "`hasIntent` throws InvalidIntentError",
    () => {
        const state = new State('foo');
        const invalidIntent = 0;

        testRunner.assertThrowsExpectedError(InvalidIntentError)

        // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
        state.hasIntent(invalidIntent);
    }
);

stateTests.addTest(
    "has method `addIntent`",
    () => {
        const state = new State('foo');
        testRunner.assertStrictlyEquals(true, Utils.isFunction(state.addIntent));
    }
);

stateTests.addTest(
    "`addIntent` throws invalidIntentError",
    () => {
        const state = new State('foo');
        const invalidIntent = 0;
        const conditionals = {
            min1: 0,
            max1: 0,
            min2: 0,
            max2: 0,
        };

        testRunner.assertThrowsExpectedError(InvalidIntentError);

        // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
        state.addIntent(invalidIntent, conditionals);
    }
);

stateTests.addTest(
    "`addIntent` throws DuplicateIntentError",
    () => {
        const state = new State('foo');
        const nextState = new State('bar');
        const firstIntent = new Intent('foo');
        const conditionals = {
            min1: 0,
            max1: 0,
            min2: 0,
            max2: 0,
        };

        state.addIntent(firstIntent, nextState, conditionals);

        testRunner.assertThrowsExpectedError(DuplicateIntentError);

        const duplicateIntent = new Intent('foo');
        state.addIntent(duplicateIntent, nextState, conditionals);
    }
);

stateTests.addTest(
    "`addIntent` throws InvalidStateError",
    () => {
        const state = new State('foo');
        const intent = new Intent('foo');
        const invalidState = {};

        testRunner.assertThrowsExpectedError(InvalidStateError);

        // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
        state.addIntent(intent, invalidState, {});
    }
);

stateTests.addTest(
    "has method `on`",
    () => {
        const state = new State('foo');
        testRunner.assertStrictlyEquals(true, Utils.isFunction(state.on));
    }
);

stateTests.addTest(
    "`on` throws InvalidIntentError",
    () => {
        const state = new State('foo');
        const invalidIntent = 0;

        testRunner.assertThrowsExpectedError(InvalidIntentError)

        // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
        state.on(invalidIntent);
    }
);

stateTests.addTest(
    "`on` throws UnknownIntentError",
    () => {
        // Given an intent and a state whose parameters do not contain support for that intent
        const intent = new Intent('foo');
        const state = new State('foo');

        // Then UnknownIntentError is thrown
        testRunner.assertThrowsExpectedError(UnknownIntentError)

        // When that intent is imposed on the state
        state.on(intent);
    }
);

stateTests.addTest(
    "`on` returns next state and conditionals",
    () => {
        // Given initial state that has an intent for a next state
        const intent = new Intent('foo');

        const nextState = new State('jabbing');

        const conditionals = {};
        const initialState = new State('swinging');
        initialState.addIntent(intent, nextState, conditionals);

        // When that intent is imposed on the current (initial) state
        const actual = initialState.on(intent);

        // Then we receive both the next state and its conditionals
        const expected = {
            next: nextState,
            conditionals: {},
        };

        testRunner.assertDeepCompareObjects(expected, actual);
    }
);

stateTests.addTest(
    "has method `updateProgress`",
    () => {
        const state = new State('foo');
        testRunner.assertStrictlyEquals(true, Utils.isFunction(state.updateProgress));
    }
);

stateTests.addTest(
    "`updateProgress` throws NumberTypeError",
    () => {
        const state = new State('foo', 1);

        testRunner.assertThrowsExpectedError(NumberTypeError);

        // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
        state.updateProgress('');
    }
);

stateTests.addTest(
    "`updateProgress` updates internal state progression relative to delta time and state duration",
    () => {
        const state = new State('foo', 3);
        state.updateProgress(1.5);

        const actual = state.progress;
        const expected = 0.5;

        testRunner.assertStrictlyEquals(expected, actual);
    }
);
stateTests.addTest(
    "`updateProgress` cannot exceed progress past 1 with long elapsed time if state can loop",
    () => {
        const state = new State("foo", 2, true);

        state.updateProgress(5);
        const actual = state.progress;
        
        const expected = 0.5;
        testRunner.assertStrictlyEquals(expected, actual);
    }
);
stateTests.addTest(
    "has method `exit`",
    () => {
        const state = new State('foo');
        testRunner.assertStrictlyEquals(true, Utils.isFunction(state.exit));
    }
);

// stateTests.addTest(
//     "something something wtf happens when a state with finite duration reaches the end of that duration?",
//     () => {

//     }
// );

testRunner.run();
