# Staging open access — отключение Basic Auth

Дата: 2026-10-26  
Сайт: https://jeesuscrised.ru/  
Production `tekomp.ru`: не изменялся

---

## 1. Где была Basic Auth

Только в DocumentRoot staging:

`/var/www/u3655435/data/www/jeesuscrised.ru/.htaccess`

Директивы:

- `AuthType Basic`
- `AuthName "Teploenergokomplekt staging"`
- `AuthUserFile …/teploenergokomplekt/.htpasswd-staging`
- `Require valid-user`

Файл паролей `.htpasswd-staging` лежит **вне** www (сохранён, не публиковался).  
Родительских `.htaccess` с Auth не найдено.  
В репозитории `deploy/.htaccess` Auth не содержал — пароль добавлял только временный staging-deploy скрипт.

---

## 2. Что изменено

1. Резервная копия:  
   `…/teploenergokomplekt/var/auth-backups/htaccess-before-open-*.bak`
2. Из live `.htaccess` удалены все директивы Basic Auth.
3. Сохранены:
   - `Header always set X-Robots-Tag "noindex, nofollow"`
   - правила 301 / API / DirectoryIndex
4. `robots.txt` → `User-agent: *` / `Disallow: /`
5. Скрипт `scripts/_tmp_staging_deploy.py` обновлён: при следующих выкладках **не** включает Basic Auth (только noindex + robots).

Повторный полный deploy приложения не выполнялся.

---

## 3. HTTP-проверки (без логина/пароля)

| URL | Статус | WWW-Authenticate |
|---|---|---|
| `/`, `/about/`, `/services/` | 200 | нет |
| 6 страниц услуг | 200 | нет |
| `/documents/`, `/contacts/` | 200 | нет |
| CSS / JS / logo / boiler image | 200 | — |
| `/services/obsluzhivanie-kotelnyh/` | **301** → диагностика | нет |
| `/.env`, `/.htpasswd` и аналоги | 403 | — |

Окна запроса пароля: **нет**.

---

## 4. SSL / HTTPS

| Параметр | Значение |
|---|---|
| Subject | `CN=jeesuscrised.ru` |
| SAN | `jeesuscrised.ru`, `www.jeesuscrised.ru` |
| Issuer | Let's Encrypt (YR1) |
| Срок | 2026-10-08 → **2027-01-06** |
| `curl` ssl_verify | 0 (успех) |
| HTTP → HTTPS | **301** на `https://jeesuscrised.ru` |

Предупреждение Chrome «Не защищено» при открытии по **https://jeesuscrised.ru/** с действующим LE-сертификатом не воспроизводится в проверках (`ssl_verify=0`, валидный CN/SAN).  
Если у заказчика остаётся «Не защищено», обычно это:

- открыт `http://` (нужна явная ссылка с `https://`);
- кэш старого самоподписанного/просроченного сертификата;
- корпоративный MITM-прокси.

На сервере сертификат домена корректный и не отключался.

---

## 5. Индексация

| Защита | Статус |
|---|---|
| `X-Robots-Tag: noindex, nofollow` | да |
| `robots.txt` Disallow `/` | да |
| meta `robots` noindex в HTML | да (staging-патч) |
| Правила редиректов / API | без изменений |

---

## 6. Инкогнито / без сохранённых credentials

Playwright Chromium без `httpCredentials`: главная открывается, title сайта на месте, текста 401 нет, диалогов auth нет.  
Скрин: `qa-screenshots/staging-open-home-1440.png`.

---

## Целевой результат

**https://jeesuscrised.ru/** открывается у любого посетителя **без** логина/пароля по корректному HTTPS.  
Индексация по-прежнему ограничена. Push / production deploy не выполнялись.
