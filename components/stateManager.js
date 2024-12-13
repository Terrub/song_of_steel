//@ts-check
import DuplicateEntityError from "../errors/fooErrors/duplicateEntityError.js";
import InvalidEntityError from "../errors/fooErrors/invalidEntityError.js";
import InvalidStateError from "../errors/fooErrors/invalidStateError.js";
import NoRegisteredEntitiesError from "../errors/fooErrors/noRegisteredEntitiesError.js";
import UnknownEntityError from "../errors/fooErrors/unknownEntityError.js";
import NumberTypeError from "../errors/typeErrors/numberTypeError.js";
import Utils from "../utils.js";
import Entity from "./entity.js";
import Intent from "./intent.js";
import State from "./state.js";

export default class StateManager {
    /** @type {Array.<Entity>} */
    #entities;

    /** @type {Object.<String, State>} */
    #entityStates;

    constructor() {
        this.#entities = [];
        this.#entityStates = {};
    }

    /**
     * @param {Number} progress current relative state progression. Float value in range [0,1]
     * @param {*} conditionals List of min,max range for partial - and min,max range for perfect success
     * @returns {Number}
     */
    static calcPoiseLoss(progress, conditionals) {        
        if (progress >= conditionals.min2 && progress <= conditionals.max2) {
            return 0;
        }

        if (progress > conditionals.min1 && progress < conditionals.min2) {
            return 1 - ((progress - conditionals.min1) / (conditionals.min2 - conditionals.min1));
        }

        if (progress > conditionals.max2 && progress < conditionals.max1) {
            return (progress - conditionals.max2) / (conditionals.max1 - conditionals.max2);
        }

        return 1;
    }

    /**
     * @param {Entity} entity
     * @param {State} oldState
     * @param {State} newState
     */
    #swapState(entity, oldState, newState) {
        // TODO: Consider adding the below methods to update or reset old and new state
        // newState.enter();
        this.#entityStates[entity.name] = newState;
        oldState.exit();
    }

    /**
     * @param {Entity} entity
     */
    hasEntity(entity) {
        if (!Utils.isInstanceOf(Entity, entity)) {
            throw new InvalidEntityError(entity);
        }

        if (this.#entityStates[entity.name]) {
            return true;
        }

        return false;
    }

    /**
     * @param {Entity} entity
     * @param {State} initialState
     */
    addEntity(entity, initialState) {
        if (this.hasEntity(entity)) {
            throw new DuplicateEntityError(entity);
        }

        if (!Utils.isInstanceOf(State, initialState)) {
            throw new InvalidStateError(initialState);
        }

        this.#entities.push(entity);
        this.#entityStates[entity.name] = initialState;
    }

    /**
     * @param {Entity} entity
     * @returns {State}
     */
    getEntityState(entity) {
        if (!this.hasEntity(entity)) {
            throw new UnknownEntityError(entity);
        }

        return this.#entityStates[entity.name];
    }

    /**
     * @param {Entity} entity
     * @param {State} newState
     */
    setEntityState(entity, newState) {
        if (!Utils.isInstanceOf(State, newState)) {
            throw new InvalidStateError(newState);
        }

        const currentState = this.getEntityState(entity);

        this.#swapState(entity, currentState, newState)
    }

    /**
     * @param {Entity} entity
     * @param {Intent} intent
     */
    setEntityIntent(entity, intent) {
        const currentState = this.getEntityState(entity);
        if (!currentState.hasIntent(intent)) {
            return;
        }
        const stateData = currentState.on(intent);
        const poiseLoss = StateManager.calcPoiseLoss(currentState.progress, stateData.conditionals);
        if (1 > poiseLoss) {
            this.#swapState(entity, currentState, stateData.next);
        }
    }

    /**
     * @param {Number} elapsed Delta time since last update (in seconds)
     */
    update(elapsed) {
        if (!Utils.isNumber(elapsed)) {
            throw new NumberTypeError('elapsed', elapsed);
        }

        if (this.#entities.length < 1) {
            throw new NoRegisteredEntitiesError();
        }

        for (const entity of this.#entities) {
            const currentState = this.getEntityState(entity);
            currentState.updateProgress(elapsed);
        }
    }
}