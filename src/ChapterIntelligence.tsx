import { useMemo, useState } from 'react';
import { Activity, BookOpen, CalendarDays, ChartNoAxesCombined, FileText, ShieldCheck } from 'lucide-react';
import { chapterCatalog, chapterDetails } from './data/chapterCatalog';
import archiveData from './data/archiveChapterStats.json';

type Subject = 'Physics' | 'Chemistry' | 'Mathematics';
type ArchiveRow = [code:string, name:string, file:string, unitId:string|null, total2022to26:number, years:number[]];
type RecordRow = Record<string, any>;
const subjects: Subject[] = ['Physics', 'Chemistry', 'Mathematics'];
const subjectCode: Record<Subject,string> = { Physics:'P', Chemistry:'C', Mathematics:'M' };
const years = archiveData.years as number[];
const archiveRows = archiveData.rows as ArchiveRow[];
const panel: React.CSSProperties = { background:'#101a2b', border:'1px solid #24364f', borderRadius:16, padding:18 };
const muted: React.CSSProperties = { color:'#91a7c2', fontSize:12, lineHeight:1.65 };
const pill: React.CSSProperties = { border:'1px solid #2b405d', background:'#17263c', color:'#c8dcf5', borderRadius:9, padding:'9px 13px', cursor:'pointer', fontSize:12 };
function Metric({label,value,sub}:{label:string;value:string;sub:string}) { return <div style={{...panel,padding:14}}><small style={muted}>{label}</small><b style={{display:'block',fontSize:23,color:'#eef5ff',margin:'7px 0 3px'}}>{value}</b><small style={muted}>{sub}</small></div>; }
export default function ChapterIntelligence({ records }:{ records:RecordRow[] }) {
 const [subject,setSubject]=useState<Subject>('Physics');
 const [chapterId,setChapterId]=useState(chapterCatalog[0].id);
 const [year,setYear]=useState('All years');
 const selected=chapterCatalog.find(c=>c.id===chapterId) || chapterCatalog[0];
 const activeChapter=selected.subject===subject?selected:chapterCatalog.find(c=>c.subject===subject)!;
 const topics=(chapterDetails as Record<string,readonly string[]>)[activeChapter.id] || [];
 const chapterFiles=useMemo(()=>archiveRows.filter(r=>r[0]===subjectCode[subject]&&r[3]===activeChapter.id),[subject,activeChapter]);
 const visibleYearIndex=year==='All years'?-1:years.indexOf(Number(year));
 const fileCount=(r:ArchiveRow)=>visibleYearIndex<0?r[4]:r[5][visibleYearIndex]||0;
 const chapterAppearances=chapterFiles.reduce((n,r)=>n+fileCount(r),0);
 const chapterYearCounts=years.map((y,i)=>({year:y,count:chapterFiles.reduce((n,r)=>n+(r[5][i]||0),0)}));
 const subjectFiles=archiveRows.filter(r=>r[0]===subjectCode[subject]);
 const subjectAppearances=subjectFiles.reduce((n,r)=>n+fileCount(r),0);
 const subjectQuestionRecords=records.filter(r=>r.subject===subject&&(year==='All years'||String(r.year)===year));
 const historical=archiveRows.filter(r=>r[0]===subjectCode[subject]&&!r[3]);
 const currentSyllabusUnits=chapterCatalog.filter(c=>c.subject===subject);
 const topFiles=[...chapterFiles].sort((a,b)=>fileCount(b)-fileCount(a));
 const maxYearCount=Math.max(1,...chapterYearCounts.map(x=>x.count));
 const totalMappedFiles=archiveRows.filter(r=>r[3]).length;
 return <div style={{display:'grid',gap:16,marginTop:18}}>
  <section style={{...panel,display:'flex',justifyContent:'space-between',gap:14,flexWrap:'wrap',alignItems:'center'}}>
   <div><span style={{...muted,color:'#8daaff',letterSpacing:1}}>CHAPTER-WISE INTELLIGENCE · 2022–2026</span><h2 style={{color:'#f1f6ff',fontSize:25,margin:'7px 0'}}>Chapter PYQ Analysis Dashboard</h2><p style={{...muted,margin:0}}>Archive-derived chapter frequency, year trends, subtopic checklist and syllabus mapping.</p></div>
   <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>{subjects.map(s=><button key={s} onClick={()=>{setSubject(s);setChapterId(chapterCatalog.find(c=>c.subject===s)!.id)}} style={{...pill,background:subject===s?'#4037ad':'#17263c',borderColor:subject===s?'#7168ff':'#2b405d',color:'#f3f5ff'}}>{s}</button>)}</div>
  </section>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:9}}>
   <Metric label="PDF chapter files" value="104" sub="37 Physics · 36 Chemistry · 31 Mathematics"/>
   <Metric label="2022–2026 appearances" value={Number(archiveData.archiveAppearances2022_2026).toLocaleString('en-IN')} sub="Across all supplied chapter PDFs"/>
   <Metric label="2020–2026 appearances" value={Number(archiveData.archiveAppearances2020_2026).toLocaleString('en-IN')} sub="Full source archive coverage"/>
   <Metric label="Current syllabus mapping" value={String(totalMappedFiles)+'/104'} sub="8 historical chapter files remain separately tagged"/>
  </div>
  <div style={{display:'grid',gridTemplateColumns:'minmax(250px,0.9fr) minmax(0,2fr)',gap:14}}>
   <aside style={panel}><div style={{display:'flex',alignItems:'center',gap:8,color:'#e8f1ff',fontWeight:700,marginBottom:12}}><BookOpen size={17}/> {subject.toUpperCase()} CHAPTERS <span style={{...muted,marginLeft:'auto'}}>{currentSyllabusUnits.length} units</span></div><div style={{display:'grid',gap:7,maxHeight:560,overflowY:'auto'}}>{currentSyllabusUnits.map(ch=><button key={ch.id} onClick={()=>setChapterId(ch.id)} style={{...pill,textAlign:'left',background:activeChapter.id===ch.id?'#23205a':'#142137',borderColor:activeChapter.id===ch.id?'#756bff':'#293b55',display:'grid',gap:4}}><b>{String(ch.unit).padStart(2,'0')} · {ch.name}</b><small style={muted}>{archiveRows.filter(r=>r[3]===ch.id).length} mapped source file(s)</small></button>)}</div></aside>
   <div style={{display:'grid',gap:14}}>
    <section style={panel}>
     <div style={{display:'flex',justifyContent:'space-between',gap:10,flexWrap:'wrap',alignItems:'start'}}><div><span style={{...muted,color:'#8ea8ff'}}>CHAPTER DEEP DIVE</span><h2 style={{color:'#f1f6ff',fontSize:22,margin:'6px 0'}}>{activeChapter.name}</h2><p style={{...muted,margin:0}}>{activeChapter.focus}</p></div><select value={year} onChange={e=>setYear(e.target.value)} style={pill}><option>All years</option>{years.map(y=><option key={y}>{y}</option>)}</select></div>
     <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))',gap:9,marginTop:16}}><Metric label="PDF question appearances" value={chapterAppearances.toLocaleString('en-IN')} sub={year==='All years'?'2022–2026 archive':'Selected year only'}/><Metric label="Source chapter PDFs" value={String(chapterFiles.length)} sub="Mapped to this syllabus unit"/><Metric label="Syllabus focus topics" value={String(topics.length)} sub="From the current chapter catalogue"/><Metric label="Verified DB questions" value={String(subjectQuestionRecords.filter(r=>r.chapter===activeChapter.name||r.chapter===activeChapter.id).length)} sub="Separately verified Supabase records"/></div>
    </section>
    <section style={panel}>
     <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14,color:'#eaf2ff',fontWeight:700}}><ChartNoAxesCombined size={17}/> YEAR-WISE QUESTION APPEARANCES</div>
     <div style={{display:'grid',gap:11}}>{chapterYearCounts.map(item=><div key={item.year} style={{display:'grid',gridTemplateColumns:'42px 1fr 42px',gap:10,alignItems:'center'}}><b style={{color:'#c8d9f1',fontSize:12}}>{item.year}</b><div style={{height:11,background:'#1a2b43',borderRadius:20,overflow:'hidden'}}><div style={{height:'100%',width:(item.count/maxYearCount*100)+'%',background:'linear-gradient(90deg,#4f7cf4,#47c5ce)',borderRadius:20}}/></div><b style={{color:'#dbe9ff',fontSize:12,textAlign:'right'}}>{year==='All years'?item.count:(Number(year)===item.year?item.count:'—')}</b></div>)}</div>
     <p style={{...muted,marginBottom:0}}>Counts represent appearances in chapter PDFs, not deduplicated unique questions or official NTA weightage.</p>
    </section>
   </div>
  </div>
  <section style={panel}>
   <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,color:'#eaf2ff',fontWeight:700}}><FileText size={17}/> SOURCE PDF CHAPTER BREAKDOWN</div>
   {topFiles.length? <div style={{display:'grid',gap:8}}>{topFiles.map(r=><div key={r[2]} style={{display:'grid',gridTemplateColumns:'minmax(0,1.5fr) 90px 90px',gap:10,alignItems:'center',padding:'10px 12px',background:'#142238',border:'1px solid #263a54',borderRadius:9}}><div><b style={{color:'#e5efff',fontSize:13}}>{r[1]}</b><div style={muted}>{r[2]}</div></div><div style={{textAlign:'right'}}><b style={{color:'#b9d2ff'}}>{fileCount(r)}</b><div style={muted}>{year==='All years'?'2022–26':'Selected year'}</div></div><div style={{textAlign:'right'}}><b style={{color:'#d7e8ff'}}>{r[5].reduce((a,b)=>a+b,0)}</b><div style={muted}>year total</div></div></div>)}</div>:<p style={muted}>No source PDF chapter has been mapped to this syllabus unit yet.</p>}
  </section>
  <section style={panel}>
   <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12,color:'#eaf2ff',fontWeight:700}}><BookOpen size={17}/> SYLLABUS TOPIC CHECKLIST</div>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:8}}>{topics.map((topic,i)=><div key={topic} style={{padding:11,background:'#17263c',border:'1px solid #2a405c',borderRadius:9,color:'#d7e6fa',fontSize:12}}>{String(i+1).padStart(2,'0')} · {topic}</div>)}</div>
  </section>
  {historical.length>0&&<section style={panel}><div style={{display:'flex',alignItems:'center',gap:8,color:'#eaf2ff',fontWeight:700,marginBottom:10}}><CalendarDays size={17}/> HISTORICAL / NOT MAPPED TO CURRENT SYLLABUS</div><p style={muted}>These source files are retained for historical practice but are not silently merged into the current syllabus chapters.</p>{historical.map(r=><div key={r[2]} style={{display:'flex',justifyContent:'space-between',gap:10,padding:'8px 0',borderBottom:'1px solid #26384f'}}><span style={{color:'#dce8f8',fontSize:12}}>{r[1]}</span><b style={{color:'#9db7d6',fontSize:12}}>{fileCount(r)} appearances</b></div>)}</section>}
  <section style={{...panel,display:'flex',gap:9,alignItems:'flex-start'}}><ShieldCheck color="#7e9bff"/><div><b style={{color:'#eaf2ff'}}>Data integrity & source scope</b><p style={{...muted,margin:'4px 0 0'}}>The archive contains 11,593 question appearances across 2020–2026, including 8,366 appearances from 2022–2026. A question may be listed in more than one chapter PDF. These figures are not unique-paper totals, official weightage percentages, or future predictions. {records.length} verified question records are currently available separately in the database.</p></div></section>
 </div>;
}
