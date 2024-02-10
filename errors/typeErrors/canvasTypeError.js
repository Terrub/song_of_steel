//@ts-check
import ParamTypeError from "./paramTypeError.js";

export default class CanvasTypeError extends ParamTypeError {
  /**
   * @param {String} paramName
   * @param {*} value
   */
  constructor(paramName, value) {
    super(paramName, HTMLCanvasElement, value);
    this.name = "CanvasTypeError";
  }
}
