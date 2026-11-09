import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");

const BASE_URL = process.env.APP_URL || "https://alt-check-app-genlayer.vercel.app";

const SCENARIOS = [
  { name: "Landing Page (/)", path: "/", isModal: false },
  { name: "Board (/board)", path: "/board", isModal: false },
  { name: "Register Page (/register)", path: "/register", isModal: false },
  { name: "Page Detail (/p/55d0e52560ab)", path: "/p/55d0e52560ab", isModal: false },
  { name: "Methodology (/method)", path: "/method", isModal: false },
  { name: "Evidence (/evidence)", path: "/evidence", isModal: false },
  { name: "Wallet & Funds (/wallet)", path: "/wallet", isModal: false },
  { name: "Dialog: WalletModal", path: "/", isModal: true, modalType: "wallet" },
  { name: "Dialog: TxPipelineModal", path: "/register?testPipeline=1", isModal: true, modalType: "pipeline" },
];

const VIEWPORTS = [
  { name: "1440x900", width: 1440, height: 900 },
  { name: "500x400", width: 500, height: 400 },
  { name: "390x667", width: 390, height: 667 },
];

async function main() {
  console.log(`Starting comprehensive Axe-core matrix against ${BASE_URL}...`);
  const browser = await chromium.launch();
  const rows = [];
  const matrixRecords = [];

  let totalCritical = 0;
  let totalSerious = 0;
  let totalModerate = 0;
  let totalMinor = 0;

  for (const scen of SCENARIOS) {
    for (const vp of VIEWPORTS) {
      process.stdout.write(`Testing ${scen.name} at ${vp.name}... `);
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${scen.path}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(800);

      if (scen.isModal) {
        if (scen.modalType === "wallet") {
          const desktopBtn = page.getByTestId("open-wallet-modal");
          if (await desktopBtn.isVisible()) {
            await desktopBtn.click();
          } else {
            const mobileMenuBtn = page.getByTestId("mobile-menu-btn");
            if (await mobileMenuBtn.isVisible()) {
              await mobileMenuBtn.click();
            }
            const mobileBtn = page.getByTestId("open-wallet-modal-mobile");
            await mobileBtn.click();
          }
          await page.waitForSelector('[data-testid="wallet-modal-overlay"]');
        } else if (scen.modalType === "pipeline") {
          await page.waitForSelector('[data-testid="tx-pipeline-overlay"]');
        }
      }

      let builder = new AxeBuilder({ page });
      if (scen.isModal) {
        const selector = scen.modalType === "wallet" ? '[data-testid="wallet-modal-overlay"]' : '[data-testid="tx-pipeline-overlay"]';
        builder = builder.include(selector);
      }

      const results = await builder.analyze();
      await context.close();

      const counts = { critical: 0, serious: 0, moderate: 0, minor: 0 };
      const violations = [];

      for (const v of results.violations) {
        if (counts[v.impact] !== undefined) {
          counts[v.impact] += v.nodes.length;
        }

        const selectors = v.nodes.slice(0, 3).map((node) => {
          if (Array.isArray(node.target)) {
            return node.target.join(" > ");
          }
          return String(node.target);
        });

        violations.push({
          id: v.id,
          impact: v.impact,
          description: v.description,
          selectors: selectors,
        });
      }

      totalCritical += counts.critical;
      totalSerious += counts.serious;
      totalModerate += counts.moderate;
      totalMinor += counts.minor;

      rows.push({
        scenario: scen.name,
        viewport: vp.name,
        critical: counts.critical,
        serious: counts.serious,
        moderate: counts.moderate,
        minor: counts.minor,
      });

      matrixRecords.push({
        scenario: scen.name,
        viewport: vp.name,
        counts,
        violations,
      });

      console.log(`Crit: ${counts.critical}, Ser: ${counts.serious}, Mod: ${counts.moderate}, Min: ${counts.minor}`);
    }
  }

  await browser.close();

  const outData = {
    testedAt: new Date().toISOString(),
    targetUrl: BASE_URL,
    summary: {
      totalRuns: matrixRecords.length,
      critical: totalCritical,
      serious: totalSerious,
      moderate: totalModerate,
      minor: totalMinor,
    },
    results: matrixRecords,
  };

  const outPath = path.join(rootDir, "docs", "axe_matrix.json");
  fs.writeFileSync(outPath, JSON.stringify(outData, null, 2), "utf8");
  console.log(`\nSaved matrix records to ${outPath}\n`);

  console.log("### Comprehensive Axe-Core Accessibility Matrix\n");
  console.log("| Route / Dialog | Viewport | Critical | Serious | Moderate | Minor |");
  console.log("| :--- | :--- | :---: | :---: | :---: | :---: |");
  for (const r of rows) {
    console.log(`| ${r.scenario} | ${r.viewport} | ${r.critical} | ${r.serious} | ${r.moderate} | ${r.minor} |`);
  }
  console.log("");
}

main().catch(console.error);
