import { CanvasRenderer } from "../../components/canvasRenderer.js";
import { ParamTypeError } from "./paramTypeError.js";

export class CanvasRendererTypeError extends ParamTypeError {
  constructor(paramName, value) {
    super(paramName, CanvasRenderer, value);
    this.name = "CanvasRendererTypeError";
  }
}