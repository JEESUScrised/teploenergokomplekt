import { chromium } from "playwright";
import path from "node:path";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);

const info = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll("img")).map((i) => ({
    src: i.getAttribute("src"),
    w: i.naturalWidth,
    alt: i.alt,
  }));
  return {
    h1: document.querySelectorAll("h1").length,
    h1t: document.querySelector("h1")?.textContent?.trim(),
    cards: document.querySelectorAll("article").length,
    boiler: Boolean(document.querySelector('img[src*="boiler-cutout"]')),
    copper: Boolean(document.querySelector('img[src*="hq-heatex-copper"]')),
    imgs: imgs.slice(0, 15),
    bodyH: document.body.scrollHeight,
    sectionTitles: Array.from(document.querySelectorAll("h1,h2")).map((el) =>
      el.textContent?.trim().slice(0, 80),
    ),
  };
});

console.log(JSON.stringify(info, null, 2));
await page.screenshot({
  path: path.resolve("qa-screenshots/phase1-home-1440-reduced.png"),
  fullPage: false,
});
await page.screenshot({
  path: path.resolve("qa-screenshots/phase1-home-1440-reduced-full.png"),
  fullPage: true,
});
await browser.close();
