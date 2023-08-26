//@ts-check
import { Utils } from "../utils.js";

// TODO See if we can turn this into a class after all.
/*
  Currently I cannot turn this into a class simply, as the tic function passed to the window's
  requestAnimationFrame is assigned to some internal magic variable or something. This means
  the call to tic the first time has no defined context for `this`.
    > (typeof this === 'undefined')
  We could probably do something pretty cool to make this work with a class like this, but
  currently this works and the complexity of this psuedo-class is minimal enough to not merrit
  the time investment.
 */

/**
 *
 * @param {Function} fnRender
 * @returns {Object}
 */
export function createMainloop(fnRender) {
  if (!Utils.isFunction(fnRender)) {
    Utils.reportUsageError("Usage: createMainloop(frameRender: function");
  }

  let isAnimating = false;
  let isDebugging = false;
  let renderMethod = fnRender;

  /**
   * @param {number} elapsed
   */
  function debugRenderer(elapsed) {
    try {
      fnRender(elapsed);
    } catch (error) {
      stop();

      Utils.faultOnError(error);
    }
  }

  /**
   * @param {number} elapsed
   */
  function tic(elapsed) {
    if (isAnimating === true) {
      window.requestAnimationFrame(tic);
      renderMethod(elapsed);
    }
  }

  function start() {
    if (isAnimating === true) {
      return;
    }

    isAnimating = true;

    if (isDebugging) {
      Utils.report("Animation started");
    }

    tic(Utils.getTime());
  }

  function stop() {
    isAnimating = false;
    if (isDebugging) {
      Utils.report("Animation stopped");
    }
  }

  function reset() {
    throw new SyntaxError("reset not yet implemented");
  }

  function next() {
    if (isAnimating === true) {
      return;
    }

    renderMethod();
  }

  /**
   * @param {boolean} bVal
   */
  function setDebug(bVal) {
    isDebugging = bVal;
    if (bVal === true) {
      renderMethod = debugRenderer;
    } else if (bVal === false) {
      renderMethod = fnRender;
    } else {
      throw new Error(
        `Unrecognised debug value: '${bVal}', expected 'true' or 'false'`
      );
    }
  }

  /**
   * @typedef MainLoop
   * @type {object}
   * @property {Function} start
   * @property {Function} stop
   * @property {Function} reset
   * @property {Function} next
   * @property {Function} setDebug
   */

  /** @type {MainLoop} */
  const protoMainloop = {
    start: start,
    stop: stop,
    reset: reset,
    next: next,
    setDebug: setDebug,
  };

  return protoMainloop;
}
