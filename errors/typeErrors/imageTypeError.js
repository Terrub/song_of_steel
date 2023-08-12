import { ParamTypeError } from "./paramTypeError.js";

export class ImageTypeError extends ParamTypeError {
  constructor(paramName, value) {
    super(paramName, Image, value);
    this.name = "ImageTypeError";
  }
}
