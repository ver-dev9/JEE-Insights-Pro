#!/usr/bin/env node
/**
 * Import reviewed question records into Supabase using a LOCAL service-role key.
 * This script must only run on a trusted machine. Never use the service-role key in VITE_ variables.
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';
if (process.loadEnvFile && fs.existsSync('.env.local')) process.loadEnvFile('.env.local');
const input=process.argv[2];
if(!input){console.error('Usage: node scripts/import-verified-questions.mjs <verified-questions.json>');process.exit(2)}
execFileSync(process.execPath,['scripts/validate-question-import.mjs',input],{stdio:'inherit'});
const url=process.env.SUPABASE_URL;
const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
if(!url||!serviceKey)throw new Error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in an untracked .env.local file.');
const rows=JSON.parse(fs.readFileSync(input,'utf8'));
const db=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
const papers=new Map();
for(const q of rows){
 if(!q.paperId)continue;
 const meta={id:q.paperId,year:Number(q.year),session:q.session,exam_date:q.date,shift:q.shift,duration_minutes:Number(q.paperDurationMinutes),marking_scheme:q.paperMarkingScheme,source_url:q.paperSourceUrl,answer_key_source_url:q.answerKeySourceUrl,verification_status:'verified',is_published:false};
 if(!meta.duration_minutes||!meta.marking_scheme||!meta.source_url)throw new Error('Paper '+q.paperId+' needs paperDurationMinutes, paperMarkingScheme and paperSourceUrl.');
 const previous=papers.get(q.paperId);
 if(previous&&JSON.stringify(previous)!==JSON.stringify(meta))throw new Error('Conflicting paper metadata for '+q.paperId);
 papers.set(q.paperId,meta);
}
for(const [paperId,paper] of papers){
 const paperRows=rows.filter(q=>q.paperId===paperId);
 if(paperRows.some(q=>q.paperComplete===true)){
  const expected=Number(paperRows[0].expectedQuestionCount);
  if(!expected||expected!==paperRows.length||paperRows.some(q=>q.paperComplete!==true||Number(q.expectedQuestionCount)!==expected))throw new Error('Paper '+paperId+' completeness flag/count does not match imported records.');
 }
 const {error}=await db.from('exam_papers').upsert(paper,{onConflict:'id'});
 if(error)throw error;
}
for(const q of rows){
 const question={id:q.id,paper_id:q.paperId||null,year:Number(q.year),session:q.session,exam_date:q.date,shift:q.shift,subject:q.subject,chapter:q.chapter,topic:q.topic||null,difficulty:q.difficulty||'Unclassified',question_type:q.type==='numeric'?'numerical':'single-correct',question_text:q.prompt,options:q.type==='mcq'?q.options:null,image_url:q.imageUrl||null,source_url:q.sourceUrl,answer_key_source_url:q.answerKeySourceUrl,verification_status:'verified'};
 const {error:questionError}=await db.from('questions').upsert(question,{onConflict:'id'});
 if(questionError)throw questionError;
 const answerKey={question_id:q.id,correct_answer:q.answer,explanation:q.solution||null,formula:q.formula||null,short_solution:q.shortSolution||null,answer_key_source_url:q.answerKeySourceUrl,verified_by:q.answerKeyVerifiedBy,verified_at:q.answerKeyVerifiedAt};
 const {error:keyError}=await db.from('question_answer_keys').upsert(answerKey,{onConflict:'question_id'});
 if(keyError)throw keyError;
}
console.log('Imported '+rows.length+' reviewed question records. Paper records remain unpublished until paper-level QA is completed.');
