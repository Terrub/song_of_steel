//@ts-check
import Entity from "../components/entity.js";
import StateManager from "../components/stateManager.js";
import Intent from "../components/intent.js";
import State from "../components/state.js";
import DuplicateEntityError from "../errors/fooErrors/duplicateEntityError.js";
import InvalidEntityError from "../errors/fooErrors/invalidEntityError.js";
import InvalidIntentError from "../errors/fooErrors/invalidIntentError.js";
import InvalidStateError from "../errors/fooErrors/invalidStateError.js";
import UnknownEntityError from "../errors/fooErrors/unknownEntityError.js";
import TestBot from "../testBot/testBot.js";
import Utils from "../utils.js";
import NumberTypeError from "../errors/typeErrors/numberTypeError.js";
import NoRegisteredEntitiesError from "../errors/fooErrors/noRegisteredEntitiesError.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const stateManagerTests = testRunner.createSuite("Tests StateManager");

stateManagerTests.addTest(
  "has method `hasEntity`",
  () => {
    const foo = new StateManager();
    testRunner.assertStrictlyEquals(true, Utils.isFunction(foo.hasEntity));
  }
);

stateManagerTests.addTest(
  "`hasEntity` throws invalidEntityError",
  () => {
    const foo = new StateManager();
    const entity = "";

    testRunner.assertThrowsExpectedError(InvalidEntityError);

    // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
    foo.hasEntity(entity);
  }
);

stateManagerTests.addTest(
  "has method `addEntity`",
  () => {
    const foo = new StateManager();
    testRunner.assertStrictlyEquals(true, Utils.isFunction(foo.addEntity));
  }
);

stateManagerTests.addTest(
  "`addEntity` throws InvalidEntityError",
  () => {
    // Given a foo and an invalid entity
    const foo = new StateManager();
    const entity = {};
    const initialState = new State('foo');

    // Then I expect an InvalidEntityError
    testRunner.assertThrowsExpectedError(InvalidEntityError);

    // When I try load it in
    // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
    foo.addEntity(entity, initialState);
  }
);

stateManagerTests.addTest(
  "`addEntity` throws InvalidStateError",
  () => {
    // Given foo, a valid entity and an invalid state
    const foo = new StateManager();
    const entity = new Entity('foo');
    const invalidState = {};

    // Then an InvalidStateError is expected
    testRunner.assertThrowsExpectedError(InvalidStateError);

    // When the entity is added with its invalid initial state
    // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
    foo.addEntity(entity, invalidState);
  }
);

stateManagerTests.addTest(
  "`addEntity` throws DuplicateEntityError",
  () => {
    // Given foo with added original entity
    const foo = new StateManager();
    const originalEntity = new Entity('foo');
    const initialState = new State('foo');

    foo.addEntity(originalEntity, initialState);

    // Then an InvalidEntityError is expected
    testRunner.assertThrowsExpectedError(DuplicateEntityError);

    // When a duplicate entity is added
    const duplicateEntity = new Entity('foo');
    foo.addEntity(duplicateEntity, initialState);
  }
);

