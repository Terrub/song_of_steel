//@ts-check
import Sprite from "../../components/sprite.js";
import ParamTypeError from "./paramTypeError.js";

export default class SpriteTypeError extends ParamTypeError {
  /**
   * @param {String} paramName
   * @param {*} sprite
   */
  constructor(paramName, sprite) {
    super(paramName, Sprite, sprite);
    this.name = "SpriteTypeError";
  }
}
