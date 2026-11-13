#!/usr/bin/env node
/**
 * Repairs EXISTING PrepWiser question rows in place.
 * Never inserts, upserts, deletes, or changes verification_status.
 * Requires .env.local: SUPABASE_URL (or VITE_SUPABASE_URL), SUPABASE_SERVICE_ROLE_KEY.
 * Run: node scripts/upload-prepwiser-repair-assets.mjs data/prepwiser-repair-manifest.json public/question-pages
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
const concurrency = Math.max(1, Number(process.env.PYQ_UPLOAD_CONCURRENCY || 4));
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const rows = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const { data: buckets, error: listError } = await supabase.storage.listBuckets();
if (listError) throw listError;
if (!buckets.some(b => b.name === bucket)) {
  const { error } = await supabase.storage.createBucket(bucket, {
    public: true, fileSizeLimit: '5MB', allowedMimeTypes: ['image/webp']
  });
  if (error) throw error;
}
let cursor = 0, repaired = 0;
const failures = [];
function cleanText(value) {
  return String(value ?? '').replace(/\r\n?/g, '\n').replace(/[\u00a0\u2007\u202f]/g, ' ')
    .split('\n').map(line => line.replace(/[ \t]+$/g, '')).join('\n').trim();
}
async function worker() {
  while (true) {
    const i = cursor++;
    if (i >= rows.length) return;
    const row = rows[i];
    const localPath = path.join(assetDir, row.id + '.webp');
    try {
      if (!fs.existsSync(localPath)) throw new Error('Missing image ' + localPath);
      const bytes = fs.readFileSync(localPath);
      const { error: uploadError } = await supabase.storage.from(bucket).upload(row.id + '.webp', bytes, {
        contentType: 'image/webp', upsert: true, cacheControl: '31536000'
      });
      if (uploadError) throw uploadError;
      const options = Array.isArray(row.options) && row.options.length > 0 && row.options.every(x => String(x ?? '').trim())
        ? row.options.map(cleanText) : null;
      const patch = {
        question_text: cleanText(row.question_text),
        options,
        image_url: url.replace(/\/$/, '') + '/storage/v1/object/public/' + bucket + '/' + row.id + '.webp',
        source_pdf: row.source_pdf || null,
        source_page: row.source_page ?? null,
        source_question_number: row.source_qnum ?? null,
        source_answer_value: row.answer == null ? null : String(row.answer).trim(),
        answer_provenance: row.answerProvenance || (row.answer != null ? 'PrepWiser PDF answer-key section (unverified)' : null),
        quality_flags: row.qualityFlags || [],
      };
      // UPDATE existing ID only. No upsert/insert and do not touch verification_status.
      const { data, error } = await supabase.from('questions').update(patch).eq('id', row.id).select('id');
      if (error) throw error;
      if (!data || data.length !== 1) throw new Error('Existing question ID not found; row was not inserted: ' + row.id);
      repaired++;
      if (repaired % 100 === 0) console.log('Repaired existing rows:', repaired, '/', rows.length);
    } catch (e) {
      failures.push({ id: row.id, error: String(e?.message || e) });
    }
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
if (failures.length) {
  fs.writeFileSync('data/prepwiser-repair-failures.json', JSON.stringify(failures, null, 2));
  throw new Error('Repair incomplete: ' + repaired + '/' + rows.length + '. See data/prepwiser-repair-failures.json');
}
console.log(JSON.stringify({
  existing_rows_repaired: repaired,
  images_uploaded: repaired,
  bucket,
  inserted: 0,
  deleted: 0,
  verification_status: 'Preserved exactly as found; source answer keys remain unverified.'
}, null, 2));
