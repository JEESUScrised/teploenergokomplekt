# Портфолио — таблица для согласования заказчиком

Дата: 2026-10-25  
Ветка: `feat/tekomp-client-revisions-2026-10`  
Источник: `src/data/projects.ts`, `public/assets/projects/`  

**Статус публикации на сайте:** 0 из 26 объектов (все `approvedForPublication: false`).  
**Фотографий в репозитории:** 31.  
Флаги публикации самостоятельно **не** менялись.

Легенда источника:
- `filename-derived` — значение восстановлено из имени файла (требует подтверждения).
- `unknown` — определить по файлу нельзя.
- `client-confirmed` — подтверждено заказчиком (пока нигде не проставлено).

Примеры из брифа (ДЕ-16 Бузулук 2026, ДЕ-6 Сакмарская, КЕ-10 Ачинск, Е-2,5 Белореченская) — **образцы оформления**, не основание для автопубликации.

---

## 1. Объекты с предполагаемыми метаданными (filename-derived)

| ID | Файлы | Оборудование | Нас. пункт | Регион | Год | Источник | Подтвердить |
|---|---|---|---|---|---|---|---|
| `de-16-buzuluk-2026` | `de-16-buzuluk-2026.jpg`, `-2.jpg`, `-3.jpg` | ДЕ-16 | Бузулук | Оренбургская область | 2026 | filename-derived | модель, город, регион, год, что 3 фото — один объект; сверка с примером брифа |
| `ke-25-kurgan-2025` | `ke-25-kurgan-2025.jpg`, `-2.jpeg` | КЕ-25 | Курган | — | 2025 | filename-derived | регион, год, связь 2 фото |
| `kvgm-10-150-krasnogvardeets-2026` | `kvgm-10-150-krasnogvardeets-2026.jpg` | КВГМ-10-150 | Красногвардеец | — | 2026 | filename-derived | регион, год; отдельный объект от 2025? |
| `kvgm-10-150-krasnogvardeets-2025` | `kvgm-10-150-krasnogvardeets-2025.jpg` | КВГМ-10-150 | Красногвардеец | — | 2025 | filename-derived | регион, год; отдельный объект от 2026? |
| `de-6-volgograd-2024` | `de-6-volgograd-2024.jpg`, `-2.jpeg` | ДЕ-6 | Волгоград | — | 2024 | filename-derived | регион, год; **не** «Сакмарская» из примера брифа |
| `ke-25-achinsk-2025` | `ke-25-achinsk-2025.jpg` | КЕ-25 | Ачинск | Красноярский край | 2025 | filename-derived | модель (бриф: КЕ-10?), год |
| `de-10-verhniy-baskunchak-2024` | `de-10-verhniy-baskunchak-2024.jpeg`, `-2.jpeg` | ДЕ-10 | Верхний Баскунчак | — | 2024 | filename-derived | регион, год, связь 2 фото |
| `de-4-14-kirov-2025` | `de-4-14-kirov-2025.jpeg` | ДЕ-4-14 | Киров | — | 2025 | filename-derived | регион (область?), год |
| `dev-4-serov-2024` | `dev-4-serov-2024.jpg` | ДЕВ-4 | Серов | — | 2024 | filename-derived | регион, год |
| `de-25-sennoy-2024` | `de-25-automation-sennoy-2024.jpeg` | ДЕ-25 | Сенной | — | 2024 | filename-derived | регион; уточнить «automation» в имени |
| `kva-rostov-2025` | `kva-1-0-gzh-rostov-2025.jpeg` | КВА-1,0 ГЖ | Ростов-на-Дону | — | 2025 | filename-derived | регион, год |
| `deaerator-tyumen-2024` | `deaerator-automation-tyumen-2024.jpg` | Деаэратор | Тюмень | — | 2024 | filename-derived | регион, год, вид работ |
| `economizer-tyumen-2024` | `economizer-tyumen-2024.jpg` | Экономайзер | Тюмень | — | 2024 | filename-derived | регион, год; тот же объект, что деаэратор? |

---

## 2. Фотографии без места и года (unknown)

Публиковать в хронологии **нельзя**, пока заказчик не укажет объект / город / регион / год.

| ID | Файл | Предполагаемый тип (по описанию в данных) | Место | Год | Что нужно |
|---|---|---|---|---|---|
| `hq-boiler-row-gas` | `hq-boiler-row-gas.jpg` | Котельная / газовая обвязка | unknown | unknown | объект, локация, год |
| `hq-boiler-blue-green` | `hq-boiler-blue-green.jpg` | Котлоагрегат | unknown | unknown | то же |
| `hq-heatex-copper-tubes` | `hq-heatex-copper-tubes.jpg` | Поверхности нагрева | unknown | unknown | то же |
| `hq-welder-boiler` | `hq-welder-boiler.jpg` | Сварочные работы | unknown | unknown | то же |
| `hq-grinder-sparks` | `hq-grinder-sparks.jpg` | Ремонтные работы | unknown | unknown | то же |
| `hq-techs-water-tubes` | `hq-techs-water-tubes.jpg` | Обследование | unknown | unknown | то же |
| `hq-boiler-yellow-pipes` | `hq-boiler-yellow-pipes.jpg` | Газовая обвязка | unknown | unknown | то же |
| `hq-boiler-red-plate` | `hq-boiler-red-plate.jpg` | Котлоагрегат | unknown | unknown | то же |
| `hq-heatex-ladder` | `hq-heatex-ladder.jpg` | Теплообменные поверхности | unknown | unknown | то же |
| `hq-pipes-yellow-network` | `hq-pipes-yellow-network.jpg` | Трубопроводы | unknown | unknown | то же |
| `boiler-room-line` | `boiler-room-line.jpg` | Котельная | unknown | unknown | то же |
| `boiler-room-red-unit` | `boiler-room-red-unit.jpg` | Котельная | unknown | unknown | то же |
| `boiler-room-twin-units` | `boiler-room-twin-units.jpg` | Котельная | unknown | unknown | то же |

---

## 3. Вопросы заказчику (краткий чеклист)

1. Подтвердите или скорректируйте строки таблицы §1 (модель, город, регион, год).  
2. Укажите данные для 13 фото §2 **или** разрешите использовать их только как общие иллюстрации без хронологии.  
3. Совпадает ли ДЕ-16 Бузулук с примером из вашего документа?  
4. ДЕ-6 — это Волгоград (как в файле) или Сакмарская (как в примере)?  
5. Ачинск — КЕ-25 (файл) или КЕ-10 (пример)?  
6. КВГМ Красногвардеец 2025 и 2026 — два разных объекта?  
7. Деаэратор и экономайзер в Тюмени — один объект или два?  
8. Какие объекты можно сразу пометить к публикации на сайте?

После ответа в данных будут проставлены `source: "client-confirmed"` и при необходимости `approvedForPublication: true` — без смены дизайна раздела.
