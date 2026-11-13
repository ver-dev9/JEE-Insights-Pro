-- Source provenance and review metadata for imported PYQ records.
-- Additive only: does not change question visibility or verification status.
alter table public.questions
  add column if not exists source_pdf text,
  add column if not exists source_page integer,
  add column if not exists source_question_number integer,
  add column if not exists source_answer_value text,
  add column if not exists answer_provenance text,
  add column if not exists quality_flags jsonb not null default '[]'::jsonb;

create index if not exists questions_source_location_idx
  on public.questions (source_pdf, source_page, source_question_number);
