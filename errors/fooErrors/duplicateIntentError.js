//@ts-check
export default class DuplicateIntentError extends Error {
  constructor(duplicateIntent) {
    super(`Provided intent is already known: '${duplicateIntent}'`);
    this.name = "DuplicateIntentError";
  }
}
