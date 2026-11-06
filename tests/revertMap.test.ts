import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { REVERT_MAP, getRevertExplanation } from "../src/lib/revertMap";

describe("revertMap Completeness & Exact Match", () => {
  const contractPath = path.resolve(process.cwd(), "contracts-reference/AltCheck.py");
  const contractContent = fs.readFileSync(contractPath, "ascii");

  // Extract all UserError messages from contract source
  const errorRegex = /UserError\(\s*["']([^"']+)["']\s*\)/g;
  const contractErrors = new Set<string>();
  let match;
  while ((match = errorRegex.exec(contractContent)) !== null) {
    contractErrors.add(match[1]);
  }

  // Also include consensus FAIL error messages that get unpacked into UserErrors
  const failRegex = /FAIL\|([a-zA-Z0-9_\- ]+)/g;
  while ((match = failRegex.exec(contractContent)) !== null) {
    contractErrors.add(match[1]);
  }

  it("every contract UserError string is mapped in revertMap", () => {
    for (const err of contractErrors) {
      expect(REVERT_MAP[err], `Missing mapped explanation for contract error: "${err}"`).toBeDefined();
      expect(REVERT_MAP[err].title).toBeTruthy();
      expect(REVERT_MAP[err].explanation).toBeTruthy();
      expect(REVERT_MAP[err].action).toBeTruthy();
    }
  });

  it("getRevertExplanation matches substring contract errors correctly", () => {
    const res1 = getRevertExplanation("Execution reverted: url host not allowed");
    expect(res1.title).toBe("Host Address Forbidden");

    const res2 = getRevertExplanation("gl.vm.UserError: not an html page");
    expect(res2.title).toBe("Target Is Not An HTML Page");

    const res3 = getRevertExplanation("audit cooldown active (please wait)");
    expect(res3.title).toBe("Audit Cooldown Active");
  });

  it("unknown errors produce a friendly fallback explanation", () => {
    const res = getRevertExplanation("some unpredictable network hiccup");
    expect(res.title).toBe("Transaction Reverted");
    expect(res.explanation).toContain("some unpredictable network hiccup");
  });
});
