import { chromium } from "playwright";

const routes = [
  { path: "/", name: "home" },
  { path: "/board", name: "board" },
  { path: "/register", name: "register" },
  { path: "/p/cf95eac13fb0", name: "page-detail" },
  { path: "/method", name: "method" },
  { path: "/evidence", name: "evidence" },
  { path: "/wallet", name: "wallet" },
];

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext();

  for (const r of routes) {
    console.log(`Capturing ${r.name}...`);
    const page = await context.newPage();

    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("https://alt-check-app-genlayer.vercel.app" + r.path, { waitUntil: "networkidle" });
    await page.screenshot({ path: "docs/screenshots/" + r.name + "-desktop.png", fullPage: true });

    // Mobile 390px
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("https://alt-check-app-genlayer.vercel.app" + r.path, { waitUntil: "networkidle" });
    await page.screenshot({ path: "docs/screenshots/" + r.name + "-390px.png", fullPage: true });

    await page.close();
  }

  // Also capture with dialog open
  console.log("Capturing wallet modal...");
  const modalPage = await context.newPage();
  await modalPage.setViewportSize({ width: 1440, height: 900 });
  await modalPage.goto("https://alt-check-app-genlayer.vercel.app/", { waitUntil: "networkidle" });
  await modalPage.click('button[aria-label="Manage Wallet"]');
  await modalPage.waitForSelector("#wallet-modal-title");
  await modalPage.screenshot({ path: "docs/screenshots/modal-wallet-desktop.png" });

  await modalPage.setViewportSize({ width: 390, height: 844 });
  await modalPage.screenshot({ path: "docs/screenshots/modal-wallet-390px.png" });
  await modalPage.close();

  await browser.close();
  console.log("Captured all curated screenshots successfully!");
}

capture().catch(console.error);
