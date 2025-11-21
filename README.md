# Career Guidance Experience

A Next.js (App Router) experience for interactive career selection. Users проходят скринер, отвечают на углублённые и ситуационные вопросы, видят живые рекомендации и сохраняют сессию в Supabase вместе со snapshot признаков.

## Что внутри

- Клиентский конструктор: профиль, области интересов, форматы работы, ценности (слайдеры) и свободный ввод.
- Живой блок рекомендаций с объяснениями и навыками; гибридный скоринг (правила + веса + эмбеддинги).
- Секция диалога: готовые вопросы для скринера, углубления и ситуаций.
- Блок админки: таблицы Supabase, RLS по умолчанию, REST-доступ к каталогам профессий/правил.

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.local.example` to `.env.local` and fill in your Supabase project keys (Project Settings → API in Supabase):

```bash
cp .env.local.example .env.local
```

Then edit `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# Only used on the server (API routes); do NOT expose elsewhere
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. Apply the Supabase schema (one-time):

   - Open the Supabase Dashboard → SQL editor → paste `supabase/schema.sql` → **Run**. If you prefer CLI, run `psql "<supabase-connection-string>" -f supabase/schema.sql`.
   - Verify tables (Sessions/Answers/Profiles/Jobs/Rules/Scores/Questions/Users) appeared in Database → Tables.

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to explore the builder and chat-style flows.

## Supabase setup (detailed)

1) **Create `.env.local` in the repo root** (e.g., `cp .env.local.example .env.local`) using keys from Supabase → Project Settings → API. Keep the service role key server-only:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-api-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

2) **Apply the schema** (if not already):

- Dashboard → SQL → paste `supabase/schema.sql` → Run.
- Or from a terminal: `psql "postgresql://postgres:<password>@db.<project>.supabase.co:5432/postgres" -f supabase/schema.sql` (use the connection string from Project Settings → Database → Connection string → Psql).

3) **Check RLS**: after applying the SQL, RLS is enabled on all tables; anon can insert into `sessions`/`answers`, service role can do everything. If you want authenticated reads for admin UI, use the provided policies on `questions/jobs/rules/scores`.

4) **Optional helpers**:

- Create an Edge Function or RPC that updates `profiles.emb_vector` when you capture free-text answers (embedding size is 1536, cosine index already exists).
- Seed catalogs via SQL inserts into `questions`, `jobs`, `rules` to match your domain.

## API

`POST /api/sessions` accepts a session payload (profile, screening, motivations, featureSnapshot) and persists rows into `sessions` and `answers`. The handler uses the Supabase REST API with your `NEXT_PUBLIC_SUPABASE_URL` and keys; set `SUPABASE_SERVICE_ROLE_KEY` if you want to bypass RLS via the service role.

## Deployment

The app is production-ready on any Next.js host (Vercel, etc.). Ensure env vars are configured and the Supabase schema is applied before deploying.
