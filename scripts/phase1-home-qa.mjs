/**
 * Phase 1 homepage visual QA at required widths.
 * Usage: SITE_URL=http://127.0.0.1:4173 node scripts/phase1-home-qa.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SITE_URL || "http://127.0.0.1:4173";
const OUT = path.resolve("qa-screenshots");

const viewports = [
  { name: "phase1-home-375", w: 375, h: 812 },
  { name: "phase1-home-768", w: 768, h: 1024 },
  { name: "phase1-home-1440", w: 1440, h: 900 },
  { name: "phase1-home-1920", w: 1920, h: 1080 },
];

async function overflowReport(page) {
  return page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    const overflowing = [];
    if (docW > winW + 1) {
      document.querySelectorAll("body *").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.right > winW + 2) {
          overflowing.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || "").toString().slice(0, 80),
            right: Math.round(r.right),
          });
        }
      });
    }
    const h1 = Array.from(document.querySelectorAll("h1")).map((el) =>
      el.textContent?.trim(),
    );
    return {
      ok: docW <= winW + 1,
      scrollWidth: docW,
      innerWidth: winW,
      h1,
      offenders: overflowing.slice(0, 8),
    };
  });
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
const results = [];

for (const shot of viewports) {
  await page.setViewportSize({ width: shot.w, height: shot.h });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const overflow = await overflowReport(page);
  results.push({ name: shot.name, ...overflow });
  await page.screenshot({
    path: path.join(OUT, `${shot.name}.png`),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(OUT, `${shot.name}-full.png`),
    fullPage: true,
  });
}

await writeFile(path.join(OUT, "phase1-overflow.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
