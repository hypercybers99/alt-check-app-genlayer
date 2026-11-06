import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Contract Constants & Limits Parity", () => {
  const contractPath = path.resolve(process.cwd(), "contracts-reference/AltCheck.py");
  const contractContent = fs.readFileSync(contractPath, "ascii");

  function getConstInt(name: string): number {
    const re = new RegExp(`${name}\\s*=\\s*(\\d+)`);
    const m = contractContent.match(re);
    if (!m) throw new Error(`Constant ${name} not found in contract`);
    return parseInt(m[1], 10);
  }

  it("contract constants match dApp configuration and limits", () => {
    expect(getConstInt("MAX_BODY_BYTES")).toBe(300000);
    expect(getConstInt("MAX_ELEMENTS")).toBe(3000);
    expect(getConstInt("SHELL_TEXT_THRESHOLD")).toBe(200);
    expect(getConstInt("AUDIT_COOLDOWN_SECONDS")).toBe(300);
    expect(getConstInt("MAX_AUDITS_PER_PAGE")).toBe(12);
    expect(getConstInt("PAGE_LIMIT_MAX")).toBe(50);
    expect(getConstInt("LABEL_MIN")).toBe(3);
    expect(getConstInt("LABEL_MAX")).toBe(80);
    expect(getConstInt("NOTE_MIN")).toBe(5);
    expect(getConstInt("NOTE_MAX")).toBe(280);
    expect(getConstInt("MAX_NOTES_PER_AUDIT")).toBe(3);
    expect(getConstInt("SNIPPET_MAX")).toBe(120);
    expect(getConstInt("MAX_SNIPPETS_PER_RULE")).toBe(5);
    expect(getConstInt("MODEL_ALT_SAMPLE")).toBe(8);
    expect(getConstInt("MODEL_LINK_SAMPLE")).toBe(8);
    expect(getConstInt("MODEL_PENALTY_PER_VAGUE")).toBe(2);
    expect(getConstInt("MODEL_PENALTY_CAP")).toBe(10);
  });
});
