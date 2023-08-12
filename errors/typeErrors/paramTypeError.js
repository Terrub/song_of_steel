export class ParamTypeError extends TypeError {
  constructor(paramName, intendedClass, actualClass) {
    super(
      `Given parameter '${paramName}' must be of type ${intendedClass.name}, '${typeof actualClass}' given.`
    );
    this.name = "ParamTypeError";
  }
}
