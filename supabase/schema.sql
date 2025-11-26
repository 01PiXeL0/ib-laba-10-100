-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists vector;

-- Users table
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  age text,
  location text,
  education text,
  created_at timestamptz default now()
);

-- Sessions capture conversational runs
create table if not exists sessions (
  id uuid primary key,
  user_id uuid references users(id) on delete set null,
  user_name text,
  email text,
  age_group text,
  location text,
  education text,
  screening jsonb,
  motivations jsonb,
  feature_snapshot jsonb,
  summary jsonb,
  started_at timestamptz default now()
);

-- Answers store the raw payload of the interaction
create table if not exists answers (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id) on delete cascade,
  question_id text,
  answers_json jsonb,
  created_at timestamptz default now()
);

-- Profiles aggregate embeddings and text summaries for a user
create table if not exists profiles (
  user_id uuid primary key references users(id) on delete cascade,
  emb_vector vector(1536),
  summary_text text,
  traits_json jsonb,
  updated_at timestamptz default now()
);

-- Question catalog
create table if not exists questions (
  id uuid primary key default uuid_generate_v4(),
  text text not null,
  type text,
  tags text[],
  area text,
  created_at timestamptz default now()
);

-- Modern jobs/professions catalog
create table if not exists jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  area text,
  subarea text,
  skills_json jsonb,
  weights_json jsonb,
  description text,
  tags text[],
  created_at timestamptz default now()
);

-- Rule engine blocks
create table if not exists rules (
  id uuid primary key default uuid_generate_v4(),
  condition_json jsonb not null,
  effect_json jsonb not null,
  priority integer default 0,
  created_at timestamptz default now()
);

-- Scores per session and job
create table if not exists scores (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id) on delete cascade,
  job_id uuid references jobs(id) on delete cascade,
  score numeric,
  components_json jsonb,
  created_at timestamptz default now()
);

-- Helpful indexes
create index if not exists sessions_user_idx on sessions(user_id);
create index if not exists answers_session_idx on answers(session_id);
create index if not exists profiles_vector_idx on profiles using ivfflat (emb_vector vector_cosine_ops);
create index if not exists jobs_area_idx on jobs(area);
create index if not exists scores_session_idx on scores(session_id);
create index if not exists scores_job_idx on scores(job_id);

-- Row Level Security policies
alter table sessions enable row level security;
alter table answers enable row level security;
alter table users enable row level security;
alter table profiles enable row level security;
alter table questions enable row level security;
alter table jobs enable row level security;
alter table rules enable row level security;
alter table scores enable row level security;

-- Basic policies: allow service role to do everything, allow anonymous inserts for sessions/answers
create policy "service role full access" on sessions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role full access" on answers
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role full access" on users
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role full access" on profiles
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role full access" on questions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role full access" on jobs
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role full access" on rules
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "service role full access" on scores
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "anon can insert sessions" on sessions
  for insert
  with check (true);

create policy "anon can insert answers" on answers
  for insert
  with check (true);

-- Optional read policies for admin UI (authenticated users)
create policy "authenticated can read catalogs" on questions
  for select
  using (auth.role() = 'authenticated');

create policy "authenticated can read jobs" on jobs
  for select
  using (auth.role() = 'authenticated');

create policy "authenticated can read rules" on rules
  for select
  using (auth.role() = 'authenticated');

create policy "authenticated can read scores" on scores
  for select
  using (auth.role() = 'authenticated');
