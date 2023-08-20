// @ts-check
import { Utils } from "../utils.js";
import { Sprite } from "./sprite.js";
import { SpriteTypeError } from "../errors/typeErrors/spriteTypeError.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { Vector } from "./vector.js";

export class AnimatedSprite {
  /** @type {Sprite} */
  #sprite;
  /** @type {number} */
  #ticsPerFrame;
  /** @type {boolean} */
  #loop;
  /** @type {number} */
  #numTicsDrawn;

  /**
   * @callback callWhenDone
   */

  /**
   * @param {Sprite} sprite
   * @param {number} framesMax
   * @param {number} ticsPerFrame
   * @param {boolean} loop
   * @param {?callWhenDone} callWhenDone
   */
  constructor(
    sprite,
    framesMax,
    ticsPerFrame,
    loop = true,
    callWhenDone = null
  ) {
    this.sprite = sprite;
    this.framesMax = framesMax;
    this.#ticsPerFrame = ticsPerFrame;
    this.#loop = loop;
    this.#numTicsDrawn = 0;

    if (callWhenDone && !Utils.isFunction(callWhenDone)) {
      // TODO Create specific error for when callback is declared but not a function
      throw new TypeError(
        "callWhenDone should be a callback function if declared"
      );
    }
    this.callWhenDone = callWhenDone;
  }

  get sprite() {
    return this.#sprite;
  }

  set sprite(sprite) {
    if (!Utils.isInstanceOf(Sprite, sprite)) {
      throw new SpriteTypeError("sprite", sprite);
    }

    this.#sprite = sprite;
  }

  /**
   * @returns {void}
   */
  reset() {
    if (this.#loop) {
      console.warn("Why are we trying to reset a looping sprite?!?");
      return;
    }

    this.#numTicsDrawn = 0;
  }

  /**
   * @param {CanvasRenderer} renderer
   * @param {Vector} position
   * @param {number} ticsElapsed
   * @returns {void}
   */
  draw(renderer, position, ticsElapsed) {
    let frameNumber;
    if (this.#loop) {
      frameNumber =
        Math.floor(ticsElapsed / this.#ticsPerFrame) % this.framesMax;
    } else {
      frameNumber = Math.floor(this.#numTicsDrawn / this.#ticsPerFrame);
      if (frameNumber + 1 < this.framesMax) {
        this.#numTicsDrawn += 1;
      } else if (this.callWhenDone) {
        this.callWhenDone();
      }
    }

    this.#sprite.frameOffset.x = frameNumber * this.#sprite.frameDimensions.x;
    this.#sprite.frameOffset.y = 0;
    this.#sprite.draw(renderer, position);
  }
}
