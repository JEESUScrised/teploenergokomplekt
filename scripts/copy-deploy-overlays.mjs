/**
 * Copy Apache/PHP overlays into Next static `out/` after `next build`.
 * Required for Reg.ru shared hosting: 301 redirects + PHP leads endpoint.
 */
import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "out");
const deployDir = path.join(root, "deploy");

if (!existsSync(outDir)) {
  console.error("out/ missing — run next build first");
  process.exit(1);
}

cpSync(path.join(deployDir, ".htaccess"), path.join(outDir, ".htaccess"));
mkdirSync(path.join(outDir, "api", "leads"), { recursive: true });
cpSync(
  path.join(deployDir, "api", "leads", "index.php"),
  path.join(outDir, "api", "leads", "index.php"),
);

console.log("Copied deploy/.htaccess and deploy/api/leads/index.php → out/");
