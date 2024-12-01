import Drawable from "./drawable.js";

//@ts-check
export default class DrawText extends Drawable{
    /**
     * @param {String} text
     * @param {Number} x
     * @param {Number} y
     * @param {String|CanvasGradient|CanvasPattern} color
     * @param {?FontFace} font
     */
    constructor(text, x, y, color, font = null) {
        super();

        this.text = text;
        this.x = x;
        this.y = y;
        this.color = color;
        this.font = font;
    }

    get type() {
        return Drawable.TEXT;
    }
}