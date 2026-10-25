/**
 * Phase 3 licenses/permits visual QA.
 * Usage: SITE_URL=http://127.0.0.1:4173 node scripts/phase3-licenses-qa.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SITE_URL || "http://127.0.0.1:4173";
const OUT = path.resolve("qa-screenshots/phase3-licenses");

const shots = [
  { name: "documents-375", w: 375, h: 812, url: "/documents/", full: true },
  { name: "documents-768", w: 768, h: 1024, url: "/documents/", full: true },
  { name: "documents-1440", w: 1440, h: 900, url: "/documents/", full: true },
  { name: "documents-1920", w: 1920, h: 1080, url: "/documents/", full: true },
  { name: "home-licenses-1440", w: 1440, h: 900, url: "/", full: false, scroll: "licenses" },
  { name: "home-licenses-375", w: 375, h: 812, url: "/", full: false, scroll: "licenses" },
];

async function overflowReport(page) {
  return page.evaluate(() => {
    const docW = document.documentElement.scrollWidth;
    const winW = window.innerWidth;
    return { ok: docW <= winW + 1, scrollWidth: docW, innerWidth: winW };
  });
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
const results = [];

for (const shot of shots) {
  await page.setViewportSize({ width: shot.w, height: shot.h });
  await page.goto(`${BASE}${shot.url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);

  if (shot.scroll === "licenses") {
    await page.evaluate(() => {
      const el = [...document.querySelectorAll("section")].find((s) =>
        s.textContent?.includes("Лицензии"),
      );
      el?.scrollIntoView({ block: "start" });
    });
    await page.waitForTimeout(200);
  }

  const meta = await page.evaluate(() => ({
    title: document.title,
    h1: document.querySelector("h1")?.textContent?.trim(),
    hasEmptyState: (document.body.innerText || "").includes("подготавливаются к публикации"),
    hasPublishedPhrase: (document.body.innerText || "").includes("Представленные ниже документы"),
    navHits: [...document.querySelectorAll("a")].filter((a) =>
      (a.textContent || "").includes("Лицензии и допуски"),
    ).length,
    brokenImg: [...document.querySelectorAll("img")].filter((i) => !i.naturalWidth).length,
  }));
  const overflow = await overflowReport(page);
  results.push({ name: shot.name, ...overflow, ...meta });
  await page.screenshot({
    path: path.join(OUT, `${shot.name}.png`),
    fullPage: Boolean(shot.full),
  });
}

await writeFile(path.join(OUT, "report.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
