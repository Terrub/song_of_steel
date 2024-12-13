//@ts-check
import StringTypeError from "../errors/typeErrors/stringTypeError.js";
import Utils from "../utils.js";

export default class Entity {
    /**
     * @param {String} name
     */
    constructor(name) {
        if (!Utils.isString(name)) {
            throw new StringTypeError('name', name);
        }

        this.name = name;
    }
}