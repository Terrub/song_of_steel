//@ts-check
import AnimatedSprite from "../../components/animatedSprite.js";
import ParamTypeError from "./paramTypeError.js";

export default class AnimatedSpriteTypeError extends ParamTypeError {
  /**
   * @param {*} sprite
   */
  constructor(sprite) {
    super("AnimatedSprite", AnimatedSprite, sprite);
    this.name = "AnimatedSpriteTypeError";
  }
}
