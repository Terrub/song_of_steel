//@ts-check
export default class ParamTypeError extends TypeError {
  /**
   * @param {string} paramName
   * @param {*} intendedClass
   * @param {*} actualClass
   */
  constructor(paramName, intendedClass, actualClass) {
    super(
      `Given parameter '${paramName}' must be of type ${intendedClass.name}, '${typeof actualClass}' given.`
    );
    this.name = "ParamTypeError";
  }
}
