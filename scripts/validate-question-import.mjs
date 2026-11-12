#!/usr/bin/env node
/**
 * Validate question records before adding them to src/data/questions.json.
 * This tool does not scrape protected candidate portals or invent question data.
 * Input must be a reviewed JSON array with official source provenance.
 */
import fs from 'node:fs';
const file=process.argv[2];
if(!file){console.error('Usage: node scripts/validate-question-import.mjs <reviewed-questions.json>');process.exit(2)}
const rows=JSON.parse(fs.readFileSync(file,'utf8'));
if(!Array.isArray(rows))throw new Error('Expected a JSON array');
const ids=new Set();
for(const [i,q] of rows.entries()){
 const required=['id','year','session','date','shift','subject','chapter','type','prompt','answer','sourceUrl','answerKeySourceUrl'];
 for(const key of required)if(q[key]===undefined||q[key]===null||q[key]==='')throw new Error('Row '+(i+1)+' missing '+key);
 if(![2022,2023,2024,2025,2026].includes(q.year))throw new Error('Unsupported year at row '+(i+1));
 if(ids.has(q.id))throw new Error('Duplicate question id: '+q.id);ids.add(q.id);
 if(!/^https:\/\//.test(q.sourceUrl)||!/^https:\/\//.test(q.answerKeySourceUrl))throw new Error('Source URLs must be HTTPS');
 if(!q.verification||!['reviewed','needs-review'].includes(q.verification))throw new Error('Set verification to reviewed or needs-review');
 if(q.type==='mcq'&&(!Array.isArray(q.options)||q.options.length<2))throw new Error('MCQ needs at least two options');
 if(q.type==='numeric'&&typeof q.answer!=='string')throw new Error('Numeric answer must be stored as string');
}
console.log('Validated '+rows.length+' records. Review all answer-key mappings before marking them verified.');
