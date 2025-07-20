// Unit tests for [`parseCategoryName()`](src/utils/categoryParser.ts:3)

import { parseCategoryGroupName } from "./categoryParser";

describe("parseCategoryGroupName", () => {
  it("parses valid format", () => {
    expect(parseCategoryGroupName("Monthly:High:Fixed")).toEqual({
      category_group_name: "Monthly:High:Fixed",
      frequency: "Monthly",
      priority: "High",
      type: "Fixed",
    });
  });

  it("trims whitespace in valid format", () => {
    expect(parseCategoryGroupName("  Weekly : Low : Variable ")).toEqual({
      category_group_name: "  Weekly : Low : Variable ",
      frequency: "Weekly",
      priority: "Low",
      type: "Variable",
    });
  });

  it("returns group name only for invalid format (too few parts)", () => {
    expect(parseCategoryGroupName("Monthly:High")).toEqual({
      category_group_name: "Monthly:High",
    });
  });

  it("returns group name only for invalid format (too many parts)", () => {
    expect(parseCategoryGroupName("A:B:C:D")).toEqual({
      category_group_name: "A:B:C:D",
    });
  });

  it("returns group name only for empty string", () => {
    expect(parseCategoryGroupName("")).toEqual({
      category_group_name: "",
    });
  });

  it("returns group name only for non-string input", () => {
    expect(parseCategoryGroupName(null as unknown as string)).toEqual({
      category_group_name: "null",
    });
    expect(parseCategoryGroupName(123 as unknown as string)).toEqual({
      category_group_name: "123",
    });
  });

  it("returns group name only if any part is empty", () => {
    expect(parseCategoryGroupName("Monthly::Fixed")).toEqual({
      category_group_name: "Monthly::Fixed",
    });
    expect(parseCategoryGroupName(":High:Fixed")).toEqual({
      category_group_name: ":High:Fixed",
    });
    expect(parseCategoryGroupName("Monthly:High:")).toEqual({
      category_group_name: "Monthly:High:",
    });
  });
});
