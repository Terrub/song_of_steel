import { ParamTypeError } from "./paramTypeError.js";

export class NumberTypeError extends ParamTypeError {
  constructor(paramName, value) {
    super(paramName, Number, value);
    this.name = "NumberTypeError";
  }
}
