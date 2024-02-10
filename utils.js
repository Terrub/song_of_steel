// @ts-check
import ParamTypeError from "./errors/typeErrors/paramTypeError.js";

export default class Utils {
  /**
   * @param {*} value
   * @returns {Boolean}
   */
  static isUndefined(value) {
    // NOTE 1: value being a reference to something.

    /* NOTE 2: changed the use of: */
    // return (value === undefined);
    /* to: */
    return typeof value === "undefined";
    /* as this is supported on more browsers according to Teun Lassche */
  }

  /**
   * @param {*} value
   * @returns {Boolean}
   */
  static isDefined(value) {
    return !Utils.isUndefined(value);
  }

  /**
   * @param {*} value
   * @returns {Boolean}
   */
  static isBoolean(value) {
    return typeof value === "boolean";
  }

  /**
   * @param {*} num
   * @returns {Boolean}
   */
  static isNumber(num) {
    return typeof num === "number";
  }

  /**
   * @param {*} value
   * @returns {Boolean}
   */
  static isInteger(value) {
    return value === +value && value === (value | 0);
  }

  /**
   * @param {*} value
   * @returns {Boolean}
   */
  static isString(value) {
    return typeof value === "string";
  }

  /**
   * @param {*} value
   * @returns {Boolean}
   */
  static isNull(value) {
    return value === null;
  }

  /**
   * @param {*} value
   * @returns {Boolean}
   */
  static isObject(value) {
    // #NOTE1: typeof null === 'object' so check for null as well!
    if (Utils.isNull(value)) {
      return false;
    }
    if (Utils.isUndefined(value)) {
      return false;
    }

    return typeof value === "object";
  }

  /**
   * @param {*} value
   * @returns {Boolean}
   */
  static isFunction(value) {
    return typeof value === "function";
  }

  /**
   * @param {*} value
   * @returns {Boolean}
   */
  static isEmptyObject(value) {
    if (!Utils.isObject(value)) {
      return false;
    }

    return Object.getOwnPropertyNames(value).length === 0;
  }

  /**
   * @param {*} value
   * @returns {Boolean}
   */
  static isArray(value) {
    return Array.isArray(value);
  }

  /**
   * @param {*} parentClass
   * @param {*} childClass
   * @returns {Boolean}
   */
  static isInstanceOf(parentClass, childClass) {
    return childClass instanceof parentClass;
  }

  /**
   * @param {Number} value
   * @returns {Number}
   */
  static floor(value) {
    if (!Utils.isNumber(value)) {
      throw new ParamTypeError("value", Number, value);
    }

    return Math.floor(value);
  }

  /**
   * @param {Number} value
   * @returns {Number}
   */
  static ceil(value) {
    if (!Utils.isNumber(value)) {
      throw new ParamTypeError("value", Number, value);
    }

    return Math.ceil(value);
  }

  /**
   * @param {Number} value
   * @returns {Number}
   */
  static round(value) {
    if (!Utils.isNumber(value)) {
      throw new ParamTypeError("value", Number, value);
    }

    return Math.round(value);
  }

  /**
   * @param {Number} value
   * @param {Number} lowerBound
   * @param {Number} upperBound
   * @returns {Number}
   */
  static constrain(value, lowerBound, upperBound) {
    return Math.max(lowerBound, Math.min(upperBound, value));
  }

  /**
   * @param {Object} x
   * @param {Object} y
   * @returns {Boolean}
   */
  static objectEquals(x, y) {
    if (
      Utils.isNull(x) ||
      Utils.isNull(y) ||
      Utils.isUndefined(x) ||
      Utils.isUndefined(y)
    ) {
      return x === y;
    }

    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) {
      return false;
    }

    // if they are functions, they should exactly refer to same one (because of closures)
    // if they are regexps, they should exactly refer to same one
    //    it is hard to better equality check on current ES
    if (x instanceof Function || x instanceof RegExp) {
      return x === y;
    }

    if (x === y || x.valueOf() === y.valueOf()) {
      return true;
    }

    if (Utils.isArray(x) && x.length !== y.length) {
      return false;
    }

    // if they are dates, they must've had equal valueOf
    if (x instanceof Date) {
      return false;
    }

    // if they are strictly equal, they both need to be object at least
    if (!(Utils.isObject(x) && Utils.isObject(y))) {
      return false;
    }

    // recursive object equality check
    const xKeys = Object.keys(x);
    const yKeysInX = Object.keys(y).every((i) => xKeys.indexOf(i) !== -1);
    const valuesEqual = xKeys.every((i) => Utils.objectEquals(x[i], y[i]));

    return yKeysInX && valuesEqual;
  }

  /**
   * @param {Array} array
   */
  static shuffleArray(array) {
    if (!Utils.isArray(array)) {
      throw new ParamTypeError("array", Array, array);
    }

    for (let i = array.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * @param {Error} err
   */
  static faultOnError(err) {
    const errBody = document.createElement("body");
    errBody.style.backgroundColor = "#cc3333";
    errBody.style.color = "#ffffff";
    errBody.innerHTML = `<pre>${err}</pre>`;
    document.body = errBody;

    throw err;
  }

  /**
   * @param {Function} toAttempt
   * @param  {...any} args
   * @returns {*}
   */
  static attempt(toAttempt, ...args) {
    let result;

    try {
      result = toAttempt(...args);
    } catch (err) {
      Utils.faultOnError(err);
    }

    return result;
  }

  /**
   * @param  {...any} args
   */
  static report(...args) {
    // eslint-disable-next-line no-console
    console.log(...args);
  }

  /**
   * @param {String} errorMessage
   */
  static reportError(errorMessage) {
    throw new Error(errorMessage);
  }

  /**
   * @param {String} errorMessage
   */
  static reportUsageError(errorMessage) {
    // For now just report the error normally;
    Utils.reportError(errorMessage);
  }

  /**
   * @param {*} statement
   * @param {Function} check
   */
  static onlyProceedIf(statement, check) {
    if (Utils.attempt(check, [statement]) !== true) {
      Utils.reportError("A checkpoint failed, check the stack for more info.");
    }
  }

  /**
   * @returns {Number}
   */
  static getTime() {
    return Date.now();
  }

  /**
   * @param {Number} pMax
   * @param {Number} pMin
   * @returns {Number}
   */
  static generateRandomFloat(pMax = 1.0, pMin = 0.0) {
    if (!Utils.isNumber(pMax)) {
      throw new TypeError(`Provided max should be a number, '${pMax}' given.`);
    }

    if (!Utils.isNumber(pMin)) {
      throw new TypeError(`Provided min should be a number, '${pMin}' given.`);
    }

    if (pMin > pMax) {
      throw new TypeError(
        `Provided max value needs to be greater than min value`
      );
    }

    return Math.random() * (pMax - pMin) + pMin;
  }

  /**
   * @param {Number} pMax
   * @param {Number} pMin
   * @returns {Number}
   */
  static generateRandomInt(pMax, pMin) {
    let max = pMax;
    let min = pMin;

    if (!Utils.isInteger(max)) {
      max = 100;
    }
    if (!Utils.isInteger(min)) {
      min = 0;
    }
    const randomNumber = Math.floor(Math.random() * (max - min) + min);

    return randomNumber;
  }
}
