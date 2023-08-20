import { Sprite } from "../../components/sprite.js";
import { ParamTypeError } from "./paramTypeError.js";

export class SpriteTypeError extends ParamTypeError {
  constructor(paramName, sprite) {
    super(paramName, Sprite, sprite);
    this.name = "SpriteTypeError";
  }
}
