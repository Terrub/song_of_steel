export class ParamTypeError extends TypeError {
  constructor(intendedClass, actualClass) {
    super(
      `Given parameter should be of type ${intendedClass.name}, '${typeof actualClass}' given.`
    );
  }
}
