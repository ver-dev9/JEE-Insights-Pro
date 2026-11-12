-- Allow the practice workspace to display extracted PDF records with a clear review label.
-- Answer keys remain protected; CBT continues to query verified records only.
drop policy if exists "verified questions readable" on public.questions;
create policy "reviewable questions readable" on public.questions
for select to anon, authenticated
using (verification_status in ('verified','needs-review'));
grant select on public.questions to anon, authenticated;
