// src/server/api/pickBestImage.test.ts
import { describe, expect, it } from "vitest";
import {
  EVENT_PLACEHOLDER_IMAGE,
  pickBestImage,
} from "@/server/api/pickBestImage";

describe("pickBestImage", () => {
  it("returns the placeholder for undefined images", () => {
    expect(pickBestImage(undefined)).toBe(EVENT_PLACEHOLDER_IMAGE);
  });

  it("returns the placeholder for an empty image array", () => {
    expect(pickBestImage([])).toBe(EVENT_PLACEHOLDER_IMAGE);
  });

  it("returns the placeholder when all urls are empty", () => {
    expect(pickBestImage([{ url: "" }, { url: "   ", width: 900 }])).toBe(
      EVENT_PLACEHOLDER_IMAGE,
    );
  });

  it("chooses the widest wide image", () => {
    expect(
      pickBestImage([
        { url: "/small.jpg", width: 300, height: 200 },
        { url: "/wide-600.jpg", width: 600, height: 300 },
        { url: "/wide-1000.jpg", width: 1000, height: 500 },
      ]),
    ).toBe("/wide-1000.jpg");
  });

  it("chooses the image with the largest width when no wide image exists", () => {
    expect(
      pickBestImage([
        { url: "/portrait-400.jpg", width: 400, height: 900 },
        { url: "/portrait-500.jpg", width: 500, height: 800 },
      ]),
    ).toBe("/portrait-500.jpg");
  });

  it("chooses the first valid url when width is missing", () => {
    expect(pickBestImage([{ url: "/first.jpg" }, { url: "/second.jpg" }])).toBe(
      "/first.jpg",
    );
  });
});
