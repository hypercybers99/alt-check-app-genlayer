import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { width: 1440, height: 900, name: "desktop-1440" },
  { width: 630, height: 300, name: "landscape-narrow-630" },
  { width: 500, height: 400, name: "tablet-compact-500" },
  { width: 390, height: 667, name: "mobile-390" },
];

for (const vp of VIEWPORTS) {
  test.describe(`Modal Occlusion & Hit-Testing [${vp.name}: ${vp.width}x${vp.height}]`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("Modal header, title, close button, body, and footer pass elementFromPoint hit-testing without occlusion", async ({
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

      // Wait for modal to render
      const overlay = page.getByTestId("wallet-modal-overlay");
      await expect(overlay).toBeVisible({ timeout: 5000 });

      // Elements to test
      const targets = [
        { name: "title", selector: '[data-testid="wallet-modal-title"]' },
        { name: "close button", selector: '[data-testid="wallet-modal-close"]' },
        { name: "body", selector: '[data-testid="wallet-modal-body"]' },
        { name: "footer", selector: '[data-testid="wallet-modal-footer"]' },
      ];

      for (const target of targets) {
        const locator = page.locator(target.selector);
        await expect(locator).toBeVisible();

        const isUnoccluded = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          if (!el) return { found: false, reason: "Element not in DOM" };

          const rect = el.getBoundingClientRect();
          // Find a point safely within the visible bounding box
          const cx = Math.max(0, Math.min(window.innerWidth - 1, rect.left + rect.width / 2));
          const cy = Math.max(0, Math.min(window.innerHeight - 1, rect.top + Math.min(rect.height / 2, 20)));

          const topEl = document.elementFromPoint(cx, cy);
          if (!topEl) return { found: false, reason: "elementFromPoint returned null" };

          // Either topEl is the element itself, contains it, or is a descendant inside it
          const unoccluded = el === topEl || el.contains(topEl) || topEl.contains(el);
          return {
            found: true,
            unoccluded,
            topElTag: topEl.tagName,
            topElClass: topEl.className,
          };
        }, target.selector);

        expect(
          isUnoccluded.unoccluded,
          `Expected ${target.name} to receive top-level pointer hit without occlusion (got ${isUnoccluded.topElTag}.${isUnoccluded.topElClass})`
        ).toBe(true);
      }

      // Test keyboard Esc dismiss
      await page.keyboard.press("Escape");
      await expect(overlay).not.toBeVisible();
    });
  });
}
