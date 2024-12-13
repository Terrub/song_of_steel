//@ts-check
import Engine from "../components/engine.js";
import Rectangle from "../components/rectangle.js";
import Vector from "../components/vector.js";
import TestBot from "../testBot/testBot.js";
import Utils from "../utils.js";

const resultsContainer = document.createElement("div");
document.body.appendChild(resultsContainer);

const resultRenderer = TestBot.renderResultsInDiv(resultsContainer);
const testRunner = new TestBot(resultRenderer);

const engineTests = testRunner.createSuite("Tests Engine");

engineTests.addTest(
    "has method getDrawables",
    () => {
        testRunner.assertStrictlyEquals(true, Utils.isFunction(Engine.getDrawables));
    }
);

engineTests.addTest(
    "something something return drawables",
    () => {
        const expected = [];
        const actual = Engine.getDrawables();

        testRunner.assertDeepCompareObjects(expected, actual);
    }
);

engineTests.addTest(
    "something something getRectangleCenter",
    () => {
        const actual = {};
        actual["positive-positive"] = Engine.getRectangleCenter(
            new Rectangle(3, 3, 10, 6, "cyan")
        );
        actual["positive-negative"] = Engine.getRectangleCenter(
            new Rectangle(3, 3, -10, -6, "magenta")
        );
        actual["negative-positive"] = Engine.getRectangleCenter(
            new Rectangle(-3, -3, 10, 6, "yellow")
        );
        actual["negative-negative"] = Engine.getRectangleCenter(
            new Rectangle(-3, -3, -10, -6, "black")
        );

        const expected = {
            "positive-positive": new Vector(8, 6),
            "positive-negative": new Vector(-2, 0),
            "negative-positive": new Vector(2, 0),
            "negative-negative": new Vector(-8, -6)
        };

        testRunner.assertDeepCompareObjects(expected, actual);
    }
);

engineTests.addTest(
    "something something getDirectionNormal",
    () => {
        const actual = {};
        actual["up"] = Engine.getDirectionNormal(new Vector(5, 5), new Vector(5, 7));
        actual["right"] = Engine.getDirectionNormal(new Vector(-5, 5), new Vector(7, 5));
        actual["down"] = Engine.getDirectionNormal(new Vector(-5, 7), new Vector(-5, -5));
        actual["left"] = Engine.getDirectionNormal(new Vector(7, 5), new Vector(5, 5));

        const expected = {
            "up": new Vector(0, 1),
            "right": new Vector(1, 0),
            "down": new Vector(0, -1),
            "left": new Vector(-1, 0),
        };
        testRunner.assertDeepCompareObjects(expected, actual);
    }
)

engineTests.addTest(
    "something something mob standing on floor with gravity",
    () => {
        // Remember Origin (0,0) is Top Left, gravity pulling down is a positive Y vector
        // MOb, Mobile Object
        // SObs, Static Objects

        // Given a mob and just a floor object the mob is right ontop of
        const mob = new Rectangle(10, 10, 10, 10, "green");
        const sobs = [new Rectangle(0, 20, 100, 10, "red")];

        // When a downward vector is applied and we resolve for collisions
        const mobVel = new Vector(0, 10);
        Engine.resolveCollisions(mob, mobVel, sobs);

        // Then we should expect the actual displacement vector to be 0
        const expected = new Vector(0, 0);

        testRunner.assertDeepCompareObjects(expected, mobVel);
    }
);

engineTests.addTest(
    "something something mob falling towards a floor object with gravity but not yet hitting it this frame",
    () => {
        // Given a mob and just a floor object the mob is a distance away from
        const mob = new Rectangle(10, 10, 10, 10, "green");
        const sobs = [new Rectangle(0, 30, 100, 10, "red")];

        // When a downward vector is applied and we resolve for collisions
        const mobVel = new Vector(0, 10);
        Engine.resolveCollisions(mob, mobVel, sobs);

        // Then we should expect the actual displacement vector to be the same as the input vector
        // (i.e.: No collisions would happen)
        const expected = new Vector(0, 10);

        testRunner.assertDeepCompareObjects(expected, mobVel);
    }
);

engineTests.addTest(
    "something something mob falling with gravity gets intercepted by floor",
    () => {
        // Given a mob and floor object a set distance away
        const mob = new Rectangle(10, 10, 10, 10, "green");
        const sobs = [new Rectangle(0, 25, 100, 10, "red")];

        // When a greater downward vector is applied than the distance to the floor and we resolve for collisions
        const mobVel = new Vector(0, 10);
        Engine.resolveCollisions(mob, mobVel, sobs);

        // Then we should expect the actual displacement vector to be the distance to the object and hence shorter.
        // (i.e.: Mob collided with floor in between frames)
        const expected = new Vector(0, 5);

        testRunner.assertDeepCompareObjects(expected, mobVel);
    }
);

engineTests.addTest(
    "velocity with only positive y component should ignore objects to far left and right of mob",
    () => {
        // Given a mob and floor object a set distance away
        const mob = new Rectangle(10, 10, 10, 10, "green");
        const sobs = [
            new Rectangle(0, 25, 100, 10, "red"), // Floor, should collide with next frame
            new Rectangle(100, 0, 10, 100, "blue") // Far right wall, no collision should happen
        ];

        // When a greater downward vector is applied than the distance to the floor and we resolve for collisions
        const mobVel = new Vector(0, 10);
        Engine.resolveCollisions(mob, mobVel, sobs);

        // Then we should expect the actual displacement vector to be the distance to the object and hence shorter.
        // (i.e.: Mob collided with floor in between frames)
        const expected = new Vector(0, 5);

        testRunner.assertDeepCompareObjects(expected, mobVel);
    }
);

testRunner.run();
