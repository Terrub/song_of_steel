import { AnimationFrame } from "./animationFrame.js";
import { Lerp } from "./lerp.js";

export class StickAnimation {
  #frames;
  #totalTicLength;

  constructor() {
    this.#frames = [];
    this.#totalTicLength = 0;
  }

  getFrameLength() {
    return this.#totalTicLength;
  }

  setFrameAt(index, frame) {
    // TODO Add more sanity checks to StickAnimation.setFrameAt. It is sensative to errors.
    this.#frames[index] = frame;
    this.#totalTicLength += frame.lengthInTics;
  }

  resolve(/** @type {Number} */ numTics, boneVectors) {
    // TODO Resolve is calc'd every tic, should only calc when frames change.
    //      If we bake in the relation between current relative tic and associated frames we have
    //      a simple look up table and don't need to do excess calculations.

    // TODO Resolve does calculations even if we only have one frame.
    //      We could just return the boneVectors in that one frame directly instead.
    let relFrameTic = numTics % this.#totalTicLength;
    /** @type {AnimationFrame} */
    let currentFrame;
    /** @type {AnimationFrame} */
    let nextFrame;

    for (let i = 0; this.#frames.length > i; i += 1) {
      const frame = this.#frames[i];

      // if subtracting current frame's tics would turn out negative, we found the frame we are in
      if (0 > relFrameTic - frame.lengthInTics) {
        currentFrame = frame;
        nextFrame = this.#frames[(i + 1) % this.#frames.length];
        break;
      }

      // Subtract number of tics of this frame as we've passed it already
      relFrameTic -= frame.lengthInTics;
    }

    const dt = relFrameTic / nextFrame.lengthInTics;
    for (const boneName in boneVectors) {
      if (!(boneName in currentFrame.bonesVectors)) {
        continue;
      }

      const boneN0 = currentFrame.bonesVectors[boneName];
      const boneN1 = nextFrame.bonesVectors[boneName];

      const newX = Lerp.calc(boneN0.x, boneN1.x, Lerp.smootheStep(dt));
      const newY = Lerp.calc(boneN0.y, boneN1.y, Lerp.smootheStep(dt));

      boneVectors[boneName].x += newX;
      boneVectors[boneName].y += newY;
    }
  }
}
