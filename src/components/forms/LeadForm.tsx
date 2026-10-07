"use client";

import { AnimatePresence, motion } from "motion/react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { easeOutExpo } from "@/lib/motion";

type Status = "idle" | "submitting" | "error" | "unconfigured" | "success";

function validatePhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

const fieldClass =
  "form-field min-h-12 border border-[var(--line)] bg-[var(--surface)] px-3 outline-none transition-[border-color,box-shadow,background-color] duration-200 focus:border-[var(--blue)] focus:shadow-[0_0_0_3px_rgba(23,55,166,0.12)]";

export function LeadForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const reduce = usePrefersReducedMotion();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);

    const honeypot = String(data.get("company_website") ?? "");
    if (honeypot.trim()) {
      setStatus("idle");
      return;
    }

    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const task = String(data.get("task") ?? "").trim();
    const consent = data.get("consent");

    if (!name || name.length < 2) {
      setStatus("error");
      setMessage("Укажите имя.");
      return;
    }
    if (!validatePhone(phone)) {
      setStatus("error");
      setMessage("Укажите корректный телефон.");
      return;
    }
    if (task.length > 2000) {
      setStatus("error");
      setMessage("Описание слишком длинное.");
      return;
    }
    if (!consent) {
      setStatus("error");
      setMessage("Необходимо согласие на обработку персональных данных.");
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, task }),
      });
      const payload = (await response.json()) as { ok?: boolean; code?: string; error?: string };

      if (response.status === 503 || payload.code === "UNCONFIGURED") {
        setStatus("unconfigured");
        setMessage(
          "Форма готова, но сервер приёма заявок ещё не подключён. Свяжитесь с нами по телефону или e-mail из раздела «Контакты».",
        );
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setMessage(payload.error || "Не удалось отправить заявку. Попробуйте позже.");
        return;
      }

      form.reset();
      setStatus("success");
      setMessage("Заявка отправлена. Мы свяжемся с вами.");
    } catch {
      setStatus("error");
      setMessage("Ошибка сети. Проверьте соединение и попробуйте снова.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate>
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <label className="grid gap-2">
          <span className="text-sm text-[var(--muted)] transition-colors duration-200">Имя</span>
          <input name="name" autoComplete="name" required className={fieldClass} />
        </label>
        <label className="grid gap-2">
          <span className="text-sm text-[var(--muted)]">Телефон</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            placeholder="+7"
            className={fieldClass}
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm text-[var(--muted)]">Краткое описание задачи</span>
        <textarea
          name="task"
          rows={compact ? 3 : 4}
          className={`${fieldClass} py-3 resize-y`}
        />
      </label>

      <label className="sr-only" aria-hidden="true">
        Не заполняйте это поле
        <input name="company_website" tabIndex={-1} autoComplete="off" />
      </label>

      <label className="flex items-start gap-3 text-sm text-[var(--muted)]">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 size-4 accent-[var(--blue)]"
        />
        <span>Согласие на обработку персональных данных</span>
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? (
            <span className="inline-flex items-center gap-2">
              {!reduce ? (
                <motion.span
                  className="inline-block size-3.5 rounded-full border-2 border-white/35 border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
                />
              ) : null}
              Отправка…
            </span>
          ) : (
            "Отправить заявку"
          )}
        </Button>
        <AnimatePresence mode="wait">
          {message ? (
            <motion.p
              key={message}
              className={`text-sm ${
                status === "error" || status === "unconfigured"
                  ? "text-[#8a1f1f]"
                  : "text-[var(--blue-dark)]"
              }`}
              role="status"
              initial={reduce ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
            >
              {message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}
