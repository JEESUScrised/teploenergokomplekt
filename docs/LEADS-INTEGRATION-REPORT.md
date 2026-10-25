# Leads Integration Report — ООО «Теплоэнергокомплект»

Дата: 2026-10-25  
Ветка: `feat/tekomp-client-revisions-2026-10`  
Staging: https://jeesuscrised.ru/

---

## 1. Текущая схема отправки

```
Browser LeadForm
  → POST /api/leads/  (JSON: name, phone, task, company_website?)
  → Apache PHP  deploy/api/leads/index.php
  → HTTPS/HTTP webhook (LEADS_WEBHOOK_URL)
```

### Frontend (`src/components/forms/LeadForm.tsx`)

| Поле | Обязательность | Примечание |
|---|---|---|
| `name` | да (≥2) | |
| `phone` | да (10–15 цифр) | |
| `task` | нет (≤2000) | |
| `consent` | да (только UI) | не уходит на сервер |
| `company_website` | honeypot | пустое у людей; при заполнении сервер отвечает `ok` без webhook |

Защита от двойной отправки: `disabled` на время `submitting` + `useRef(inFlight)`.

Сообщения пользователю: успех / ошибка валидации / сеть / 429 / `UNCONFIGURED` (форма готова, приём не подключён).

### PHP (`deploy/api/leads/index.php`)

1. Только `POST`, JSON ≤ 32 KB.  
2. Валидация имени/телефона/длины задачи.  
3. Honeypot `company_website`.  
4. Rate limit: ≤8 запросов / IP / 10 мин (файл вне www, fail-open).  
5. Загрузка webhook:
   - `getenv` / `$_SERVER` / `$_ENV` `LEADS_WEBHOOK_URL`
   - **предпочтительно** `{account}/teploenergokomplekt/leads.env`
   - legacy `{account}/teploenergokomplekt/.env`
6. `curl` POST JSON `{ source, name, phone, task, submittedAt }`, timeout 20 s, connect 5 s, без follow redirects.  
7. Ответы клиенту **без** URL webhook и без деталей curl.

### Важно про shared hosting

`getenv('LEADS_WEBHOOK_URL')` в CLI на staging **пуст**. Apache обычно **не** прокидывает произвольные env в PHP.  
Рабочий способ на REG.RU: файл **вне DocumentRoot** `…/data/teploenergokomplekt/leads.env` (`chmod 600`).

Это не Node/build-time переменная и не `NEXT_PUBLIC_*`.

---

## 2. Результаты тестов

### Локальный mock webhook (`scripts/leads-mock-webhook.mjs` + contract test)

| Сценарий | Результат |
|---|---|
| mock OK | pass |
| mock HTTP 500 | pass |
| mock hang/timeout | pass |
| UI contracts без утечки URL | pass |

Локальный mock **не** считается подтверждением staging-доставки.

### Staging (loopback sink на `127.0.0.1`, не канал заказчика)

| Сценарий | HTTP | Результат |
|---|---|---|
| Валидная заявка → sink | 200 | pass (payload: name/phone/source) |
| Короткое имя | 400 | pass |
| Неверный телефон | 400 | pass |
| Некорректный JSON | 400 | pass |
| Honeypot | 200 без пересылки | pass |
| Webhook down (`127.0.0.1:1`) | 502 | pass, без утечки |
| Webhook timeout | 502 | pass, без утечки |
| После очистки конфига | 503 `UNCONFIGURED` | pass |

После тестов на staging снова выставлен пустой `LEADS_WEBHOOK_URL=` (приём выключен до выдачи боевого/тестового URL заказчика).

### Безопасность staging

| Проверка | Результат |
|---|---|
| `leads.env` / `.env` вне `www/` | да |
| HTTP GET путей вида `/teploenergokomplekt/.env`, `/.env` | 403/404, без содержимого секретов |
| `.env` внутри DocumentRoot | нет |
| Webhook в JS/`_next` | нет |

---

## 3. Требуемые настройки сервера

На аккаунте staging/production (путь вида `/var/www/<user>/data/`):

```bash
mkdir -p ~/teploenergokomplekt/var
chmod 700 ~/teploenergokomplekt ~/teploenergokomplekt/var
cp deploy/teploenergokomplekt/leads.env.example ~/teploenergokomplekt/leads.env
chmod 600 ~/teploenergokomplekt/leads.env
# Вписать LEADS_WEBHOOK_URL=https://…   (реальный HTTPS endpoint)
```

Убедиться, что в DocumentRoot лежит актуальный `api/leads/index.php` (через `npm run build` → `postbuild` → выкладка `out/`).

Не класть `leads.env` / `.env` в `www/`.  
Не коммитить реальный URL.  
Не использовать `NEXT_PUBLIC_LEADS_*`.

Опционально (панель ISPmanager): SetEnv — только если хостинг гарантирует передачу в PHP; файл `leads.env` остаётся основным способом.

---

## 4. Данные для подключения конечного получателя

Нужно от заказчика / интегратора:

1. **HTTPS URL** приёмника (Telegram bot gateway, Bitrix24 webhook, Make/Zapier, корпоративный endpoint и т.п.).  
2. Подтверждение метода: **POST** `Content-Type: application/json`.  
3. Ожидаемое тело:

```json
{
  "source": "teploenergokomplekt-website",
  "name": "…",
  "phone": "…",
  "task": "…",
  "submittedAt": "2026-10-25T00:00:00+00:00"
}
```

4. Код ответа 2xx = успех; иначе сайт покажет пользователю общую ошибку передачи.  
5. Желательно отдельный **тестовый** URL для staging, не совпадающий с рабочим каналом.  
6. Контакты в `company.ts` (телефон/email) — для fallback-текста при `UNCONFIGURED`.

После получения URL: записать только в `leads.env` на сервере, проверить одну тестовую заявку в тестовый канал, затем заменить на production URL при релизе.

---

## 5. Блокирующие проблемы

**Блокеров по коду/инфраструктуре нет.**

Осталось только **операционное** условие go-live форм:

- отсутствует конечный (или постоянный тестовый) `LEADS_WEBHOOK_URL` от заказчика.

До его появления staging корректно отвечает `503 UNCONFIGURED` и показывает понятное сообщение в UI.

---

## 6. Изменения в репозитории (этап 6)

- Усилен PHP-обработчик (конфиг вне www, honeypot, rate limit, безопасные ошибки).  
- Frontend: защита от повторного submit, передача honeypot, разбор JSON ошибок.  
- Пример `deploy/teploenergokomplekt/leads.env.example`.  
- Локальные скрипты mock/contract test.  
- README обновлён.

Push / production deploy / DNS не выполнялись.
