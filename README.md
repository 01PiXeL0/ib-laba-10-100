# DEVBASICS Career OS

Готовый продукт на Next.js (App Router) с Prisma и PostgreSQL: модальный вход, отдельная страница теста и отдельный чат с ИИ. Все данные уходят в базу через Prisma Client.

## Возможности
- Разделение по этапам: / (лендинг с CTA) → /assessment (тест) → /chat (диалог).
- Модальное окно входа/регистрации (email + пароль), хэш через scrypt без внешних пакетов.
- API-роуты для аутентификации, сохранения оценок и чатов (`/api/auth/register`, `/api/auth/login`, `/api/assessments`, `/api/chat`).
- Prisma-схема с таблицами User, Assessment, ChatSession; Postgres рекомендуем как основную БД.

## Быстрый старт
1. **Установите зависимости**
   ```bash
   npm install
   ```

2. **Создайте `.env.local`** (пример):
   ```bash
   cp .env.local.example .env.local
   # DATABASE_URL="postgresql://user:password@localhost:5432/devbasics?schema=public"
   ```
   Подходит любой PostgreSQL (Neon, Railway, Render, локальный). Для SQLite поменяйте провайдер в `prisma/schema.prisma`.

3. **Примените Prisma-схему**
   ```bash
   npx prisma db push
   # или
   npx prisma migrate dev --name init
   ```
   Таблицы: `User`, `Assessment`, `ChatSession`.

4. **Запустите dev-сервер**
   ```bash
   npm run dev
   ```
   Страницы: `/` (лендинг и CTA), `/assessment` (тест), `/chat` (чат). Кнопка «Войти/Регистрация» открывает модалку на любой странице.

## API
- `POST /api/auth/register` — `{ email, password, name? }` → создаёт пользователя, пароль хэшируется scrypt.
- `POST /api/auth/login` — `{ email, password }` → проверка пароля, возврат профиля.
- `POST /api/assessments` — `{ screening, motivations, featureSnapshot, userId? }` → запись в Assessment.
- `POST /api/chat` — `{ transcript: [{role, content}], assessmentId?, userId?, summary? }` → запись в ChatSession.

## Примечания по базе
- По умолчанию используется PostgreSQL. Если нужен SQLite для локальных тестов, смените `provider` и строку подключения в `prisma/schema.prisma`.
- Для продакшена рекомендуем управляемый Postgres (Neon/Railway/Render). Prisma Client работает на Vercel/Netlify без доп. настроек.

## Линтинг и тесты
- `npm run lint` — проверка кода.
