//@ts-check
export default class InvalidEntityError extends Error {
    constructor(invalidEntity) {
      super(`Provided entity is invalid: '${invalidEntity}'`);
      this.name = "InvalidEntityError";
    }
  }
  