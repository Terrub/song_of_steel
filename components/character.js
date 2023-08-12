import { VectorTypeError } from "../errors/typeErrors/vectorTypeError.js";
import { Utils } from "../utils.js";
import { AnimatedSprite } from "./animatedSprite.js";
import { Vector } from "./vector.js";

export class Character {
  static ATTACK_LEFT = "attack1";
  static ATTACK_RIGHT = "attack2";

  #dimensions;
  #velocity;
  #sprites;
  #attacking;
  #isDead = false;
  #health = 100;

  constructor(dimensions, velocity, sprites) {
    this.dimensions = dimensions;
    this.velocity = velocity;

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

  get velocity() {
    return this.#velocity;
  }

  set velocity(vector) {
    if (!Utils.isInstanceOf(Vector, vector)) {
      throw new VectorTypeError("velocity", vector);
    }

    this.#velocity = vector;
  }

  draw(renderer, position, framesElapsed) {
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

    if (this.#attacking === Character.ATTACK_LEFT) {
      currentSprite = this.#sprites[Character.ATTACK_LEFT];
    }

    if (this.#attacking === Character.ATTACK_RIGHT) {
      currentSprite = this.#sprites[Character.ATTACK_RIGHT];
    }

    currentSprite.draw(renderer, position, framesElapsed);
  }

  attackLeft() {
    if (Utils.isDefined(this.#attacking)) {
      return;
    }

    this.#attacking = Character.ATTACK_LEFT;
  }

  attackRight() {
    if (Utils.isDefined(this.#attacking)) {
      return;
    }

    this.#attacking = Character.ATTACK_RIGHT;
  }

  resetAttacks() {
    this.#attacking = undefined;
    this.#sprites.attack1.reset();
    this.#sprites.attack2.reset();
  }
}
