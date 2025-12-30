# Angle of Attack Indicator Patch — Concept

Initial concept for a universal AoA indicator patch targeting Microsoft Flight Simulator 2020 and 2024. This document captures design cues, intended behavior, and a build path so we can iterate without guesswork.

## Visual Language (inspired by reference mock)
- Upright tablet-style display with a black bezel and white background.
- Three primary states stacked vertically:
  - Red chevron (too high AoA / stall margin).
  - Blue “on-speed” donut (target approach AoA).
  - Yellow triangle (approaching limit).
  - Green bar (comfort band / low AoA).
- Keep the geometry simple (SVG) so it scales across panel resolutions and VR.

## Target Scope
- Usable on any aircraft with pitot/static and alpha data available in MSFS 2020/2024.
- Works in 2D cockpits, VR, and as an external overlay (Pop Out Panel or independent instrument window).
- Avoids per-aircraft panel edits where possible; favor a self-contained Community package with a universal instrument.

## Data Model
- Primary SimVars: `INCIDENCE ALPHA`, `AIRSPEED INDICATED`, `SIM ON GROUND`, `PLANE BANK DEGREES`.
- Optional smoothing: exponential moving average on `INCIDENCE ALPHA` to reduce flicker.
- Derived states (tunable per aircraft class):
  - `stall_alpha`: from aircraft config (`flight_model.cfg`), fallback 16–18 deg.
  - `on_speed_alpha`: typically 1.3 × `VS0` AoA band; start with ~10–12 deg.
  - `caution_alpha`: midpoint between on-speed and stall.

## Behavior
- State logic (pseudo):
  - If `SIM ON GROUND` and `AIRSPEED INDICATED < 30 kts`: show green bar only (prevent false cautions during taxi).
  - Else if `alpha >= stall_alpha`: flash red chevron.
  - Else if `alpha >= caution_alpha`: steady yellow triangle.
  - Else if `alpha >= on_speed_alpha`: blue donut.
  - Else: green bar.
- Optional audio cue: single tone when entering yellow, pulsed tone in red.
- Color accessibility: expose palette overrides; offer monochrome shapes with brightness changes for colorblind users.

## Implementation Outline
1. **Community package**: `packages/aoa-indicator/`
   - `manifest.json` and `layout.json`.
   - `html_ui/Pages/VCockpit/Instruments/AOAIndicator/` with `index.html`, `instrument.js`, `style.css`, and SVG assets.
2. **Panel injection**:
   - Preferred: treat as a standalone “extra instrument” that can be popped out. Add a new panel entry so it appears in the in-sim instrument list.
   - Alternative: ship helper script to append `VcockpitXX` block to `panel.cfg` for user-selected aircraft (backed up before patching).
3. **Config overrides**:
   - `config/defaults.json` with baseline thresholds.
   - Optional `config/aircraft/<icao>.json` for tuned thresholds per aircraft family.
4. **VR/Windowing**:
   - Ensure the HTML instrument is scalable; support 150–200% UI scale for VR.
   - Add drag handle + bezel in CSS; snap to portrait 9:16 layout.
5. **Telemetry hook (future hardware)**:
   - Expose L:Vars `L:AOA_STATE`, `L:AOA_ALPHA_DEG` for external hardware drivers.

## Testing Notes (manual for now)
- **Base sim check**: Cessna 172 (steam) at 3000 ft, clean, slow flight; observe transitions green→blue→yellow before stall.
- **Approach check**: C172 full flaps, 65 kts, trimmed; expect stable blue donut on final.
- **Edge case**: Steep turns at 45° bank; ensure smoothing prevents rapid flicker between states.
- **Ground handling**: Taxi and rotate—stay green until liftoff.
- Record sim version, weather preset, aircraft variant, and any per-aircraft overrides used.

## Next Steps
- Build skeleton Community package structure with placeholder instrument UI.
- Add basic state machine in `instrument.js` reading `INCIDENCE ALPHA`.
- Create tuning table for common trainers (C172, DA62, TBM) and jets (A320neo, CJ4) with initial thresholds.
- Add README section for install/usage and manual removal.
