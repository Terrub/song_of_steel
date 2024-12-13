//@ts-check
export default class UnknownIntentError extends Error {
  /**
   * @param {*} unknownIntent
   */
  constructor(unknownIntent) {
    super(`Unknown intent encountered: '${unknownIntent.name ? unknownIntent.name : unknownIntent}'`);
    this.name = "UnknownIntentError";
  }
}
