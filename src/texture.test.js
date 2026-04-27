import { describe, expect, it } from "vitest";
import { GRID_SIZE, calculateFitScale } from "./texture.js";

describe("calculateFitScale", () => {
  it("shrinks a large texture so the full grid fits the viewport", () => {
    const scale = calculateFitScale({
      imageWidth: 4096,
      imageHeight: 4096,
      viewportWidth: 1024,
      viewportHeight: 768,
      controlsBottom: 96,
    });

    expect(4096 * GRID_SIZE * scale).toBeLessThanOrEqual(1024);
    expect(4096 * GRID_SIZE * scale).toBeLessThanOrEqual(768 - 96);
    expect(scale).toBeLessThan(0.1);
  });

  it("does not enlarge small textures above their natural size", () => {
    expect(
      calculateFitScale({
        imageWidth: 8,
        imageHeight: 8,
        viewportWidth: 1024,
        viewportHeight: 768,
      })
    ).toBe(1);
  });
});
