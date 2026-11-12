-- JEE Insights Pro: shared data model and user-owned progress.
-- Apply with Supabase CLI: supabase db push
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = timezone('utc', now()); return new; end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  target_exam_date date,
  available_study_minutes integer check (available_study_minutes between 0 and 1440),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, display_name)
  values(new.id, coalesce(new.raw_user_meta_data->>'display_name',''))
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.exam_papers (
  id text primary key,
  year integer not null check (year between 2013 and 2100),
  session text not null,
  exam_date date not null,
  shift text not null,
  paper_type text not null default 'JEE Main Paper 1',
  duration_minutes integer not null check (duration_minutes > 0),
  marking_scheme jsonb not null,
  source_url text not null,
  answer_key_source_url text not null,
  verification_status text not null check (verification_status in ('needs-review','verified','withdrawn')),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id text primary key,
  paper_id text references public.exam_papers(id) on delete restrict,
  year integer not null check (year between 2013 and 2100),
  session text not null,
  exam_date date not null,
  shift text not null,
  subject text not null check (subject in ('Physics','Chemistry','Mathematics')),
  chapter text not null,
  topic text,
  difficulty text check (difficulty in ('Easy','Moderate','Difficult','Unclassified')),
  question_type text not null check (question_type in ('single-correct','multiple-correct','numerical')),
  question_text text not null,
  options jsonb,
  image_url text,
  source_url text not null,
  answer_key_source_url text not null,
  verification_status text not null check (verification_status in ('needs-review','verified','withdrawn')),
  created_at timestamptz not null default now(),
  constraint options_shape check (options is null or jsonb_typeof(options) = 'array')
);
create index if not exists questions_filter_idx on public.questions(year,session,exam_date,shift,subject,chapter);
create index if not exists questions_topic_idx on public.questions using gin (to_tsvector('english', coalesce(question_text,'') || ' ' || coalesce(topic,'') || ' ' || coalesce(chapter,'')));

-- Correct answers and solutions are isolated from the browser-readable question table.
create table if not exists public.question_answer_keys (
  question_id text primary key references public.questions(id) on delete cascade,
  correct_answer jsonb not null,
  explanation text,
  formula text,
  short_solution text,
  answer_key_source_url text not null,
  verified_by text,
  verified_at timestamptz
);

create table if not exists public.question_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  question_id text not null references public.questions(id) on delete cascade,
  mode text not null check (mode in ('practice','exam','review')),
  submitted_answer jsonb,
  is_correct boolean,
  time_spent_seconds integer not null default 0 check (time_spent_seconds >= 0),
  attempted_at timestamptz not null default now()
);
create index if not exists question_attempts_user_time_idx on public.question_attempts(user_id,attempted_at desc);
create index if not exists question_attempts_user_question_idx on public.question_attempts(user_id,question_id);

create table if not exists public.exam_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  paper_id text not null references public.exam_papers(id),
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  submitted_at timestamptz,
  status text not null default 'in-progress' check (status in ('in-progress','submitted','expired')),
  score numeric,
  result_summary jsonb,
  created_at timestamptz not null default now()
);
create table if not exists public.exam_responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.exam_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  question_id text not null references public.questions(id),
  response jsonb,
  marked_for_review boolean not null default false,
  updated_at timestamptz not null default now(),
  unique(session_id,question_id)
);

