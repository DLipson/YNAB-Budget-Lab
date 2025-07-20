// src/config/index.test.ts

import { describe, it, expect } from "vitest";
import { YNAB_API_KEY } from "./index";

describe("Environment Configuration", () => {
  it("YNAB_API_KEY should be defined", () => {
    expect(YNAB_API_KEY).toBeDefined();
  });
});
