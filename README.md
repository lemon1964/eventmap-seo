# EventMap

EventMap - курсовой проект для `Next.js III: SEO, i18n 2026`.

Приложение для поиска событий с локализованными маршрутами, server-rendered search, страницами деталей событий, metadata, sitemap, robots, Supabase Auth, облачным избранным, unit tests, smoke tests и CI.

## Стек

- Next.js App Router
- TypeScript
- next-intl
- Ticketmaster API
- Supabase Auth/RLS
- Vitest
- Playwright
- Vercel

## Локальная установка

Установите зависимости:

```bash
npm ci
```

Создайте локальный env-файл на основе примера:

```bash
cp .env.example .env.local
```

Не коммитьте `.env.local`.

## Env variables

Проект использует переменные:

```text
NEXT_PUBLIC_SITE_URL
SITE_ENV
TICKETMASTER_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Для локальной разработки ориентируйтесь на `.env.example`.

Для production на Vercel добавьте эти же имена переменных в настройках проекта Vercel. В `NEXT_PUBLIC_SITE_URL` укажите production domain.

## Разработка

Запустите dev server:

```bash
npm run dev
```

Откройте:

```text
http://localhost:3000/en
```

## Тесты

Запуск unit tests:

```bash
npm run test:unit
```

Запуск Playwright smoke tests:

```bash
npm run test:e2e
```

Общий запуск unit и smoke tests:

```bash
npm run test
```

Локальная проверка CI-последовательности:

```bash
npm run test:ci
```

## Production build

Перед деплоем выполните production build:

```bash
npm run build
```

## Тестовые маршруты

```text
/en
/ru
/en/search
/en/search/music
/en/events/london-music-night
/en/favorites
/en/login
/en/demo
/en/demo/final-architecture
/sitemap.xml
/robots.txt
```

## Деплой

Целевой деплой - Vercel.

Используйте импорт GitHub-репозитория в Vercel Dashboard. Framework Preset должен быть `Next.js`. Если проект лежит в корне репозитория, `Root Directory` оставьте пустым. `Output Directory` оставьте пустым, чтобы Vercel использовал стандартный Next.js output.

Production env variables задаются в Vercel Dashboard, а не в GitHub и не в `.env.local`.

После деплоя обновите настройки Supabase Auth:

```text
Site URL:
https://<your-vercel-domain>

Redirect URLs:
https://<your-vercel-domain>/auth/callback
http://localhost:3000/auth/callback
```

Google Client ID и Google Client Secret хранятся в Supabase Dashboard, а не в Next.js проекте.
