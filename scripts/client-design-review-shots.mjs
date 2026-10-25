/**
 * Client design-review screenshots.
 * - Staging (Basic Auth): main pages
 * - Local DESIGN_PREVIEW build: portfolio demo only
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("qa-screenshots/client-design-review");
const STAGING = process.env.STAGING_URL || "https://jeesuscrised.ru";
const LOCAL = process.env.LOCAL_URL || "http://127.0.0.1:4191";
const USER = process.env.STAGING_BASIC_USER || "tekomp-qa";
const PASS = process.env.STAGING_BASIC_PASS || "";

const viewports = [
  { name: "375", w: 375, h: 812 },
  { name: "768", w: 768, h: 1024 },
  { name: "1440", w: 1440, h: 900 },
  { name: "1920", w: 1920, h: 1080 },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function shotPage(context, base, route, fileBase, { fullPage = true, clipSelector = null } = {}) {
  const page = await context.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}${route}`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(500);
  if (clipSelector) {
    const el = page.locator(clipSelector).first();
    if ((await el.count()) > 0) {
      await el.screenshot({ path: path.join(OUT, `${fileBase}.png`) });
      await page.close();
      return;
    }
  }
  await page.screenshot({ path: path.join(OUT, `${fileBase}.png`), fullPage });
  await page.close();
}

// —— Staging shots ——
const stagingCtx = await browser.newContext({
  httpCredentials: PASS ? { username: USER, password: PASS } : undefined,
  viewport: { width: 1440, height: 900 },
});

for (const vp of viewports) {
  const page = await stagingCtx.newPage();
  await page.setViewportSize({ width: vp.w, height: vp.h });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${STAGING}/`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(OUT, `home-full-${vp.name}.png`),
    fullPage: true,
  });
  await page.screenshot({
    path: path.join(OUT, `home-viewport-${vp.name}.png`),
    fullPage: false,
  });
  await page.close();
}

// About block (first section)
{
  const page = await stagingCtx.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${STAGING}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  const about = page.locator('section[aria-labelledby="about-heading"]');
  await about.screenshot({ path: path.join(OUT, "block-about-1440.png") });
  await page.close();
}

await shotPage(stagingCtx, STAGING, "/services/", "services-index-1440", { fullPage: true });
await shotPage(stagingCtx, STAGING, "/services/remont-kotlov/", "service-remont-kotlov-1440", {
  fullPage: true,
});
await shotPage(stagingCtx, STAGING, "/documents/", "documents-1440", { fullPage: true });
await shotPage(stagingCtx, STAGING, "/contacts/", "contacts-1440", { fullPage: true });

// Portfolio empty state on staging home
{
  const page = await stagingCtx.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${STAGING}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  // scroll to portfolio eyebrow
  await page.getByText("Портфолио", { exact: true }).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const section = page.locator("section").filter({ hasText: "Объекты / выполненные работы" });
  await section.first().screenshot({ path: path.join(OUT, "portfolio-empty-staging-1440.png") });
  await page.close();
}

// Mobile menu
{
  const page = await stagingCtx.newPage();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${STAGING}/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(OUT, "mobile-menu-open-390.png"),
    fullPage: false,
  });
  await page.close();
}

// Mobile long service page
{
  const page = await stagingCtx.newPage();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${STAGING}/services/remont-kotlov/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(OUT, "service-remont-kotlov-375.png"),
    fullPage: true,
  });
  await page.close();
}

await stagingCtx.close();

// —— Local design-preview portfolio ——
const localCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
try {
  for (const vp of [
    { name: "375", w: 375, h: 812 },
    { name: "1440", w: 1440, h: 900 },
    { name: "1920", w: 1920, h: 1080 },
  ]) {
    const page = await localCtx.newPage();
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const res = await page.goto(`${LOCAL}/design-preview/portfolio/`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    if (!res || res.status() >= 400) {
      console.error("LOCAL_PREVIEW_UNAVAILABLE", res?.status());
      await page.close();
      break;
    }
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(OUT, `portfolio-demo-full-${vp.name}.png`),
      fullPage: true,
    });
    await page.screenshot({
      path: path.join(OUT, `portfolio-demo-viewport-${vp.name}.png`),
      fullPage: false,
    });
    await page.close();
  }
} catch (err) {
  console.error("LOCAL_PREVIEW_ERROR", String(err));
}
await localCtx.close();

await browser.close();
console.log("Wrote screenshots to", OUT);
