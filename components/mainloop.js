import { Utils } from "../utils.js";

// TODO: See if we can turn this into a class after all.
/*
  Currently I cannot turn this into a class simply, as the tic function passed to the window's
  requestAnimationFrame is assigned to some internal magic variable or something. This means
  the call to tic the first time has no defined context for `this`.
    > (typeof this === 'undefined')
  We could probably do something pretty cool to make this work with a class like this, but
  currently this works and the complexity of this psuedo-class is minimal enough to not merrit
  the time investment.
 */
export function createMainloop(fnRender) {
  if (!Utils.isFunction(fnRender)) {
    Utils.reportUsageError("Usage: createMainloop(frameRender: function");
  }

  let isAnimating = false;
  let isDebugging = false;

  function frameRender() {
    try {
      fnRender();
    } catch (error) {
      stop();

      Utils.faultOnError(error);
    }
  }

  function tic() {
    if (isAnimating === true) {
      window.requestAnimationFrame(tic);
      frameRender();
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

    tic();
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

    frameRender();
  }

  function setDebug(bVal) {
    isDebugging = bVal;
  }

  const protoMainloop = {
    start: start,
    stop: stop,
    reset: reset,
    next: next,
    setDebug: setDebug,
  };

  return protoMainloop;
}
