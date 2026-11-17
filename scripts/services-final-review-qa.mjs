/**
 * Services final compliance QA → qa-screenshots/services-final-review/
 */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { extname } from "node:path";

const ROOT = path.resolve("out");
const OUT = path.resolve("qa-screenshots/services-final-review");
const PORT = 4195;

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

const SLUGS = [
  "diagnostika-i-obsledovanie",
  "remont-kotlov",
  "obmurovka-i-teploizolyatsiya",
  "puskonaladochnye-raboty",
  "rekonstruktsiya-i-modernizatsiya",
  "postavka-komplektuyushchih",
];

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

const report = {
  overflow: [],
  consoleErrors: [],
  h1BySlug: {},
  homeServiceCount: 0,
  servicesIndexCount: 0,
  hasObsluzhivanieCard: false,
  exportSlugs: [],
  linksOk: true,
};

for (const vp of [
  { name: "375", w: 375, h: 812 },
  { name: "768", w: 768, h: 1024 },
  { name: "1440", w: 1440, h: 900 },
  { name: "1920", w: 1920, h: 1080 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.w, height: vp.h } });
  page.on("pageerror", (err) => {
    report.consoleErrors.push(`${vp.name}: ${err.message}`);
  });
  await page.emulateMedia({ reducedMotion: "reduce" });

  await page.goto(`http://127.0.0.1:${PORT}/`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(400);
  const homeMeta = await page.evaluate(() => {
    const rows = [...document.querySelectorAll("a.service-row")];
    return {
      count: rows.length,
      titles: rows.map((r) => r.querySelector("h3")?.textContent?.trim()),
      overflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
      hasObsl: /обслуживание котельных/i.test(document.body.innerText),
    };
  });
  report.homeServiceCount = homeMeta.count;
  if (homeMeta.hasObsl) report.hasObsluzhivanieCard = true;
  if (homeMeta.overflow) report.overflow.push(`home-${vp.name}`);

  if (vp.name === "1440" || vp.name === "375") {
    await page.locator("a.service-row").first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({
      path: path.join(OUT, `home-services-${vp.name}.png`),
      fullPage: false,
    });
  }

  await page.goto(`http://127.0.0.1:${PORT}/services/`, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  await page.waitForTimeout(400);
  const indexMeta = await page.evaluate(() => {
    const h1 = document.querySelector("h1")?.textContent?.trim();
    const sections = [...document.querySelectorAll("section")].length;
    return {
      h1,
      sections,
      overflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    };
  });
  report.servicesIndexCount = indexMeta.sections;
  if (indexMeta.overflow) report.overflow.push(`services-index-${vp.name}`);
  if (vp.name === "1440" || vp.name === "375") {
    await page.screenshot({
      path: path.join(OUT, `services-index-${vp.name}.png`),
      fullPage: false,
    });
  }

  for (const slug of SLUGS) {
    const res = await page.goto(`http://127.0.0.1:${PORT}/services/${slug}/`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });
    if (!res || res.status() >= 400) report.linksOk = false;
    await page.waitForTimeout(250);
    const meta = await page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent?.trim() || "",
      overflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
      hasLiningOnCommissioning: /шамотно-кирпич/i.test(
        document.body.innerText,
      ),
    }));
    report.h1BySlug[slug] = meta.h1;
    if (meta.overflow) report.overflow.push(`${slug}-${vp.name}`);
    if (slug === "puskonaladochnye-raboty" && meta.hasLiningOnCommissioning) {
      report.consoleErrors.push(
        `${vp.name}: commissioning page contains lining copy`,
      );
    }
    if (vp.name === "1440" || vp.name === "375") {
      await page.screenshot({
        path: path.join(OUT, `${slug}-${vp.name}.png`),
        fullPage: false,
      });
    }
  }

  await page.close();
}

report.exportSlugs = SLUGS;

await writeFile(path.join(OUT, "qa-report.json"), JSON.stringify(report, null, 2));
await browser.close();
await new Promise((resolve) => server.close(resolve));

const ok =
  report.homeServiceCount === 6 &&
  !report.hasObsluzhivanieCard &&
  report.overflow.length === 0 &&
  report.consoleErrors.length === 0 &&
  report.linksOk;

console.log(JSON.stringify(report, null, 2));
console.log(ok ? "SERVICES_QA_OK" : "SERVICES_QA_NEEDS_FIXES");
process.exit(ok ? 0 : 1);
