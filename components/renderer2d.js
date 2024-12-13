import ParamTypeError from "../errors/typeErrors/paramTypeError.js";
import Utils from "../utils.js";
import Drawable from "./drawable.js";
import Line from "./line.js";
import Rectangle from "./rectangle.js";

//@ts-check
export default class Renderer2d {
  /**
   * Draws the provided array of drawables onto the provided Canvas Rendering Context (2D)
   * @param {CanvasRenderingContext2D} gLib
   * @param {Array.<Drawable>} drawables
   */
  static render(gLib, cameraPos, drawables) {
    if (!drawables.length || drawables.length <= 0) {
      // TODO: create custom error for attempt to render empty array
      throw new Error("Drawables is empty");
    }

    gLib.reset();
    // TODO: Consider using: gLib.clearRect(0,0,9999,9999); for optimisations

    gLib.translate(-cameraPos.x, -cameraPos.y);

    for (const drawable of drawables) {
      if (!Utils.isInstanceOf(Drawable, drawable)) {
        throw new ParamTypeError('drawables', Drawable, drawable);
      }

      // TODO: Consider using a map to map type to render method?
      if (drawable.type === Drawable.RECTANGLE) {
        Renderer2d.#drawRect(gLib, drawable);
      } else if (drawable.type === Drawable.LINE) {
        Renderer2d.#drawLine(gLib, drawable)
      } else if (drawable.type === Drawable.TEXT) {
        Renderer2d.#drawText(gLib, drawable);
      } else {
        console.error(`No render support for type: ${drawable.type}`);
      }
    }
  }

  // /** @type {HTMLCanvasElement} */
  // canvas;
  // /** @type {CanvasRenderingContext2D} */
  // gLib;

  // /**
  //  * @param {HTMLCanvasElement} canvas
  //  */
  // constructor(canvas) {
  //   if (!Utils.isInstanceOf(HTMLCanvasElement, canvas)) {
  //     throw new CanvasTypeError("canvas", canvas);
  //   }

  //   this.canvas = canvas;
  //   const gLib = canvas.getContext("2d");

  //   if (!gLib) {
  //     throw new Error("Something went wrong getting 2d context");
  //   }

  //   this.gLib = gLib;
  // }

  // /**
  //  * @returns {Number}
  //  */
  // get width() {
  //   return this.canvas.width;
  // }

  // /**
  //  * @returns {Number}
  //  */
  // get height() {
  //   return this.canvas.height;
  // }

  // save() {
  //   this.gLib.save();
  // }

  // restore() {
  //   this.gLib.restore();
  // }

  // reset() {
  //   this.gLib.reset();
  // }

  // /**
  //  * @param {Number} value
  //  */
  // rotate(value) {
  //   this.gLib.rotate(value);
  // }

  // /**
  //  * @param {Number} x
  //  * @param {Number} y
  //  */
  // translate(x, y) {
  //   this.gLib.translate(x, -y);
  // }

  // /**
  //  * @param {Number} x
  //  * @param {Number} y
  //  * @param {String|CanvasGradient|CanvasPattern} color
  //  */
  // drawPixel(x, y, color) {
  //   this.gLib.fillStyle = color;
  //   this.gLib.fillRect(x, this.height - y, 1, 1);
  // }

