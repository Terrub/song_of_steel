import Drawable from "./drawable.js";

//@ts-check
export default class Rectangle extends Drawable{
    /**
     * @param {Number} x
     * @param {Number} y
     * @param {Number} width
     * @param {Number} height
     * @param {String|CanvasGradient|CanvasPattern} color
     */
    constructor(x, y, width, height, color) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    get type() {
        return Drawable.RECTANGLE;
    }
}