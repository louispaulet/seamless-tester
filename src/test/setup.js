import "@testing-library/jest-dom/vitest";

class TestImage {
  onload = null;
  onerror = null;
  naturalWidth = 4096;
  naturalHeight = 2048;

  set src(value) {
    this._src = value;
    queueMicrotask(() => {
      if (this.onload) {
        this.onload();
      }
    });
  }

  get src() {
    return this._src;
  }
}

global.Image = TestImage;

if (!URL.createObjectURL) {
  URL.createObjectURL = () => "blob:test-image";
}

if (!URL.revokeObjectURL) {
  URL.revokeObjectURL = () => {};
}

if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = (callback) => setTimeout(callback, 0);
}