  /**
   * @param {CanvasRenderingContext2D} gLib
   * @param {Line} line
   */
  static #drawLine(gLib, line) {
    gLib.lineWidth = line.lineWidth;
    gLib.strokeStyle = line.color;
    gLib.beginPath();
    gLib.moveTo(line.x1, line.y1);
    gLib.lineTo(line.x2, line.y2);
    gLib.stroke();
  }

  // /**
  //  * @param {Number} xS
  //  * @param {Number} yS
  //  * @param {Number} x0
  //  * @param {Number} y0
  //  * @param {Number} x1
  //  * @param {Number} y1
  //  * @param {Number} xE
  //  * @param {Number} yE
  //  * @param {String|CanvasGradient|CanvasPattern} color
  //  * @param {Number} lineWidth
  //  */
  // drawCurve(xS, yS, x0, y0, x1, y1, xE, yE, color, lineWidth = 1) {
  //   this.gLib.lineWidth = lineWidth;
  //   this.gLib.strokeStyle = color;
  //   this.gLib.beginPath();
  //   this.gLib.moveTo(xS, this.height - yS);
  //   this.gLib.bezierCurveTo(
  //     x0,
  //     this.height - y0,
  //     x1,
  //     this.height - y1,
  //     xE,
  //     this.height - yE
  //   );
  //   this.gLib.stroke();
  // }

  /**
   * @param {CanvasRenderingContext2D} gLib
   * @param {Rectangle} rectangle
   */
  static #drawRect(gLib, rectangle) {
    gLib.fillStyle = rectangle.color;
    // if (rectangle.color === "red") {
    //   console.log(rectangle);
    // }
    gLib.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
  }

  // /**
  //  * @param {Number} x
  //  * @param {Number} y
  //  * @param {Number} r
  //  * @param {String|CanvasGradient|CanvasPattern} c
  //  */
  // drawCircle(x, y, r, c) {
  //   this.gLib.fillStyle = c;
  //   this.gLib.beginPath();
  //   this.gLib.arc(x, this.height - y, r, 0, 2 * Math.PI);
  //   this.gLib.fill();
  // }

  // /**
  //  * @param {Number} x
  //  * @param {Number} y
  //  * @param {Number} r
  //  * @param {String|CanvasGradient|CanvasPattern} c
  //  */
  // strokeCircle(x, y, r, c) {
  //   this.gLib.strokeStyle = c;
  //   this.gLib.lineWidth = 1;
  //   this.gLib.beginPath();
  //   this.gLib.arc(x, this.height - y, r, 0, 2 * Math.PI);
  //   this.gLib.stroke();
  // }

  // /**
  //  * @param {Number} x
  //  * @param {Number} y
  //  * @param {Number} w
  //  * @param {Number} h
  //  * @param {String|CanvasGradient|CanvasPattern} color
  //  * @param {Number} strokeWidth
  //  */
  // strokeRect(x, y, w, h, color, strokeWidth = 1) {
  //   this.gLib.beginPath();
  //   this.gLib.lineWidth = strokeWidth;
  //   this.gLib.strokeStyle = color;
  //   this.gLib.strokeRect(x, y, w, h);
  //   // this.gLib.rect(x, y, w, h);
  //   // this.gLib.stroke();
  // }

  // /**
  //  * @param {String|CanvasGradient|CanvasPattern} color
  //  */
  // fill(color) {
  //   this.gLib.fillStyle = color;
  //   this.gLib.fillRect(0, 0, this.width, this.height);
  // }

  // clear() {
  //   this.gLib.clearRect(0, 0, this.width, this.height);
  // }

  // /**
  //  * @param {Number} x
  //  * @param {Number} y
  //  * @param {Number} w
  //  * @param {Number} h
  //  */
  // clearRect(x, y, w, h) {
  //   this.gLib.clearRect(x, this.height - y, w, -h);
  // }

  // /**
  //  * @param {CanvasImageSource} image
  //  * @param {Number} sX
  //  * @param {Number} sY
  //  * @param {Number} sW
  //  * @param {Number} sH
  //  * @param {Number} dX
  //  * @param {Number} dY
  //  * @param {Number} dW
  //  * @param {Number} dH
  //  */
  // drawImage(image, sX, sY, sW, sH, dX, dY, dW, dH) {
  //   this.gLib.drawImage(image, sX, sY, sW, sH, dX, this.height - dY, dW, -dH);
  // }

  // /**
  //  * @param {String} text
  //  * @param {String} font
  //  * @returns {Number}
  //  */
  // measureTextWidth(text, font) {
  //   let oldFont;
  //   let result;

  //   if (Utils.isString(font) && this.gLib.font !== font) {
  //     oldFont = this.gLib.font;

  //     this.gLib.font = font;

  //     result = this.gLib.measureText(text).width;

  //     this.gLib.font = oldFont;
  //   } else {
  //     result = this.gLib.measureText(text).width;
  //   }

  //   return result;
  // }

  /**
   * @param {CanvasRenderingContext2D} gLib
   * @param {DrawText} drawable
   */
  static #drawText(gLib, drawable) {
    if (!Utils.isNull(drawable.font)) {
      // @ts-ignore we check if font is null or not...
      gLib.font = drawable.font;
    }

    if (Utils.isDefined(drawable.color)) {
      gLib.fillStyle = drawable.color;
    }

    gLib.fillText(drawable.text, drawable.x, drawable.y);
  }
}
