/**
 * Service ticker seamless loop QA → qa-screenshots/ticker-seamless/
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";

const ROOT = path.resolve("out");
const OUT = path.resolve("qa-screenshots/ticker-seamless");
const PORT = 4188;

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
      const filePath = path.join(ROOT, urlPath.replace(/^\//, ""));
      const data = await readFile(filePath);
      res.writeHead(200, { "Content-Type": MIME[extname(filePath)] || "application/octet-stream" });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end("not found");
    }
  });
  return new Promise((resolve) => server.listen(PORT, "127.0.0.1", () => resolve(server)));
}

await mkdir(OUT, { recursive: true });
const server = await startServer();
const browser = await chromium.launch({ channel: "chrome", headless: true });

const viewports = [
  { name: "375", w: 375, h: 812 },
  { name: "768", w: 768, h: 1024 },
  { name: "1440", w: 1440, h: 900 },
  { name: "1920", w: 1920, h: 1080 },
];

const report = { viewports: {}, frames: [], staging: {} };

for (const vp of viewports) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(400);

  const ticker = page.locator(".marquee");
  await ticker.scrollIntoViewIfNeeded();

  const metrics = await page.evaluate(() => {
    const root = document.querySelector(".marquee");
    const track = document.querySelector(".marquee-track");
    const groups = [...document.querySelectorAll(".marquee-group")];
    const measure = document.querySelector(".marquee-measure");
    if (!root || !track) return null;
    const text = root.innerText.replace(/\s+/g, " ");
    return {
      viewWidth: root.clientWidth,
      trackWidth: track.scrollWidth,
      groupCount: groups.length,
      group0Width: groups[0]?.scrollWidth ?? 0,
      group1Width: groups[1]?.scrollWidth ?? 0,
      measureWidth: measure?.scrollWidth ?? 0,
      duration: getComputedStyle(track).animationDuration,
      timing: getComputedStyle(track).animationTimingFunction,
      iteration: getComputedStyle(track).animationIterationCount,
      hasObsluzhivanie: /обслуживание/i.test(text),
      labels: text,
      groupsEqual: groups.length >= 2 && groups[0].scrollWidth === groups[1].scrollWidth,
      groupCoversViewport: (groups[0]?.scrollWidth ?? 0) >= root.clientWidth - 1,
    };
  });

  report.viewports[vp.name] = metrics;

  await ticker.screenshot({ path: path.join(OUT, `ticker-${vp.name}.png`) });

  // Frame sequence on widest viewport (seam check over ~1.2 group cycles)
  if (vp.name === "1920") {
    const durationMs = parseFloat(metrics?.duration || "36") * 1000;
    const sampleCount = 8;
    const interval = Math.min(900, durationMs / sampleCount);
    for (let i = 0; i < sampleCount; i++) {
      await page.waitForTimeout(i === 0 ? 0 : interval);
      const x = await page.evaluate(() => {
        const track = document.querySelector(".marquee-track");
        if (!track) return null;
        const t = getComputedStyle(track).transform;
        return { transform: t, t: performance.now() };
      });
      await ticker.screenshot({ path: path.join(OUT, `frame-1920-${String(i).padStart(2, "0")}.png`) });
      report.frames.push(x);
    }
  }

  await page.close();
}

// Staging source check
{
  const page = await browser.newPage();
  await page.goto("https://jeesuscrised.ru/", { waitUntil: "networkidle", timeout: 60000 });
  const staging = await page.evaluate(async () => {
    const html = document.documentElement.outerHTML;
    const scripts = [...document.querySelectorAll("script[src]")].map((s) => s.getAttribute("src") || "");
    let jsHasObsl = false;
    let jsHasKomplektuyushchie = false;
    let jsHasMarquee = false;
    for (const src of scripts) {
      if (!src.includes("/_next/")) continue;
      try {
        const text = await fetch(src).then((r) => r.text());
        if (/Обслуживание/.test(text)) jsHasObsl = true;
        if (/Комплектующие/.test(text)) jsHasKomplektuyushchie = true;
        if (/marquee/.test(text)) jsHasMarquee = true;
      } catch {
        /* ignore */
      }
    }
    const aboutHasObsluzhivanii = /обслуживани/i.test(document.body.innerText);
    const tickerText = document.querySelector(".marquee")?.textContent || "";
    return {
      htmlHasObsluzhivanie: /Обслуживание/.test(html),
      jsHasObsl,
      jsHasKomplektuyushchie,
      jsHasMarquee,
      tickerHasObsluzhivanie: /обслуживание/i.test(tickerText),
      tickerSample: tickerText.replace(/\s+/g, " ").slice(0, 180),
      aboutMentionsObsluzhivanieWord: aboutHasObsluzhivanii,
    };
  });
  report.staging = staging;
  await page.close();
}

await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2), "utf8");
await browser.close();
server.close();
console.log(JSON.stringify(report, null, 2));
