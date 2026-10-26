/**
 * Local + live staging acceptance for seamless ServiceTicker.
 * Fails if any viewport shows empty band ≥24px during scrubbed cycles.
 *
 * Usage:
 *   node scripts/ticker-staging-acceptance.mjs            # local out/ + staging
 *   BASE=https://jeesuscrised.ru node scripts/ticker-staging-acceptance.mjs
 */
import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { extname } from "node:path";

const OUT = path.resolve("qa-screenshots/ticker-staging-acceptance");
const VIEWPORTS = [375, 768, 1440, 1920, 2560];
const LOCAL_PORT = 4197;
const STAGING = "https://jeesuscrised.ru";
const ONLY = process.env.BASE || "";
const SKIP_STAGING = process.env.SKIP_STAGING === "1";
const SKIP_LOCAL = process.env.SKIP_LOCAL === "1";

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

async function startLocal() {
  const ROOT = path.resolve("out");
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
      res.end("nf");
    }
  });
  await new Promise((r) => server.listen(LOCAL_PORT, "127.0.0.1", r));
  return server;
}

async function runSuite(browser, base, label) {
  const suite = { label, base, viewports: {}, passed: true, buildSignals: null };

  // Build fingerprint
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 90000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
    suite.buildSignals = await page.evaluate(() => {
      const root = document.querySelector(".marquee");
      return {
        hasMeasure: !!document.querySelector(".marquee-measure"),
        hasGroups: document.querySelectorAll(".marquee-group").length,
        ready: root?.getAttribute("data-ticker-ready"),
        repeat: root?.getAttribute("data-ticker-repeat"),
        itemCount: document.querySelectorAll(".marquee-track .marquee-item").length,
        shift: getComputedStyle(document.querySelector(".marquee-track") || document.body)
          .getPropertyValue("--marquee-shift")
          .trim(),
      };
    });
    await page.close();
  }

  for (const width of VIEWPORTS) {
    const height = width >= 1440 ? 900 : 812;
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`${base}/`, { waitUntil: "networkidle", timeout: 90000 });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(
      () => document.querySelector(".marquee")?.getAttribute("data-ticker-ready") === "1",
      { timeout: 15000 },
    ).catch(() => null);
    await page.waitForTimeout(500);

    const ticker = page.locator(".marquee");
    await ticker.scrollIntoViewIfNeeded();

    const baseGeom = await page.evaluate(() => {
      const root = document.querySelector(".marquee");
      const track = document.querySelector(".marquee-track");
      const measure = document.querySelector(".marquee-measure");
      const groups = [...document.querySelectorAll(".marquee-group")];
      if (!root || !track || !measure || groups.length < 2) {
        return { error: "legacy-or-missing-dom", hasGroups: groups.length, hasMeasure: !!measure };
      }
      const unit = measure.getBoundingClientRect().width;
      const g0 = groups[0].getBoundingClientRect().width;
      const g1 = groups[1].getBoundingClientRect().width;
      const view = root.clientWidth;
      const cs = getComputedStyle(track);
      return {
        viewWidth: view,
        sequenceWidth: Number(unit.toFixed(2)),
        group0Width: Number(g0.toFixed(2)),
        group1Width: Number(g1.toFixed(2)),
        groupsEqual: Math.abs(g0 - g1) < 1,
        groupCoversViewport: g0 > view, // strict: wider than container
        repeatAttr: root.getAttribute("data-ticker-repeat"),
        shiftVar: cs.getPropertyValue("--marquee-shift").trim(),
        durationSec: parseFloat(cs.animationDuration) || 0,
        timing: cs.animationTimingFunction,
        iteration: cs.animationIterationCount,
        hasObsluzhivanie: /обслуживание/i.test(root.innerText),
        pageOverflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      };
    });

    const scrub = await page.evaluate(({ stepsPerCycle, cycles }) => {
      const root = document.querySelector(".marquee");
      const track = document.querySelector(".marquee-track");
      const groups = [...document.querySelectorAll(".marquee-group")];
      if (!root || !track || groups.length < 2) return { error: true };
      const shiftPx = groups[0].getBoundingClientRect().width;
      track.style.animation = "none";
      const gapFrames = [];
      const total = cycles * stepsPerCycle;
      for (let i = 0; i <= total; i++) {
        const wrapped = ((i / stepsPerCycle) * shiftPx) % shiftPx;
        const tx = -wrapped;
        track.style.transform = `translate3d(${tx}px,0,0)`;
        const rr = root.getBoundingClientRect();
        const items = [...document.querySelectorAll(".marquee-track .marquee-item")];
        const covered = new Array(Math.max(1, Math.ceil(rr.width))).fill(false);
        for (const item of items) {
          const r = item.getBoundingClientRect();
          const from = Math.max(0, Math.floor(r.left - rr.left));
          const to = Math.min(covered.length, Math.ceil(r.right - rr.left));
          for (let x = from; x < to; x++) covered[x] = true;
        }
        const ranges = [];
        let run = null;
        for (let x = 0; x < covered.length; x++) {
          if (!covered[x]) {
            if (!run) run = [x, x];
            else run[1] = x;
          } else if (run) {
            ranges.push(run);
            run = null;
          }
        }
        if (run) ranges.push(run);
        const significant = ranges.filter(([a, b]) => b - a + 1 >= 24);
        if (significant.length) {
          gapFrames.push({
            step: i,
            tx,
            emptyPx: significant.reduce((s, [a, b]) => s + (b - a + 1), 0),
          });
        }
      }
      // seam
      const seam = [];
      for (const tx of [0, -(shiftPx - 1), -shiftPx]) {
        track.style.transform = `translate3d(${tx}px,0,0)`;
        const rr = root.getBoundingClientRect();
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
        });
      }
      track.style.transform = "";
      track.style.animation = "";
      return { shiftPx, gapFrames, seam, steps: total + 1 };
    }, { stepsPerCycle: 16, cycles: 3 });

    // Live samples with CSS animation running
    await page.evaluate(() => {
      const track = document.querySelector(".marquee-track");
      if (track) {
        track.style.animation = "";
        track.style.transform = "";
      }
    });
    const liveGaps = [];
    for (let i = 0; i < 10; i++) {
      await page.waitForTimeout(320);
      const empty = await page.evaluate(() => {
        const root = document.querySelector(".marquee");
        if (!root) return 9999;
        const rr = root.getBoundingClientRect();
        const items = [...document.querySelectorAll(".marquee-track .marquee-item")];
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
          if (!c) run++;
          else {
            if (run >= 24) empty += run;
            run = 0;
          }
        }
        if (run >= 24) empty += run;
        return empty;
      });
      if (empty > 0) liveGaps.push({ i, empty });
    }

    await ticker.screenshot({ path: path.join(OUT, `${label}-${width}.png`) });

    const pass =
      !baseGeom.error &&
      baseGeom.groupsEqual &&
      baseGeom.groupCoversViewport &&
      !baseGeom.hasObsluzhivanie &&
      !baseGeom.pageOverflowX &&
      (scrub.gapFrames?.length ?? 1) === 0 &&
      (scrub.seam || []).every((s) => s.coversLeft && s.coversRight) &&
      liveGaps.length === 0;

    if (!pass) suite.passed = false;
    suite.viewports[String(width)] = { ...baseGeom, scrub, liveGaps, pass };
    await page.close();
  }

  return suite;
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = { passed: true, suites: [] };

