# DEVBASICS Career OS

Продакшн-готовый опыт профориентации на Next.js (App Router) с Supabase: скринер, углублённые вопросы, ситуационные кейсы, живые рекомендации и сохранение сессий в PostgreSQL/pgvector. Аутентификация — через Supabase Auth (email+пароль) с модальным окном регистрации/входа.

## Возможности
- Конструктор профиля: области интересов, форматы работы, ценности (слайдеры), навыки, ограничения, свободный ввод.
- Живые рекомендации с гибридным скорингом (веса + правила + эмбеддинги) и пояснениями «почему».
- Диалоговые блоки: скринер, углублённые и ситуационные вопросы, ценности и навыки.
- Хранилище и админ-контура: таблицы Supabase (users/sessions/answers/profiles/jobs/rules/scores/questions) с RLS по умолчанию.
- Модальная регистрация/вход (email+пароль) + серверные API `/api/auth/register` и `/api/auth/login`.

## Быстрый старт
1. **Установите зависимости**
   ```bash
   npm install
   ```

2. **Создайте `.env.local`** (можно скопировать пример):
   ```bash
   cp .env.local.example .env.local
   ```
   Заполните ключами из Supabase → Project Settings → API:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-api-key>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key> # только на сервере
   ```

3. **Примените схему БД**
   - Через Dashboard: SQL Editor → вставьте содержимое `supabase/schema.sql` → Run.
   - Или через CLI/psql (строка подключения в Project Settings → Database → Connection string → Psql):
     ```bash
     psql "postgresql://postgres:<password>@db.<project>.supabase.co:5432/postgres" -f supabase/schema.sql
     ```
   Проверьте, что таблицы `sessions`, `answers`, `profiles`, `jobs`, `rules`, `scores`, `questions`, `users` появились, а на них включён RLS.

4. **Запустите dev-сервер**
   ```bash
   npm run dev
   ```
   Откройте [http://localhost:3000](http://localhost:3000) — хедер, конструктор, рекомендации и модальное окно входа готовы к работе.

## Подробный гайд по подключению
1) **Ключи и переменные**
   - `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` используются в клиенте для REST/RLS-вставок (sessions/answers).
   - `SUPABASE_SERVICE_ROLE_KEY` нужен только API-роутам (server-side) для сервисных вызовов (signup/login, сиды, админ-операции). Никогда не публикуйте его в браузер.

2) **RLS и политика доступа**
   - После применения `schema.sql` включены политики: anon может писать `sessions`/`answers`; service-role — полный доступ; доменные таблицы (`jobs`, `rules`, `questions`, `scores`) открыты на чтение для аутентифицированных пользователей (можно отключить при желании).
   - Если нужна админка, обращайтесь к REST `/rest/v1/*` с service role ключом или через серверные RPC.

3) **Аутентификация (модальное окно)**
   - UI-триггер в хедере и в секции «Доступ и база» открывает модалку.
   - Регистрация/вход отправляют POST на `/api/auth/register` или `/api/auth/login` с `{ email, password, name? }`, роуты проксируют запрос в Supabase Auth.
   - При успехе Supabase создаёт пользователя в `users`; RLS автоматически связывает сессии/ответы с `user_id` (через service role вы можете проставлять связь сами, если нужно).

4) **Сохранение сессии**
   - Кнопка «Сохранить сессию» шлёт POST на `/api/sessions` с `profile`, `screening`, `motivations`, `featureSnapshot`. Эндпоинт пишет строки в `sessions` и `answers` с учётом RLS.
   - Для векторных признаков используйте колонку `profiles.emb_vector` (pgvector установлен), можно добавить Edge Function для эмбеддингов.

5) **Рекомендованная БД**
   - **Supabase** (PostgreSQL + pgvector + Auth) — основной вариант, всё в одном проекте.
   - Альтернатива: **Neon** или **Railway** для внешнего Postgres (с расширением `vector`); Supabase можно оставить только для Auth. Просто поменяйте строки подключения в `.env.local` и примените схему в выбранной БД.

6) **Деплой (Vercel/др.)**
   - Перед деплоем задайте все переменные окружения из `.env.local` в настройках хоста.
   - Убедитесь, что схема уже применена; dev-сервер миграции не выполняет.
   - Production можно запускать с теми же API-роутами, RLS остаётся включённой.

## API для интеграции
- `POST /api/auth/register` — `{ email, password, name? }` → Supabase Auth signup.
- `POST /api/auth/login` — `{ email, password }` → Supabase Auth sign-in (access token/metainfo в ответе Supabase).
- `POST /api/sessions` — сохраняет профиль и ответы в `sessions`/`answers`, payload включает `profile`, `screening`, `motivations`, `featureSnapshot`.

## Линтинг и тесты
- `npm run lint` — проверка кода (ESLint + Next.js).
