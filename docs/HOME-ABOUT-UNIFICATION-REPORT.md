# Home + About Unification Report — этап 3

Дата: 2026-11-17  
Ветка: `feat/tekomp-client-revisions-2026-10`  
Итоговый статус: **`HOME_ABOUT_UNIFICATION_READY`**

---

## 1. Старая и новая структура главной

### Было

1. `HomeHero` — отдельный рекламный Hero с котлом  
2. `ServiceTicker`  
3. `AboutStrip` — три компактные карточки «О нас»  
4. `ServicesEditorial`  
5. `ProjectsSection`  
6. `Advantages`  
7. `LicensesBand`  
8. `CtaRequest`  

Отдельная страница `/about/` с `AboutContent` (география, типы котлов, технологии, квалификация, иллюстрации).

### Стало

1. **О НАС** (`AboutStrip`, `id="about"`) — выразительный первый экран с тремя карточками и крупным котлом  
2. **Бегущая строка** (`ServiceTicker`)  
3. **Услуги** (`ServicesEditorial`)  
4. **География / Технологии и качество** (`GeographyQualityBand`)  
5. **Объекты** (`ProjectsSection`)  
6. **Преимущества** (`Advantages`)  
7. **Лицензии и допуски** (`LicensesBand`)  
8. **Контакты / CTA** (`CtaRequest`)

Отдельная страница `/about/` удалена.

---

## 2. Материалы, перенесённые из `/about/`

| Тема | Куда |
|---|---|
| География «от Белгорода до Находки», карта | `GeographyQualityBand` → `#geography` |
| Типы котлов (ДКВР, ДЕ, КЕ, …) | блок «Технологии и качество» + карточка «Специализация» |
| Квалификация специалистов / НАКС по запросу | карточка в `#technologies` |
| Технологии сварки, НК, гидравлика, исполнительная документация | карточка в `#technologies` |
| Изображение котла из Hero | центральная карточка «Профиль компании» |
| Фирменный логотип | левая карточка «Компания» |
| Фото поверхностей нагрева | правая карточка «Специализация» |

Не придумывались проекты, адреса, годы объектов, гарантии и лицензии сверх уже подтверждённых данных сайта.

---

## 3. Удалённые дубли и устаревшие блоки

- Удалён отдельный `HomeHero` (не оставлен второй рекламный Hero).  
- Удалены `src/app/about/page.tsx` и `AboutContent.tsx`.  
- Убрано повторное «О нас» в виде второй секции с тем же смыслом.  
- Не возвращены «Виды ремонта», аккордеон «Основные направления», «Этапы ремонта», отдельная услуга «Обслуживание котельных».  
- Подробные сведения НАКС / Ростехнадзор / СРО на главной не дублируются — остаётся тизер `LicensesBand` со ссылкой на `/documents/`.

---

## 4. Новый первый экран

Компонент: `src/components/sections/home/AboutStrip.tsx`  
Стили: `.about-hero*` в `src/app/globals.css`

- Единственный H1: **О нас**  
- Eyebrow: `ООО «ТЕПЛОЭНЕРГОКОМПЛЕКТ»`  
- CTA: консультация + услуги  
- Desktop: 3 колонки, центральная шире, крупный котёл  
- Mobile: вертикальный стек, котёл остаётся крупным  
- Анимации появления и лёгкий параллакс котла (с учётом `prefers-reduced-motion`)

---

## 5. Изображения

| Назначение | Путь |
|---|---|
| Логотип (карточка «Компания») | `/assets/brand/logo.png` |
| Котёл (центр, бывший Hero) | `/assets/boilers/boiler-cutout-repair.png` |
| Специализация | `/assets/projects/hq-heatex-copper-tubes.jpg` |
| Карта географии | существующий `GeographyMap` |

Отдельная вторая галерея портфолио не создавалась. Иллюстрации оборудования не переименовывались в подтверждённые объекты.

---

## 6. Навигация

- Header / Footer: пункт «О компании» → `/#about`  
- Якорь первого блока: `id="about"`  
- Sitemap: маршрут `/about` убран (`src/app/sitemap.ts`)  
- Canonical главной: `/` (через `buildMetadata({ path: "/" })`)  
- Static Export: каталог `out/about` отсутствует

