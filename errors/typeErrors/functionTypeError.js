import { ParamTypeError } from "./paramTypeError.js";

export class FunctionTypeError extends ParamTypeError {
  constructor(paramName, value) {
    super(paramName, Function, value);
    this.name = "FunctionTypeError";
  }
}
