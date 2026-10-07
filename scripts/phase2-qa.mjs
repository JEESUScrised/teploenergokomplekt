/**
 * Phase 2 visual QA: overflow check + full-page screenshots via Playwright.
 * Usage: node scripts/phase2-qa.mjs
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SITE_URL || "http://localhost:3000";
const OUT = path.resolve("qa-phase2");

const viewports = [
  { name: "home-1920", w: 1920, h: 1080, url: "/" },
  { name: "home-1440", w: 1440, h: 900, url: "/" },
  { name: "home-1366", w: 1366, h: 768, url: "/" },
  { name: "home-1280", w: 1280, h: 800, url: "/" },
  { name: "home-1024", w: 1024, h: 768, url: "/" },
  { name: "home-768", w: 768, h: 1024, url: "/" },
  { name: "home-430", w: 430, h: 932, url: "/" },
  { name: "home-390", w: 390, h: 844, url: "/" },
  { name: "home-360", w: 360, h: 800, url: "/" },
  { name: "service-repair-1440", w: 1440, h: 900, url: "/services/remont-kotlov" },
  { name: "service-repair-390", w: 390, h: 844, url: "/services/remont-kotlov" },
  { name: "services-1440", w: 1440, h: 900, url: "/services" },
  { name: "services-390", w: 390, h: 844, url: "/services" },
  { name: "documents-1440", w: 1440, h: 900, url: "/documents" },
  { name: "documents-390", w: 390, h: 844, url: "/documents" },
  { name: "contacts-1440", w: 1440, h: 900, url: "/contacts" },
  { name: "contacts-390", w: 390, h: 844, url: "/contacts" },
];

const fullpages = [
  { name: "home-fullpage-1440", w: 1440, h: 900, url: "/" },
  { name: "home-fullpage-390", w: 390, h: 844, url: "/" },
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
    return {
      ok: docW <= winW + 1,
      scrollWidth: docW,
      innerWidth: winW,
      offenders: overflowing.slice(0, 8),
    };
  });
}

const browser = await chromium.launch({ channel: "chrome", headless: true });
await mkdir(OUT, { recursive: true });
const page = await browser.newPage();
const results = [];

for (const shot of viewports) {
  await page.setViewportSize({ width: shot.w, height: shot.h });
  await page.goto(`${BASE}${shot.url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(250);
  const overflow = await overflowReport(page);
  results.push({ name: shot.name, ...overflow });
  await page.screenshot({
    path: path.join(OUT, `${shot.name}.png`),
    fullPage: false,
  });
}

for (const shot of fullpages) {
  await page.setViewportSize({ width: shot.w, height: shot.h });
  await page.goto(`${BASE}${shot.url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(250);
  await page.screenshot({
    path: path.join(OUT, `${shot.name}.png`),
    fullPage: true,
  });
}

await browser.close();

const bad = results.filter((r) => !r.ok);
console.log(JSON.stringify({ total: results.length, overflows: bad }, null, 2));
if (bad.length) process.exitCode = 2;
