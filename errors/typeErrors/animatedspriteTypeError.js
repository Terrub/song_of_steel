import { AnimatedSprite } from "../../components/animatedSprite.js";
import { ParamTypeError } from "./paramTypeError.js";

export class AnimatedSpriteTypeError extends ParamTypeError {
  constructor(sprite) {
    super("AnimatedSprite", AnimatedSprite, sprite);
    this.name = "AnimatedSpriteTypeError";
  }
}
