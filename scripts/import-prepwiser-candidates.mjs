#!/usr/bin/env node
/**
 * Import extracted PDF candidates as needs-review rows.
 * Local-only: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.
 * This does not publish questions or unlock CBT.
 */
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';
if (process.loadEnvFile && fs.existsSync('.env.local')) process.loadEnvFile('.env.local');
const input=process.argv[2] || 'data/prepwiser-question-candidates.json';
if(!fs.existsSync(input)) throw new Error('Candidate JSON not found: '+input);
const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!key) throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in local .env.local. Never use a VITE_ service key.');
const rows=JSON.parse(fs.readFileSync(input,'utf8'));
if(!Array.isArray(rows)) throw new Error('Expected a JSON array');
const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
const batch=100;
let imported=0;
for(let i=0;i<rows.length;i+=batch){
 const slice=rows.slice(i,i+batch);
 const questions=slice.map(q=>({
  id:q.id,paper_id:null,year:Number(q.year),session:q.session,exam_date:q.date,shift:q.shift,
  subject:q.subject,chapter:q.chapter,topic:q.topic,difficulty:null,
  question_type:q.type==='numeric'?'numerical':'single-correct',
  question_text:q.prompt||'[Text extraction needs review]',options:q.options,
  source_url:q.sourceUrl,answer_key_source_url:q.answerKeySourceUrl,
  verification_status:'needs-review'
 }));
 const {error}=await db.from('questions').upsert(questions,{onConflict:'id'});
 if(error) throw error;
 const keys=slice.filter(q=>q.answer!==null&&q.answer!==undefined).map(q=>({
  question_id:q.id,correct_answer:q.type==='numeric'?String(q.answer):String(q.answer),
  explanation:null,formula:null,short_solution:null,
  answer_key_source_url:q.answerKeySourceUrl,verified_by:null,verified_at:null
 }));
 if(keys.length){const {error:keyError}=await db.from('question_answer_keys').upsert(keys,{onConflict:'question_id'});if(keyError)throw keyError;}
 imported+=slice.length;
 console.log('Imported '+imported+' / '+rows.length+' as needs-review');
}
console.log('Done. Nothing was marked verified or published. Review extracted text/options and answer keys before changing status.');
