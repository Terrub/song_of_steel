//@ts-check
export default class InvalidIntentError extends Error {
    constructor(invalidIntent) {
      super(`Provided intent is invalid: '${invalidIntent}'`);
      this.name = "InvalidIntentError";
    }
  }
  