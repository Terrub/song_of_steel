import { CanvasTypeError } from "../errors/typeErrors/canvasTypeError.js";
import { Utils } from "../utils.js";

export class CanvasRenderer {
  canvas;

  glib;

  constructor(canvas) {
    if (!Utils.isInstanceOf(HTMLCanvasElement, canvas)) {
      throw new CanvasTypeError("canvas", canvas);
    }

    this.canvas = canvas;
    this.gLib = canvas.getContext("2d");
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  save() {
    this.gLib.save();
  }

  restore() {
    this.gLib.restore();
  }

  rotate(value) {
    this.gLib.rotate(value);
  }

  translate(x, y) {
    this.gLib.translate(x, -y);
  }

  drawPixel(x, y, color) {
    this.gLib.fillStyle = color;
    this.gLib.fillRect(x, this.height - y, 1, 1);
  }

  drawLine(x1, y1, x2, y2, color, lineWidth = 1) {
    this.gLib.lineWidth = lineWidth;
    this.gLib.strokeStyle = color;
    this.gLib.beginPath();
    this.gLib.moveTo(x1, this.height - y1);
    this.gLib.lineTo(x2, this.height - y2);
    this.gLib.stroke();
  }

  drawCurve(xS, yS, x0, y0, x1, y1, xE, yE, color, lineWidth = 1) {
    this.gLib.lineWidth = lineWidth;
    this.gLib.strokeStyle = color;
    this.gLib.beginPath();
    this.gLib.moveTo(xS, this.height - yS);
    this.gLib.bezierCurveTo(x0, this.height - y0, x1, this.height - y1, xE, this.height - yE);
    this.gLib.stroke();
  }

  drawRect(x, y, x2, y2, color) {
    this.gLib.fillStyle = color;
    this.gLib.fillRect(x, this.height - y, x2, -y2);
  }

  strokeRect(x, y, w, h, color, strokeWidth = 1) {
    this.gLib.beginPath();
    this.gLib.lineWidth = strokeWidth;
    this.gLib.strokeStyle = color;
    this.gLib.strokeRect(x, y, w, h);
    // this.gLib.rect(x, y, w, h);
    // this.gLib.stroke();
  }

  fill(color) {
    this.gLib.fillStyle = color;
    this.gLib.fillRect(0, 0, this.width, this.height);
  }

  clear() {
    this.gLib.clearRect(0, 0, this.width, this.height);
  }

  clearRect(x, y, w, h) {
    this.gLib.clearRect(x, this.height - y, w, -h);
  }

  drawImage(image, sX, sY, sW, sH, dX, dY, dW, dH) {
    this.gLib.drawImage(image, sX, sY, sW, sH, dX, this.height - dY, dW, -dH);
  }

  measureTextWidth(text, font) {
    let oldFont;
    let result;

    if (Utils.isString(font) && this.gLib.font !== font) {
      oldFont = gLib.font;

      this.gLib.font = font;

      result = this.gLib.measureText(text).width;

      this.gLib.font = oldFont;
    } else {
      result = this.gLib.measureText(text).width;
    }

    return result;
  }

  text = function (x, y, text, color, font) {
    if (Utils.isDefined(font)) {
      this.gLib.font = font;
    }

    if (Utils.isDefined(color)) {
      this.gLib.fillStyle = color;
    }

    this.gLib.fillText(text, x, this.height - y);
  };
}
