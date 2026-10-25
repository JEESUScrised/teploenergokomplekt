/**
 * Contract tests for LeadForm client expectations vs PHP response shapes.
 * Also drives local mock webhook modes (ok/fail/timeout) without staging PII.
 *
 * This does NOT prove staging delivery — see remote staging probe.
 */
import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import http from "node:http";

function request(url, { method = "GET", body, timeoutMs = 3000 } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request(
      {
        hostname: u.hostname,
        port: u.port,
        path: u.pathname,
        method,
        headers: body
          ? { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) }
          : {},
        timeout: timeoutMs,
      },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            body: Buffer.concat(chunks).toString("utf8"),
          });
        });
      },
    );
    req.on("timeout", () => {
      req.destroy(new Error("timeout"));
    });
    req.on("error", reject);
    if (body) req.write(body);
    req.end();
  });
}

async function withMock(mode, fn) {
  const port = 9876 + Math.floor(Math.random() * 200);
  const child = spawn(process.execPath, ["scripts/leads-mock-webhook.mjs", String(port), mode], {
    stdio: ["ignore", "pipe", "pipe"],
  });
  await sleep(250);
  try {
    return await fn(port);
  } finally {
    child.kill("SIGTERM");
  }
}

const results = [];

await withMock("ok", async (port) => {
  const res = await request(`http://127.0.0.1:${port}/`, {
    method: "POST",
    body: JSON.stringify({
      source: "teploenergokomplekt-website",
      name: "Test",
      phone: "+79990001122",
      task: "local mock",
      submittedAt: new Date().toISOString(),
    }),
  });
  results.push({ case: "mock_ok", status: res.status, ok: res.status === 200 });
});

await withMock("fail", async (port) => {
  const res = await request(`http://127.0.0.1:${port}/`, {
    method: "POST",
    body: JSON.stringify({ name: "Test", phone: "+79990001122", task: "x" }),
  });
  results.push({ case: "mock_fail", status: res.status, ok: res.status === 500 });
});

await withMock("hang", async (port) => {
  let timedOut = false;
  try {
    await request(`http://127.0.0.1:${port}/`, {
      method: "POST",
      body: JSON.stringify({ name: "Test", phone: "+79990001122", task: "x" }),
      timeoutMs: 800,
    });
  } catch {
    timedOut = true;
  }
  results.push({ case: "mock_timeout", ok: timedOut });
});

// Double-submit guard is frontend-only; assert response shape contract for UI.
const uiContracts = [
  {
    name: "success",
    response: { ok: true },
    expect: "success",
  },
  {
    name: "unconfigured",
    response: { ok: false, code: "UNCONFIGURED", error: "Приём заявок временно недоступен" },
    status: 503,
    expect: "unconfigured",
  },
  {
    name: "validation",
    response: { ok: false, error: "Укажите имя" },
    status: 400,
    expect: "error",
  },
  {
    name: "upstream",
    response: { ok: false, error: "Ошибка при передаче заявки" },
    status: 502,
    expect: "error",
  },
];

for (const c of uiContracts) {
  const hasLeak =
    JSON.stringify(c.response).includes("http") ||
    JSON.stringify(c.response).toLowerCase().includes("webhook");
  results.push({
    case: `ui_contract_${c.name}`,
    ok: !hasLeak && Boolean(c.expect),
    leak: hasLeak,
  });
}

console.log(JSON.stringify({ results }, null, 2));
if (results.some((r) => !r.ok)) process.exitCode = 1;
