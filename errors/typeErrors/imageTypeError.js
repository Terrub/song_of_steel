//@ts-check
import ParamTypeError from "./paramTypeError.js";

export default class ImageTypeError extends ParamTypeError {
  /**
   * @param {String} paramName
   * @param {*} value
   */
  constructor(paramName, value) {
    super(paramName, Image, value);
    this.name = "ImageTypeError";
  }
}
