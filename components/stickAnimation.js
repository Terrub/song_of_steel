// @ts-check
import { AnimationFrame } from "./animationFrame.js";
import { Lerp } from "./lerp.js";
import { Vector } from "./vector.js";

export class StickAnimation {
  /** @type {AnimationFrame[]} */
  #frames;
  /** @type {number} */
  #totalTicLength;
  /** @type {number} */
  #relFrameTic;
  /** @type {?AnimationFrame} */
  #currentFrame;
  /** @type {?AnimationFrame} */
  #nextFrame;

  constructor() {
    this.#frames = [];
    this.#totalTicLength = 0;
    this.#relFrameTic = 0;
    this.#currentFrame = null;
    this.#nextFrame = null;
  }

  /**
   * @returns {number}
   */
  getFrameLength() {
    return this.#totalTicLength;
  }

  /**
   * @param {number} index
   * @param {AnimationFrame} frame
   */
  setFrameAt(index, frame) {
    // TODO Add more sanity checks to StickAnimation.setFrameAt. It is sensative to errors.
    this.#frames[index] = frame;
    this.#totalTicLength += frame.lengthInTics;
  }

  /**
   * @param {number} numTics
   * @param {Object.<string, Vector>} boneVectors
   * @returns {void}
   */
  resolve(numTics, boneVectors) {
    // TODO Resolve is calc'd every tic, should only calc when frames change.
    //      If we bake in the relation between current relative tic and associated frames we have
    //      a simple look up table and don't need to do excess calculations.

    // TODO Resolve does calculations even if we only have one frame.
    //      We could just return the boneVectors in that one frame directly instead.
    this.#relFrameTic = numTics % this.#totalTicLength;
    this.#calcFrames();

    if (!this.#currentFrame) {
      // TODO Add specific error for when currentFrame is null
      throw new Error("StickAnimation could not resolve currentFrame");
    }

    if (!this.#nextFrame) {
      // TODO Add specific error for when  nextFrame is null
      throw new Error("StickAnimation could not resolve nextFrame");
    }

    const dt = this.#relFrameTic / this.#nextFrame.lengthInTics;
    for (const boneName in boneVectors) {
      if (!(boneName in this.#currentFrame.bonesVectors)) {
        continue;
      }

      const boneN0 = this.#currentFrame.bonesVectors[boneName];
      const boneN1 = this.#nextFrame.bonesVectors[boneName];

      const newX = Lerp.calc(boneN0.x, boneN1.x, Lerp.linear(dt));
      const newY = Lerp.calc(boneN0.y, boneN1.y, Lerp.linear(dt));

      boneVectors[boneName].x += newX;
      boneVectors[boneName].y += newY;
    }
  }

  /**
   * @returns {void}j
   */
  #calcFrames() {
    for (let i = 0; this.#frames.length > i; i += 1) {
      this.#currentFrame = this.#frames[i];

      // if subtracting current frame's tics would turn out negative, we found the frame we are in
      if (0 > this.#relFrameTic - this.#currentFrame.lengthInTics) {
        this.#nextFrame = this.#frames[(i + 1) % this.#frames.length];
        break;
      }

      // Subtract number of tics of this frame as we've passed it already
      this.#relFrameTic -= this.#currentFrame.lengthInTics;
    }
  }
}
