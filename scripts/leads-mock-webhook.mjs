/**
 * Local/loopback webhook sink for lead-form integration tests.
 * Usage: node scripts/leads-mock-webhook.mjs [port] [mode]
 *   mode: ok | fail | timeout | hang
 * Does not print full PII to stdout in default mode (counts + field presence only).
 */
import http from "node:http";
import { writeFileSync } from "node:fs";
import path from "node:path";

const port = Number(process.argv[2] || 9876);
const mode = process.argv[3] || "ok";
const outFile = path.resolve("qa-screenshots/leads-mock-last.json");

const received = [];

const server = http.createServer(async (req, res) => {
  if (req.method === "POST") {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const raw = Buffer.concat(chunks).toString("utf8");
    let body = null;
    try {
      body = JSON.parse(raw);
    } catch {
      body = { _raw: raw.slice(0, 200) };
    }
    received.push({ at: new Date().toISOString(), body });
    writeFileSync(
      outFile,
      JSON.stringify(
        {
          count: received.length,
          lastHasName: Boolean(body?.name),
          lastHasPhone: Boolean(body?.phone),
          lastTaskLen: String(body?.task ?? "").length,
          lastSource: body?.source ?? null,
          lastKeys: body && typeof body === "object" ? Object.keys(body) : [],
        },
        null,
        2,
      ),
    );

    if (mode === "timeout" || mode === "hang") {
      // Intentionally do not respond (caller should time out).
      return;
    }
    if (mode === "fail") {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false }));
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.url === "/_count") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ count: received.length }));
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(port, "127.0.0.1", () => {
  console.log(JSON.stringify({ listening: `http://127.0.0.1:${port}`, mode }));
});
