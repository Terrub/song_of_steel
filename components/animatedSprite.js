import { Utils } from "../utils.js";
import { Sprite } from "./sprite.js";
import { SpriteTypeError } from "../errors/typeErrors/spriteTypeError.js";

export class AnimatedSprite {
  #sprite;
  #ticsPerFrame;
  #loop;
  #numTicsDrawn = 0;

  constructor(
    sprite,
    framesMax,
    ticsPerFrame,
    loop = true,
    callWhenDone = undefined
  ) {
    this.sprite = sprite;
    this.framesMax = framesMax;
    this.#ticsPerFrame = ticsPerFrame;
    this.#loop = loop;
    if (Utils.isDefined(callWhenDone) && !Utils.isFunction(callWhenDone)) {
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

  reset() {
    if (this.#loop) {
      console.warn("Why are we trying to reset a looping sprite?!?");
      return;
    }

    this.#numTicsDrawn = 0;
  }

  draw(renderer, position, ticsElapsed) {
    let frameNumber;
    if (this.#loop) {
      frameNumber =
        Math.floor(ticsElapsed / this.#ticsPerFrame) % this.framesMax;
    } else {
      frameNumber = Math.floor(this.#numTicsDrawn / this.#ticsPerFrame);
      if (frameNumber + 1 < this.framesMax) {
        this.#numTicsDrawn += 1;
      } else {
        this.callWhenDone();
      }
    }

    this.#sprite.frameOffset.x = frameNumber * this.#sprite.frameDimensions.x;
    this.#sprite.frameOffset.y = 0;
    this.#sprite.draw(renderer, position);
  }
}
