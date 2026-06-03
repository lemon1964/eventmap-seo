// src/entities/search/searchFilters.test.ts
import { describe, expect, it } from "vitest";
import { parseSearchSegments } from "@/entities/search/searchFilters";

describe("parseSearchSegments", () => {
  it("returns an empty object for undefined segments", () => {
    expect(parseSearchSegments()).toEqual({});
  });

  it("returns an empty object for an empty segments array", () => {
    expect(parseSearchSegments([])).toEqual({});
  });

  it("finds a category from one segment", () => {
    expect(parseSearchSegments(["music"])).toEqual({ category: "music" });
  });

  it("finds a city from one segment", () => {
    expect(parseSearchSegments(["london"])).toEqual({ city: "london" });
  });

  it("finds category and city from ordered segments", () => {
    expect(parseSearchSegments(["music", "london"])).toEqual({
      category: "music",
      city: "london",
    });
  });

  it("normalises upper-case segments", () => {
    expect(parseSearchSegments(["LONDON", "MUSIC"])).toEqual({
      city: "london",
      category: "music",
    });
  });

  it("ignores unknown segments and still finds a category", () => {
    expect(parseSearchSegments(["unknown", "music"])).toEqual({
      category: "music",
    });
  });

  it("does not break when extra segments are present", () => {
    expect(parseSearchSegments(["sports", "berlin", "extra"])).toEqual({
      category: "sports",
      city: "berlin",
    });
  });

  it("supports arts category and new-york city", () => {
    expect(parseSearchSegments(["arts", "new-york"])).toEqual({
      category: "arts",
      city: "new-york",
    });
  });
});
