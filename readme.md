# Seamless Tester ✨

`Seamless Tester` is a small browser-based utility for checking whether an image or texture is truly seamless when repeated.

If you land on the GitHub Pages root, open the tester here:

[Open the live tester](https://seamless.thefrenchartist.dev/) 🧵

## What It Does 🔍
- Loads a local image file.
- Repeats the image in a 10x10 grid.
- Fits the full tiled grid into the browser when an image loads.
- Lets you zoom the tiles in and out to inspect seams, corners, and repetition artifacts.

## How To Use It 🧭
1. Run `make up` and open the local Vite URL.
2. Use `Open image` to choose a texture or image.
3. Use `Default` to return to the embedded local sample.
4. Use `Fit` to return to the full 10x10 grid view.
5. Use `-` and `+` to adjust tile size.
6. Look closely at the edges where neighboring tiles meet.

## Current State 🛠️
- Vite, React, and Tailwind CSS app.
- Browser-only, with no backend.
- Includes an embedded default texture so the page works immediately, even offline.
- Includes generated PNG favicon and toolbar logo assets in `public/`.

## Development 🚀
```sh
make up
make test
make deploy
```

`make deloy` is also available as an alias for `make deploy`.

Deployments publish the Vite `dist/` folder to GitHub Pages with the custom domain `seamless.thefrenchartist.dev`.

## Why It Exists 🧩
An image can look fine on its own but reveal visible seams once it is tiled. This project provides a fast visual check before using that image as a texture, background, or repeated pattern.