stateManagerTests.addTest(
  "`addEntity` works",
  () => {
    // Given a foo and an entity
    const foo = new StateManager();
    const entity = new Entity('foo');
    const initialState = new State('foo');
    const actual = {
      "before adding": false,
      "after adding": false
    };

    actual["before adding"] = foo.hasEntity(entity);

    // When I try load it in
    foo.addEntity(entity, initialState);

    // Then I expect hasEntity to return true
    actual["after adding"] = foo.hasEntity(entity);

    const expected = {
      "before adding": false,
      "after adding": true
    };

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

stateManagerTests.addTest(
  "has method `getEntityState`",
  () => {
    const foo = new StateManager();
    testRunner.assertStrictlyEquals(true, Utils.isFunction(foo.getEntityState));
  }
);

stateManagerTests.addTest(
  "`getEntityState` throws UnknownEntityError",
  () => {
    // Given
    const foo = new StateManager();
    const entity = new Entity('foo');

    // Then I expect an error
    testRunner.assertThrowsExpectedError(UnknownEntityError);

    // When I get this unknown entity's state
    foo.getEntityState(entity);
  }
);

stateManagerTests.addTest(
  "`getEntityState` returns state of known entity",
  () => {
    // Given
    const foo = new StateManager();
    const entity = new Entity('foo');
    const initialState = new State('foo');
    foo.addEntity(entity, initialState);

    // When I get the entity state
    const actual = foo.getEntityState(entity);

    // Then I expect the state to be 'idleing'
    const expected = initialState;

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

stateManagerTests.addTest(
  "has method `setEntityIntent`",
  () => {
    const foo = new StateManager();
    testRunner.assertStrictlyEquals(true, Utils.isFunction(foo.setEntityIntent));
  }
);

stateManagerTests.addTest(
  "`setEntityIntent` throws InvalidEntityError",
  () => {
    const foo = new StateManager();
    const invalidEntity = {};
    const intent = new Intent('foo');

    // Then I expect to see InvalidEntityError thrown
    testRunner.assertThrowsExpectedError(InvalidEntityError);

    // When I try and set the intent for that invalid entity
    // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
    foo.setEntityIntent(invalidEntity, intent);
  }
);

stateManagerTests.addTest(
  "`setEntityIntent` throws UnknownEntityError",
  () => {
    const foo = new StateManager();
    const entity = new Entity('foo');
    const intent = new Intent('foo');

    testRunner.assertThrowsExpectedError(UnknownEntityError);

    foo.setEntityIntent(entity, intent);
  }
);

stateManagerTests.addTest(
  "`setEntityIntent` throws InvalidIntentError",
  () => {
    const foo = new StateManager();
    const entity = new Entity('foo');
    const invalidIntent = 0;
    const initialState = new State('foo');
    foo.addEntity(entity, initialState);

    testRunner.assertThrowsExpectedError(InvalidIntentError);

    // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
    foo.setEntityIntent(entity, invalidIntent);
  }
);

stateManagerTests.addTest(
  "something something get state data and check for conditionals",
  () => {
    const foo = new StateManager();
    const entity = new Entity('foo');
    const intent = new Intent('foo');
    const initialState = new State('foo');
    const nextState = new State('bar');
    initialState.addIntent(intent, nextState, {
      min1: 0.3,
      min2: 0.5,
      max2: 0.6,
      max1: 0.8
    });
    foo.addEntity(entity, initialState);

    const entityState = foo.getEntityState(entity);

    const stateData = entityState.on(intent);
    const actual = stateData.conditionals;

    const expected = {
      min1: 0.3,
      min2: 0.5,
      max2: 0.6,
      max1: 0.8
    };

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

stateManagerTests.addTest(
  "something something calc poise meter based on state conditionals complete failure",
  () => {
    /*
      progress = 0.55
      0         0.5       1
      | - - | - | | - | - |
          ^
     */
    // These would be retrieved from the state for a given intent.
    const mockConditionals = {
      min1: 0.3,
      min2: 0.5,
      max2: 0.6,
      max1: 0.8,
    };
    const progress = 0.2;
    const actual = StateManager.calcPoiseLoss(progress, mockConditionals);
    const expected = 1;

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

stateManagerTests.addTest(
  "something something calc poise meter based on state conditionals perfect success",
  () => {
    /*
      progress = 0.55
      0         0.5       1
      | - - | - | | - | - |
                 ^
     */
    // These would be retrieved from the state for a given intent.
    const mockConditionals = {
      min1: 0.3,
      min2: 0.5,
      max2: 0.6,
      max1: 0.8,
    };
    const progress = 0.55;
    const actual = StateManager.calcPoiseLoss(progress, mockConditionals);
    const expected = 0;

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

stateManagerTests.addTest(
  "something something calc poise meter based on state conditionals with early partial success",
  () => {
    /*
      progress = 0.4
      0         0.5       1
      | - - | - | | - | - |
              ^
      Given 0.4 would return 0.5 (halfway between min1 and min2)
      ... but, floating point bullshit: 0.4 would return 0.5000...01
      So lets try 0.42 instead, that should return 0.6 exact so poise loss = 1 - 0.6 = 0.4
     */
    // These would be retrieved from the state for a given intent.
    const mockConditionals = {
      min1: 0.3,
      min2: 0.5,
      max2: 0.6,
      max1: 0.8,
    };
    const progress = 0.42;
    const actual = StateManager.calcPoiseLoss(progress, mockConditionals);
    const expected = 0.4;

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

stateManagerTests.addTest(
  "something something calc poise meter based on state conditionals with late partial success",
  () => {
    /*
      progress = 0.79
      0         0.5       1
      | - - | - | | - | - |
                     ^
      Given 0.79 would return 0.95
      */
    const mockConditionals = {
      min1: 0.3,
      min2: 0.5,
      max2: 0.6,
      max1: 0.8,
    };
    const progress = 0.79;
    const actual = StateManager.calcPoiseLoss(progress, mockConditionals);
    const expected = 0.95;

    testRunner.assertStrictlyEquals(expected, actual);
  }
);

stateManagerTests.addTest(
  "`setEntityIntent` with unknown intent for current state keeps current state",
  () => {
    const foo = new StateManager();
    const entity = new Entity('foo');

    const jabbingIntent = new Intent('jabbing');
    const jabbingRightIntent = new Intent('jabbing-right');

    const nextState = new State('jabbing');
    const swingingState = new State('swinging');
    swingingState.addIntent(jabbingIntent, nextState, {
      min1: 0.3,
      min2: 0.5,
      max2: 0.6,
      max1: 0.8,
    });

    const actual = {
      initialStateName: "",
      newStateName: ""
    };

    foo.addEntity(entity, swingingState);

    const initialState = foo.getEntityState(entity);
    actual.initialStateName = initialState.name;

    // When a new intent is set for an entity which is not known to the current state
    foo.setEntityIntent(entity, jabbingRightIntent);

    // Then getEntityState should return the original state
    const newState = foo.getEntityState(entity);
    actual.newStateName = newState.name;

    const expected = {
      initialStateName: "swinging",
      newStateName: "swinging"
    };

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

stateManagerTests.addTest(
  "`setEntityIntent` with known intent whose conditionals fail, keeps current state",
  () => {
    const foo = new StateManager();
    const entity = new Entity('foo');
    const jabbingIntent = new Intent('jabbing');
    const swingingState = new State('swinging');
    const nextState = new State('jabbing');
    swingingState.addIntent(jabbingIntent, nextState, {
      min1: 0.3,
      min2: 0.5,
      max2: 0.6,
      max1: 0.8,
    });

    const actual = {
      initialStateName: "",
      newStateName: ""
    };

    foo.addEntity(entity, swingingState);

    const initialState = foo.getEntityState(entity);
    actual.initialStateName = initialState.name;

    // When a new intent is set for an entity which is not known to the current state
    foo.setEntityIntent(entity, jabbingIntent);

    // Then getEntityState should return the original state
    const newState = foo.getEntityState(entity);
    actual.newStateName = newState.name;

    const expected = {
      initialStateName: "swinging",
      newStateName: "swinging"
    };

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

stateManagerTests.addTest(
  "`setEntityIntent` with valid intent for current state sets entity state to next state",
  () => {
    const foo = new StateManager();
    const entity = new Entity('foo');
    const jabbingIntent = new Intent('jabbing');
    const swingingState = new State('swinging', 1);
    const nextState = new State('jabbing', 1);
    swingingState.addIntent(jabbingIntent, nextState, {
      min1: 0.3,
      min2: 0.5,
      max2: 0.6,
      max1: 0.8,
    });

    const actual = {
      initialStateName: "",
      newStateName: ""
    };

    foo.addEntity(entity, swingingState);

    const initialState = foo.getEntityState(entity);
    actual.initialStateName = initialState.name;

    initialState.updateProgress(0.55);

    // When a new intent is set for an entity
    foo.setEntityIntent(entity, jabbingIntent);

    // Then getEntityState should return the state associated with the new Intent
    const newState = foo.getEntityState(entity);
    actual.newStateName = newState.name;

    const expected = {
      initialStateName: "swinging",
      newStateName: "jabbing"
    };

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

stateManagerTests.addTest(
  "something something state should be reset when exited",
  () => {
    const foo = new StateManager();
    const entity = new Entity('fooEntity');
    const intent = new Intent('fooIntent');
    const state = new State('fooState', 1);
    const nextState = new State('barState');
    
    foo.addEntity(entity, state);
    state.addIntent(intent, nextState, {
      min1: 0,
      min2: 0.4,
      max2: 0.6,
      max1: 1
    });
    
    const actual = {
      progress: {
        before: -1,
        after: -1,
      }
    }

    state.updateProgress(0.5);

    actual.progress.before = state.progress;

    foo.setEntityIntent(entity, intent);

    actual.progress.after = state.progress;

    const expected = {
      progress: {
        before: 0.5,
        after: 0,
      },
    };

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

stateManagerTests.addTest(
  "has method `update`",
  () => {
    const stateManager = new StateManager();
    testRunner.assertStrictlyEquals(true, Utils.isFunction(stateManager.update));
  }
);

stateManagerTests.addTest(
  "`update` throws NumberTypeError",
  () => {
    // Given a stateManager
    const stateManager = new StateManager();

    // Then a NumberTypeError should be thrown
    testRunner.assertThrowsExpectedError(NumberTypeError);
    
    // When `update` is called without a deltaTime
    // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
    stateManager.update();

  }
);

stateManagerTests.addTest(
  "`update` throws NoRegisteredEntitiesError",
  () => {
    // Given a stateManager without any registered entities
    const stateManager = new StateManager();

    // Then a NoRegisteredEntitiesError should be thrown
    testRunner.assertThrowsExpectedError(NoRegisteredEntitiesError);
    
    // When `update` is called
    stateManager.update(0.016);
  }
);

stateManagerTests.addTest(
  "`update` updates current State progress based on provided elapsed time",
  () => {
    const stateManager = new StateManager();
    const currentState = new State('foo', 1);
    stateManager.addEntity(new Entity('foo'), currentState);

    const actual = {
      before: 0,
      after: 0
    };

    currentState.updateProgress(0.4);

    actual.before = currentState.progress;

    stateManager.update(0.1);

    actual.after = currentState.progress;
    
    const expected = {
      before: 0.4,
      after: 0.5
    };

    testRunner.assertDeepCompareObjects(expected, actual);
  }
);

stateManagerTests.addTest(
  "has method `setEntityState`",
  () => {
    const sm = new StateManager();
    testRunner.assertStrictlyEquals(true, Utils.isFunction(sm.setEntityState));
  }
);

stateManagerTests.addTest(
  "`setEntityState` throws InvalidEntityError",
  () => {
    const foo = new StateManager();
    const invalidEntity = {};
    const state = new State('foo');

    // Then I expect to see InvalidEntityError thrown
    testRunner.assertThrowsExpectedError(InvalidEntityError);

    // When I try and set the state for that invalid entity
    // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
    foo.setEntityState(invalidEntity, state);
  }
);

stateManagerTests.addTest(
  "`setEntityState` throws UnknownEntityError",
  () => {
    const foo = new StateManager();
    const entity = new Entity('foo');
    const state = new State('foo');

    testRunner.assertThrowsExpectedError(UnknownEntityError);

    foo.setEntityState(entity, state);
  }
);

stateManagerTests.addTest(
  "`setEntityState` throws InvalidStateError",
  () => {
    const foo = new StateManager();
    const entity = new Entity('foo');
    const initialState = new State('foo');
    foo.addEntity(entity, initialState);
    
    testRunner.assertThrowsExpectedError(InvalidStateError);
    
    const invalidState = {};
    // @ts-ignore TS knows this is wrong but JS will 'certaintly try'
    foo.setEntityState(entity, invalidState);
  }
);

// stateManagerTests.addTest(
//   "something something updating state pushing progress over duration, exits state?",
//   () => {

//   }
// );

// stateManagerTests.addTest(
//   "something something state should be allowed to setup when entered",
//   () => {

//   }
// );

testRunner.run();
