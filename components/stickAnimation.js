import { Lerp } from "./lerp.js";

export class StickAnimation {
  frames = [];
  bones;

  constructor(bones) {
    this.bones = bones;
  }

  setFrameAt(index, frame) {
    this.frames[index] = frame;

    this.totalTicLength = this.frames.reduce((sum, frame) => {
      return sum + frame.lengthInTics;
    }, 0);
  }

  resolve(numTics) {
    let foo = numTics % this.totalTicLength;
    let activeFrameId = 0;

    for (let i = 0; this.frames.length > i; i += 1) {
      const frame = this.frames[i];
      if (0 > foo - frame.lengthInTics) {
        activeFrameId = i;
        break;
      }
      foo -= frame.lengthInTics;
    }
    const currentFrame = this.frames[activeFrameId];
    const nextFrame = this.frames[(activeFrameId + 1) % this.frames.length];

    const dt = foo / nextFrame.lengthInTics;
    for (const boneName in this.bones) {
      const boneN0 = currentFrame.bones[boneName];
      const boneN1 = nextFrame.bones[boneName];

      const newX = Lerp.calc(boneN0.x, boneN1.x, Lerp.linear(dt));
      const newY = Lerp.calc(boneN0.y, boneN1.y, Lerp.linear(dt));

      this.bones[boneName].point.x = newX;
      this.bones[boneName].point.y = newY;
    }
  }
}
