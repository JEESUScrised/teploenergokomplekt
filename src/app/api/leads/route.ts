import { NextResponse } from "next/server";

type LeadBody = {
  name?: string;
  phone?: string;
  task?: string;
};

function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export async function POST(request: Request) {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const task = String(body.task ?? "").trim();

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Укажите имя" }, { status: 400 });
  }
  if (!isValidPhone(phone)) {
    return NextResponse.json({ ok: false, error: "Укажите корректный телефон" }, { status: 400 });
  }
  if (task.length > 2000) {
    return NextResponse.json({ ok: false, error: "Слишком длинное описание" }, { status: 400 });
  }

  const webhook = process.env.LEADS_WEBHOOK_URL?.trim();
  if (!webhook) {
    return NextResponse.json(
      {
        ok: false,
        code: "UNCONFIGURED",
        error: "LEADS_WEBHOOK_URL is not configured",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "teploenergokomplekt-website",
        name,
        phone,
        task,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: "Ошибка при передаче заявки" },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Ошибка сети при передаче заявки" },
      { status: 502 },
    );
  }
}
