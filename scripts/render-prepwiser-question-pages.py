#!/usr/bin/env python3
"""Render page-faithful question crops from PrepWiser PDFs.
Run after extract-prepwiser-pdfs.py. Images are visual evidence, not answer verification.
"""
import argparse, collections, json, re, zipfile
from pathlib import Path
import fitz
from PIL import Image

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("archive")
    ap.add_argument("candidates")
    ap.add_argument("--output-dir",default="public/question-pages")
    ap.add_argument("--manifest",default="data/prepwiser-repair-manifest.json")
    ap.add_argument("--public-base-url",default="/question-pages")
    ap.add_argument("--scale",type=float,default=1.15)
    a=ap.parse_args()
    rows=json.loads(Path(a.candidates).read_text(encoding="utf-8"))
    grouped=collections.defaultdict(list)
    for r in rows: grouped[(r["sourcePdf"],int(r["sourcePage"]))].append(r)
    out=Path(a.output_dir); out.mkdir(parents=True,exist_ok=True)
    manifest=[]; audit=collections.Counter()
    with zipfile.ZipFile(a.archive) as z:
        for pdf in sorted({r["sourcePdf"] for r in rows}):
            doc=fitz.open(stream=z.read(pdf),filetype="pdf")
            for pn in sorted(p for name,p in grouped if name==pdf):
                page=doc[pn-1]; headers=[]
                for block in page.get_text("dict")["blocks"]:
                    for line in block.get("lines",[]):
                        txt="".join(s["text"] for s in line["spans"]).strip()
                        m=re.search(r"\bQ\s*(\d+)\s+JEE\s+Main\b",txt,re.I)
                        if m: headers.append((int(m.group(1)),min(s["bbox"][1] for s in line["spans"])))
                headers.sort(key=lambda x:x[1])
                pix=page.get_pixmap(matrix=fitz.Matrix(a.scale,a.scale),alpha=False)
                page_img=Image.frombytes("RGB",(pix.width,pix.height),pix.samples)
                for r in grouped[(pdf,pn)]:
                    qn=int(r["sourceQuestionNumber"]); ys=[y for q,y in headers if q==qn]; flags=[]
                    if not ys:
                        crop=page_img.copy(); method="full-page-fallback"
                        flags.append("visual-question-header-not-found"); audit[flags[-1]]+=1
                    else:
                        y0=max(0,ys[0]-5); later=[y for _,y in headers if y>ys[0]+2]
                        y1=min(later)-5 if later else page.rect.height-20
                        crop=page_img.crop((int(22*a.scale),int(y0*a.scale),int((page.rect.width-22)*a.scale),max(int((y0+40)*a.scale),int(y1*a.scale))))
                        method="question-header-to-next-question"
                    prompt=r.get("prompt") or ""; opts=r.get("options") or []
                    if r.get("answer") is None: flags.append("missing-source-answer")
                    if r.get("type")!="numeric" and len(opts)!=4: flags.append("option-count-not-four")
                    if any(not str(o).strip() for o in opts): flags.append("blank-option-text")
                    if re.search(r"\n\s*(?:\n|$)",prompt): flags.append("possible-math-or-layout-loss")
                    if re.search(r"\b(figure|diagram|shown in|shown below|reaction)\b",prompt,re.I): flags.append("visual-content-check")
                    if len(prompt.strip())<15: flags.append("empty-or-short-extracted-text")
                    audit.update(flags)
                    filename=r["id"]+".webp"; crop.save(out/filename,"WEBP",quality=80,method=3)
                    r["pageImagePath"]=f'{a.public_base_url.rstrip("/")}/{filename}'
                    r["cropMethod"]=method; r["qualityFlags"]=sorted(set(flags))
                    r["verification"]="needs-review"
                    r["answerProvenance"]="PrepWiser PDF answer-key section" if r.get("answer") is not None else None
                    manifest.append(r)
            doc.close()
    mp=Path(a.manifest); mp.parent.mkdir(parents=True,exist_ok=True)
    mp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
    print(json.dumps({"candidate_count":len(rows),"rendered_question_assets":len(manifest),
      "source_answer_count":sum(r.get("answer") is not None for r in rows),
      "missing_source_answer_count":sum(r.get("answer") is None for r in rows),
      "quality_flag_counts_nonexclusive":dict(audit),"verified_count":0},indent=2))
    print(f"Manifest: {mp.resolve()}"); print(f"Images: {out.resolve()}")

if __name__=="__main__": main()
