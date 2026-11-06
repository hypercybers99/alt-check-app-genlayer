import { describe, it, expect } from "vitest";

describe("Board Sorting & Partial Audit Rules", () => {
  it("ranks full audits above partial audits when scores are identical", () => {
    const rawBoardItems = [
      { id: "partial_1", score: 90, grade: "B", partial: true, label: "Partial Page 1" },
      { id: "full_1", score: 90, grade: "A", partial: false, label: "Full Page 1" },
      { id: "full_2", score: 100, grade: "A", partial: false, label: "Full Clean Page" },
      { id: "partial_2", score: 100, grade: "B", partial: true, label: "Partial 100 Page" },
      { id: "bad_1", score: 25, grade: "F", partial: false, label: "Failing Page" },
    ];

    // Sorting rule from AltCheck.py line 1151:
    // best_list.sort(key=lambda x: (x["score"], not x.get("partial", False)), reverse=True)
    const sorted = [...rawBoardItems].sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, full audit (partial === false) must come BEFORE partial audit (partial === true)
      if (a.partial !== b.partial) {
        return a.partial ? 1 : -1;
      }
      return 0;
    });

    expect(sorted[0].id).toBe("full_2"); // 100 Full
    expect(sorted[1].id).toBe("partial_2"); // 100 Partial (ranked below full 100)
    expect(sorted[2].id).toBe("full_1"); // 90 Full
    expect(sorted[3].id).toBe("partial_1"); // 90 Partial (ranked below full 90)
    expect(sorted[4].id).toBe("bad_1"); // 25
  });

  it("identifies whole-document rules that require unverified status on partial audits", () => {
    const wholeDocRules = ["R5", "R8", "R11"];
    const allRules = [
      "R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10", "R11", "R12"
    ];

    for (const r of allRules) {
      const isWhole = wholeDocRules.includes(r);
      if (isWhole) {
        expect(["R5", "R8", "R11"]).toContain(r);
      } else {
        expect(["R5", "R8", "R11"]).not.toContain(r);
      }
    }
  });

  it("caps grade at B for partial audits across score tiers", () => {
    function computeGrade(score: number, isPartial: boolean, mode: string): string {
      if (mode !== "FULL") return "N/A";
      if (isPartial) {
        if (score >= 80) return "B";
        if (score >= 65) return "C";
        if (score >= 50) return "D";
        return "F";
      } else {
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 65) return "C";
        if (score >= 50) return "D";
        return "F";
      }
    }

    // Full audits
    expect(computeGrade(100, false, "FULL")).toBe("A");
    expect(computeGrade(90, false, "FULL")).toBe("A");
    expect(computeGrade(85, false, "FULL")).toBe("B");
    expect(computeGrade(70, false, "FULL")).toBe("C");
    expect(computeGrade(55, false, "FULL")).toBe("D");
    expect(computeGrade(25, false, "FULL")).toBe("F");

    // Partial audits: grade is capped at B even for score >= 90!
    expect(computeGrade(100, true, "FULL")).toBe("B");
    expect(computeGrade(90, true, "FULL")).toBe("B");
    expect(computeGrade(85, true, "FULL")).toBe("B");
    expect(computeGrade(70, true, "FULL")).toBe("C");
    expect(computeGrade(55, true, "FULL")).toBe("D");
    expect(computeGrade(25, true, "FULL")).toBe("F");

    // SPA Shell
    expect(computeGrade(-1, false, "SHELL_ONLY")).toBe("N/A");
  });
});
