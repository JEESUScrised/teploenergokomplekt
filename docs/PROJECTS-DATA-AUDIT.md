# Аудит портфолио объектов

Дата аудита: 2026-10-25  
Ветка: `feat/tekomp-client-revisions-2026-10`  
Источник изображений: `public/assets/projects/`  
Источник данных: `src/data/projects.ts`

## Сводка

| Показатель | Значение |
|---|---|
| Файлов изображений в `public/assets/projects/` | 31 |
| Объектов в каталоге данных (после объединения серий) | 26 |
| Опубликовано в хронологии (`approvedForPublication`) | **0** |
| Ожидают подтверждения заказчиком | 26 |
| Дубликаты файлов (MD5) | не обнаружены |
| Отдельный маршрут `/portfolio` | нет (секция на главной + маркизы на About / Service) |

Примеры из брифа заказчика (ДЕ-16 Бузулук 2026, ДЕ-6 Сакмарская 2026, КЕ-10 Ачинск 2026, Е-2,5 Белореченская 2025) **не** добавлены в публикацию: это образцы оформления. Совпадение файла `de-16-buzuluk-2026*.jpg` с примером само по себе не считается подтверждением.

Год и город из имени файла сохранены как provisional (`source: "filename"`) и **не** выводятся в хронологии до `approvedForPublication: true`.

## Таблица изображений

| Изображение | Объект | Год | Местоположение | Подтверждение | Статус |
|---|---|---|---|---|---|
| hq-boiler-row-gas.jpg | hq-boiler-row-gas | — | — | unknown | ожидает уточнения |
| hq-boiler-blue-green.jpg | hq-boiler-blue-green | — | — | unknown | ожидает уточнения |
| hq-heatex-copper-tubes.jpg | hq-heatex-copper-tubes | — | — | unknown | ожидает уточнения |
| hq-welder-boiler.jpg | hq-welder-boiler | — | — | unknown | ожидает уточнения |
| hq-grinder-sparks.jpg | hq-grinder-sparks | — | — | unknown | ожидает уточнения |
| hq-techs-water-tubes.jpg | hq-techs-water-tubes | — | — | unknown | ожидает уточнения |
| hq-boiler-yellow-pipes.jpg | hq-boiler-yellow-pipes | — | — | unknown | ожидает уточнения |
| hq-boiler-red-plate.jpg | hq-boiler-red-plate | — | — | unknown | ожидает уточнения |
| hq-heatex-ladder.jpg | hq-heatex-ladder | — | — | unknown | ожидает уточнения |
| hq-pipes-yellow-network.jpg | hq-pipes-yellow-network | — | — | unknown | ожидает уточнения |
| boiler-room-line.jpg | boiler-room-line | — | — | unknown | ожидает уточнения |
| boiler-room-red-unit.jpg | boiler-room-red-unit | — | — | unknown | ожидает уточнения |
| boiler-room-twin-units.jpg | boiler-room-twin-units | — | — | unknown | ожидает уточнения |
| de-16-buzuluk-2026.jpg | de-16-buzuluk-2026 | 2026* | Бузулук, Оренбургская обл.* | filename | ожидает уточнения |
| de-16-buzuluk-2026-2.jpg | de-16-buzuluk-2026 | 2026* | Бузулук* | filename | ожидает уточнения |
| de-16-buzuluk-2026-3.jpg | de-16-buzuluk-2026 | 2026* | Бузулук* | filename | ожидает уточнения |
| ke-25-kurgan-2025.jpg | ke-25-kurgan-2025 | 2025* | Курган* | filename | ожидает уточнения |
| ke-25-kurgan-2025-2.jpeg | ke-25-kurgan-2025 | 2025* | Курган* | filename | ожидает уточнения |
| kvgm-10-150-krasnogvardeets-2026.jpg | kvgm-10-150-krasnogvardeets-2026 | 2026* | Красногвардеец* | filename | ожидает уточнения |
| kvgm-10-150-krasnogvardeets-2025.jpg | kvgm-10-150-krasnogvardeets-2025 | 2025* | Красногвардеец* | filename | ожидает уточнения |
| de-6-volgograd-2024.jpg | de-6-volgograd-2024 | 2024* | Волгоград* | filename | ожидает уточнения |
| de-6-volgograd-2024-2.jpeg | de-6-volgograd-2024 | 2024* | Волгоград* | filename | ожидает уточнения |
| ke-25-achinsk-2025.jpg | ke-25-achinsk-2025 | 2025* | Ачинск, Красноярский край* | filename | ожидает уточнения |
| de-10-verhniy-baskunchak-2024.jpeg | de-10-verhniy-baskunchak-2024 | 2024* | Верхний Баскунчак* | filename | ожидает уточнения |
| de-10-verhniy-baskunchak-2024-2.jpeg | de-10-verhniy-baskunchak-2024 | 2024* | Верхний Баскунчак* | filename | ожидает уточнения |
| de-4-14-kirov-2025.jpeg | de-4-14-kirov-2025 | 2025* | Киров* | filename | ожидает уточнения |
| dev-4-serov-2024.jpg | dev-4-serov-2024 | 2024* | Серов* | filename | ожидает уточнения |
| de-25-automation-sennoy-2024.jpeg | de-25-sennoy-2024 | 2024* | Сенной* | filename | ожидает уточнения |
| kva-1-0-gzh-rostov-2025.jpeg | kva-rostov-2025 | 2025* | Ростов-на-Дону* | filename | ожидает уточнения |
| deaerator-automation-tyumen-2024.jpg | deaerator-tyumen-2024 | 2024* | Тюмень* | filename | ожидает уточнения |
| economizer-tyumen-2024.jpg | economizer-tyumen-2024 | 2024* | Тюмень* | filename | ожидает уточнения |

\* Значение восстановлено из имени файла, не из подтверждённого акта/письма заказчика.

## Где выводится галерея

| Место | Компонент | Поведение |
|---|---|---|
| Главная `/` | `ProjectsSection` | Хронология по годам **или** empty state |
| О компании `/about` | `ProjectGallery` (marquee) | Слайды без утверждения года в подписи |
| Страницы услуг | `ProjectGallery` через `projectsForTags` | То же |
| Отдельный URL портфолио | — | отсутствует |

## Запрос к заказчику

1. Финальный список объектов: модель, город, регион, год завершения работ.  
2. Соответствие каждого файла из `public/assets/projects/` конкретному объекту (включая `hq-*` и `boiler-room-*`).  
3. Регионы для записей, где указан только город (Курган, Волгоград, Киров, Серов, Сенной, Красногвардеец, Верхний Баскунчак, Ростов-на-Дону, Тюмень).  
4. Подтверждение или корректировка: ДЕ-16 Бузулук — 2026 vs пример брифа; КЕ-25 Ачинск vs пример «КЕ-10 Ачинск»; ДЕ-6 Волгоград vs пример «ДЕ-6 Сакмарская».  
5. Нужны ли отдельные карточки для КВГМ Красногвардеец 2025 и 2026.  
6. Разрешение на публикацию после сверки (`approvedForPublication`).

## Как опубликовать после ответа

1. Проставить `source: "client-confirmed"`.  
2. Уточнить `city` / `region` / `year` / `equipmentModel`.  
3. `approvedForPublication: true`.  
4. Пересобрать сайт — `getProjectsGroupedByYear()` включит объекты в хронологию.
