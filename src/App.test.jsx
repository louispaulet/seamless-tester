import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App.jsx";

describe("App", () => {
  beforeEach(() => {
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test-image");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      bottom: 96,
      height: 82,
      left: 14,
      right: 520,
      top: 14,
      width: 506,
      x: 14,
      y: 14,
      toJSON: () => {},
    });
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 768 });
  });

  it("renders the default sample immediately", async () => {
    render(<App />);

    expect(screen.getByText("Default sample")).toBeInTheDocument();
    expect(screen.getByText("256 x 256 px")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("25%")).toBeInTheDocument());
  });

  it("renders exactly 100 tiles", () => {
    render(<App />);

    expect(screen.getAllByTestId("tile")).toHaveLength(100);
  });

  it("loads an uploaded image and updates the source label", async () => {
    const user = userEvent.setup();
    render(<App />);

    const file = new File(["<svg></svg>"], "texture.svg", { type: "image/svg+xml" });
    await user.upload(screen.getByLabelText(/open image/i, { selector: "input" }), file);

    await waitFor(() => expect(screen.getByText("texture.svg")).toBeInTheDocument());
    expect(screen.getByText("4096 x 2048 px")).toBeInTheDocument();
  });

  it("zooms in and out from the fitted scale", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(screen.getByText("25%")).toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: /zoom in/i }));
    expect(screen.getByText("28%")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /zoom out/i }));
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("restores the embedded sample with Default", async () => {
    const user = userEvent.setup();
    render(<App />);

    const file = new File(["image"], "texture.webp", { type: "image/webp" });
    await user.upload(screen.getByLabelText(/open image/i, { selector: "input" }), file);
    await waitFor(() => expect(screen.getByText("texture.webp")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /default/i }));
    expect(screen.getByText("Default sample")).toBeInTheDocument();
    expect(screen.getByText("256 x 256 px")).toBeInTheDocument();
  });
});
