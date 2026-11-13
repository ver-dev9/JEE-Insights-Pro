#!/usr/bin/env node
/**
 * Upload page-faithful PrepWiser question images and source metadata.
 *
 * Requires .env.local with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Input: data/prepwiser-repair-manifest.json and public/question-pages/*.webp
 * This script does not delete questions or mark any answer verified.
 */
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

function loadEnv(file = '.env.local') {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
}
loadEnv();
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
const manifestPath = process.argv[2] || 'data/prepwiser-repair-manifest.json';
const assetDir = process.argv[3] || 'public/question-pages';
const bucket = process.env.PYQ_ASSET_BUCKET || 'question-assets';
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const rows = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const workers = Number(process.env.PYQ_UPLOAD_CONCURRENCY || 4);
let cursor = 0, uploaded = 0, failed = [];
async function worker() {
  while (true) {
    const i = cursor++;
    if (i >= rows.length) return;
    const row = rows[i];
    const filename = row.id + '.webp';
    const localPath = path.join(assetDir, filename);
    try {
      if (!fs.existsSync(localPath)) throw new Error('Missing asset: ' + localPath);
      const bytes = fs.readFileSync(localPath);
      const { error } = await supabase.storage.from(bucket).upload(filename, bytes, {
        contentType: 'image/webp', upsert: true, cacheControl: '31536000'
      });
      if (error) throw error;
      uploaded++;
      if (uploaded % 250 === 0) console.log('Uploaded assets:', uploaded, '/', rows.length);
    } catch (e) { failed.push({ id: row.id, error: String(e.message || e) }); }
  }
}
const { data: buckets, error: listError } = await supabase.storage.listBuckets();
if (listError) throw listError;
if (!buckets.some(b => b.name === bucket)) {
  const { error } = await supabase.storage.createBucket(bucket, {
    public: true, fileSizeLimit: '5MB', allowedMimeTypes: ['image/webp']
  });
  if (error) throw error;
}
await Promise.all(Array.from({ length: workers }, worker));
if (failed.length) {
  fs.writeFileSync('data/prepwiser-upload-failures.json', JSON.stringify(failed, null, 2));
  throw new Error(`Asset upload incomplete: ${uploaded}/${rows.length}; see data/prepwiser-upload-failures.json`);
}
const updates = rows.map(r => ({
  id: r.id,
  source_pdf: r.source_pdf || r.sourcePdf,
  source_page: r.source_page || r.sourcePage,
  source_question_number: r.source_qnum || r.sourceQuestionNumber,
  source_answer_value: r.answer ?? null,
  answer_provenance: r.answerProvenance || (r.answer != null ? 'PrepWiser PDF answer-key section' : null),
  quality_flags: r.qualityFlags || r.extractionFlags || [],
  image_url: `${url.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${r.id}.webp`
}));
for (let start = 0; start < updates.length; start += 100) {
  const batch = updates.slice(start, start + 100);
  const { error } = await supabase.from('questions').upsert(batch, { onConflict: 'id' });
  if (error) throw new Error(`Question metadata batch ${start} failed: ${error.message}`);
  if ((start + batch.length) % 1000 === 0) console.log('Updated metadata:', start + batch.length, '/', updates.length);
}
console.log(JSON.stringify({
  uploaded_assets: uploaded,
  metadata_rows_updated: updates.length,
  bucket,
  answer_status: 'All existing verification_status values are preserved; none marked verified.'
}, null, 2));
