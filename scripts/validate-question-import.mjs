#!/usr/bin/env node
/**
 * Strictly validate reviewed JEE Main Paper 1 records before production import.
 * Only verification="verified" records with question and final-key provenance pass.
 */
import fs from 'node:fs';
const file=process.argv[2];
if(!file){console.error('Usage: node scripts/validate-question-import.mjs <reviewed-questions.json>');process.exit(2)}
const rows=JSON.parse(fs.readFileSync(file,'utf8'));
if(!Array.isArray(rows))throw new Error('Expected a JSON array');
const ids=new Set();
const subjects=new Set(['Physics','Chemistry','Mathematics']);
const types=new Set(['mcq','numeric']);
for(const [i,q] of rows.entries()){
 const required=['id','year','session','date','shift','subject','chapter','type','prompt','answer','sourceUrl','answerKeySourceUrl','answerKeyVerifiedBy','answerKeyVerifiedAt'];
 for(const key of required)if(q[key]===undefined||q[key]===null||q[key]==='')throw new Error('Row '+(i+1)+' missing '+key);
 if(![2022,2023,2024,2025,2026].includes(Number(q.year)))throw new Error('Unsupported year at row '+(i+1));
 if(ids.has(q.id))throw new Error('Duplicate question id: '+q.id);ids.add(q.id);
 if(!subjects.has(q.subject))throw new Error('Invalid subject at row '+(i+1));
 if(!types.has(q.type))throw new Error('Invalid question type at row '+(i+1));
 if(!/^https:\/\//.test(q.sourceUrl)||!/^https:\/\//.test(q.answerKeySourceUrl))throw new Error('Source URLs must be HTTPS');
 if(q.verification!=='verified')throw new Error('Row '+(i+1)+' is not verified. Production imports require verification="verified".');
 if(q.type==='mcq'&&(!Array.isArray(q.options)||q.options.length<2))throw new Error('MCQ needs at least two options');
 if(q.type==='numeric'&&typeof q.answer!=='string')throw new Error('Numeric answer must be stored as a string');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(q.date))throw new Error('Date must use YYYY-MM-DD at row '+(i+1));
}
console.log('Validated '+rows.length+' fully reviewed records. Final human QA is still required before publishing.');
