# Angle of Attack Indicator Patch

This repository is a starting point for documenting and distributing the Angle of Attack (AoA) indicator patch. It will collect notes, configuration snippets, and supporting assets needed to build, test, and ship the patch.

## Getting Started
- Clone the repo: `git clone https://github.com/JJGuilloryGit/angleofattackindicatorpatch.git`
- Add any patch files, configs, or documentation under meaningful subfolders.
- Keep changes small and well documented in commit messages so others can follow the patch history.

## Concept & Roadmap
- See `docs/aoa_patch_concept.md` for the current universal AoA indicator concept, visual language, and implementation outline for MSFS 2020/2024.
- Contributions should document sim version, aircraft, and any tuning data added (stall/on-speed AoA thresholds).

## Current Package (preview scaffold)
- Location: `packages/aoa-indicator` (Community-style package with manifest/layout, HTML instrument, and tuning configs).
- Instrument: Portrait HTML gauge at `html_ui/Pages/VCockpit/Instruments/AOAIndicator/` with state machine for red/yellow/blue/green AoA cues. Outside the sim it uses a mock alpha signal so you can preview.
- Config: `config/defaults.json` plus aircraft overrides in `config/aircraft/*.json` (initial: C172, DA62, A320neo).

### Install (manual for now)
1) Copy `packages/aoa-indicator` into your MSFS `Community` folder (2020/2024).
2) Launch the sim. The instrument can be added as a standalone panel (pop-out) once we register it via `panel.cfg` helper; current build is a preview for UI and logic only.
3) Use Developer Mode or an aircraft panel edit to insert a new `VcockpitXX` entry that points at `html_ui/Pages/VCockpit/Instruments/AOAIndicator/index.html` (back up `panel.cfg` first).

### Remove
- Delete `aoa-indicator` from `Community` and restore the backed-up `panel.cfg` if you inserted it manually.

### Tuning Notes
- Default thresholds: stall 17°, on-speed 11°, caution 14°, ground mask at <30 kts.
- Override per aircraft by adding `config/aircraft/<icao>.json` with `stall_alpha_deg`, `on_speed_alpha_deg`, and `caution_alpha_deg`.
- Report sim version, aircraft, weather preset, and any overrides when sharing test results.

## Contributing
- Open issues or PRs describing the change and the AoA simulator/hardware version it targets.
- Avoid committing large binaries or generated artifacts; link to releases or attach them elsewhere if needed.
- Update this README when adding new features or setup steps so newcomers can reproduce your workflow.

## Project Status
Initial scaffolding only. Flesh out patch details, build instructions, and validation steps as they become available.
