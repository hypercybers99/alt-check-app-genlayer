import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("Contract Public Methods & Arity Parity", () => {
  const contractPath = path.resolve(process.cwd(), "contracts-reference/AltCheck.py");
  const contractContent = fs.readFileSync(contractPath, "ascii");

  // Parse all @gl.public.(view|write) def <name>(self, ...)
  const methodRegex = /@gl\.public\.(view|write)\s*\n\s*def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/g;
  const contractMethods = new Map<string, { kind: string; arity: number; args: string[] }>();

  let m;
  while ((m = methodRegex.exec(contractContent)) !== null) {
    const kind = m[1];
    const name = m[2];
    const rawArgs = m[3].split(",").map((s) => s.trim()).filter(Boolean);
    // Ignore 'self'
    const args = rawArgs.filter((a) => !a.startsWith("self"));
    contractMethods.set(name, { kind, arity: args.length, args });
  }

  // List of all readContract / writeContract methods invoked by the dApp
  const dappInvocations = [
    { functionName: "register_page", arity: 2, kind: "write" },
    { functionName: "audit_page", arity: 1, kind: "write" },
    { functionName: "add_maintainer_note", arity: 3, kind: "write" },
    { functionName: "retire_page", arity: 1, kind: "write" },
    { functionName: "get_page", arity: 1, kind: "view" },
    { functionName: "get_audits", arity: 3, kind: "view" },
    { functionName: "get_progress", arity: 1, kind: "view" },
    { functionName: "list_page_ids", arity: 2, kind: "view" },
    { functionName: "get_board", arity: 1, kind: "view" },
    { functionName: "get_rules", arity: 0, kind: "view" },
    { functionName: "get_meta", arity: 0, kind: "view" },
  ];

  it("should find all 11 public contract methods in AltCheck.py", () => {
    expect(contractMethods.size).toBe(11);
    expect(contractMethods.has("register_page")).toBe(true);
    expect(contractMethods.has("audit_page")).toBe(true);
    expect(contractMethods.has("add_maintainer_note")).toBe(true);
    expect(contractMethods.has("retire_page")).toBe(true);
    expect(contractMethods.has("get_page")).toBe(true);
    expect(contractMethods.has("get_audits")).toBe(true);
    expect(contractMethods.has("get_progress")).toBe(true);
    expect(contractMethods.has("list_page_ids")).toBe(true);
    expect(contractMethods.has("get_board")).toBe(true);
    expect(contractMethods.has("get_rules")).toBe(true);
    expect(contractMethods.has("get_meta")).toBe(true);
  });

  it("every method called by the dApp exists in the contract with matching arity and kind", () => {
    for (const inv of dappInvocations) {
      const match = contractMethods.get(inv.functionName);
      expect(match, `Method ${inv.functionName} must exist in contract`).toBeDefined();
      expect(match?.arity, `Arity mismatch for ${inv.functionName}`).toBe(inv.arity);
      expect(match?.kind, `Kind mismatch for ${inv.functionName}`).toBe(inv.kind);
    }
  });

  it("contract has exactly 4 write methods and 7 view methods", () => {
    let writes = 0;
    let views = 0;
    contractMethods.forEach((v) => {
      if (v.kind === "write") writes++;
      if (v.kind === "view") views++;
    });
    expect(writes).toBe(4);
    expect(views).toBe(7);
  });
});
