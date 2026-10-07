/**
 * Phase 3 visual QA screenshots.
 * Usage: node scripts/phase3-qa.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SITE_URL || "http://127.0.0.1:3000";
const OUT = path.resolve("qa-phase3/after");

const shots = [
  { name: "home-1440", w: 1440, h: 900, url: "/", full: false },
  { name: "home-390", w: 390, h: 844, url: "/", full: false },
  { name: "home-full-1440", w: 1440, h: 900, url: "/", full: true },
  { name: "home-full-390", w: 390, h: 844, url: "/", full: true },
  { name: "service-repair-1440", w: 1440, h: 900, url: "/services/remont-kotlov", full: false },
  { name: "documents-1440", w: 1440, h: 900, url: "/documents", full: false },
  { name: "about-1440", w: 1440, h: 900, url: "/about", full: false },
];

const browser = await chromium.launch({ channel: "chrome", headless: true });
await mkdir(OUT, { recursive: true });
const page = await browser.newPage();

for (const shot of shots) {
  await page.setViewportSize({ width: shot.w, height: shot.h });
  await page.goto(`${BASE}${shot.url}`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(OUT, `${shot.name}.png`),
    fullPage: shot.full,
  });
  console.log("ok", shot.name);
}

await browser.close();
console.log("saved to", OUT);
