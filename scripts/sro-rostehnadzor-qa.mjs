/**
 * SRO / Rostekhnadzor revision screenshots → qa-screenshots/sro-rostehnadzor-revision/
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("qa-screenshots/sro-rostehnadzor-revision");
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

  const overflowX = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });
  if (overflowX) console.warn(`overflow-x at ${vp.name}`);

  const h1Count = await page.locator("h1").count();
  console.log(`${vp.name}: h1=${h1Count}`);

  await page.screenshot({
    path: path.join(OUT, `documents-viewport-${vp.name}.png`),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(OUT, `documents-full-${vp.name}.png`),
    fullPage: true,
  });

  for (const id of ["naks", "industrial-safety", "sro"]) {
    const section = page.locator(`#${id}`);
    if ((await section.count()) > 0) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await section.screenshot({
        path: path.join(OUT, `${id}-${vp.name}.png`),
      });
    }
  }

  await page.close();
}

await browser.close();
console.log(`saved → ${OUT}`);
