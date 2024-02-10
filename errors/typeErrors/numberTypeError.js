//@ts-check
import ParamTypeError from "./paramTypeError.js";

export default class NumberTypeError extends ParamTypeError {
  /**
   * @param {string} paramName
   * @param {*} value
   */
  constructor(paramName, value) {
    super(paramName, Number, value);
    this.name = "NumberTypeError";
  }
}