---

## 7. Редирект

В `deploy/.htaccess` (копируется в `out/` postbuild):

```apache
# Former about page merged into homepage (permanent)
RewriteRule ^about/?$ / [R=301,L]
RewriteRule ^about/index\.html$ / [R=301,L]
```

Серверный 301 Apache, без клиентского JS-редиректа. Не конфликтует с правилом retired service и PHP API.

---

## 8. Бегущая строка

Проверка локально (`scripts/ticker-local-qa.mjs`) на 1440 и 1920:

| | 1440 | 1920 |
|---|---|---|
| `data-ticker-ready` | `1` | `1` |
| 6 направлений | да | да |
| «Обслуживание» | нет | нет |
| groupsEqual | да | да |
| covers viewport | да | да |
| iteration | infinite | infinite |
| timing | linear | linear |

Пустоты справа и скачка на стыке не выявлено. Существующая измерительная реализация `ServiceTicker` сохранена без переписывания.

---

## 9. Lint / typecheck / build

| Команда | Результат |
|---|---|
| `npm run lint` | OK (warnings нет после правки `hero-revision-qa.mjs`) |
| `npm run typecheck` | OK (после очистки устаревшего `.next`) |
| `npm run build` | OK после повторного запуска; Static Export 17 маршрутов, `/about` нет |
| postbuild | `deploy/.htaccess` и PHP API скопированы в `out/` |

Примечание окружения: Next.js 16.4.3 показывает предупреждение о известной уязвимости. По ТЗ зависимости **не обновлялись**. Первый прогон `next build` мог остановиться на security nudge; повторный прогон завершился успешно.

`/documents/` в экспорте на месте; блоки НАКС / Ростехнадзор / СРО не переписывались.

---

## 10. Визуальный QA

Скриншоты: `qa-screenshots/home-about-unification/` (в `.gitignore`, локально):

- `first-screen-desktop-1440.png` / `1920` / `2560`  
- `first-screen-mobile-375.png` / `tablet-768`  
- `about-block-desktop-1440.png` / `about-block-mobile-375.png`  
- `about-into-services-desktop-1440.png`  
- `geography-technologies-desktop-1440.png`  
- `home-full-desktop-1440.png` / `1920` / `home-full-mobile-375.png`  
- кадры тикера `ticker-*-frame-*.png`  
- `qa-report.json`, `ticker-local-report.json`

Наблюдения:

- Первый экран выразительный, H1 «О нас» сразу после Header  
- Котёл доминирует в центральной карточке  
- Overflow по ширинам 375–2560 не зафиксирован  
- JS page errors не зафиксированы  
- География и технологии читаемы, без дубля услуг/портфолио

---

## 11. Оставшиеся вопросы

1. Canonical в локальном export указывает на `http://localhost:3000/` — поведение `getSiteUrl()` при сборке без production env (не регрессия этого этапа).  
2. Security upgrade Next.js отложен по ТЗ («не обновлять зависимости»).  
3. Staging/production deploy и push не выполнялись по ТЗ.

---

## Изменённые файлы (ключевые)

| Файл | Изменение |
|---|---|
| `src/app/page.tsx` | новая композиция без `HomeHero` |
| `src/components/sections/home/AboutStrip.tsx` | новый первый экран |
| `src/components/sections/home/GeographyQualityBand.tsx` | **новый** — география + технологии |
| `src/components/sections/home/HomeHero.tsx` | удалён |
| `src/app/about/page.tsx`, `AboutContent.tsx` | удалены |
| `Header.tsx` / `Footer.tsx` | `/#about` |
| `src/app/sitemap.ts` | без `/about` |
| `deploy/.htaccess` | 301 `/about/` → `/` |
| `src/app/globals.css` | стили `.about-hero*` |
| QA-скрипты | обновлены под отсутствие `/about` |
| `docs/HOME-ABOUT-UNIFICATION-REPORT.md` | этот отчёт |

Коммит: `feat(home): unify homepage and company content`  
Push / staging / production / DNS: **не выполнялись**.
