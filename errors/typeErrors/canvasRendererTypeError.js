//@ts-check
import CanvasRenderer from "../../components/canvasRenderer.js";
import ParamTypeError from "./paramTypeError.js";

export default class CanvasRendererTypeError extends ParamTypeError {
  /**
   * @param {String} paramName
   * @param {*} value
   */
  constructor(paramName, value) {
    super(paramName, CanvasRenderer, value);
    this.name = "CanvasRendererTypeError";
  }
}
