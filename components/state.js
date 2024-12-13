//@ts-check

import DuplicateIntentError from "../errors/fooErrors/duplicateIntentError.js";
import InvalidIntentError from "../errors/fooErrors/invalidIntentError.js";
import InvalidStateError from "../errors/fooErrors/invalidStateError.js";
import UnknownIntentError from "../errors/fooErrors/unknownIntentError.js";
import NumberTypeError from "../errors/typeErrors/numberTypeError.js";
import StringTypeError from "../errors/typeErrors/stringTypeError.js";
import Utils from "../utils.js";
import Intent from "./intent.js";

export default class State {
    /** @type {String} */
    #name;

    /** @type {Object.<String, Object>} */
    #knownIntents = {};

    /** @type {Number} */
    #progress = 0;

    /** @type {Number} */
    #duration;

    /** @type {Boolean} */
    #canLoop;

    /**
     * @param {String} name
     * @param {Number} duration
     * @param {Boolean} [canLoop=false]
     */
    constructor(name, duration = 0, canLoop = false) {
        if (!Utils.isString(name)) {
            throw new StringTypeError('name', name);
        }

        if (!Utils.isNumber(duration)) {
            throw new NumberTypeError('duration', duration);
        }

        this.#name = name;
        this.#duration = duration;
        this.#canLoop = canLoop;
    }

    get name() {
        return this.#name;
    }

    get progress() {
        return (this.#progress / this.#duration);
    }

    get duration() {
        return this.#duration;
    }

    get canLoop() {
        return this.#canLoop;
    }

    /**
     * @param {Intent} intent
     */
    hasIntent(intent) {
        if (!Utils.isInstanceOf(Intent, intent)) {
            throw new InvalidIntentError(intent);
        }

        return (intent.name in this.#knownIntents);
    }

    /**
     * @param {Intent} intent
     * @param {State} nextState
     * @param {*} conditionals
     */
    addIntent(intent, nextState, conditionals) {
        if (this.hasIntent(intent)) {
            throw new DuplicateIntentError(intent);
        }

        if (!Utils.isInstanceOf(State, nextState)) {
            throw new InvalidStateError(nextState);
        }

        this.#knownIntents[intent.name] = {
            next: nextState,
            conditionals: conditionals,
        };
    }

    /**
     * @param {Intent} intent
     * @returns {Object}
     */
    on(intent) {
        if (!this.hasIntent(intent)) {
            throw new UnknownIntentError(intent);
        }

        return this.#knownIntents[intent.name];
    }

    /**
     * @param {Number} elapsed
     */
    updateProgress(elapsed) {
        if (!Utils.isNumber(elapsed)) {
            throw new NumberTypeError('elapsed', elapsed);
        }

        this.#progress += elapsed;

        if (this.#canLoop && this.#progress > this.#duration) {
            this.#progress = this.#progress % this.#duration;
        }
    }
    
    /**
     * Method to be invoked when entity exits this state
     */
    exit() {
        this.#progress = 0;
    }
}
