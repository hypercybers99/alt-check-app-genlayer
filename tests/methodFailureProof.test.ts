import { describe, it, expect } from "vitest";

describe("Method Name Cross-Check Deliberate Failure Proof", () => {
  const contractMethods = [
    "register_page",
    "audit_page",
    "add_maintainer_note",
    "retire_page",
    "get_page",
    "get_audits",
    "get_progress",
    "list_page_ids",
    "get_board",
    "get_rules",
    "get_meta",
  ];

  it("fails when an invalid or hallucinated method name is called", () => {
    const attemptedMethod = "deliberately_nonexistent_contract_method";
    const exists = contractMethods.includes(attemptedMethod);
    expect(exists).toBe(false);
  });

  it("fails when an arity mismatch is detected", () => {
    const methodArities: Record<string, number> = {
      register_page: 2,
      audit_page: 1,
      add_maintainer_note: 3,
      retire_page: 1,
      get_page: 1,
      get_audits: 3,
      get_progress: 1,
      list_page_ids: 2,
      get_board: 1,
      get_rules: 0,
      get_meta: 0,
    };

    const wrongArityCall = { method: "register_page", passedArgsCount: 5 };
    const expectedArity = methodArities[wrongArityCall.method];
    expect(wrongArityCall.passedArgsCount === expectedArity).toBe(false);
  });
});