let server = null;
try {
  if (ONLY) {
    const custom = await runSuite(browser, ONLY.replace(/\/$/, ""), "custom");
    report.suites.push(custom);
    if (!custom.passed) report.passed = false;
  } else {
    if (!SKIP_LOCAL) {
      server = await startLocal();
      const local = await runSuite(browser, `http://127.0.0.1:${LOCAL_PORT}`, "local");
      report.suites.push(local);
      if (!local.passed) report.passed = false;
    }
    if (!SKIP_STAGING) {
      const staging = await runSuite(browser, STAGING, "staging");
      report.suites.push(staging);
      if (!staging.passed) report.passed = false;
    }
  }
} finally {
  await browser.close();
  if (server) server.close();
}

await writeFile(path.join(OUT, "report.json"), JSON.stringify(report, null, 2), "utf8");

const summary = {
  passed: report.passed,
  suites: report.suites.map((s) => ({
    label: s.label,
    passed: s.passed,
    buildSignals: s.buildSignals,
    viewports: Object.fromEntries(
      Object.entries(s.viewports).map(([k, v]) => [
        k,
        {
          pass: v.pass,
          viewWidth: v.viewWidth,
          sequenceWidth: v.sequenceWidth,
          group0Width: v.group0Width,
          groupCoversViewport: v.groupCoversViewport,
          scrubGaps: v.scrub?.gapFrames?.length,
          liveGaps: v.liveGaps?.length,
          error: v.error || null,
        },
      ]),
    ),
  })),
};
console.log(JSON.stringify(summary, null, 2));
if (!report.passed) process.exitCode = 1;
