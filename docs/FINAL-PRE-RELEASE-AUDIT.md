# Финальный предрелизный аудит — ООО «Теплоэнергокомплект»

Дата: 2026-10-25  
Ветка: `feat/tekomp-client-revisions-2026-10`  
Статус: **READY_FOR_STAGING**

---

## 1. Проверенные коммиты и версии

| Параметр | Значение |
|---|---|
| Базовый клиентский коммит | `fdd99b4` — feat(projects): rebuild project portfolio by year |
| Security-коммит | `b3b17c2` — fix(security): patch Next.js vulnerabilities |
| Merge | `git merge --ff-only fix/next-security-2026-10` — успешен |
| HEAD основной ветки после merge | `b3b17c2` |
| `fix/next-security-2026-10` основана на `fdd99b4` | да (`merge-base --is-ancestor`) |
| Next.js | **16.4.3** (`package.json` и `package-lock.json` согласованы) |
| `output` / `trailingSlash` | `"export"` / `true` (`next.config.mjs`) |

Дополнительные коммиты после merge (аудит):

- SEO: meta description главной без «обслуживания» как отдельного направления каталога
- a11y: H1 на `/services/` и `/contacts/`
- deploy: `postbuild` копирует `.htaccess` и PHP leads в `out/`
- docs: таблица согласования портфолио + этот отчёт

Push / production deploy **не** выполнялись.

---

## 2. Проверка требований заказчика

### Главная

| Требование | Результат |
|---|---|
| Первый Hero удалён | OK — `HomeHero` не подключён к `page.tsx` |
| «О нас» — первый контентный блок | OK — `AboutStrip` первым |
| Три информационные карточки, согласованные тексты | OK |
| Центральная карточка: `boiler-cutout-repair.png` | OK |
| Нет «Виды ремонта» / «Основные направления работ» / «Этапы ремонта» на главной | OK — секции не рендерятся |
| Корректный H1 | OK — H1 «О нас» |

### Услуги

| Требование | Результат |
|---|---|
| Ровно 6 направлений | OK — порядок и названия совпадают с ТЗ |
| Нет «Обслуживание котельных» в каталоге/навигации | OK — отсутствует в `services[]`, header, footer, home editorial |
| Карточки / внутренние страницы / SEO / nav | OK |
| Старый URL | Клиентский fallback + правило Apache 301 (см. §4) |

### Лицензии

| Требование | Результат |
|---|---|
| Название «Лицензии и допуски» | OK (nav, H1, meta) |
| URL `/documents/` | OK |
| Текст по требованиям | OK (`documentsPageCopy`) |
| Неподтверждённые документы не публикуются | OK — все `approvedForPublication: false`, empty state |
| Нет фиктивных лицензий в UI | OK |
| Ссылки НАКС / Ростехнадзор | OK — `https://naks.ru/registry-list/`, `https://www.gosnadzor.ru/` |

### Объекты

| Требование | Результат |
|---|---|
| Хронологическая группировка по годам | OK в коде (`getProjectsGroupedByYear`) |
| Реальные фото, без фиктивных карточек | OK — 31 файл в `public/assets/projects/` |
| Публично 0 объектов | OK — 26 черновиков, empty state |
| Галерея / lightbox | OK на `/about/` (Escape закрывает) |
| `approvedForPublication` не менялись | OK |

Таблица для заказчика: [`docs/PROJECTS-CLIENT-CONFIRMATION.md`](./PROJECTS-CLIENT-CONFIRMATION.md).

---

## 3. Проверка страниц

Playwright по static export (`out/`), viewport 375 / 768 / 1440 / 1920.

| Маршрут | HTTP | H1 | Broken images | Ссылка на obsluzhivanie |
|---|---|---|---|---|
| `/` | 200 | О нас | 0 | нет |
| `/about/` | 200 | О компании | 0 | нет |
| `/services/` | 200 | Услуги | 0 | нет |
| 6 страниц услуг | 200 | корректные | 0 | нет |
| `/documents/` | 200 | Лицензии и допуски | 0 | нет |
| `/contacts/` | 200 | Контакты | 0 | нет |

Горизонтальный overflow на главной: нет (все 4 ширины).  
CTA кликабельны. Клавиатурный Escape для lightbox: OK.

Скриншоты: `qa-screenshots/pre-release/`.

---

## 4. Проверка редиректов

| Проверка | Результат |
|---|---|
| `deploy/.htaccess` — `R=301` на `/services/diagnostika-i-obsledovanie/` | OK (статически) |
| Клиентский fallback (`meta refresh` + `location.replace`) | OK на static serve |
| `out/.htaccess` после `npm run build` | OK — копируется `postbuild` |
| `out/api/leads/index.php` | OK — копируется `postbuild` |
| **HTTP 301 с заголовком `Location` на Apache** | **обязательно на staging** — локального Apache нет; `serve` не эмулирует `.htaccess` |

