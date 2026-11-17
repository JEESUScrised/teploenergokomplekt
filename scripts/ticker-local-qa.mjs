/**
 * Local-only ServiceTicker seam QA against `out/` (no staging).
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { extname } from "node:path";

const ROOT = path.resolve("out");
const OUT = path.resolve("qa-screenshots/home-about-unification");
const PORT = 4192;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      if (urlPath.endsWith("/")) urlPath += "index.html";
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
const report = {};

for (const vp of [
  { n: "1440", w: 1440, h: 900 },
  { n: "1920", w: 1920, h: 1080 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  await page.goto(`http://127.0.0.1:${PORT}/`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForSelector('[data-ticker-ready="1"]', { timeout: 10000 });
  await page.waitForTimeout(400);

  const metrics = await page.evaluate(() => {
    const root = document.querySelector(".marquee");
    const track = document.querySelector(".marquee-track");
    const groups = [...document.querySelectorAll(".marquee-group")];
    const text = (root?.innerText || "").replace(/\s+/g, " ");
    return {
      ready: root?.getAttribute("data-ticker-ready"),
      repeat: root?.getAttribute("data-ticker-repeat"),
      viewWidth: root?.clientWidth,
      group0: groups[0]?.scrollWidth || 0,
      group1: groups[1]?.scrollWidth || 0,
      groupsEqual:
        groups.length >= 2 && groups[0].scrollWidth === groups[1].scrollWidth,
      covers: (groups[0]?.scrollWidth || 0) >= (root?.clientWidth || 0) - 1,
      duration: track ? getComputedStyle(track).animationDuration : null,
      iteration: track ? getComputedStyle(track).animationIterationCount : null,
      timing: track ? getComputedStyle(track).animationTimingFunction : null,
      hasObsluzhivanie: /обслуживание/i.test(text),
      sixDirs:
        /Диагностика/i.test(text) &&
        /Ремонт котлов/i.test(text) &&
        /Обмуровка/i.test(text) &&
        /Пусконаладка/i.test(text) &&
        /Реконструкция/i.test(text) &&
        /Комплектующие/i.test(text),
      sample: text.slice(0, 240),
    };
  });

  const cycleMs = (metrics.group0 / 60) * 1000;
  const frames = [];
  for (let i = 0; i < 6; i++) {
    if (i) await page.waitForTimeout(Math.min(1500, Math.max(400, cycleMs / 2)));
    const transform = await page.evaluate(
      () => getComputedStyle(document.querySelector(".marquee-track")).transform,
    );
    frames.push(transform);
    await page.locator(".marquee").screenshot({
      path: path.join(OUT, `ticker-${vp.n}-frame-${String(i).padStart(2, "0")}.png`),
    });
  }

  report[vp.n] = { ...metrics, frames, cycleMs: Math.round(cycleMs) };
  await page.close();
}

await writeFile(
  path.join(OUT, "ticker-local-report.json"),
  JSON.stringify(report, null, 2),
  "utf8",
);
await browser.close();
await new Promise((resolve) => server.close(resolve));

console.log(JSON.stringify(report, null, 2));
const ok = Object.values(report).every(
  (r) =>
    r.ready === "1" &&
    r.groupsEqual &&
    r.covers &&
    !r.hasObsluzhivanie &&
    r.sixDirs &&
    r.iteration === "infinite",
);
console.log(ok ? "TICKER_OK" : "TICKER_NEEDS_FIXES");
process.exit(ok ? 0 : 1);
