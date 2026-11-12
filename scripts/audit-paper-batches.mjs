#!/usr/bin/env node
/**
 * Paper-level QA gate for reviewed JEE Main imports.
 * This does not create or infer questions. It checks the supplied, human-reviewed dataset.
 */
import fs from 'node:fs';

const file = process.argv[2];
if (!file) {
  console.error('Usage: node scripts/audit-paper-batches.mjs <reviewed-questions.json>');
  process.exit(2);
}
const rows = JSON.parse(fs.readFileSync(file, 'utf8'));
if (!Array.isArray(rows) || rows.length === 0) throw new Error('Expected a non-empty question array.');

const groups = new Map();
for (const q of rows) {
  if (!q.paperId) throw new Error(`Question ${q.id || '(unknown)'} has no paperId.`);
  const list = groups.get(q.paperId) || [];
  list.push(q);
  groups.set(q.paperId, list);
}

let allPassed = true;
for (const [paperId, paperRows] of groups) {
  const first = paperRows[0];
  const expected = Number(first.expectedQuestionCount);
  const completeFlags = paperRows.every(q => q.paperComplete === true);
  const expectedConsistent = paperRows.every(q => Number(q.expectedQuestionCount) === expected);
  const ids = new Set(paperRows.map(q => q.id));
  const unique = ids.size === paperRows.length;
  const subjectCounts = Object.fromEntries(['Physics', 'Chemistry', 'Mathematics'].map(s => [s, paperRows.filter(q => q.subject === s).length]));
  const subjectExpected = first.expectedSubjectCounts || null;
  const subjectMatch = subjectExpected
    ? ['Physics', 'Chemistry', 'Mathematics'].every(s => Number(subjectExpected[s]) === subjectCounts[s])
    : false;
  const keySources = paperRows.every(q => /^https:\/\//.test(q.answerKeySourceUrl || ''));
  const questionSources = paperRows.every(q => /^https:\/\//.test(q.sourceUrl || ''));
  const verified = paperRows.every(q => q.verification === 'verified' && q.answerKeyVerifiedBy && q.answerKeyVerifiedAt);
  const passed = Number.isInteger(expected) && expected > 0 && paperRows.length === expected &&
    completeFlags && expectedConsistent && unique && subjectMatch && keySources && questionSources && verified;
  if (!passed) allPassed = false;
  console.log(`${passed ? 'PASS' : 'HOLD'} ${paperId}: ${paperRows.length}/${expected || '?'} questions · Physics ${subjectCounts.Physics}, Chemistry ${subjectCounts.Chemistry}, Mathematics ${subjectCounts.Mathematics}`);
  if (!subjectExpected) console.log('  Missing expectedSubjectCounts (declare expected counts for this exam format).');
  if (!completeFlags) console.log('  paperComplete must be true on every row only after the complete shift is checked.');
  if (!verified) console.log('  Every row needs verification=verified and answer-key reviewer metadata.');
}
if (!allPassed) {
  console.error('One or more paper batches are on HOLD. Do not mark them complete or publish them.');
  process.exit(1);
}
console.log(`All ${groups.size} paper batch(es) passed structural QA. Human subject review and source-rights checks are still required.`);
