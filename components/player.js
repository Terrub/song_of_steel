//@ts-check
import CanvasRenderer from "./canvasRenderer.js";
import Vector from "./vector.js";

export default class Player {
  /** @type {Vector} */
  velocity;
  /** @type {boolean} */
  debug;

  /**
   * @param {Vector} velocity
   */
  constructor(velocity) {
    this.velocity = velocity;
    this.debug = false;
  }

  load() {}

  /**
   * @param {CanvasRenderer} renderer
   * @param {Vector} position
   * @param {number} framesElapsed
   * @param {number} floorHeight
   */
  draw(renderer, position, framesElapsed, floorHeight) {}

  attackLeft() {}

  attackRight() {}
}
