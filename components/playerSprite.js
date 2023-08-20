// @ts-check
import { AnimatedSpriteTypeError } from "../errors/typeErrors/animatedspriteTypeError.js";
import { VectorTypeError } from "../errors/typeErrors/vectorTypeError.js";
import { Utils } from "../utils.js";
import { AnimatedSprite } from "./animatedSprite.js";
import { CanvasRenderer } from "./canvasRenderer.js";
import { Player } from "./player.js";
import { Vector } from "./vector.js";

export class PlayerSprite extends Player {
  static ATTACK_LEFT = "attack1";
  static ATTACK_RIGHT = "attack2";

  /** @type {Vector} */
  #dimensions;
  /** @type {Vector} */
  #velocity;
  /** @type {Object.<string, AnimatedSprite>} */
  #sprites;
  /** @type {string|undefined} */
  #attacking;
  /** @type {boolean} */
  #isDead = false;
  /** @type {number} */
  #health = 100;

  /**
   * @param {Vector} dimensions
   * @param {Vector} velocity
   * @param {Object.<string, AnimatedSprite>} sprites
   */
  constructor(dimensions, velocity, sprites) {
    super(velocity);
    this.dimensions = dimensions;
    this.velocity = velocity;
    this.#attacking = undefined;

    for (const spriteName in sprites) {
      if (!Utils.isInstanceOf(AnimatedSprite, sprites[spriteName])) {
        throw new AnimatedSpriteTypeError(sprites[spriteName]);
      }
    }
    this.#sprites = sprites;
  }

  get dimensions() {
    return this.#dimensions;
  }

  set dimensions(vector) {
    if (!Utils.isInstanceOf(Vector, vector)) {
      throw new VectorTypeError("dimensions", vector);
    }

    this.#dimensions = vector;
  }

  /**
   * @param {CanvasRenderer} renderer
   * @param {Vector} position
   * @param {number} framesElapsed
   * @param {number} floorHeight
   * @returns {void}
   */
  draw(renderer, position, framesElapsed, floorHeight) {
    let currentSprite = this.#sprites.idle;

    if (this.velocity.x !== 0 && this.velocity.y === 0) {
      currentSprite = this.#sprites.run;
    }

    if (this.velocity.y > 0 && position.y > 0) {
      currentSprite = this.#sprites.jump;
    }

    if (this.velocity.y <= 0 && position.y !== 0) {
      currentSprite = this.#sprites.fall;
    }

    if (this.#attacking === PlayerSprite.ATTACK_LEFT) {
      currentSprite = this.#sprites[PlayerSprite.ATTACK_LEFT];
    }

    if (this.#attacking === PlayerSprite.ATTACK_RIGHT) {
      currentSprite = this.#sprites[PlayerSprite.ATTACK_RIGHT];
    }

    currentSprite.draw(renderer, position, framesElapsed);
  }

  /**
   * @returns {void}
   */
  attackLeft() {
    if (Utils.isDefined(this.#attacking)) {
      return;
    }

    this.#attacking = PlayerSprite.ATTACK_LEFT;
  }

  /**
   * @returns {void}
   */
  attackRight() {
    if (Utils.isDefined(this.#attacking)) {
      return;
    }

    this.#attacking = PlayerSprite.ATTACK_RIGHT;
  }

  /**
   * @returns {void}
   */
  resetAttacks() {
    this.#attacking = undefined;
    this.#sprites.attack1.reset();
    this.#sprites.attack2.reset();
  }
}
