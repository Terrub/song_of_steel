//@ts-check
import CanvasTypeError from "../errors/typeErrors/canvasTypeError.js";
import Utils from "../utils.js";

export default class CanvasRenderer {
  /** @type {HTMLCanvasElement} */
  canvas;
  /** @type {CanvasRenderingContext2D} */
  gLib;

  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    if (!Utils.isInstanceOf(HTMLCanvasElement, canvas)) {
      throw new CanvasTypeError("canvas", canvas);
    }

    this.canvas = canvas;
    const gLib = canvas.getContext("2d");

    if (!gLib) {
      throw new Error("Something went wrong getting 2d context");
    }

    this.gLib = gLib;
  }

  /**
   * @returns {Number}
   */
  get width() {
    return this.canvas.width;
  }

  /**
   * @returns {Number}
   */
  get height() {
    return this.canvas.height;
  }

  save() {
    this.gLib.save();
  }

  restore() {
    this.gLib.restore();
  }

  reset() {
    this.gLib.reset();
  }

  /**
   * @param {Number} value
   */
  rotate(value) {
    this.gLib.rotate(value);
  }

  /**
   * @param {Number} x
   * @param {Number} y
   */
  translate(x, y) {
    this.gLib.translate(x, -y);
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {String|CanvasGradient|CanvasPattern} color
   */
  drawPixel(x, y, color) {
    this.gLib.fillStyle = color;
    this.gLib.fillRect(x, this.height - y, 1, 1);
  }

  /**
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} x2
   * @param {Number} y2
   * @param {String|CanvasGradient|CanvasPattern} color
   * @param {Number} lineWidth
   */
  drawLine(x1, y1, x2, y2, color, lineWidth = 1) {
    this.gLib.lineWidth = lineWidth;
    this.gLib.strokeStyle = color;
    this.gLib.beginPath();
    this.gLib.moveTo(x1, this.height - y1);
    this.gLib.lineTo(x2, this.height - y2);
    this.gLib.stroke();
  }

  /**
   * @param {Number} xS
   * @param {Number} yS
   * @param {Number} x0
   * @param {Number} y0
   * @param {Number} x1
   * @param {Number} y1
   * @param {Number} xE
   * @param {Number} yE
   * @param {String|CanvasGradient|CanvasPattern} color
   * @param {Number} lineWidth
   */
  drawCurve(xS, yS, x0, y0, x1, y1, xE, yE, color, lineWidth = 1) {
    this.gLib.lineWidth = lineWidth;
    this.gLib.strokeStyle = color;
    this.gLib.beginPath();
    this.gLib.moveTo(xS, this.height - yS);
    this.gLib.bezierCurveTo(
      x0,
      this.height - y0,
      x1,
      this.height - y1,
      xE,
      this.height - yE
    );
    this.gLib.stroke();
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} x2
   * @param {Number} y2
   * @param {String|CanvasGradient|CanvasPattern} color
   */
  drawRect(x, y, x2, y2, color) {
    this.gLib.fillStyle = color;
    this.gLib.fillRect(x, this.height - y, x2, -y2);
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} r
   * @param {String|CanvasGradient|CanvasPattern} c
   */
  drawCircle(x, y, r, c) {
    this.gLib.fillStyle = c;
    this.gLib.beginPath();
    this.gLib.arc(x, this.height - y, r, 0, 2 * Math.PI);
    this.gLib.fill();
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} r
   * @param {String|CanvasGradient|CanvasPattern} c
   */
  strokeCircle(x, y, r, c) {
    this.gLib.strokeStyle = c;
    this.gLib.lineWidth = 1;
    this.gLib.beginPath();
    this.gLib.arc(x, this.height - y, r, 0, 2 * Math.PI);
    this.gLib.stroke();
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   * @param {String|CanvasGradient|CanvasPattern} color
   * @param {Number} strokeWidth
   */
  strokeRect(x, y, w, h, color, strokeWidth = 1) {
    this.gLib.beginPath();
    this.gLib.lineWidth = strokeWidth;
    this.gLib.strokeStyle = color;
    this.gLib.strokeRect(x, y, w, h);
    // this.gLib.rect(x, y, w, h);
    // this.gLib.stroke();
  }

  /**
   * @param {String|CanvasGradient|CanvasPattern} color
   */
  fill(color) {
    this.gLib.fillStyle = color;
    this.gLib.fillRect(0, 0, this.width, this.height);
  }

  clear() {
    this.gLib.clearRect(0, 0, this.width, this.height);
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {Number} w
   * @param {Number} h
   */
  clearRect(x, y, w, h) {
    this.gLib.clearRect(x, this.height - y, w, -h);
  }

  /**
   * @param {CanvasImageSource} image
   * @param {Number} sX
   * @param {Number} sY
   * @param {Number} sW
   * @param {Number} sH
   * @param {Number} dX
   * @param {Number} dY
   * @param {Number} dW
   * @param {Number} dH
   */
  drawImage(image, sX, sY, sW, sH, dX, dY, dW, dH) {
    this.gLib.drawImage(image, sX, sY, sW, sH, dX, this.height - dY, dW, -dH);
  }

  /**
   * @param {String} text
   * @param {String} font
   * @returns {Number}
   */
  measureTextWidth(text, font) {
    let oldFont;
    let result;

    if (Utils.isString(font) && this.gLib.font !== font) {
      oldFont = this.gLib.font;

      this.gLib.font = font;

      result = this.gLib.measureText(text).width;

      this.gLib.font = oldFont;
    } else {
      result = this.gLib.measureText(text).width;
    }

    return result;
  }

  /**
   * @param {Number} x
   * @param {Number} y
   * @param {String} text
   * @param {String|CanvasGradient|CanvasPattern} color
   * @param {?String} font
   */
  text(x, y, text, color, font = null) {
    if (!Utils.isNull(font)) {
      // @ts-ignore we check if font is null or not...
      this.gLib.font = font;
    }

    if (Utils.isDefined(color)) {
      this.gLib.fillStyle = color;
    }

    this.gLib.fillText(text, x, this.height - y);
  }
}
