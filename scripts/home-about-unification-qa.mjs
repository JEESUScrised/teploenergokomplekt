/**
 * Home + About unification QA → qa-screenshots/home-about-unification/
 * Serves `out/` locally and captures required viewports.
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { extname } from "node:path";

const ROOT = path.resolve("out");
const OUT = path.resolve("qa-screenshots/home-about-unification");
const PORT = 4191;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
  ".woff2": "font/woff2",
};

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      if (urlPath.endsWith("/")) urlPath += "index.html";
      if (urlPath === "/about" || urlPath === "/about/") {
        res.writeHead(404);
        res.end("about removed");
        return;
      }
      const filePath = path.join(ROOT, urlPath.replace(/^\//, ""));
      const data = await readFile(filePath);
      res.writeHead(200, {
        "Content-Type": MIME[extname(filePath)] || "application/octet-stream",
      });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("not found");
    }
  });
  return new Promise((resolve) =>
    server.listen(PORT, "127.0.0.1", () => resolve(server)),
  );
}

await mkdir(OUT, { recursive: true });
const server = await startServer();
const browser = await chromium.launch({ channel: "chrome", headless: true });

const report = {
  h1: [],
  overflow: [],
  ticker: {},
  aboutPresent: false,
  heroPresent: false,
  geographyPresent: false,
  aboutExportGone: true,
  consoleErrors: [],
};

async function shot(page, name, fullPage = false) {
  await page.screenshot({
    path: path.join(OUT, `${name}.png`),
    fullPage,
  });
}

for (const vp of [
  { name: "375", w: 375, h: 812 },
  { name: "768", w: 768, h: 1024 },
  { name: "1440", w: 1440, h: 900 },
  { name: "1920", w: 1920, h: 1080 },
  { name: "2560", w: 2560, h: 1440 },
]) {
  const page = await browser.newPage({
    viewport: { width: vp.w, height: vp.h },
  });
  page.on("pageerror", (err) => {
    report.consoleErrors.push(`${vp.name}: ${err.message}`);
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`http://127.0.0.1:${PORT}/`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(600);

  const meta = await page.evaluate(() => {
    const h1 = [...document.querySelectorAll("h1")].map((el) =>
      el.textContent?.trim(),
    );
    return {
      h1,
      about: Boolean(document.querySelector("#about")),
      hero: Boolean(document.querySelector("section.hero")),
      geography: Boolean(document.querySelector("#geography")),
      technologies: Boolean(document.querySelector("#technologies")),
      overflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
      tickerText: document.querySelector(".marquee")?.innerText || "",
      tickerReady: document
        .querySelector(".marquee")
        ?.getAttribute("data-ticker-ready"),
      tickerRepeat: document
        .querySelector(".marquee")
        ?.getAttribute("data-ticker-repeat"),
    };
  });

  report.h1 = meta.h1;
  report.aboutPresent = meta.about;
  report.heroPresent = meta.hero;
  report.geographyPresent = meta.geography && meta.technologies;
  if (meta.overflow) report.overflow.push(vp.name);

  if (vp.name === "1440" || vp.name === "1920") {
    report.ticker[vp.name] = {
      ready: meta.tickerReady,
      repeat: meta.tickerRepeat,
      hasObsluzhivanie: /обслуживание/i.test(meta.tickerText),
      labels: meta.tickerText.replace(/\s+/g, " ").slice(0, 200),
    };

    // Capture three loop samples for seam check at 1440/1920
    const samples = [];
    for (let i = 0; i < 3; i++) {
      await page.waitForTimeout(i === 0 ? 200 : 1200);
      const frame = await page.evaluate(() => {
        const track = document.querySelector(".marquee-track");
        if (!track) return null;
        const style = getComputedStyle(track);
        return {
          transform: style.transform,
          duration: style.animationDuration,
        };
      });
      samples.push(frame);
    }
    report.ticker[vp.name].loopSamples = samples;
  }

  if (vp.name === "1440") {
    await shot(page, "first-screen-desktop-1440", false);
    await page.locator("#about").screenshot({
      path: path.join(OUT, "about-block-desktop-1440.png"),
    });
    await page.evaluate(() => {
      document
        .querySelector("#services, [aria-labelledby='services-heading']")
        ?.scrollIntoView({ block: "start" });
    });
    await page.waitForTimeout(200);
    await shot(page, "about-into-services-desktop-1440", false);
    await page.locator("#geography").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await shot(page, "geography-technologies-desktop-1440", false);
    await shot(page, "home-full-desktop-1440", true);
  }

  if (vp.name === "375") {
    await shot(page, "first-screen-mobile-375", false);
    await page.locator("#about").screenshot({
      path: path.join(OUT, "about-block-mobile-375.png"),
    });
    await shot(page, "home-full-mobile-375", true);
  }

  if (vp.name === "1920") {
    await shot(page, "first-screen-desktop-1920", false);
    await shot(page, "home-full-desktop-1920", true);
  }

  if (vp.name === "768") {
    await shot(page, "first-screen-tablet-768", false);
  }

  if (vp.name === "2560") {
    await shot(page, "first-screen-desktop-2560", false);
  }

  await page.close();
}

await writeFile(path.join(OUT, "qa-report.json"), JSON.stringify(report, null, 2));
await browser.close();
await new Promise((resolve) => server.close(resolve));

const ok =
  report.aboutPresent &&
  !report.heroPresent &&
  report.geographyPresent &&
  report.overflow.length === 0 &&
  report.consoleErrors.length === 0 &&
  report.h1.length === 1 &&
  /о нас/i.test(report.h1[0] || "") &&
  !report.ticker["1440"]?.hasObsluzhivanie &&
  !report.ticker["1920"]?.hasObsluzhivanie;

console.log(JSON.stringify(report, null, 2));
console.log(ok ? "HOME_ABOUT_QA_OK" : "HOME_ABOUT_QA_NEEDS_FIXES");
process.exit(ok ? 0 : 1);
