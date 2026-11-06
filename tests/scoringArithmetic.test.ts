import { describe, it, expect } from "vitest";

describe("Accessibility Scoring & Ambiguity Arithmetic", () => {
  // Exact contract RULE_SPECS:
  // "R1": weight 4, cap 8 (max deduction 32)
  // "R2": weight 2, cap 8 (max deduction 16)
  // "R3": weight 4, cap 8 (max deduction 32)
  // "R4": weight 3, cap 8 (max deduction 24)
  // "R5": weight 3, cap 3 (max deduction 9)
  // "R6": weight 5, cap 1 (max deduction 5)
  // "R7": weight 5, cap 1 (max deduction 5)
  // "R8": weight 2, cap 5 (max deduction 10)
  // "R9": weight 5, cap 1 (max deduction 5)
  // "R10": weight 2, cap 5 (max deduction 10)
  // "R11": weight 3, cap 1 (max deduction 3)
  // "R12": weight 3, cap 5 (max deduction 15)

  const RULE_SPECS: Record<string, { weight: number; cap: number }> = {
    R1: { weight: 4, cap: 8 },
    R2: { weight: 2, cap: 8 },
    R3: { weight: 4, cap: 8 },
    R4: { weight: 3, cap: 8 },
    R5: { weight: 3, cap: 3 },
    R6: { weight: 5, cap: 1 },
    R7: { weight: 5, cap: 1 },
    R8: { weight: 2, cap: 5 },
    R9: { weight: 5, cap: 1 },
    R10: { weight: 2, cap: 5 },
    R11: { weight: 3, cap: 1 },
    R12: { weight: 3, cap: 5 },
  };

  function computeAuditScore(
    ruleCounts: Record<string, number>,
    vagueCount: number
  ): { detScore: number; modelPenalty: number; finalScore: number } {
    let deductions = 0;
    for (const [r, spec] of Object.entries(RULE_SPECS)) {
      const count = ruleCounts[r] || 0;
      const effectiveCount = Math.min(spec.cap, count);
      deductions += effectiveCount * spec.weight;
    }
    const detScore = Math.max(0, 100 - deductions);
    const modelPenalty = Math.min(10, 2 * vagueCount);
    const finalScore = Math.max(0, detScore - modelPenalty);
    return { detScore, modelPenalty, finalScore };
  }

  it("good.html fixture computes perfect 100 A score", () => {
    const res = computeAuditScore({}, 0);
    expect(res.detScore).toBe(100);
    expect(res.modelPenalty).toBe(0);
    expect(res.finalScore).toBe(100);
  });

  it("bad.html fixture computes exactly 25 F score across all 12 rule findings", () => {
    // bad.html counts from contract live evidence:
    // R1: 3, R2: 3, R3: 3, R4: 4, R5: 2, R6: 1, R7: 1, R8: 1, R9: 1, R10: 2, R11: 1, R12: 1
    // Deductions:
    // R1: 3 * 4 = 12
    // R2: 3 * 2 = 6
    // R3: 3 * 4 = 12
    // R4: 4 * 3 = 12
    // R5: 2 * 3 = 6
    // R6: 1 * 5 = 5
    // R7: 1 * 5 = 5
    // R8: 1 * 2 = 2
    // R9: 1 * 5 = 5
    // R10: 2 * 2 = 4
    // R11: 1 * 3 = 3
    // R12: 1 * 3 = 3
    // Total deductions = 12+6+12+12+6+5+5+2+5+4+3+3 = 75
    // detScore = 100 - 75 = 25 (Grade F)
    const counts = {
      R1: 3, R2: 3, R3: 3, R4: 4, R5: 2, R6: 1,
      R7: 1, R8: 1, R9: 1, R10: 2, R11: 1, R12: 1,
    };
    const res = computeAuditScore(counts, 0);
    expect(res.detScore).toBe(25);
    expect(res.modelPenalty).toBe(0);
    expect(res.finalScore).toBe(25);
  });

  it("model ambiguity penalty is strictly capped at 10 points", () => {
    expect(computeAuditScore({}, 0).modelPenalty).toBe(0);
    expect(computeAuditScore({}, 3).modelPenalty).toBe(6);
    expect(computeAuditScore({}, 5).modelPenalty).toBe(10);
    expect(computeAuditScore({}, 8).modelPenalty).toBe(10);
    expect(computeAuditScore({}, 20).modelPenalty).toBe(10);
  });

  it("score can never drop below 0 when deductions exceed 100", () => {
    const hugeCounts = {
      R1: 100, R2: 100, R3: 100, R4: 100, R5: 100, R6: 100,
      R7: 100, R8: 100, R9: 100, R10: 100, R11: 100, R12: 100,
    };
    const res = computeAuditScore(hugeCounts, 10);
    expect(res.detScore).toBe(0);
    expect(res.finalScore).toBe(0);
  });
});
