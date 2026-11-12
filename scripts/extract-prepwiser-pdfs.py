#!/usr/bin/env python3
"""Extract question candidates from the user's PrepWiser chapter-PDF archive.
Requires: pip install pymupdf
Output is deliberately marked needs-review; OCR/layout loss is possible.
"""
import argparse, datetime, hashlib, json, re, zipfile
from pathlib import Path
import fitz

def clean(s):
    s=s.replace("\u00a0"," ").replace("\u200b","")
    return re.sub(r"[ \t]+"," ",s).strip()

def date_iso(raw):
    try:
        return datetime.datetime.strptime(raw.strip(), "%d %b").replace(year=2020).strftime("%m-%d")
    except Exception:
        return ""

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("archive", help="PrepWiser ZIP file")
    ap.add_argument("-o","--output",default="data/prepwiser-question-candidates.json")
    args=ap.parse_args()
    z=zipfile.ZipFile(args.archive)
    rows=[]
    for filename in sorted(n for n in z.namelist() if n.lower().endswith(".pdf")):
        subject_dir=filename.split("/",1)[0].lower()
        subject={"physics":"Physics","chemistry":"Chemistry","mathematics":"Mathematics","maths":"Mathematics"}.get(subject_dir)
        if not subject: continue
        chapter=Path(filename).stem.replace("PrepWiser_","").replace("_JEE-Main-PYQs","").replace("_"," ").replace("-"," ").strip()
        doc=fitz.open(stream=z.read(filename),filetype="pdf")
        pages=[p.get_text("text") for p in doc]
        full="\n".join(pages)
        starts=list(re.finditer(r"(?m)^Q(\d+)\s*$",full))
        answer_pos=full.find("Answer key:")
        q_end=answer_pos if answer_pos>=0 else len(full)
        q_starts=[m for m in starts if m.start()<q_end]
        # Page offsets preserve an auditable PDF page pointer.
        offsets=[]; cursor=0
        for t in pages:
            offsets.append(cursor); cursor+=len(t)+1
        answer_map={}
        if answer_pos>=0:
            tail=full[answer_pos:]
            for m in re.finditer(r"(?m)^\s*(\d+)\.\s*\n\s*([A-D]|[-+]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*$",tail):
                answer_map[int(m.group(1))]=m.group(2).strip()
        for idx,m in enumerate(q_starts):
            end=q_starts[idx+1].start() if idx+1<len(q_starts) else q_end
            block=full[m.end():end].strip()
            qnum=int(m.group(1))
            meta=re.search(r"JEE Main\s+(20\d{2})\s*[·•]\s*(\d{1,2}\s+[A-Za-z]{3})\s*[·•]\s*(Shift\s*\d+)",block,re.I)
            if not meta: continue
            year=int(meta.group(1)); shift=re.sub(r"\s+"," ",meta.group(3)).title()
            try:
                dt=datetime.datetime.strptime(meta.group(2)+" "+str(year),"%d %b %Y").date().isoformat()
            except Exception:
                dt=None
            urlm=re.search(r"prepwiser\.in/questions/([A-Za-z0-9_-]+)",block)
            source_url=("https://prepwiser.in/questions/"+urlm.group(1)) if urlm else "https://prepwiser.in/learn/"
            # Remove metadata and the solution-link line, retain the extracted stem/options.
            body=re.sub(r"JEE Main\s+20\d{2}\s*[·•]\s*\d{1,2}\s+[A-Za-z]{3}\s*[·•]\s*Shift\s*\d+","",block,flags=re.I)
            body=re.sub(r"Step-by-step solution\s*›?\s*prepwiser\.in/questions/[A-Za-z0-9_-]+","",body,flags=re.I)
            body=re.sub(r"PrepWiser\s*·.*?(?=\n|$)","",body)
            body=clean(body)
            # Keep option strings separately when PDF text exposes them cleanly.
            opts=[]
            matches=list(re.finditer(r"\(([A-D])\)\s*(.*?)(?=\([A-D]\)|$)",body,re.S))
            if len(matches)>=2:
                opts=[clean(x.group(2)) for x in matches]
            numeric=bool(re.search(r"\bNUMERICAL\b",block,re.I))
            body=re.sub(r"\bNUMERICAL\b","",body,flags=re.I).strip()
            page_no=1
            absolute=m.start()
            for pi,off in enumerate(offsets):
                if off<=absolute: page_no=pi+1
                else: break
            key=answer_map.get(qnum)
            rid="pw-"+hashlib.sha1((filename+"|"+str(qnum)+"|"+str(year)+"|"+str(dt)+"|"+shift).encode()).hexdigest()[:20]
            rows.append({
                "id":rid,"year":year,"session":"JEE Main","date":dt,"shift":shift,
                "subject":subject,"chapter":chapter,"topic":None,
                "type":"numeric" if numeric else "mcq","prompt":body,
                "options":opts if len(opts)>=2 and not numeric else None,
                "answer":key,"sourceUrl":source_url,"answerKeySourceUrl":"https://prepwiser.in/learn/",
                "verification":"needs-review","answerKeyVerifiedBy":None,"answerKeyVerifiedAt":None,
                "difficulty":None,"paperId":None,"paperComplete":False,
                "sourcePdf":filename,"sourcePage":page_no,"sourceQuestionNumber":qnum,
                "extractionFlags":["needs-human-review","possible-formula-or-diagram-loss"] + (["missing-answer-key-entry"] if key is None else []) + (["incomplete-options"] if not numeric and len(opts)<2 else [])
            })
    Path(args.output).parent.mkdir(parents=True,exist_ok=True)
    Path(args.output).write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"Extracted {len(rows)} question candidates from {len([n for n in z.namelist() if n.lower().endswith('.pdf')])} PDFs.")
    print("All records are needs-review; no paper is marked complete or published.")
if __name__=="__main__": main()
