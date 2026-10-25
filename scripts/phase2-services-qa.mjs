/**
 * Phase 2 services visual QA.
 * Usage: SITE_URL=http://127.0.0.1:4173 node scripts/phase2-services-qa.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SITE_URL || "http://127.0.0.1:4173";
const OUT = path.resolve("qa-screenshots/phase2-services");

const viewports = [
  { name: "home-services-375", w: 375, h: 812, url: "/", full: false },
  { name: "home-services-768", w: 768, h: 1024, url: "/", full: false },
  { name: "home-services-1440", w: 1440, h: 900, url: "/", full: false },
  { name: "home-services-1920", w: 1920, h: 1080, url: "/", full: false },
  { name: "service-remont-1440", w: 1440, h: 900, url: "/services/remont-kotlov/", full: true },
  { name: "service-remont-375", w: 375, h: 812, url: "/services/remont-kotlov/", full: true },
];

async function overflowReport(page) {
  return page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    return {
      ok: docW <= winW + 1,
      scrollWidth: docW,
      innerWidth: winW,
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
  await page.goto(`${BASE}${shot.url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  if (shot.url === "/") {
    await page.evaluate(() => {
      const el = document.querySelector("section .service-row, a.service-row");
      el?.scrollIntoView({ block: "start" });
    });
    await page.waitForTimeout(200);
  }

  const overflow = await overflowReport(page);
  const serviceCount = await page.evaluate(() => {
    if (!location.pathname.replace(/\/$/, "").endsWith("services") && location.pathname === "/") {
      return document.querySelectorAll("a.service-row").length;
    }
    return null;
  });
  const titles = await page.evaluate(() =>
    Array.from(document.querySelectorAll("a.service-row h3")).map((el) =>
      el.textContent?.trim(),
    ),
  );
  const h1 = await page.evaluate(() => document.querySelector("h1")?.textContent?.trim());
  results.push({ name: shot.name, ...overflow, serviceCount, titles, h1 });
  await page.screenshot({
    path: path.join(OUT, `${shot.name}.png`),
    fullPage: shot.full,
  });
}

// Link audit
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
const broken = await page.evaluate(() => {
  const hrefs = Array.from(document.querySelectorAll("a[href]")).map((a) =>
    a.getAttribute("href"),
  );
  return hrefs.filter((h) => h && h.includes("obsluzhivanie-kotelnyh"));
});
results.push({ brokenObsluzhivanieLinksOnHome: broken });

await page.goto(`${BASE}/services/obsluzhivanie-kotelnyh/`, { waitUntil: "networkidle" });
results.push({
  redirectPageTitle: await page.title(),
  redirectH1: await page.evaluate(() => document.querySelector("h1")?.textContent?.trim()),
});

await writeFile(path.join(OUT, "report.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
