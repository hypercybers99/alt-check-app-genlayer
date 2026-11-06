import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const ROUTES = [
  { path: "/", name: "Landing Page" },
  { path: "/board", name: "Board" },
  { path: "/register", name: "Register Page" },
  { path: "/p/8ae6a69c2bd7", name: "Page Detail" },
  { path: "/method", name: "Methodology" },
  { path: "/evidence", name: "Evidence" },
  { path: "/wallet", name: "Wallet & Funds" },
];

for (const route of ROUTES) {
  test(`Route [${route.name}] (${route.path}) passes axe-core accessibility scan`, async ({
    page,
  }) => {
    await page.goto(route.path);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const criticalViolations = accessibilityScanResults.violations.filter((v) => v.impact === "critical");
    const seriousViolations = accessibilityScanResults.violations.filter((v) => v.impact === "serious");

    expect(criticalViolations).toHaveLength(0);
    expect(seriousViolations).toHaveLength(0);
  });
}

test("Wallet Modal dialog passes axe-core accessibility scan and keyboard trap", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");

  const desktopBtn = page.getByTestId("open-wallet-modal");
  const mobileMenuBtn = page.getByTestId("mobile-menu-btn");
  if (await desktopBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await desktopBtn.click();
  } else if (await mobileMenuBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await mobileMenuBtn.click();
    const mobileBtn = page.getByTestId("open-wallet-modal-mobile");
    await expect(mobileBtn).toBeVisible({ timeout: 5000 });
    await mobileBtn.click();
  } else {
    await desktopBtn.click({ force: true });
  }

  const overlay = page.getByTestId("wallet-modal-overlay");
  await expect(overlay).toBeVisible();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[data-testid="wallet-modal-overlay"]')
    .analyze();

  const criticalViolations = accessibilityScanResults.violations.filter((v) => v.impact === "critical");
  const seriousViolations = accessibilityScanResults.violations.filter((v) => v.impact === "serious");

  expect(criticalViolations).toHaveLength(0);
  expect(seriousViolations).toHaveLength(0);

  // Test keyboard navigation
  await page.keyboard.press("Tab");
  const activeTag = await page.evaluate(() => document.activeElement?.tagName);
  expect(["BUTTON", "INPUT", "A", "DIV"]).toContain(activeTag);

  await page.keyboard.press("Escape");
  await expect(overlay).not.toBeVisible();
});

test("TxPipelineModal dialog passes axe-core accessibility scan", async ({
  page,
}) => {
  await page.goto("/register?testPipeline=1");
  await page.waitForLoadState("domcontentloaded");

  const overlay = page.getByTestId("tx-pipeline-overlay");
  await expect(overlay).toBeVisible();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[data-testid="tx-pipeline-overlay"]')
    .analyze();

  const criticalViolations = accessibilityScanResults.violations.filter((v) => v.impact === "critical");
  const seriousViolations = accessibilityScanResults.violations.filter((v) => v.impact === "serious");

  expect(criticalViolations).toHaveLength(0);
  expect(seriousViolations).toHaveLength(0);

  // Click Done to dismiss
  await page.getByTestId("tx-pipeline-footer-btn").click();
  await expect(overlay).not.toBeVisible();
});
