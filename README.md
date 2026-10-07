# ООО «Теплоэнергокомплект» — корпоративный сайт

Премиальный промышленный сайт подрядчика по ремонту и модернизации котельного оборудования.

## Стек

- Next.js (App Router) + TypeScript
- Tailwind CSS v4
- Локальные шрифты: Oswald, Manrope (`@fontsource`)

## Запуск

```bash
npm install
npm run dev
```

```bash
npm run lint
npm run typecheck
npm run build
```

## Конфигурация клиента

1. Контакты: `src/config/company.ts` — `phone`, `phoneDisplay`, `email`, `address`
2. Публичный URL: `.env` → `NEXT_PUBLIC_SITE_URL`
3. Приём заявок: `.env` → `LEADS_WEBHOOK_URL` (POST JSON)
4. Сканы документов: положите файлы в `public/assets/documents/` и укажите пути в `src/data/documents.ts`

См. `.env.example`.

## Исходные материалы

Оригиналы фото и ассетов не изменяются и хранятся в папке `ФОТО КОТЛОВ/`.
Рабочие копии с латинскими именами — в `public/assets/`.
