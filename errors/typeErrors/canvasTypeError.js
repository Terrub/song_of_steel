import { ParamTypeError } from "./paramTypeError.js";

export class CanvasTypeError extends ParamTypeError {
  constructor(paramName, value) {
    super(paramName, HTMLCanvasElement, value);
    this.name = "CanvasTypeError";
  }
}
