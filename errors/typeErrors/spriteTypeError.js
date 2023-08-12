import { Sprite } from "../../components/sprite.js";
import { ParamTypeError } from "./paramTypeError.js";

export class SpriteTypeError extends ParamTypeError {
  constructor(sprite) {
    super("sprite", Sprite, sprite);
    this.name = "SpriteTypeError";
  }
}