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

    const seriousViolations = accessibilityScanResults.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious"
    );

    expect(
      seriousViolations,
      `Axe detected serious/critical violations on ${route.path}: ${JSON.stringify(
        seriousViolations,
        null,
        2
      )}`
    ).toHaveLength(0);
  });
}

test("Wallet Modal dialog passes axe-core accessibility scan and keyboard trap", async ({
  page,
}) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");

  const desktopBtn = page.getByTestId("open-wallet-modal");
  if (await desktopBtn.isVisible()) {
    await desktopBtn.click();
  } else {
    const mobileMenuBtn = page.getByTestId("mobile-menu-btn");
    await expect(mobileMenuBtn).toBeVisible({ timeout: 5000 });
    await mobileMenuBtn.click();

    const mobileBtn = page.getByTestId("open-wallet-modal-mobile");
    await expect(mobileBtn).toBeVisible({ timeout: 5000 });
    await mobileBtn.click();
  }

  const overlay = page.getByTestId("wallet-modal-overlay");
  await expect(overlay).toBeVisible();

  // Run Axe scan on modal
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[data-testid="wallet-modal-overlay"]')
    .analyze();

  const seriousViolations = accessibilityScanResults.violations.filter(
    (v) => v.impact === "critical" || v.impact === "serious"
  );

  expect(seriousViolations).toHaveLength(0);

  // Test keyboard navigation
  await page.keyboard.press("Tab");
  const activeTag = await page.evaluate(() => document.activeElement?.tagName);
  expect(["BUTTON", "INPUT", "A", "DIV"]).toContain(activeTag);

  // Escape closes the modal
  await page.keyboard.press("Escape");
  await expect(overlay).not.toBeVisible();
});
