/**
 * Hero revision screenshots → qa-screenshots/hero-revision/
 * Expects LOCAL_URL (default http://127.0.0.1:4177) serving the built site.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve("qa-screenshots/hero-revision");
const BASE = process.env.LOCAL_URL || "http://127.0.0.1:4177";

const viewports = [
  { name: "375", w: 375, h: 812 },
  { name: "768", w: 768, h: 1024 },
  { name: "1440", w: 1440, h: 900 },
  { name: "1920", w: 1920, h: 1080 },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext();

const checks = {
  overflow: [],
  tickerHasObsluzhivanie: false,
  heroPresent: false,
  aboutAfterHero: false,
  mobileMenuOk: false,
};

for (const vp of viewports) {
  const page = await context.newPage();
  await page.setViewportSize({ width: vp.w, height: vp.h });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(500);

  const hero = page.locator("section.hero");
  checks.heroPresent = (await hero.count()) > 0;

  const order = await page.evaluate(() => {
    const main = document.querySelector("main") || document.body;
    const sections = [...main.querySelectorAll("section")];
    return sections.slice(0, 3).map((s) => ({
      class: s.className,
      aria: s.getAttribute("aria-labelledby"),
      id: s.id,
    }));
  });
  // Legacy check: hero was removed; about is now the first screen.
  checks.aboutAfterHero =
    order[0]?.id === "about" || order[0]?.aria === "about-heading";

  const overflowX = await page.evaluate(() => {
    const doc = document.documentElement;
    return doc.scrollWidth > doc.clientWidth + 1;
  });
  if (overflowX) checks.overflow.push(vp.name);

  const tickerText = await page.locator(".marquee").innerText().catch(() => "");
  if (/обслуживание/i.test(tickerText)) checks.tickerHasObsluzhivanie = true;

  await page.screenshot({
    path: path.join(OUT, `home-full-${vp.name}.png`),
    fullPage: true,
  });
  await page.screenshot({
    path: path.join(OUT, `home-viewport-${vp.name}.png`),
    fullPage: false,
  });

  if (vp.name === "1440" || vp.name === "375") {
    await hero.screenshot({ path: path.join(OUT, `hero-only-${vp.name}.png`) });
  }

  if (vp.name === "1440") {
    const box = await page.evaluate(() => {
      const heroEl = document.querySelector("section.hero");
      const aboutEl = document.querySelector('section[aria-labelledby="about-heading"]');
      if (!heroEl || !aboutEl) return null;
      const hr = heroEl.getBoundingClientRect();
      const ar = aboutEl.getBoundingClientRect();
      const top = window.scrollY + hr.top;
      const bottom = window.scrollY + ar.top + Math.min(ar.height, 420);
      return { top, height: bottom - top };
    });
    if (box) {
      await page.screenshot({
        path: path.join(OUT, "hero-plus-about-start-1440.png"),
        clip: {
          x: 0,
          y: Math.max(0, box.top),
          width: 1440,
          height: Math.min(box.height, 1400),
        },
      });
    }
  }

  if (vp.name === "375") {
    const toggle = page.getByRole("button", { name: /меню|menu|открыть/i }).or(
      page.locator('button[aria-expanded], [data-menu-toggle], .menu-toggle, header button').first(),
    );
    try {
      await toggle.first().click({ timeout: 3000 });
      await page.waitForTimeout(400);
      await page.screenshot({
        path: path.join(OUT, "mobile-menu-375.png"),
        fullPage: false,
      });
      checks.mobileMenuOk = true;
    } catch {
      checks.mobileMenuOk = false;
    }
  }

  await page.close();
}

await browser.close();

console.log(
  JSON.stringify(
    {
      out: OUT,
      base: BASE,
      checks,
    },
    null,
    2,
  ),
);
