import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { width: 1440, height: 900, name: "desktop-1440x900" },
  { width: 630, height: 300, name: "narrow-landscape-630x300" },
  { width: 500, height: 400, name: "compact-tablet-500x400" },
  { width: 390, height: 667, name: "mobile-390x667" },
];

for (const vp of VIEWPORTS) {
  test.describe(`Modal Occlusion & Hit-Testing [${vp.name}]`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("WalletModal: title, close control, body, and footer button pass elementFromPoint without occlusion", async ({
      page,
    }) => {
      await page.goto("/");
      await page.waitForLoadState("domcontentloaded");

      // Open wallet modal
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
      await expect(overlay).toBeVisible({ timeout: 5000 });

      const targets = [
        { name: "title", selector: '[data-testid="wallet-modal-title"]' },
        { name: "close button", selector: '[data-testid="wallet-modal-close"]' },
        { name: "body", selector: '[data-testid="wallet-modal-body"]' },
        { name: "footer button", selector: '[data-testid="wallet-modal-footer-close"]' },
      ];

      for (const target of targets) {
        const locator = page.locator(target.selector);
        await expect(locator).toBeVisible();

        const hit = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return { found: false, reason: "Element not in DOM" };

          const rect = el.getBoundingClientRect();
          const cx = Math.max(0, Math.min(window.innerWidth - 1, rect.left + rect.width / 2));
          const cy = Math.max(0, Math.min(window.innerHeight - 1, rect.top + Math.min(rect.height / 2, 16)));

          const topEl = document.elementFromPoint(cx, cy);
          if (!topEl) return { found: false, reason: "elementFromPoint returned null" };

          const unoccluded = el === topEl || el.contains(topEl) || topEl.contains(el);
          return {
            found: true,
            unoccluded,
            topElTag: topEl.tagName,
            topElClass: topEl.className,
          };
        }, target.selector);

        expect(
          hit.unoccluded,
          `Expected WalletModal ${target.name} to receive pointer hit without occlusion (got ${hit.topElTag}.${hit.topElClass})`
        ).toBe(true);
      }

      await page.keyboard.press("Escape");
      await expect(overlay).not.toBeVisible();
    });

    test("TxPipelineModal: title, close control, body, and footer button pass elementFromPoint without occlusion", async ({
      page,
    }) => {
      await page.goto("/register?testPipeline=1");
      await page.waitForLoadState("domcontentloaded");

      const overlay = page.getByTestId("tx-pipeline-overlay");
      await expect(overlay).toBeVisible({ timeout: 5000 });

      const targets = [
        { name: "title", selector: '[data-testid="tx-pipeline-title"]' },
        { name: "close button", selector: '[data-testid="tx-pipeline-close"]' },
        { name: "body", selector: '[data-testid="tx-pipeline-body"]' },
        { name: "footer button", selector: '[data-testid="tx-pipeline-footer-btn"]' },
      ];

      for (const target of targets) {
        const locator = page.locator(target.selector);
        await expect(locator).toBeVisible();

        const hit = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return { found: false, reason: "Element not in DOM" };

          const rect = el.getBoundingClientRect();
          const cx = Math.max(0, Math.min(window.innerWidth - 1, rect.left + rect.width / 2));
          const cy = Math.max(0, Math.min(window.innerHeight - 1, rect.top + Math.min(rect.height / 2, 16)));

          const topEl = document.elementFromPoint(cx, cy);
          if (!topEl) return { found: false, reason: "elementFromPoint returned null" };

          const unoccluded = el === topEl || el.contains(topEl) || topEl.contains(el);
          return {
            found: true,
            unoccluded,
            topElTag: topEl.tagName,
            topElClass: topEl.className,
          };
        }, target.selector);

        expect(
          hit.unoccluded,
          `Expected TxPipelineModal ${target.name} to receive pointer hit without occlusion (got ${hit.topElTag}.${hit.topElClass})`
        ).toBe(true);
      }

      // Close modal by clicking footer button
      const footerBtn = page.getByTestId("tx-pipeline-footer-btn");
      await footerBtn.click();
      await expect(overlay).not.toBeVisible();
    });
  });
}
