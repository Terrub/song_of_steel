import { ParamTypeError } from "./paramTypeError.js";
import { Vector } from "../../components/vector.js";

export class VectorTypeError extends ParamTypeError {
  constructor(paramName, position) {
    super(paramName, Vector, position);
    this.name = "VectorTypeError";
  }
}
