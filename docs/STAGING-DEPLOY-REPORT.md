# Staging Deploy Report — ООО «Теплоэнергокомплект»

Дата: 2026-10-25  
Итог: **STAGING_PASS**  
(интеграционный тест успешной доставки webhook — **заблокирован**: `LEADS_WEBHOOK_URL` пуст)

---

## 1. Staging URL

**https://jeesuscrised.ru/**

Доступ QA (HTTP Basic Auth, только staging):

- Пользователь: `tekomp-qa`
- Пароль: `TkStg-2026-QA!`

Production **не** затрагивался: **https://tekomp.ru/** (другой IP / другой аккаунт).

---

## 2. Подтверждение окружения (без лишних деталей)

| Проверка | Результат |
|---|---|
| DNS `jeesuscrised.ru` | `37.140.192.188` (REG.RU shared) |
| DNS `tekomp.ru` | `37.140.192.190` (другой хост) |
| Аккаунт SSH | staging-аккаунт; в `www/` только `jeesuscrised.ru` и `a-texgroup.com` |
| `tekomp.ru` на аккаунте | **отсутствует** |
| DocumentRoot staging | `…/www/jeesuscrised.ru` (подтверждён) |
| Свободное место | ~861 GB available |

Вывод: домен является тестовым DocumentRoot на подтверждённом аккаунте. Загрузка разрешена.

---

## 3. Резервное копирование

До выкладки и перед повторной выкладкой (после rebuild URL):

| Артефакт | Назначение |
|---|---|
| `…/backups/tekomp-staging/jeesuscrised-20261025-201116.tar.gz` | полный снимок DocumentRoot до первой выкладки (37 MB) |
| `…/backups/tekomp-staging/jeesuscrised-20261025-202002.tar.gz` | снимок перед повторной выкладкой (URL/canonical) |
| `htaccess-*.bak` | копия `.htaccess` |
| `php-v-*.txt` | версия PHP (8.2.35 CLI) |
| `rollback-*.sh` | скрипт отката из соответствующего tar |

Откат возможен через `rollback-*.sh` на сервере. Неизвестные пользовательские каталоги вне DocumentRoot не удалялись; `a-texgroup.com` не трогался.

---

## 4. Версия коммита

| | |
|---|---|
| Ветка | `feat/tekomp-client-revisions-2026-10` |
| HEAD при выкладке | `6e87257` |
| Next.js | 16.4.3 |
| Preflight | `git status` clean; lint / typecheck / build OK |
| Сборка staging URL | `NEXT_PUBLIC_SITE_URL=https://jeesuscrised.ru` (только для этой выкладки; не в git) |

---

## 5. Публикация

| | |
|---|---|
| Источник | локальный `out/` (238 файлов, ~39 MB) |
| Цель | только DocumentRoot `jeesuscrised.ru` |
| `.htaccess` | да (+ staging overlays) |
| `api/leads/index.php` | да |
| `node_modules` / `.git` / `.env` / исходники | **не** загружались |
| Секреты в DocumentRoot | не найдены |
| Production `tekomp.ru` | **не** деплоился |

Staging-only (не входят в production-сборку репозитория):

- HTTP Basic Auth (`.htpasswd` вне DocumentRoot)
- `Header always set X-Robots-Tag: noindex, nofollow`
- `robots.txt` → `Disallow: /`
- meta `robots` noindex в HTML (патч на сервере после upload)

Маркер: `.staging-overlay` в DocumentRoot.

---

## 6. HTTP-статусы страниц

С Basic Auth, `curl` / Playwright:

| Маршрут | Статус |
|---|---|
| `/` | 200 |
| `/about/` | 200 |
| `/services/` | 200 |
| 6 страниц услуг | 200 |
| `/documents/` | 200 |
| `/contacts/` | 200 |
| `/robots.txt` | 200 (с auth) |
| `/sitemap.xml` | 200 |
| Без auth (любой URL) | **401** + `WWW-Authenticate` |

