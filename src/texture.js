export const GRID_SIZE = 10;
export const MIN_SCALE = 0.01;
export const MAX_SCALE = 8;
export const SCALE_STEP = 1.1;
export const DEFAULT_TEXTURE_NAME = "Default sample";
export const DEFAULT_TEXTURE_WIDTH = 256;
export const DEFAULT_TEXTURE_HEIGHT = 256;

const DEFAULT_TEXTURE_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <defs>
      <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.04"
          numOctaves="3"
          seed="17"
          stitchTiles="stitch"
        />
      </filter>
    </defs>
    <rect width="256" height="256" fill="#cdb79d" />
    <rect width="256" height="256" filter="url(#grain)" opacity="0.26" />
    <g opacity="0.14" fill="none" stroke="#7a5d45" stroke-width="4" stroke-linecap="round">
      <path d="M0 64H256M0 128H256M0 192H256" />
      <path d="M64 0V256M128 0V256M192 0V256" />
    </g>
    <g opacity="0.1" fill="#fff7eb">
      <circle cx="40" cy="42" r="7" />
      <circle cx="216" cy="48" r="9" />
      <circle cx="72" cy="176" r="8" />
      <circle cx="176" cy="212" r="6" />
      <circle cx="128" cy="128" r="10" />
    </g>
  </svg>
`.trim();

export function svgDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export const DEFAULT_TEXTURE_URL = svgDataUrl(DEFAULT_TEXTURE_SVG);

export const DEFAULT_TEXTURE = {
  name: DEFAULT_TEXTURE_NAME,
  width: DEFAULT_TEXTURE_WIDTH,
  height: DEFAULT_TEXTURE_HEIGHT,
  url: DEFAULT_TEXTURE_URL,
};

export function clampScale(scale) {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

export function calculateFitScale({
  imageWidth,
  imageHeight,
  viewportWidth,
  viewportHeight,
  controlsBottom = 0,
}) {
  const horizontalPadding = viewportWidth <= 720 ? 28 : 48;
  const bottomPadding = viewportWidth <= 720 ? 18 : 24;
  const availableWidth = Math.max(1, viewportWidth - horizontalPadding);
  const availableHeight = Math.max(1, viewportHeight - controlsBottom - bottomPadding);
  const naturalGridWidth = Math.max(1, imageWidth * GRID_SIZE);
  const naturalGridHeight = Math.max(1, imageHeight * GRID_SIZE);

  return clampScale(Math.min(1, availableWidth / naturalGridWidth, availableHeight / naturalGridHeight));
}

export function readImageDimensions(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth || DEFAULT_TEXTURE_WIDTH,
        height: image.naturalHeight || DEFAULT_TEXTURE_HEIGHT,
      });
    };
    image.onerror = () => reject(new Error("Unable to load image."));
    image.src = url;
  });
}
