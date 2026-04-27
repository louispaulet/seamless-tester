# Seamless Tester

`Seamless Tester` is a small browser-based utility for checking whether an image or texture is truly seamless when repeated.

## What It Does
- Loads a local image file.
- Repeats the image in a 10x10 grid.
- Lets you zoom the tiles in and out to inspect seams, corners, and repetition artifacts.

## How To Use It
1. Open `seamless_texture_test_select_file_zoom.html` in a browser.
2. Use `Open image` to choose a texture or image.
3. Use `Default` to return to the embedded local sample.
4. Use `-` and `+` to adjust tile size.
5. Look closely at the edges where neighboring tiles meet.

## Current State
- Single-file HTML prototype.
- No build step and no runtime dependencies.
- Includes an embedded default texture so the page works immediately, even offline.

## Why It Exists
An image can look fine on its own but reveal visible seams once it is tiled. This project provides a fast visual check before using that image as a texture, background, or repeated pattern.
