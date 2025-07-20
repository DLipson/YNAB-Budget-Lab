// Unit tests for [`parseCategoryName()`](src/utils/categoryParser.ts:3)

import { parseCategoryName } from "./categoryParser";

describe("parseCategoryName", () => {
  it("parses valid format", () => {
    expect(parseCategoryName("Monthly:High:Fixed")).toEqual({
      name: "Monthly:High:Fixed",
      frequency: "Monthly",
      priority: "High",
      type: "Fixed",
    });
  });

  it("trims whitespace in valid format", () => {
    expect(parseCategoryName("  Weekly : Low : Variable ")).toEqual({
      name: "  Weekly : Low : Variable ",
      frequency: "Weekly",
      priority: "Low",
      type: "Variable",
    });
  });

  it("returns name only for invalid format (too few parts)", () => {
    expect(parseCategoryName("Monthly:High")).toEqual({
      name: "Monthly:High",
    });
  });

  it("returns name only for invalid format (too many parts)", () => {
    expect(parseCategoryName("A:B:C:D")).toEqual({
      name: "A:B:C:D",
    });
  });

  it("returns name only for empty string", () => {
    expect(parseCategoryName("")).toEqual({
      name: "",
    });
  });

  it("returns name only for non-string input", () => {
    expect(parseCategoryName(null as any)).toEqual({
      name: "null",
    });
    expect(parseCategoryName(123 as any)).toEqual({
      name: "123",
    });
  });

  it("returns name only if any part is empty", () => {
    expect(parseCategoryName("Monthly::Fixed")).toEqual({
      name: "Monthly::Fixed",
    });
    expect(parseCategoryName(":High:Fixed")).toEqual({
      name: ":High:Fixed",
    });
    expect(parseCategoryName("Monthly:High:")).toEqual({
      name: "Monthly:High:",
    });
  });
});