Конфликтов маршрутизации Next export не обнаружено: 6 SSG-услуг + отдельная страница редиректа.

---

## 5. Проверка SEO

- Title/description на проверенных страницах заполнены и соответствуют направлениям.
- Meta главной без позиционирования «обслуживания» как отдельного пункта каталога.
- Canonical / robots на retired URL: `noindex`, canonical → диагностика.
- Sitemap включает static routes + 6 услуг (без obsluzhivanie как канонической услуги).

---

## 6. Проверка форм

| Вопрос | Ответ |
|---|---|
| Как отправляется | `POST /api/leads/` JSON `{ name, phone, task }` |
| Backend | PHP `deploy/api/leads/index.php` → webhook `LEADS_WEBHOOK_URL` |
| Static Export | Да: статический фронт + PHP на Apache рядом с `out/` |
| Обязательные поля | Имя (≥2), телефон (10–15 цифр), согласие; honeypot |
| Ошибка | UI `error` / сеть; 503 → `unconfigured` с текстом связаться по контактам |
| Успех | «Заявка отправлена. Мы свяжемся с вами.» |
| Секреты во frontend | Нет webhook URL / ключей в клиентском коде |

**Staging:** задать `LEADS_WEBHOOK_URL` на хостинге; без него форма показывает понятный unconfigured-state (не «тихий» сбой).  
Реальные отправки на рабочие адреса в аудите не выполнялись.

---

## 7. Проверка мобильного меню

Viewport ~390px:

- Открытие: `aria-expanded=true`, `#mobile-menu` присутствует, label «Закрыть меню»
- Закрытие: `aria-expanded=false`, меню снимается
- Пункты услуг: 6 актуальных направлений из `services`

Отдельный багфикс меню не потребовался.

---

## 8. Результаты безопасности

| Команда | Результат |
|---|---|
| `npm audit --omit=dev` | **0 vulnerabilities** |
| `npm audit` (с dev) | 1 high: **Zod &lt; 4.6.6** (GHSA-mrhx-c7xc-m3w5) |

**Zod (dev-only):** тянется через `eslint-plugin-react-hooks`, версия в lockfile `4.6.5`. Не входит в production bundle static export. Массовый `npm audit fix --force` не запускался. При желании позже: точечное обновление Zod в dev-дереве без смены Next.

Next.js 16.4.3 закрывает ранее отмеченные advisory GHSA-673q / 2464 / p3m5.

---

## 9. Результаты сборки

| Команда | Результат |
|---|---|
| `npm run lint` | OK |
| `npm run typecheck` | OK |
| `npm run build` | OK (Next 16.4.3, 17 маршрутов) |
| `postbuild` | копирует `.htaccess` + `api/leads/index.php` → `out/` |

---

## 10. Блокирующие проблемы

**Нет блокеров для staging.**

Обязательные проверки на staging (не локально):

1. HTTP **301** + `Location` для `/services/obsluzhivanie-kotelnyh/`.
2. Наличие `.htaccess` и PHP leads в выкладке (после `npm run build` они уже в `out/`).
3. Настроенный `LEADS_WEBHOOK_URL` перед ожиданием реальных заявок.

---

## 11. Некритичные проблемы

1. Неиспользуемые legacy-компоненты (`HomeHero`, `HomeDirections`, `RepairStages`, `HeroFactLedger`) остаются в дереве; `HomeDirections` содержит устаревшую ссылку на obsluzhivanie, но **не подключён** к страницам.
2. Prefetch RSC `*.txt` 404 при клиентской навигации на static `serve` — артефакт static export / dev-serve; полные HTML-маршруты отдают 200.
3. В `company.ts` пустые phone / email / address — на контактах плейсхолдеры до заполнения заказчиком.
4. Dev-only Zod advisory (см. §8).
5. Публичное портфолио пустое до согласования (ожидаемо).

---

## 12. Материалы от заказчика

1. Подтверждение строк портфолио — [`PROJECTS-CLIENT-CONFIRMATION.md`](./PROJECTS-CLIENT-CONFIRMATION.md).
2. Какие объекты публиковать (`approvedForPublication`).
3. Актуальные телефон, e-mail, адрес.
4. Реквизиты webhook для заявок (или иной канал приёма).
5. Редакционные сканы лицензий (без ПФИ) — только после этого публикация документов.
6. Staging-проверка Apache 301.

---

## 13. Заключение

**READY_FOR_STAGING**

Клиентские этапы 1–4 и security-patch интегрированы; lint / typecheck / build / prod-audit чистые; браузерная регрессия ключевых маршрутов пройдена. Production deploy не выполнять до staging-проверки Apache 301, webhook форм и заполнения контактов / портфолио по ответу заказчика.
