//@ts-check

export default class NoRegisteredEntitiesError extends Error {
    constructor() {
      super(`No entities were registered to perform current action.`);
      this.name = "NoRegisteredEntitiesError";
    }
  }
  