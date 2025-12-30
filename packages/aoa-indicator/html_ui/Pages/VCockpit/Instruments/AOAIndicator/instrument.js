(() => {
  const defaults = {
    smoothingFactor: 0.2,
    stallAlpha: 17.0,
    onSpeedAlpha: 11.0,
    cautionAlpha: 14.0,
    groundAirspeed: 30.0,
    flashRateHz: 2.0
  };

  const selectors = {
    red: document.getElementById("shape-red"),
    blue: document.getElementById("shape-blue"),
    yellow: document.getElementById("shape-yellow"),
    green: document.getElementById("shape-green"),
    alphaVal: document.getElementById("alpha-val"),
    stateVal: document.getElementById("state-val")
  };

  const state = {
    alphaEma: null,
    lastTick: performance.now()
  };

  function readSimVar(name, unit, fallback = 0) {
    try {
      if (typeof SimVar !== "undefined" && SimVar.GetSimVarValue) {
        return SimVar.GetSimVarValue(name, unit);
      }
    } catch (err) {
      // ignore and return fallback/mock
    }
    // Mock for preview outside the sim: oscillate alpha between 4–18 deg
    const now = performance.now() / 1000;
    return 11 + Math.sin(now) * 7;
  }

  function updateDebug(alpha, stateName) {
    selectors.alphaVal.textContent = alpha.toFixed(1);
    selectors.stateVal.textContent = stateName;
  }

  function setState(active) {
    ["red", "blue", "yellow", "green"].forEach((key) => {
      const el = selectors[key];
      if (!el) return;
      el.classList.remove("active", "pulsing");
    });
    if (!active) return;
    const el = selectors[active.id];
    if (!el) return;
    el.classList.add("active");
    if (active.pulsing) {
      el.classList.add("pulsing");
    }
  }

  function deriveState(alpha, airspeed, onGround) {
    if (onGround && airspeed < defaults.groundAirspeed) {
      return { id: "green", name: "ground-safe" };
    }
    if (alpha >= defaults.stallAlpha) {
      return { id: "red", name: "stall", pulsing: true };
    }
    if (alpha >= defaults.cautionAlpha) {
      return { id: "yellow", name: "caution" };
    }
    if (alpha >= defaults.onSpeedAlpha) {
      return { id: "blue", name: "on-speed" };
    }
    return { id: "green", name: "low-aoa" };
  }

  function tick() {
    const now = performance.now();
    const dt = (now - state.lastTick) / 1000;
    state.lastTick = now;

    const rawAlpha = readSimVar("INCIDENCE ALPHA", "Radians") * (180 / Math.PI);
    const airspeed = readSimVar("AIRSPEED INDICATED", "Knots");
    const onGround = !!readSimVar("SIM ON GROUND", "Bool");

    // Exponential smoothing on alpha to reduce flicker.
    if (state.alphaEma === null) {
      state.alphaEma = rawAlpha;
    } else {
      const k = defaults.smoothingFactor * Math.min(dt * 60, 1.5);
      state.alphaEma = state.alphaEma + k * (rawAlpha - state.alphaEma);
    }

    const derived = deriveState(state.alphaEma, airspeed, onGround);
    setState(derived);
    updateDebug(state.alphaEma, derived.name);

    window.requestAnimationFrame(tick);
  }

  function init() {
    state.lastTick = performance.now();
    window.requestAnimationFrame(tick);
  }

  window.addEventListener("DOMContentLoaded", init);
})();
