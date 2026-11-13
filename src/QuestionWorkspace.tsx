import { useEffect, useMemo, useState } from 'react';
import { Clock3, Flag, ChevronLeft, ChevronRight, Send, Database } from 'lucide-react';

type Q = {
  id:string; paper_id?:string|null; year:number; session:string; exam_date:string; shift:string;
  subject:string; chapter:string; topic:string; difficulty:string; question_type:string;
  question_text:string; options:any; image_url:string|null; source_answer_value:string|null;
  verification_status:string;
};
type Props = { mode:'practice'|'cbt' };
const subjects=['All subjects','Physics','Chemistry','Mathematics'];
const box:React.CSSProperties={background:'#101a2b',border:'1px solid #263a54',borderRadius:14,padding:18};
const small:React.CSSProperties={color:'#91a7c2',fontSize:12,lineHeight:1.65};
const btn:React.CSSProperties={background:'#192b43',border:'1px solid #344d6b',color:'#d8e8fb',borderRadius:8,padding:'9px 12px',cursor:'pointer'};
function optionsOf(value:any):string[]{if(Array.isArray(value))return value.map(String);if(value&&typeof value==='object')return Object.keys(value).sort().map(k=>String(value[k]));return [];}
function normalise(raw:any,index:number):Q {
  const id=String(raw.id??raw.question_id??'question-'+index);
  const image=raw.image_url??raw.imageUrl??raw.image_path??null;
  return {
    id, paper_id:raw.paper_id??raw.paperId??null, year:Number(raw.year)||0,
    session:String(raw.session??''), exam_date:String(raw.exam_date??raw.date??''),
    shift:String(raw.shift??''), subject:String(raw.subject??'Unclassified'),
    chapter:String(raw.chapter??''), topic:String(raw.topic??''), difficulty:String(raw.difficulty??''),
    question_type:String(raw.question_type??raw.type??'mcq').toLowerCase().includes('num')?'numerical':'mcq',
    question_text:String(raw.question_text??raw.prompt??raw.question??''),
    options:raw.options??[], image_url:image?String(image):null,
    source_answer_value:raw.source_answer_value??raw.answer??raw.answer_key??null,
    verification_status:String(raw.verification_status??raw.verification??'needs-review').toLowerCase()==='verified'?'verified':'needs-review'
  };
}
function imageFor(q:Q){return q.image_url||(q.id?import.meta.env.BASE_URL+'question-pages/'+encodeURIComponent(q.id)+'.webp':null);}
function answerMatches(selected:string,raw:string):boolean {const key=String(raw||'').trim().toUpperCase();if(/^[A-D]$/.test(key))return selected===String(key.charCodeAt(0)-65)||selected===key;return selected.trim().toUpperCase()===key;}
export default function QuestionWorkspace({mode}:Props){
 const [rows,setRows]=useState<Q[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const [subject,setSubject]=useState('All subjects'),[year,setYear]=useState('All years'),[chapter,setChapter]=useState('All chapters');
 const [index,setIndex]=useState(0),[answers,setAnswers]=useState<Record<string,string>>({}),[marked,setMarked]=useState<string[]>([]);
 const [submitted,setSubmitted]=useState(false),[seconds,setSeconds]=useState(10800),[started,setStarted]=useState(false),[showResult,setShowResult]=useState(false);
 useEffect(()=>{let active=true;(async()=>{try{
   const response=await fetch(import.meta.env.BASE_URL+'data/prepwiser-repair-manifest.json',{cache:'no-cache'});
   if(!response.ok)throw new Error('The question-bank manifest is not in the deployed repository yet.');
   const payload=await response.json();const records=Array.isArray(payload)?payload:(payload.records??payload.questions??payload.items??[]);
   if(!Array.isArray(records))throw new Error('Question-bank manifest has an unsupported structure.');
   const parsed=records.map(normalise).filter((q:Q)=>q.question_text||q.image_url);
   if(active)setRows(parsed);
 }catch(e:any){if(active)setError(e?.message||'Unable to load the local question bank.');}finally{if(active)setLoading(false);}})();return()=>{active=false};},[]);
 useEffect(()=>{if(mode!=='cbt'||submitted||!started)return;const timer=window.setInterval(()=>setSeconds(s=>{if(s<=1){window.clearInterval(timer);setSubmitted(true);setShowResult(true);return 0;}return s-1}),1000);return()=>window.clearInterval(timer)},[mode,submitted,started]);
 const chapters=useMemo(()=>[...new Set(rows.filter(q=>(subject==='All subjects'||q.subject===subject)&&q.chapter).map(q=>q.chapter))].sort((a,b)=>a.localeCompare(b)),[rows,subject]);
 const filtered=useMemo(()=>rows.filter(q=>(mode==='practice'||q.verification_status==='verified')&&(subject==='All subjects'||q.subject===subject)&&(year==='All years'||String(q.year)===year)&&(chapter==='All chapters'||q.chapter===chapter)),[rows,mode,subject,year,chapter]);
 const q=filtered[index];const setAnswer=(id:string,value:string)=>setAnswers(a=>({...a,[id]:value}));
 const correct=filtered.filter(x=>x.source_answer_value!==null&&answers[x.id]!==undefined&&answerMatches(answers[x.id],String(x.source_answer_value))).length;
 const fmt=(s:number)=>`${String(Math.floor(s/3600)).padStart(2,'0')}:${String(Math.floor(s%3600/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
 if(loading)return <div style={box}>Loading local JEE question bank…</div>;
 return <div style={{display:'grid',gap:14}}>
  <section style={box}><div style={{display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap',alignItems:'center'}}><div><span style={{...small,color:'#8baaff'}}>{mode==='cbt'?'VERIFIED CBT MODE':'SUBJECT-WISE & CHAPTER-WISE PRACTICE'}</span><h2 style={{color:'#f0f6ff',margin:'6px 0'}}>{mode==='cbt'?'JEE Main CBT':'JEE Main question practice'}</h2><p style={{...small,margin:0}}>{rows.length.toLocaleString()} local records · {rows.filter(r=>r.verification_status==='verified').length.toLocaleString()} verified · {rows.filter(r=>r.verification_status!=='verified').length.toLocaleString()} requiring review</p></div>{mode==='cbt'&&<div style={{...btn,display:'flex',gap:8,alignItems:'center'}}><Clock3 size={16}/><b>{fmt(seconds)}</b></div>}</div>
   <div style={{display:'flex',gap:8,flexWrap:'wrap',marginTop:14}}><select style={btn} value={subject} onChange={e=>{setSubject(e.target.value);setChapter('All chapters');setIndex(0);setSubmitted(false)}}>{subjects.map(s=><option key={s}>{s}</option>)}</select><select style={btn} value={year} onChange={e=>{setYear(e.target.value);setIndex(0);setSubmitted(false)}}><option>All years</option>{[...new Set(rows.map(x=>String(x.year)).filter(x=>x!=='0'))].sort().reverse().map(y=><option key={y}>{y}</option>)}</select><select style={btn} value={chapter} onChange={e=>{setChapter(e.target.value);setIndex(0);setSubmitted(false)}}><option>All chapters</option>{chapters.map(c=><option key={c}>{c}</option>)}</select></div>
   <p style={{...small,margin:'10px 0 0'}}>Showing {filtered.length.toLocaleString()} records for the selected filters.</p>
  </section>
  {error&&<div style={{...box,color:'#ffcf9d'}}>{error} <p style={small}>Expected file: <code>public/data/prepwiser-repair-manifest.json</code>. Images are served from <code>public/question-pages/</code>.</p></div>}
  {filtered.length===0?<div style={{...box,textAlign:'center',padding:34}}><Database size={28} color='#7faeff'/><h3 style={{color:'#e7f0ff'}}>No questions are available yet</h3><p style={small}>The practice interface now reads the question bank directly from repository files. Add the manifest and its question images to the public folder to populate this page. Unverified source answers are always labelled as unverified.</p></div>:<div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 250px',gap:14}}>
   <section style={box}><div style={{display:'flex',justifyContent:'space-between',gap:8,...small}}><span>{q.subject} · {q.chapter||'Chapter unclassified'} · {q.topic||'Topic unclassified'}</span><span>{index+1} / {filtered.length}</span></div><p style={{...small,marginTop:10}}>{q.year} · {q.session} · {q.exam_date} · {q.shift} · {q.difficulty||'Difficulty unclassified'} · {q.verification_status==='verified'?'VERIFIED':'EXTRACTED · NEEDS REVIEW'}</p>
    {imageFor(q)&&<div style={{margin:'14px 0',background:'#fff',borderRadius:10,padding:8}}><img src={imageFor(q)!} alt={'Original question source '+q.id} loading='lazy' style={{display:'block',width:'100%',height:'auto',maxHeight:620,objectFit:'contain'}}/><p style={{fontSize:11,color:'#53657b',margin:'6px 0 0'}}>Original source image · use this to inspect notation, diagrams and options</p></div>}
    {q.question_text&&<h3 style={{color:'#edf4ff',fontSize:18,lineHeight:1.6,whiteSpace:'pre-wrap'}}>{q.question_text}</h3>}
    {q.question_type==='numerical'?<input disabled={submitted} value={answers[q.id]||''} onChange={e=>setAnswer(q.id,e.target.value)} placeholder='Enter numerical answer' style={{...btn,width:'100%',textAlign:'left'}}/>:<div style={{display:'grid',gap:8}}>{(optionsOf(q.options).length?optionsOf(q.options):['Option text unavailable — inspect source image','Option text unavailable — inspect source image','Option text unavailable — inspect source image','Option text unavailable — inspect source image']).map((o,i)=><button key={i} disabled={submitted} onClick={()=>setAnswer(q.id,String(i))} style={{...btn,textAlign:'left',background:answers[q.id]===String(i)?'#29245e':'#17263b',borderColor:answers[q.id]===String(i)?'#7b70ff':'#344d6b'}}>{String.fromCharCode(65+i)}. {o}</button>)}</div>}
    {mode==='practice'&&q.verification_status!=='verified'&&<div style={{...box,marginTop:14}}><b style={{color:'#eacb83'}}>Source extracted · Needs review</b><p style={small}>The imported source answer is provisional and has not been independently verified against the official final answer key.</p></div>}
    {submitted&&q.source_answer_value!==null&&<div style={{...box,marginTop:14}}><b style={{color:'#a9c4ff'}}>{q.verification_status==='verified'?'Verified answer':'Imported source answer (unverified)'}: {q.source_answer_value}</b><p style={{...small,color:answerMatches(answers[q.id]||'',String(q.source_answer_value))?'#9de0c1':'#ffcf9d'}}>{answerMatches(answers[q.id]||'',String(q.source_answer_value))?'Your answer matches the stored key.':'Your answer does not match the stored key.'}</p></div>}
    <div style={{display:'flex',justifyContent:'space-between',gap:8,flexWrap:'wrap',marginTop:18}}><button style={btn} onClick={()=>setMarked(m=>m.includes(q.id)?m.filter(x=>x!==q.id):[...m,q.id])}><Flag size={14}/> {marked.includes(q.id)?'Marked':'Mark for review'}</button><div style={{display:'flex',gap:8}}><button style={btn} disabled={index===0} onClick={()=>setIndex(i=>i-1)}><ChevronLeft size={14}/> Previous</button>{index<filtered.length-1&&<button style={btn} onClick={()=>{setIndex(i=>i+1);setSubmitted(false)}}>Next <ChevronRight size={14}/></button>}{mode==='practice'&&!submitted&&<button style={btn} onClick={()=>setSubmitted(true)}>Check answer</button>}</div></div>
    {mode==='cbt'&&!started&&!submitted&&<button style={{...btn,marginTop:12,background:'#4437c8'}} onClick={()=>setStarted(true)}>Start timed CBT</button>}{mode==='cbt'&&started&&!submitted&&<button style={{...btn,marginTop:12,background:'#4437c8'}} onClick={()=>{setSubmitted(true);setShowResult(true)}}><Send size={14}/> Submit examination</button>}{mode==='practice'&&submitted&&<button style={{...btn,marginTop:12}} onClick={()=>{setSubmitted(false);setIndex(i=>(i+1)%filtered.length)}}>Next practice question</button>}
   </section><aside style={{...box,maxHeight:560,overflowY:'auto'}}><b style={{color:'#eaf2ff'}}>Question palette</b><div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:6,marginTop:12}}>{filtered.map((item,i)=><button key={item.id} onClick={()=>{setIndex(i);setSubmitted(false)}} style={{...btn,padding:7,background:i===index?'#4037ad':answers[item.id]?'#15543e':marked.includes(item.id)?'#6a4b16':'#192b43'}}>{i+1}</button>)}</div><p style={small}>Answered: {Object.keys(answers).filter(k=>filtered.some(x=>x.id===k)).length} · Marked: {marked.length}</p>{showResult&&<div style={{borderTop:'1px solid #30435d',paddingTop:12}}><b style={{color:'#a9c4ff'}}>Result</b><p style={small}>Correct answers: {correct} / {filtered.length} · Attempted: {Object.keys(answers).filter(k=>filtered.some(x=>x.id===k)).length}</p><p style={small}>Scores use the locally stored answer keys; unverified records must not be treated as official results.</p></div>}</aside></div>}
 </div>;
}
