import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import evidenceData from "../src/data/evidenceData.json";

describe("Evidence Data Reconciliation & Integrity", () => {
  const e2eRaw = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../docs/e2e_production_evidence.json"), "utf8")
  );
  const storedPages = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../docs/stored_pages.json"), "utf8")
  );

  it("verifies displayed URLs in evidenceData.json strictly match on-chain stored_url in docs/stored_pages.json", () => {
    evidenceData.positiveScenarios.forEach((scenario) => {
      const stored = storedPages.find((p: any) => p.id === scenario.pageId);
      expect(stored, `Page ID ${scenario.pageId} not found in docs/stored_pages.json`).toBeDefined();
      expect(
        scenario.url,
        `Displayed URL for page ${scenario.pageId} must exactly match on-chain stored_url`
      ).toBe(stored.stored_url);

      if (stored.http_status !== 200) {
        expect(scenario.notice).toBe(
          `The source host no longer serves this URL (HTTP ${stored.http_status}). The stored audit result is still readable; a new audit of this page cannot be run.`
        );
      } else {
        expect(scenario.notice).toBeNull();
      }
    });
  });

  it("verifies e2eLifecycle in evidenceData.json strictly matches docs/e2e_production_evidence.json", () => {
    expect(evidenceData.e2eLifecycle).toHaveLength(e2eRaw.length);
    evidenceData.e2eLifecycle.forEach((item, idx) => {
      expect(item.txHash).toBe(e2eRaw[idx].txHash);
      expect(item.fnName).toBe(e2eRaw[idx].fnName);
      expect(item.votes).toBe(e2eRaw[idx].votes);
      expect(item.sender).toBe(e2eRaw[idx].sender);
      expect(item.rawStatusName).toBe(e2eRaw[idx].rawStatusName);
    });
  });

  it("verifies EVERY transaction hash is exactly 66 characters matching 0x[a-fA-F0-9]{64}", () => {
    const hashRegex = /^0x[a-fA-F0-9]{64}$/;

    evidenceData.positiveScenarios.forEach((s) => {
      expect(s.reg).toMatch(hashRegex);
      expect(s.reg).toHaveLength(66);
      expect(s.audit).toMatch(hashRegex);
      expect(s.audit).toHaveLength(66);
    });

    evidenceData.revertScenarios.forEach((r) => {
      expect(r.hash).toMatch(hashRegex);
      expect(r.hash).toHaveLength(66);
    });

    evidenceData.e2eLifecycle.forEach((e) => {
      expect(e.txHash).toMatch(hashRegex);
      expect(e.txHash).toHaveLength(66);
    });
  });

  it("verifies the 15 expected reverts are correctly populated with honest derived labels", () => {
    expect(evidenceData.revertScenarios).toHaveLength(15);
    evidenceData.revertScenarios.forEach((r) => {
      expect(r.derivedLabel).toBe("Reverted - state not applied");
      expect(r.rawStatus).toBe("FINALIZED");
      expect(["3/5", "4/5", "5/5"]).toContain(r.votes);
      expect(r.err.length).toBeGreaterThan(0);
    });
  });

  it("verifies the partial audit record is present with real tx hash, score 90, grade B capped", () => {
    const partialScenario = evidenceData.positiveScenarios.find((s) =>
      s.fixture.includes("large.html")
    );
    expect(partialScenario).toBeDefined();
    expect(partialScenario?.audit).toBe(
      "0xf16c3954f12aa8d2ad1ab13ecbd4f68e3374c57d90e525035eadde7c888f9867"
    );
    expect(partialScenario?.res).toContain("Score 90");
    expect(partialScenario?.res).toContain("Grade B capped");
  });
});
