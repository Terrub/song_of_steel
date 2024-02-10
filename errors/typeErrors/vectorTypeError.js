//@ts-check
import ParamTypeError from "./paramTypeError.js";
import Vector from "../../components/vector.js";

export default class VectorTypeError extends ParamTypeError {
  /**
   * @param {String} paramName
   * @param {*} position
   */
  constructor(paramName, position) {
    super(paramName, Vector, position);
    this.name = "VectorTypeError";
  }
}
