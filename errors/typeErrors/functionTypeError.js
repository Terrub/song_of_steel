//@ts-check
import ParamTypeError from "./paramTypeError.js";

export default class FunctionTypeError extends ParamTypeError {
  /**
   * @param {String} paramName
   * @param {*} value
   */
  constructor(paramName, value) {
    super(paramName, Function, value);
    this.name = "FunctionTypeError";
  }
}
