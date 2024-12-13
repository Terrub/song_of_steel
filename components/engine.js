//@ts-check
import Drawable from "./drawable.js";
import Rectangle from "./rectangle.js";
import Vector from "./vector.js";

export default class Engine {
    /**
     * @returns {Array.<Drawable>}
     */
    static getDrawables() {
        return [];
    }

    /**
     * @param {Vector} origin Starting point vector of object
     * @param {Vector} velocity velocity
     * @param {Rectangle} target Rectangle to calculate collision against
     * @param {Vector} vecNear Reference for nearest Contact Point
     * @param {Vector} vecNormal Reference for normal vector
     * @returns {Number}
     */
    static rayVsRect(origin, velocity, target, vecNear, vecNormal) {
        // const xDir = (velocity.x - origin.x);
        // const yDir = (velocity.y - origin.y);
        const xDir = velocity.x;
        const yDir = velocity.y;

        // Early exit, cannot move into things if not moving (? I think)
        if (xDir === 0 && yDir === 0) {
            return 0;
        }

        let xTnear = (target.x - origin.x) / xDir;
        let yTnear = (target.y - origin.y) / yDir;
        let xTfar = (target.x + target.width - origin.x) / xDir;
        let yTfar = (target.y + target.height - origin.y) / yDir;

        if (xTnear > xTfar) {
            const tmp = xTfar;
            xTfar = xTnear;
            xTnear = tmp;
        }
        if (yTnear > yTfar) {
            const tmp = yTfar;
            yTfar = yTnear;
            yTnear = tmp;
        }

        if (xTnear > yTfar || yTnear > xTfar) {
            return 0;
        }

        const tHitNear = Math.max(xTnear, yTnear);
        const tHitFar = Math.min(xTfar, yTfar);

        vecNear.x = origin.x + xDir * tHitNear;
        vecNear.y = origin.y + yDir * tHitNear;
        vecNormal.x = origin.x + xDir * tHitFar;
        vecNormal.y = origin.y + yDir * tHitFar;

        if (xTnear > yTnear) {
            if (xDir < 0) {
                vecNormal.x = 1;
                vecNormal.y = 0;
            } else {
                vecNormal.x = -1;
                vecNormal.y = 0;
            }
        } else if (xTnear < yTnear) {
            if (yDir < 0) {
                vecNormal.x = 0
                vecNormal.y = 1;
            } else {
                vecNormal.x = 0
                vecNormal.y = -1;
            }
        }

        return tHitNear;
    }

    /**
     * Collision detection between mobile object with velocity vs target statis object
     * 
     * @param {Rectangle} object Mobile (dynamic) object (Like player or NPC)
     * @param {Vector} velocity Current object speed
     * @param {Rectangle} obstacle Static object against which collision is tested
     * @returns {Void}
     */
    static rectVsRect(object, velocity, obstacle) {
        const xObjOffset = object.width * 0.5;
        const yObjOffset = object.height * 0.5;
        const origin = new Vector(object.x + xObjOffset, object.y + yObjOffset);

        const target = new Rectangle(
            obstacle.x - xObjOffset,
            obstacle.y - yObjOffset,
            obstacle.width + object.width,
            obstacle.height + object.height,
            "rgba(99, 255, 71, 0.5)"
        );

        const vecNear = new Vector(0, 0);
        const vecNormal = new Vector(0, 0);

        // console.log("Checking collisions with velocity:", velocity, "on target:", target);
        const t = Engine.rayVsRect(origin, velocity, target, vecNear, vecNormal);
        console.log(
            t,
            velocity,
            vecNear,
            vecNormal,
            // origin.y,
            // target.y - velocity.y
        );
        if (t > 0 && t <= 1) {
            velocity.x = vecNormal.x * Math.abs(velocity.x) * (1 - t);
            velocity.y = vecNormal.y * Math.abs(velocity.y) * (1 - t);
        }
    }

    /**
     * Calculates the center of a given rectangle and returns that center point as a vector.
     * @param {Rectangle} rectangle
     * @returns {Vector}
     */
    static getRectangleCenter(rectangle) {
        return new Vector(
            rectangle.x + (rectangle.width * 0.5),
            rectangle.y + (rectangle.height * 0.5)
        );
    }

    /**
     * Calculates direction (normalised) between two points
     * @param {Vector} vecStart
     * @param {Vector} vecEnd
     * @returns {Vector}
     */
    static getDirectionNormal(vecStart, vecEnd) {
        // I may want to optimise this in the future but for now lets just use the Vector class we already wrote.
        return Vector.normalise(Vector.subtract(vecEnd, vecStart));
    }

    /**
     * @param {Rectangle} mob Mobile Object
     * @param {Vector} velocity Mob Velocity reference to be adjusted to resolve collision
     * @param {Rectangle} sob Static Object
     * @returns {Void}
     */
    static resolveMobCollision(mob, velocity, sob) {
        const mobCenter = Engine.getRectangleCenter(mob);
        const sobCenter = Engine.getRectangleCenter(sob);

        const direction = Engine.getDirectionNormal(mobCenter, sobCenter);

        if (direction.x > 0
            && (mob.x + mob.width) + velocity.x > sob.x
            && sob.y < (mob.y + mob.height)
            && mob.y < (sob.y + sob.height)
        ) {
            velocity.x = sob.x - (mob.x + mob.width);
        }

        if (direction.x < 0
            && (mob.x + velocity.x) < (sob.x + sob.width)
            && sob.y < (mob.y + mob.height)
            && mob.y < (sob.y + sob.height)
        ) {
            velocity.x = (sob.x + sob.width) - mob.x;
        }

        // Mob moving up. Test mob top edge to sob bottom edge
        // That is if sob left edge is left of mob right edge  #### ####   ####
        // or sob right edge to right of mob left edge          ##     ## ##
        if (direction.y > 0
            && (mob.y + mob.height) + velocity.y > sob.y
            && sob.x < (mob.x + mob.width + velocity.x)
            && mob.x + velocity.x < (sob.x + sob.width)
        ) {
            velocity.y = sob.y - (mob.y + mob.height);
        }

        if (direction.y < 0
            && (mob.y + velocity.y) < (sob.y + sob.height)
            && sob.x < (mob.x + mob.width + velocity.x)
            && mob.x + velocity.x < (sob.x + sob.width)
        ) {
            velocity.y = (sob.y + sob.height) - mob.y;
        }
    }

    /**
     * @param {Rectangle} mob Mobile object (Player, npc, etc.)
     * @param {Vector} velocity Mob Velocity reference to be adjusted to resolve collision
     * @param {Array.<Rectangle>} staticObjects Array with static rectangle objects
     * @returns {Void}
     */
    static resolveCollisions(mob, velocity, staticObjects) {
        // loop over all relevant static objects with provided mob and velocity.
        for (const staticObj of staticObjects) {
            Engine.resolveMobCollision(mob, velocity, staticObj);
        }
    }
}