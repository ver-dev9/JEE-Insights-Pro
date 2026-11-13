-- Batch-update source provenance for existing question rows only.
-- Execute permission is restricted to service_role; no verification state is changed.
create or replace function public.apply_question_source_metadata(p_rows jsonb)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  affected integer;
begin
  update public.questions q
  set source_pdf = x.source_pdf,
      source_page = x.source_page,
      source_question_number = x.source_question_number,
      source_answer_value = x.source_answer_value,
      answer_provenance = x.answer_provenance,
      quality_flags = coalesce(x.quality_flags, '[]'::jsonb),
      image_url = x.image_url
  from jsonb_to_recordset(p_rows) as x(
    id text,
    source_pdf text,
    source_page integer,
    source_question_number integer,
    source_answer_value text,
    answer_provenance text,
    quality_flags jsonb,
    image_url text
  )
  where q.id = x.id;
  get diagnostics affected = row_count;
  return affected;
end;
$$;

revoke all on function public.apply_question_source_metadata(jsonb) from public, anon, authenticated;
grant execute on function public.apply_question_source_metadata(jsonb) to service_role;
