import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const BASE_URL = process.env.APP_URL || "http://localhost:4173";

const SCENARIOS = [
  { name: "Landing Page (/)", path: "/", isModal: false },
  { name: "Board (/board)", path: "/board", isModal: false },
  { name: "Register Page (/register)", path: "/register", isModal: false },
  { name: "Page Detail (/p/8ae6a69c2bd7)", path: "/p/8ae6a69c2bd7", isModal: false },
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

  for (const scen of SCENARIOS) {
    for (const vp of VIEWPORTS) {
      console.log(`Testing ${scen.name} at ${vp.name}...`);
      const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${scen.path}`, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(600);

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
      for (const v of results.violations) {
        if (counts[v.impact] !== undefined) {
          counts[v.impact] += v.nodes.length;
        }
      }

      rows.push({
        scenario: scen.name,
        viewport: vp.name,
        critical: counts.critical,
        serious: counts.serious,
        moderate: counts.moderate,
        minor: counts.minor,
      });
      process.stdout.write(".");
    }
  }

  await browser.close();
  console.log("\nDone.\n");

  console.log("### Comprehensive Axe-Core Accessibility Matrix\n");
  console.log("| Route / Dialog | Viewport | Critical | Serious | Moderate | Minor |");
  console.log("| :--- | :--- | :---: | :---: | :---: | :---: |");
  for (const r of rows) {
    console.log(`| ${r.scenario} | ${r.viewport} | ${r.critical} | ${r.serious} | ${r.moderate} | ${r.minor} |`);
  }
}

main().catch(console.error);
