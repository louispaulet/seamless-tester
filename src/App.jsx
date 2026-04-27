import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_TEXTURE,
  GRID_SIZE,
  SCALE_STEP,
  calculateFitScale,
  clampScale,
  readImageDimensions,
} from "./texture.js";

const tiles = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => index);

function getViewportSize() {
  return {
    width: window.innerWidth || 1024,
    height: window.innerHeight || 768,
  };
}

export default function App() {
  const controlsRef = useRef(null);
  const fileInputRef = useRef(null);
  const objectUrlRef = useRef(null);
  const loadIdRef = useRef(0);
  const [texture, setTexture] = useState(DEFAULT_TEXTURE);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState("");

  const fitTextureToViewport = useCallback((nextTexture) => {
    const viewport = getViewportSize();
    const controlsBottom = controlsRef.current?.getBoundingClientRect().bottom ?? 0;
    setScale(
      calculateFitScale({
        imageWidth: nextTexture.width,
        imageHeight: nextTexture.height,
        viewportWidth: viewport.width,
        viewportHeight: viewport.height,
        controlsBottom,
      })
    );
  }, []);

  const applyTexture = useCallback((nextTexture) => {
    setError("");
    setTexture(nextTexture);
    requestAnimationFrame(() => fitTextureToViewport(nextTexture));
  }, [fitTextureToViewport]);

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const useDefaultTexture = useCallback(() => {
    loadIdRef.current += 1;
    revokeObjectUrl();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    applyTexture(DEFAULT_TEXTURE);
  }, [applyTexture, revokeObjectUrl]);

  const useSelectedFile = useCallback(async (file) => {
    const loadId = ++loadIdRef.current;
    const objectUrl = URL.createObjectURL(file);

    try {
      const dimensions = await readImageDimensions(objectUrl);
      if (loadId !== loadIdRef.current) {
        URL.revokeObjectURL(objectUrl);
        return;
      }
      revokeObjectUrl();
      objectUrlRef.current = objectUrl;
      applyTexture({
        name: file.name,
        width: dimensions.width,
        height: dimensions.height,
        url: objectUrl,
      });
    } catch (loadError) {
      URL.revokeObjectURL(objectUrl);
      if (loadId !== loadIdRef.current) {
        return;
      }
      console.error(loadError);
      setError("Could not load image. Please choose another file.");
    }
  }, [applyTexture, revokeObjectUrl]);

  useEffect(() => {
    fitTextureToViewport(DEFAULT_TEXTURE);
  }, [fitTextureToViewport]);

  useEffect(() => {
    const handleResize = () => fitTextureToViewport(texture);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fitTextureToViewport, texture]);

  useEffect(() => revokeObjectUrl, [revokeObjectUrl]);

  const tileWidth = Math.max(1, Math.round(texture.width * scale));
  const tileHeight = Math.max(1, Math.round(texture.height * scale));
  const zoomLabel = `${Math.round(scale * 100)}%`;
  const dimensionsLabel = error || `${texture.width} x ${texture.height} px`;

  const gridStyle = useMemo(() => ({
    "--tile-width": `${tileWidth}px`,
    "--tile-height": `${tileHeight}px`,
    "--texture-url": `url("${texture.url}")`,
  }), [texture.url, tileHeight, tileWidth]);

  return (
    <div className="min-h-screen text-white">
      <div
        ref={controlsRef}
        className="fixed left-2.5 right-2.5 top-2.5 z-10 flex max-w-none flex-wrap items-center gap-2.5 rounded-lg border border-slate-900/10 bg-[#fffbf3]/95 p-3 text-slate-900 shadow-[0_18px_40px_rgba(2,8,23,0.24)] backdrop-blur md:left-3.5 md:right-auto md:top-3.5 md:max-w-[calc(100vw-28px)]"
      >
        <img
          src="/seamless-logo.png"
          alt="Seamless Tester"
          className="h-11 w-11 flex-none rounded-lg"
          draggable="false"
        />
        <button
          type="button"
          aria-label="Open image"
          className="rounded-full bg-slate-900 px-4 py-2.5 font-semibold text-white shadow-inner shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          onClick={() => {
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
              fileInputRef.current.click();
            }
          }}
        >
          Open image
        </button>
        <button
          type="button"
          className="rounded-full bg-slate-900 px-4 py-2.5 font-semibold text-white shadow-inner shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          title="Return to the embedded local sample"
          onClick={useDefaultTexture}
        >
          Default
        </button>
        <button
          type="button"
          className="h-11 w-11 rounded-full bg-slate-900 text-xl font-bold leading-none text-white shadow-inner shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          title="Make tiles smaller"
          aria-label="Zoom out"
          onClick={() => setScale((current) => clampScale(current / SCALE_STEP))}
        >
          -
        </button>
        <button
          type="button"
          className="h-11 w-11 rounded-full bg-slate-900 text-xl font-bold leading-none text-white shadow-inner shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          title="Make tiles larger"
          aria-label="Zoom in"
          onClick={() => setScale((current) => clampScale(current * SCALE_STEP))}
        >
          +
        </button>
        <button
          type="button"
          className="rounded-full bg-slate-900 px-4 py-2.5 font-semibold text-white shadow-inner shadow-white/10 transition hover:-translate-y-0.5 hover:bg-slate-800 focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
          title="Fit the full 10 by 10 grid in the viewport"
          onClick={() => fitTextureToViewport(texture)}
        >
          Fit
        </button>
        <div className="mr-0 grid min-w-52 gap-0.5 leading-tight md:mr-0.5" aria-live="polite">
          <strong className="block text-[13px] text-slate-900">{error ? "Image load failed" : texture.name}</strong>
          <span className="block text-xs text-slate-700 tabular-nums">{dimensionsLabel}</span>
        </div>
        <span className="inline-flex min-w-19 items-center justify-center rounded-full bg-slate-900/10 px-3 py-2 text-[13px] font-bold text-slate-900 tabular-nums">
          {zoomLabel}
        </span>
        <input
          ref={fileInputRef}
          className="sr-only"
          type="file"
          aria-label="Open image"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              useSelectedFile(file);
            }
          }}
        />
      </div>

      <main className="px-3.5 pb-4 pt-30 md:px-6 md:pb-6 md:pt-24">
        <div
          className="grid border border-white/10 bg-white/[0.02] shadow-[0_28px_80px_rgba(0,0,0,0.3)]"
          role="img"
          aria-label="10 by 10 seamless texture preview"
          data-testid="tile-grid"
          style={{
            ...gridStyle,
            gridTemplateColumns: `repeat(${GRID_SIZE}, var(--tile-width))`,
            gridTemplateRows: `repeat(${GRID_SIZE}, var(--tile-height))`,
            width: `calc(var(--tile-width) * ${GRID_SIZE})`,
            height: `calc(var(--tile-height) * ${GRID_SIZE})`,
          }}
        >
          {tiles.map((tile) => (
            <div
              key={tile}
              className="m-0 border-0 bg-[image:var(--texture-url)] bg-[length:100%_100%] bg-left-top bg-no-repeat p-0"
              aria-hidden="true"
              data-testid="tile"
              style={{
                width: "var(--tile-width)",
                height: "var(--tile-height)",
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
