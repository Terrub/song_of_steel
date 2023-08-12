import { CanvasRenderer } from "../../components/canvasRenderer.js";
import { ParamTypeError } from "./paramTypeError.js";

export class CanvasRendererTypeError extends ParamTypeError {
  constructor(canvasRenderer) {
    super("canvasRenderer", CanvasRenderer, canvasRenderer);
    this.name = "CanvasRendererTypeError";
  }
}