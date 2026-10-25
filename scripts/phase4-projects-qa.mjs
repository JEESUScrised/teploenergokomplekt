/**
 * Phase 4 portfolio visual QA.
 * Usage: SITE_URL=http://127.0.0.1:4173 node scripts/phase4-projects-qa.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SITE_URL || "http://127.0.0.1:4173";
const OUT = path.resolve("qa-screenshots/phase4-projects");

const shots = [
  { name: "home-projects-375", w: 375, h: 812, url: "/", full: false },
  { name: "home-projects-768", w: 768, h: 1024, url: "/", full: false },
  { name: "home-projects-1440", w: 1440, h: 900, url: "/", full: false },
  { name: "home-projects-1920", w: 1920, h: 1080, url: "/", full: false },
  { name: "home-projects-1440-full", w: 1440, h: 900, url: "/", full: true },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
const results = [];

for (const shot of shots) {
  await page.setViewportSize({ width: shot.w, height: shot.h });
  await page.goto(`${BASE}${shot.url}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const el = [...document.querySelectorAll("section")].find((s) =>
      (s.textContent || "").includes("Объекты"),
    );
    el?.scrollIntoView({ block: "start" });
  });
  await page.waitForTimeout(250);

  const meta = await page.evaluate(() => {
    const section = [...document.querySelectorAll("section")].find((s) =>
      (s.textContent || "").includes("Объекты / выполненные работы"),
    );
    const text = section?.innerText || "";
    return {
      hasTitle: text.includes("Объекты / выполненные работы"),
      hasEmpty: text.includes("готовится к публикации"),
      hasFakeBuzulukPublished: /Бузулук/.test(text) && !text.includes("готовится"),
      yearHeadings: [...(section?.querySelectorAll("h3") || [])]
        .map((h) => h.textContent?.trim())
        .filter((t) => /^\d{4}$/.test(t || "")),
      overflow: document.documentElement.scrollWidth <= window.innerWidth + 1,
    };
  });
  results.push({ name: shot.name, ...meta });
  await page.screenshot({
    path: path.join(OUT, `${shot.name}.png`),
    fullPage: Boolean(shot.full),
  });
}

await writeFile(path.join(OUT, "report.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
