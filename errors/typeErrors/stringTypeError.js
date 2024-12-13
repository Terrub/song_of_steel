//@ts-check
import ParamTypeError from "./paramTypeError.js";

export default class StringTypeError extends ParamTypeError {
  /**
   * @param {string} paramName
   * @param {*} value
   */
  constructor(paramName, value) {
    super(paramName, String, value);
    this.name = "StringTypeError";
  }
}
