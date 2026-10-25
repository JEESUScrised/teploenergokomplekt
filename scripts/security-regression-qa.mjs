/**
 * Post-security-patch smoke regression for static export.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SITE_URL || "http://127.0.0.1:4180";
const OUT = path.resolve("qa-screenshots/security-patch");

const routes = [
  "/",
  "/about/",
  "/services/",
  "/services/diagnostika-i-obsledovanie/",
  "/services/remont-kotlov/",
  "/services/obmurovka-i-teploizolyatsiya/",
  "/services/puskonaladochnye-raboty/",
  "/services/rekonstruktsiya-i-modernizatsiya/",
  "/services/postavka-komplektuyushchih/",
  "/documents/",
  "/contacts/",
  "/services/obsluzhivanie-kotelnyh/",
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.emulateMedia({ reducedMotion: "reduce" });
const results = [];

for (const route of routes) {
  const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(300);
  const status = res?.status() ?? 0;
  const title = await page.title();
  const h1 = await page.evaluate(() => document.querySelector("h1")?.textContent?.trim() || "");
  const broken = await page.evaluate(
    () =>
      [...document.querySelectorAll("img")].filter((img) => img.complete && img.naturalWidth === 0)
        .length,
  );
  const nav = await page.evaluate(() => {
    const labels = [...document.querySelectorAll("header a, header button")].map((el) =>
      (el.textContent || "").replace(/\s+/g, " ").trim(),
    );
    return {
      hasServices: labels.some((t) => t.includes("Услуги")),
      hasLicenses: labels.some((t) => t.includes("Лицензии")),
      hasContacts: labels.some((t) => t.includes("Контакты")),
    };
  });
  results.push({ route, status, title, h1, brokenImgs: broken, nav });
}

// Mobile menu smoke on home
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
const menuBtn = page.getByRole("button", { name: "Открыть меню" });
await menuBtn.click();
await page.waitForTimeout(200);
const mobileOpen = await page.evaluate(
  () =>
    document.querySelector('header button[aria-label="Открыть меню"][aria-expanded="true"]') !==
    null,
);
results.push({ mobileMenuOpen: mobileOpen });

// Contacts form fields present
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(`${BASE}/contacts/`, { waitUntil: "networkidle" });
const form = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll("form input, form textarea")].map((el) => el.getAttribute("name") || el.getAttribute("id") || el.tagName);
  return { hasForm: !!document.querySelector("form"), fields: inputs };
});
results.push({ contactsForm: form });

// Redirect page for retired service
await page.goto(`${BASE}/services/obsluzhivanie-kotelnyh/`, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
results.push({
  afterRedirectUrl: page.url(),
  afterRedirectTitle: await page.title(),
});

await page.screenshot({ path: path.join(OUT, "home-1440.png"), fullPage: false });
await writeFile(path.join(OUT, "report.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
await browser.close();
