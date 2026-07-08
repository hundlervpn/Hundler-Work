# AGENTS.md — Hundler Work

Контекст проекта для ИИ-агентов и разработчиков. Держи этот файл в актуальном состоянии при изменениях в стеке/деплое.

## Что это

**Hundler Work** — биржа заказов по типу hh.ru: площадка, соединяющая **заказчиков** и **исполнителей** (поиск заданий, отклики, свои заказы, чаты, профиль). Отдельный продукт от Hundler VPN, но в той же GitHub-организации `hundlervpn`.

Работает как **Telegram Mini App**: авторизация через Telegram `initData` (проверка HMAC на сервере по токену бота), имя и фото берутся из профиля Telegram и не подделываются.

- Репозиторий: `https://github.com/hundlervpn/Hundler-Work` (**публичный** — клонируется без токена)
- Прод: `https://hundlerwork.duckdns.org`
- Локально: `http://localhost:3000`

## Стек

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **PostgreSQL** (драйвер `pg`)
- Сборка в Docker: Next.js `output: "standalone"` + **Caddy** (reverse proxy, HTTPS через Let's Encrypt по DuckDNS DNS-01)
- Дизайн: принципы `make-interfaces-feel-better`. Палитра: **чёрный · белый · красный · фиолетовый** (красный — доминирующий акцент, фиолетовый — второстепенный). Есть светлая/тёмная тема (по умолчанию тёмная, хранится в cookie `hw-theme`).

## Структура репозитория

```
app/
  layout.tsx            корневой layout (чтение темы из cookie до отрисовки)
  page.tsx              рендерит <AppShell/>
  globals.css           глобальные стили + семантические токены темы
  api/auth/route.ts     POST /api/auth — валидация Telegram initData, upsert пользователя в БД
components/
  AppShell.tsx          каркас: состояние вкладок/темы/роли, Splash, Sidebar, BottomNav
  Sidebar.tsx           боковое меню (десктоп)
  BottomNav.tsx         нижняя навигация (мобайл)
  DesktopTabs.tsx       сегментированные табы на десктопе
  Splash.tsx            стартовая заставка/анимация логотипа
  SearchBar.tsx, CategorySelect.tsx
  OrderCard.tsx         карточка заказа (кликабельна -> детальная)
  OrderDetail.tsx       детальный экран заказа ("Откликнуться")
  OrderIcon.tsx, Price.tsx, StatusBadge.tsx
  EmptyState.tsx        плейсхолдер для пустых списков
  ChatView.tsx          полноэкранный чат (пузыри + поле ввода)
  UserProvider.tsx      контекст пользователя (грузит /api/auth, хранит user)
  icons.tsx             все SVG-иконки
  tabs/
    FindWork.tsx        «Найти работу» — лента заказов + открытие детальной
    MyResponses.tsx     «Мои отклики»
    MyOrders.tsx        «Мои заказы»
    Chats.tsx           «Чаты» — список -> ChatView
    Profile.tsx         «Профиль» — аккаунт, баланс, роль, под-экраны «Настройки» и «Реферальная система»
lib/
  data.ts               типы + (сейчас пустые) списки заказов/откликов/чатов/сообщений, PROFILE
  db.ts                 пул подключений к Postgres + ensureSchema() (идемпотентные миграции)
  nav.ts                TabKey, ThemeMode, Role, список табов
  cookies.ts            чтение/запись cookie
  plural.ts             русские склонения (день/дня/дней и т.п.)
db/
  schema.sql            DDL, применяется ТОЛЬКО при первой инициализации пустого тома БД
Dockerfile              multi-stage сборка Next.js (standalone)
caddy.Dockerfile        образ Caddy с плагином DuckDNS
Caddyfile               конфиг reverse proxy + TLS
docker-compose.yml      сервисы db / app / caddy
.env.example            шаблон переменных окружения
DEPLOY.md               инструкция по деплою
```

> Служебные скрипты в корне (`push_repo.py`, `check_repo.py`, `discover.py`, `fetch_skill.py`, `verify.py`, `read_log*.py`) — вспомогательные для процесса разработки через PromptQL и к рантайму приложения отношения не имеют.

## База данных (PostgreSQL)

Работает как docker-compose сервис `db` (образ `postgres:16-alpine`), доступен только внутри Docker-сети (наружу порт не проброшен). БД: `hundlerwork`, пользователь: `hundler`.

Таблицы:
- `users` — `telegram_id` (PK), `first_name`, `last_name`, `username`, `photo_url`, `freelancer_id` (UUID, идентификатор исполнителя), `client_id` (UUID, идентификатор заказчика), **`balance` (NUMERIC, по умолчанию 0)**, `created_at`, `updated_at`.
- `orders` — заказы, размещённые пользователем как заказчик (`owner_id -> users.telegram_id`).
- `responses` — отклики, отправленные пользователем как исполнитель (`freelancer_id -> users.telegram_id`, `order_id -> orders.id`).

**Важно про миграции:** `db/schema.sql` монтируется в `/docker-entrypoint-initdb.d` и выполняется Postgres **только при первой** инициализации пустого тома `db_data`. Для уже существующего тома он НЕ перезапускается. Поэтому приложение при старте дополнительно применяет ту же DDL идемпотентно через `ensureSchema()` в `lib/db.ts` (`CREATE TABLE IF NOT EXISTS`, `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`) — новые колонки/таблицы появляются и на старом томе. При добавлении новых колонок/таблиц обновляй И `db/schema.sql`, И `ensureSchema()`.

## Переменные окружения (`.env`)

Скопировать из `.env.example` и заполнить:
- `DUCKDNS_TOKEN` — токен DuckDNS (для выпуска HTTPS-сертификата)
- `POSTGRES_PASSWORD` — пароль Postgres (используется и `db`, и `app`)
- `TELEGRAM_BOT_TOKEN` — токен бота от @BotFather (нужен для авторизации Telegram Mini App)

## Инфраструктура / где лежат контейнеры

- **Сервер:** `38.244.142.43` (Ubuntu, Docker + docker compose). Полностью выделен под Hundler Work (старая VPN-нода Hundler VPN здесь снесена).
- **Каталог проекта на сервере:** `/opt/hundler-work` (клон репозитория; здесь лежат `docker-compose.yml`, `.env` и весь код).
- **Контейнеры (docker compose):**
  - `hundler-work-db` — PostgreSQL 16 (том `db_data`)
  - `hundler-work-app` — Next.js standalone, слушает `:3000` внутри сети (наружу не проброшен)
  - `hundler-work-caddy` — Caddy, порты **80** и **443** наружу; проксирует на `app:3000`, выпускает/обновляет TLS-сертификат через DuckDNS DNS-01
- **Тома:** `db_data` (данные Postgres), `caddy_data`, `caddy_config` (сертификаты/конфиг Caddy).
- **Домен:** `hundlerwork.duckdns.org` (DuckDNS). ⚠️ «current ip» в DuckDNS должен указывать на `38.244.142.43`.

## Команды

### Обновление контейнера на сервере (после изменений в репо)

```bash
cd /opt/hundler-work
git pull
docker compose up -d --build
docker compose ps            # проверить, что все три контейнера Up: db, app, caddy
```

При проблемах — смотреть логи:
```bash
docker compose logs -f app     # логи приложения
docker compose logs -f caddy   # логи Caddy (в т.ч. выпуск сертификата)
docker compose logs -f db      # логи Postgres
```

### Первый деплой на чистый сервер

Полная пошаговая инструкция — в `DEPLOY.md`. Кратко:
```bash
sudo mkdir -p /opt/hundler-work
sudo chown "$USER" /opt/hundler-work
git clone https://github.com/hundlervpn/Hundler-Work.git /opt/hundler-work
cd /opt/hundler-work
cp .env.example .env && nano .env    # заполнить DUCKDNS_TOKEN, POSTGRES_PASSWORD, TELEGRAM_BOT_TOKEN
docker compose up -d --build
```

### Остановка

```bash
cd /opt/hundler-work
docker compose down              # остановить (тома сохраняются)
# docker compose down -v         # ОСТОРОЖНО: удалит и тома вместе с данными БД
```

### Доступ к базе данных (на сервере)

```bash
docker compose exec db psql -U hundler -d hundlerwork
```

### Локальная разработка

```bash
npm install
npm run dev        # http://localhost:3000  (без Docker; БД/Telegram-функции работают только в проде/в контейнере)
npm run build && npm run start   # прод-сборка локально
```

## Полезные заметки для агента

- Пуш кода в GitHub из PromptQL делается скриптом `push_repo.py` (использует `run_http(integration="__github")`, Git Data API — blobs/tree/commit/ref). При добавлении новых файлов их нужно вносить в список `FILES` (или `LOGO_ASSETS` для бинарников) в `push_repo.py`.
- Владелец/оператор — mihailzareckij10, работает по-русски, техфон слабый: инструкции для сервера давать по шагам.
- После пуша в репозиторий изменения на проде появляются только после `git pull` + `docker compose up -d --build` на сервере (авто-деплоя пока нет).