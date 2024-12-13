//@ts-check
export default class InvalidStateError extends Error {
  constructor(invalidState) {
    super(`Provided state is invalid: '${invalidState}'`);
    this.name = "InvalidStateError";
  }
}
