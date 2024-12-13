import Drawable from "./drawable.js";

//@ts-check
export default class Line extends Drawable{
    /**
     * @param {Number} x1
     * @param {Number} y1
     * @param {Number} x2
     * @param {Number} y2
     * @param {String|CanvasGradient|CanvasPattern} color
     * @param {Number} [lineWidth=1] 
     */
    constructor(x1, y1, x2, y2, color, lineWidth = 1) {
        super();

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
        this.lineWidth = lineWidth;
    }

    get type() {
        return Drawable.LINE;
    }
}