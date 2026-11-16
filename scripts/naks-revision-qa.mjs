/**
 * NAKS revision screenshots → qa-screenshots/naks-revision/
 * Expects LOCAL_URL (default http://127.0.0.1:3010) serving the built site.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("qa-screenshots/naks-revision");
const BASE = process.env.LOCAL_URL || "http://127.0.0.1:3010";

const viewports = [
  { name: "375", w: 375, h: 812 },
  { name: "768", w: 768, h: 1024 },
  { name: "1440", w: 1440, h: 900 },
  { name: "1920", w: 1920, h: 1080 },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext();

for (const vp of viewports) {
  const page = await context.newPage();
  await page.setViewportSize({ width: vp.w, height: vp.h });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE}/documents/`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(OUT, `documents-viewport-${vp.name}.png`),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(OUT, `documents-full-${vp.name}.png`),
    fullPage: true,
  });

  const naks = page.locator("#naks");
  if ((await naks.count()) > 0) {
    await naks.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await naks.screenshot({
      path: path.join(OUT, `naks-section-${vp.name}.png`),
    });
  }

  await page.close();
  console.log(`ok ${vp.name}`);
}

await browser.close();
console.log(`saved → ${OUT}`);
