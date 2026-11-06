import { describe, it, expect } from "vitest";
import { deriveTerminalOutcome } from "../src/lib/txLifecycle";

describe("Transaction Lifecycle States & Outcome Derivation", () => {
  const cases = [
    {
      desc: "Standard consensus agreement (3/5) with state readback confirmed",
      input: {
        rawStatusName: "FINALIZED",
        executionResultName: "SUCCESS",
        agreeCount: 3,
        totalVotes: 5,
        readbackConfirmed: true,
      },
      expectedState: "completed",
      expectedLabelContains: "Accepted by validators (3/5 agreed) - state applied",
    },
    {
      desc: "Consensus agreement (3/5) awaiting readback confirmation",
      input: {
        rawStatusName: "FINALIZED",
        executionResultName: "SUCCESS",
        agreeCount: 3,
        totalVotes: 5,
        readbackConfirmed: false,
      },
      expectedState: "accepted",
      expectedLabelContains: "confirming state",
    },
    {
      desc: "Consensus disagreement (0/5) with status FINALIZED (v1.0.0 defect pattern)",
      input: {
        rawStatusName: "FINALIZED",
        executionResultName: "MAJORITY_DISAGREE",
        agreeCount: 0,
        totalVotes: 5,
        readbackConfirmed: false,
      },
      expectedState: "disagreed",
      expectedLabelContains: "Validators did not agree (0/5) - state not applied",
    },
    {
      desc: "Consensus minority agreement (2/5) without quorum",
      input: {
        rawStatusName: "UNDETERMINED",
        executionResultName: "SUCCESS",
        agreeCount: 2,
        totalVotes: 5,
        readbackConfirmed: false,
      },
      expectedState: "disagreed",
      expectedLabelContains: "Validators did not agree (2/5)",
    },
    {
      desc: "Consensus agreed revert with decoded UserError payload",
      input: {
        rawStatusName: "FINALIZED",
        executionResultName: "ERROR",
        revertPayload: "url host not allowed",
        agreeCount: 3,
        totalVotes: 5,
        readbackConfirmed: false,
      },
      expectedState: "reverted",
      expectedLabelContains: "Reverted - state not applied (url host not allowed)",
    },
    {
      desc: "Non-HTML MIME consensus agreed revert",
      input: {
        rawStatusName: "FINALIZED",
        executionResultName: "ERROR",
        revertPayload: "not an html page",
        agreeCount: 3,
        totalVotes: 5,
        readbackConfirmed: false,
      },
      expectedState: "reverted",
      expectedLabelContains: "Reverted - state not applied (not an html page)",
    },
    {
      desc: "Audit cooldown active consensus agreed revert",
      input: {
        rawStatusName: "FINALIZED",
        executionResultName: "FAILED",
        revertPayload: "audit cooldown active",
        agreeCount: 3,
        totalVotes: 5,
        readbackConfirmed: false,
      },
      expectedState: "reverted",
      expectedLabelContains: "Reverted - state not applied (audit cooldown active)",
    },
  ];

  it.each(cases)("$desc", ({ input, expectedState, expectedLabelContains }) => {
    const outcome = deriveTerminalOutcome(input);
    expect(outcome.state).toBe(expectedState);
    expect(outcome.terminalLabel).toContain(expectedLabelContains);
  });
});