CSS/JS/`logo`/`boiler-cutout-repair.png`: 200.

---

## 7. Проверка 301

Команда: `curl -I` **без** follow, с Basic Auth:

```
HTTP/1.1 301 Moved Permanently
X-Robots-Tag: noindex, nofollow
Location: https://jeesuscrised.ru/services/diagnostika-i-obsledovanie/
```

URL: `/services/obsluzhivanie-kotelnyh/`

После follow: **200** на диагностике. Зацикливания нет.  
Это серверный 301 (Apache via nginx), не замена клиентским JS.

Без auth на тот же URL: **401** (Basic Auth срабатывает до отдачи контента; с валидными credentials — 301).

---

## 8. PHP и webhook

| | |
|---|---|
| Обработчик | `api/leads/index.php` |
| Источник webhook | `getenv('LEADS_WEBHOOK_URL')` → fallback чтение `…/teploenergokomplekt/.env` |
| `.env` на сервере | существует |
| `LEADS_WEBHOOK_URL` | **пустой** → доставка не настроена |
| Webhook в JS / публичных файлах | нет (только имя переменной в PHP) |
| Валидация | имя ≥2, телефон 10–15 цифр, task ≤2000 |
| Коды | 405 / 400 / 503 `UNCONFIGURED` / 502 / 200 |
| Rate-limit | отдельного лимита нет (есть honeypot на клиенте) |

---

## 9. Формы

| Сценарий | Результат |
|---|---|
| Короткое имя / плохой телефон | HTTP 400 + JSON error |
| Валидная заявка | HTTP **503** `UNCONFIGURED` |
| Без Basic Auth | HTTP 401 |
| UI валидация | «Укажите имя.» |
| UI при 503 | сообщение о неподключённом приёме заявок |
| Успешная доставка в канал | **не тестировалась** — нет тестового webhook; в рабочие каналы заказчика заявки не отправлялись |

Интеграционный тест webhook: **BLOCKED** до выдачи тестового `LEADS_WEBHOOK_URL`.

---

## 10. Визуальный QA

Viewport 375 / 768 / 1440 / 1920: без горизонтального overflow.  
Мобильное меню: open/close + `aria-expanded` OK.  
6 услуг на главной — корректный набор, без «Обслуживание котельных» в каталоге.  
«Лицензии и допуски», empty state документов OK.  
Портфолио — временное/пустое состояние (0 published).  
Lightbox на `/about/`: открытие + Escape OK.  
Скриншоты: `qa-screenshots/staging/`.

---

## 11. Консоль и сеть

| | |
|---|---|
| JS page errors | критичных нет |
| Ожидаемый 503 | `POST /api/leads/` при unconfigured webhook |
| Возможный 404 | RSC prefetch `__next.*.txt` (static export / клиентская навигация) — не ломает HTML 200 |

---

## 12. Оставшиеся проблемы / follow-up

1. **Задать тестовый `LEADS_WEBHOOK_URL`** в server `.env` (не в репозиторий) и повторить happy-path формы.  
2. Перед production-сборкой: `NEXT_PUBLIC_SITE_URL=https://tekomp.ru` (staging собран с jeesuscrised.ru).  
3. Sitemap loc без trailing slash при `trailingSlash: true` — косметика для prod.  
4. Контакты в `company.ts` пустые — плейсхолдеры до данных заказчика.  
5. Портфолио / документы — ждать подтверждения заказчика (`approvedForPublication` не менялись).  
6. Staging Basic Auth / noindex **не** переносить в production-deploy `.htaccess` из репозитория (сейчас overlays только на сервере staging).

---

## 13. Итог

### STAGING_PASS

Сайт версии `6e87257` развёрнут на подтверждённом staging, защищён от индексации, Apache **301** подтверждён `curl -I`, страницы и UI проверены.  
Production не изменялся.  
Полная E2E-доставка заявок заблокирована отсутствием webhook — не блокирует staging UI/Apache acceptance.

Push / merge / production deploy не выполнялись.
