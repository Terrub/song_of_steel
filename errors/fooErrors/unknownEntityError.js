//@ts-check
export default class UnknownEntityError extends Error {
  constructor(unknownEntity) {
    super(`Unknown entity encountered: '${unknownEntity}'`);
    this.name = "UnknownEntityError";
  }
}
