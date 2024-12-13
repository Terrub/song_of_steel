//@ts-check
export default class DuplicateEntityError extends Error {
  constructor(duplicateEntity) {
    super(`Provided entity is already known: '${duplicateEntity}'`);
    this.name = "DuplicateEntityError";
  }
}
