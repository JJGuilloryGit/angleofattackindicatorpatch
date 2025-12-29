# Guidance for Future Agents

- **Purpose**: Maintain and evolve the Angle of Attack indicator patch. Capture configs, scripts, and notes that help reproduce and validate the patch on supported simulators/hardware.
- **Change discipline**: Prefer small, reviewable commits with clear summaries of what changed and why. Document simulator versions, aircraft profiles, or hardware revisions affected by each change.
- **File hygiene**: Keep binaries and large logs out of the repo; use Git LFS or external storage if artifacts are required. Favor plain text and scripts over screenshots.
- **Documentation first**: When adding a new procedure or fix, update `README.md` (or add a new doc) with prerequisites, steps, and expected outcomes so others can follow without guesswork.
- **Testing**: Record how you verified changes (sim scenario, hardware setup, expected AoA behavior). If automation is added later, include runnable scripts or checklists.
