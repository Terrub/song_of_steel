// TODO Check if AnimationFrame class should still exist

import { NumberTypeError } from "../errors/typeErrors/numberTypeError.js";
import { ParamTypeError } from "../errors/typeErrors/paramTypeError.js";
import { Utils } from "../utils.js";

// TODO Add tests for AnimationFrame?
export class AnimationFrame {
  lengthInTics;
  bonesVectors;

  constructor(lengthInTics, boneTransformations = {}) {
    if (!Utils.isNumber(lengthInTics)) {
      throw new NumberTypeError('lengthInTics', lengthInTics);
    }

    if (Utils.isDefined(boneTransformations) && !Utils.isObject(boneTransformations)) {
      throw new ParamTypeError('boneTransformations', Object, boneTransformations);
    }

    this.lengthInTics = lengthInTics;
    this.bonesVectors = boneTransformations;
  }
}