create table if not exists public.study_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  subject text,
  chapter text,
  task_date date not null,
  duration_minutes integer not null default 30 check (duration_minutes between 1 and 1440),
  task_type text not null default 'study',
  completed_at timestamptz,
  skip_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.study_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  target_value integer not null check (target_value > 0),
  current_value integer not null default 0 check (current_value >= 0),
  unit text not null,
  due_date date,
  created_at timestamptz not null default now()
);
create table if not exists public.question_collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  unique(user_id,name)
);
create table if not exists public.collection_questions (
  collection_id uuid not null references public.question_collections(id) on delete cascade,
  question_id text not null references public.questions(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key(collection_id,question_id)
);
create table if not exists public.question_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  question_id text not null references public.questions(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.exam_papers enable row level security;
alter table public.questions enable row level security;
alter table public.question_answer_keys enable row level security;
alter table public.question_attempts enable row level security;
alter table public.exam_sessions enable row level security;
alter table public.exam_responses enable row level security;
alter table public.study_tasks enable row level security;
alter table public.study_goals enable row level security;
alter table public.question_collections enable row level security;
alter table public.collection_questions enable row level security;
alter table public.question_notes enable row level security;

create policy "profiles select own" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles update own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "published papers readable" on public.exam_papers for select to anon,authenticated using (is_published and verification_status='verified');
create policy "verified questions readable" on public.questions for select to anon,authenticated using (verification_status='verified');
-- No client policies are created for question_answer_keys. Only trusted server/service role can read/write answer keys.
create policy "attempts own select" on public.question_attempts for select to authenticated using (user_id=auth.uid());
create policy "attempts own insert" on public.question_attempts for insert to authenticated with check (user_id=auth.uid() and exists(select 1 from public.questions q where q.id=question_id and q.verification_status='verified'));
create policy "attempts own update" on public.question_attempts for update to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "sessions own select" on public.exam_sessions for select to authenticated using (user_id=auth.uid());
create policy "sessions own insert" on public.exam_sessions for insert to authenticated with check (user_id=auth.uid() and exists(select 1 from public.exam_papers p where p.id=paper_id and p.is_published and p.verification_status='verified'));
-- No client UPDATE policy on exam_sessions: scores/submission state must be server-authoritative.
create policy "responses own all" on public.exam_responses for all to authenticated using (user_id=auth.uid() and exists(select 1 from public.exam_sessions s where s.id=session_id and s.user_id=auth.uid())) with check (user_id=auth.uid() and exists(select 1 from public.exam_sessions s where s.id=session_id and s.user_id=auth.uid()));
create policy "tasks own all" on public.study_tasks for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "goals own all" on public.study_goals for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "collections own all" on public.question_collections for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "collection items owned collection" on public.collection_questions for all to authenticated
using (exists(select 1 from public.question_collections c where c.id=collection_id and c.user_id=auth.uid()))
with check (exists(select 1 from public.question_collections c where c.id=collection_id and c.user_id=auth.uid()));
create policy "notes own all" on public.question_notes for all to authenticated using (user_id=auth.uid()) with check (user_id=auth.uid());

create trigger profiles_updated_at before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger tasks_updated_at before update on public.study_tasks for each row execute procedure public.set_updated_at();
create trigger notes_updated_at before update on public.question_notes for each row execute procedure public.set_updated_at();
create trigger responses_updated_at before update on public.exam_responses for each row execute procedure public.set_updated_at();

-- Practice reveal only: answer keys are not directly selectable from the client.
create or replace function public.reveal_practice_answer(p_question_id text)
returns table(correct_answer jsonb, explanation text, formula text, short_solution text)
language sql security definer set search_path = public as $$
  select k.correct_answer,k.explanation,k.formula,k.short_solution
  from public.question_answer_keys k
  join public.questions q on q.id=k.question_id
  where q.id=p_question_id and q.verification_status='verified'
    and auth.uid() is not null;
$$;
revoke all on function public.reveal_practice_answer(text) from public;
grant execute on function public.reveal_practice_answer(text) to authenticated;

-- Explicit browser grants; RLS remains the row-level security boundary.
grant select on public.questions, public.exam_papers to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.question_attempts to authenticated;
grant select, insert on public.exam_sessions to authenticated;
grant select, insert, update, delete on public.exam_responses, public.study_tasks, public.study_goals, public.question_collections, public.collection_questions, public.question_notes to authenticated;
-- Intentionally do not grant anon/authenticated direct access to question_answer_keys.
