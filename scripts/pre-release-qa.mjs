/**
 * Pre-release browser regression for Teploenergokomplekt static export.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SITE_URL || "http://127.0.0.1:4190";
const OUT = path.resolve("qa-screenshots/pre-release");

const routes = [
  "/",
  "/services/",
  "/services/diagnostika-i-obsledovanie/",
  "/services/remont-kotlov/",
  "/services/obmurovka-i-teploizolyatsiya/",
  "/services/puskonaladochnye-raboty/",
  "/services/rekonstruktsiya-i-modernizatsiya/",
  "/services/postavka-komplektuyushchih/",
  "/documents/",
  "/contacts/",
];

const viewports = [
  { name: "375", w: 375, h: 812 },
  { name: "768", w: 768, h: 1024 },
  { name: "1440", w: 1440, h: 900 },
  { name: "1920", w: 1920, h: 1080 },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
const consoleErrors = [];
page.on("pageerror", (err) => consoleErrors.push(String(err)));
page.on("console", (msg) => {
  if (msg.type() === "error") consoleErrors.push(msg.text());
});

const results = { routes: [], viewports: [], mobileMenu: null, lightbox: null, services: null };

await page.setViewportSize({ width: 1440, height: 900 });
for (const route of routes) {
  const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(250);
  const meta = await page.evaluate(() => ({
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
    h1: document.querySelector("h1")?.textContent?.trim() || "",
    brokenImgs: [...document.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth === 0)
      .length,
    hasObsluzhivanieLink: [...document.querySelectorAll("a[href]")].some((a) =>
      (a.getAttribute("href") || "").includes("obsluzhivanie-kotelnyh"),
    ),
  }));
  results.routes.push({ route, status: res?.status() ?? 0, ...meta });
}

// Services order on home
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
results.services = await page.evaluate(() =>
  [...document.querySelectorAll("a.service-row h3")].map((el) => el.textContent?.trim()),
);

// Viewport overflow on home
for (const vp of viewports) {
  await page.setViewportSize({ width: vp.w, height: vp.h });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => ({
    ok: document.documentElement.scrollWidth <= window.innerWidth + 1,
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  await page.screenshot({ path: path.join(OUT, `home-${vp.name}.png`), fullPage: false });
  results.viewports.push({ ...vp, ...overflow });
}

// Mobile menu
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
const openBtn = page.getByRole("button", { name: "Открыть меню" });
await openBtn.click();
await page.waitForTimeout(350);
const opened = await page.evaluate(() => {
  const btn = document.querySelector('header button[aria-controls="mobile-menu"]');
  const menu = document.querySelector("#mobile-menu");
  return {
    ariaExpanded: btn?.getAttribute("aria-expanded"),
    menuPresent: !!menu,
    label: btn?.getAttribute("aria-label"),
  };
});
await page.getByRole("button", { name: "Закрыть меню" }).click();
await page.waitForTimeout(350);
const closed = await page.evaluate(() => {
  const btn = document.querySelector('header button[aria-controls="mobile-menu"]');
  return {
    ariaExpanded: btn?.getAttribute("aria-expanded"),
    menuPresent: !!document.querySelector("#mobile-menu"),
  };
});
results.mobileMenu = { opened, closed };

// Lightbox on homepage projects gallery (if present)
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const card = page.locator(".project-marquee-card").first();
if ((await card.count()) > 0) {
  await card.click();
  await page.waitForTimeout(200);
  const dialogOpen = await page.locator('[role="dialog"]').count();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  const dialogClosed = await page.locator('[role="dialog"]').count();
  results.lightbox = { dialogOpen, dialogClosed };
} else {
  results.lightbox = { skipped: true };
}

// Redirect page exists (client fallback); Apache 301 checked statically
await page.goto(`${BASE}/services/obsluzhivanie-kotelnyh/`, { waitUntil: "networkidle" });
await page.waitForTimeout(700);
results.redirectClient = {
  url: page.url(),
  title: await page.title(),
};

results.consoleErrors = [...new Set(consoleErrors)].slice(0, 20);

await writeFile(path.join(OUT, "report.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();

const failedRoutes = results.routes.filter((r) => r.status !== 200 || r.brokenImgs > 0);
const menuOk =
  results.mobileMenu?.opened?.ariaExpanded === "true" &&
  results.mobileMenu?.closed?.ariaExpanded === "false";
if (failedRoutes.length || !menuOk) {
  console.error("QA issues detected");
  process.exitCode = 1;
}
