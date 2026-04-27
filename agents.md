# Agent Instructions

## Purpose
This repo is a lightweight browser tool for checking whether an image texture is actually seamless when it is tiled.

## Current Shape
- The Vite React app in `src/` is the main implementation.
- The page repeats a single image in a 10x10 grid.
- The controls let you load a local file, restore the default sample, fit the whole grid, and change tile scale with `+` and `-`.

## Working Rules
- Read this file and `readme.md` before making changes.
- Keep the tool browser-only unless there is a strong reason to add more structure.
- Preserve the fixed control bar and the tiled grid behavior.
- Favor small, focused edits over large rewrites.
- Always commit and push, even if on the main branch, before giving back the hand to the user.

## How To Verify Changes
- Run `make up` and open the local Vite URL in a browser.
- Load a candidate texture or image.
- Check the seams where tiles meet at multiple zoom levels.
- Confirm the default embedded sample still renders immediately without loading a file.
- Run `make test` before shipping behavior changes.

## Notes
- If you add assets or new modes, document them in `readme.md`.
- If a change affects the visual test workflow, make sure the instructions stay in sync with the implementation.
