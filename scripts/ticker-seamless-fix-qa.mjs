/**
 * Hard geometry QA for seamless services ticker.
 * Scrubs transform across ≥3 loop periods and checks viewport coverage.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { extname } from "node:path";

const ROOT = path.resolve("out");
const OUT = path.resolve("qa-screenshots/ticker-seamless-fix");
const PORT = 4195;
const VIEWPORTS = [375, 768, 1440, 1920, 2560];
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
  ".woff": "font/woff",
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

function analyzeCoverage(page, shiftPx, cycles = 3, stepsPerCycle = 16) {
  return page.evaluate(
    ({ shiftPx, cycles, stepsPerCycle }) => {
      const root = document.querySelector(".marquee");
      const track = document.querySelector(".marquee-track");
      if (!root || !track) return { error: "missing" };

      track.style.animation = "none";
      const rootRect = () => root.getBoundingClientRect();
      const gapFrames = [];
      const totalSteps = cycles * stepsPerCycle;

      for (let i = 0; i <= totalSteps; i++) {
        // Progress across exactly `cycles` full loop distances (shiftPx each).
        const tx = -((i / stepsPerCycle) * shiftPx);
        // Wrap into one period for visual equivalence check of seam:
        const wrapped = ((tx % shiftPx) + shiftPx) % shiftPx;
        const useTx = -wrapped;
        track.style.transform = `translate3d(${useTx}px,0,0)`;

        const rr = rootRect();
        const items = [...document.querySelectorAll(".marquee-track .marquee-item")];
        const covered = new Array(Math.max(1, Math.ceil(rr.width))).fill(false);
        for (const item of items) {
          const r = item.getBoundingClientRect();
          const from = Math.max(0, Math.floor(r.left - rr.left));
          const to = Math.min(covered.length, Math.ceil(r.right - rr.left));
          for (let x = from; x < to; x++) covered[x] = true;
        }

        const emptyRanges = [];
        let run = null;
        for (let x = 0; x < covered.length; x++) {
          if (!covered[x]) {
            if (!run) run = [x, x];
            else run[1] = x;
          } else if (run) {
            emptyRanges.push(run);
            run = null;
          }
        }
        if (run) emptyRanges.push(run);
        const significant = emptyRanges.filter(([a, b]) => b - a + 1 >= 24);
        if (significant.length) {
          gapFrames.push({
            step: i,
            tx: useTx,
            emptyPx: significant.reduce((s, [a, b]) => s + (b - a + 1), 0),
            ranges: significant,
          });
        }
      }

      // Explicit seam probes around the loop boundary
      const seam = [];
      for (const tx of [0, -shiftPx + 0.5, -shiftPx, -1]) {
        const useTx = tx === -shiftPx ? 0 : tx; // -shiftPx ≡ 0 visually when groups identical
        track.style.transform = `translate3d(${tx === -shiftPx ? -shiftPx : tx}px,0,0)`;
        // Also probe the wrapped equivalent
        track.style.transform = `translate3d(${tx}px,0,0)`;
        const rr = rootRect();
        const items = [...document.querySelectorAll(".marquee-track .marquee-item")];
        let minL = Infinity;
        let maxR = -Infinity;
        for (const item of items) {
          const r = item.getBoundingClientRect();
          minL = Math.min(minL, r.left);
          maxR = Math.max(maxR, r.right);
        }
        seam.push({
          tx,
          coversLeft: minL <= rr.left + 1,
          coversRight: maxR >= rr.right - 1,
          note: useTx,
        });
      }

      track.style.transform = "";
      track.style.animation = "";
      return { gapFrames, seam, steps: totalSteps + 1 };
    },
    { shiftPx, cycles, stepsPerCycle },
  );
}

await mkdir(OUT, { recursive: true });
const server = await startServer();
const browser = await chromium.launch({ channel: "chrome", headless: true });

const report = {
  rootCause:
    "A single 6-label sequence (~1015px with Oswald) was only mirrored once; animation distance was ~1015px while the marquee viewport was 1920–2560px, leaving an empty band on the right (~53–70% of the width depending on metrics). %-based translateX(-50%) cannot invent missing width — the animated group itself must be ≥ container width. Prior ResizeObserver logic did not reliably remeasure after document.fonts.ready / late metric changes.",
  math:
    "cycles = ceil(containerWidth / sequenceWidth); groupWidth = cycles * sequenceWidth ≥ containerWidth; track = group+group; animate translate3d(-groupWidth px) linear infinite.",
  viewports: {},
  passed: true,
};

for (const width of VIEWPORTS) {
  const height = width >= 1440 ? 900 : 812;
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(800);

  const ticker = page.locator(".marquee");
  await ticker.scrollIntoViewIfNeeded();

  const base = await page.evaluate(() => {
    const root = document.querySelector(".marquee");
    const track = document.querySelector(".marquee-track");
    const measure = document.querySelector(".marquee-measure");
    const groups = [...document.querySelectorAll(".marquee-group")];
    if (!root || !track || groups.length < 2 || !measure) return { error: "missing-dom" };

    const cs = getComputedStyle(track);
    const unit = measure.getBoundingClientRect().width;
    const g0 = groups[0].getBoundingClientRect().width;
    const g1 = groups[1].getBoundingClientRect().width;
    const view = root.clientWidth;
    const text = root.innerText.replace(/\s+/g, " ");

    return {
      viewWidth: view,
      unitWidth: Number(unit.toFixed(2)),
      group0Width: Number(g0.toFixed(2)),
      group1Width: Number(g1.toFixed(2)),
      groupsEqual: Math.abs(g0 - g1) < 1,
      groupCoversViewport: g0 + 0.5 >= view,
      cycles: Math.round(g0 / unit),
      animationDistancePx: Number(g0.toFixed(2)),
      trackWidth: track.scrollWidth,
      durationSec: parseFloat(cs.animationDuration) || 0,
      shiftVar: cs.getPropertyValue("--marquee-shift").trim(),
      timing: cs.animationTimingFunction,
      iteration: cs.animationIterationCount,
      hasObsluzhivanie: /обслуживание/i.test(text),
      labelsSample: text.slice(0, 180),
      pageOverflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    };
  });

  const coverage = await analyzeCoverage(page, base.group0Width || 0, 3, 16);

  // Live short observation (animation running) — a few wall-clock samples
  await page.evaluate(() => {
    const track = document.querySelector(".marquee-track");
    if (track) {
      track.style.animation = "";
      track.style.transform = "";
    }
  });
  const liveGaps = [];
  for (let i = 0; i < 8; i++) {
    await page.waitForTimeout(280);
    const g = await page.evaluate(() => {
      const root = document.querySelector(".marquee");
      const items = [...document.querySelectorAll(".marquee-track .marquee-item")];
      if (!root) return 0;
      const rr = root.getBoundingClientRect();
      const covered = new Array(Math.ceil(rr.width)).fill(false);
      for (const item of items) {
        const r = item.getBoundingClientRect();
        const from = Math.max(0, Math.floor(r.left - rr.left));
        const to = Math.min(covered.length, Math.ceil(r.right - rr.left));
        for (let x = from; x < to; x++) covered[x] = true;
      }
      let empty = 0;
      let run = 0;
      for (const c of covered) {
        if (!c) {
          run++;
        } else {
          if (run >= 24) empty += run;
          run = 0;
        }
      }
      if (run >= 24) empty += run;
      return empty;
    });
    if (g > 0) liveGaps.push({ i, emptyPx: g });
  }

  await ticker.screenshot({ path: path.join(OUT, `ticker-${width}.png`) });
  await page.screenshot({ path: path.join(OUT, `home-viewport-${width}.png`), fullPage: false });

  // Forced mid-empty? Capture scrub near 0 for docs
  if (width === 1920) {
    await page.evaluate((shift) => {
      const track = document.querySelector(".marquee-track");
      if (!track) return;
      track.style.animation = "none";
      track.style.transform = "translate3d(0,0,0)";
      void shift;
    }, base.group0Width);
    await ticker.screenshot({ path: path.join(OUT, "ticker-1920-tx0.png") });
    await page.evaluate((shift) => {
      const track = document.querySelector(".marquee-track");
      if (!track) return;
      track.style.transform = `translate3d(${-shift + 40}px,0,0)`;
    }, base.group0Width);
    await ticker.screenshot({ path: path.join(OUT, "ticker-1920-near-seam.png") });
  }

  const vpPass =
    !base.error &&
    base.groupsEqual &&
    base.groupCoversViewport &&
    !base.hasObsluzhivanie &&
    !base.pageOverflowX &&
    (coverage.gapFrames?.length ?? 1) === 0 &&
    (coverage.seam || []).every((s) => s.coversLeft && s.coversRight) &&
    liveGaps.length === 0;

  if (!vpPass) report.passed = false;

  report.viewports[String(width)] = {
    ...base,
    scrub: {
      cycles: 3,
      steps: coverage.steps,
      gapFrames: coverage.gapFrames,
      seam: coverage.seam,
    },
    liveGaps,
    pass: vpPass,
  };

  await page.close();
}

await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2), "utf8");
await browser.close();
server.close();

const summary = {
  passed: report.passed,
  viewports: Object.fromEntries(
    Object.entries(report.viewports).map(([k, v]) => [
      k,
      {
        pass: v.pass,
        viewWidth: v.viewWidth,
        unitWidth: v.unitWidth,
        cycles: v.cycles,
        group0Width: v.group0Width,
        animationDistancePx: v.animationDistancePx,
        scrubGaps: v.scrub?.gapFrames?.length ?? null,
        liveGaps: v.liveGaps?.length ?? null,
      },
    ]),
  ),
};
console.log(JSON.stringify(summary, null, 2));
if (!report.passed) process.exitCode = 1;
