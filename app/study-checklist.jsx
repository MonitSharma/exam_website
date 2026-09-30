// Cumulative reading/revision tracker built from every dated Sunday Sweep.
const STUDY_LIST_KEY = "pariksha_study_checklist_v1";
const STUDY_ORDER = ["Current Affairs","Polity","Economy","Modern History","Ancient & Medieval History","Art & Culture","Geography","Environment","Science & Technology","International Relations","Society","Ethics","Physics","CSAT","Answer Writing","Tests & Review","Other"];
const studyText = (v) => String(v || "").replace(/<br\s*\/?>/gi," ").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").replace(/[*_`#>]/g,"").replace(/\s+/g," ").trim();

function studySubjectFor(cell, header) {
  const t = `${studyText(header)} ${studyText(cell)}`.toLowerCase();
  if (/physics|mechanics|electromagnet|\bem\b|waves|optics|thermo|quantum|solid state|electronics/.test(t)) return "Physics";
  if (/polity|constitution|laxmikanth|governance/.test(t)) return "Polity";
  if (/economy|economic|vivek singh|mrunal|survey|budget|agriculture/.test(t)) return "Economy";
  if (/modern history|spectrum|freedom struggle|national movement/.test(t)) return "Modern History";
  if (/ancient|medieval|sultanate|mughal|tn state board|tn board/.test(t)) return "Ancient & Medieval History";
  if (/art\s*&\s*culture|art and culture|singhania|ccrt|temple|painting|dance|literature/.test(t)) return "Art & Culture";
  if (/geography|g\.c\. leong|khullar|map drill/.test(t)) return "Geography";
  if (/sci[ -]?tech|science\s*(?:&|and)\s*technology|defence tech|space technology|nuclear technology/.test(t)) return "Science & Technology";
  if (/environment|ecology|shankar|biodiversity|climate/.test(t)) return "Environment";
  if (/\bir\b|international relations|foreign policy|bilateral|multilateral|russia|eurasia/.test(t)) return "International Relations";
  if (/society|social issues/.test(t)) return "Society";
  if (/ethics|gs\s*-?\s*4|gs4|integrity|aptitude/.test(t)) return "Ethics";
  if (/csat|reasoning|reading comprehension|\brc\b/.test(t)) return "CSAT";
  if (/\brbi\b|\besi\b|finance and management|\bfm\b/.test(t)) return "RBI";
  if (/mock|sectional|quiz|revision|revise|sweep|review|diagnostic|pyq/.test(t)) return "Tests & Review";
  if (/answer|mains|gs\s*-?\s*[123]/.test(t) || /block\s*-?\s*4/.test(t)) return "Answer Writing";
  if (/current affairs|\bca\b|\bpib\b/.test(t)) return "Current Affairs";
  return "Other";
}

function buildStudyChecklistEntries(sweep, plan) {
  if (!plan?.days) return [];
  const start = new Date(`${getSundayWeekStartIso(sweep.date)}T00:00:00Z`);
  return plan.days.flatMap((day, di) => {
    const coreIndex = Math.max(0, (plan.headers || []).findIndex(h=>/block\s*-?\s*2|\bcore\b/i.test(studyText(h))));
    const outputIndex = (plan.headers || []).findIndex(h=>/output/i.test(studyText(h)));
    const coreSubject = studySubjectFor(day.cells[coreIndex], plan.headers?.[coreIndex]);
    return day.cells.map((cell, ci) => {
    const text = studyText(cell); if (!text || text === "—" || text === "-" || /^newspaper(?:\s|$)/i.test(text)) return null;
    const wd = WEEKDAYS.findIndex((d) => d.toLowerCase() === String(day.weekday).toLowerCase());
    const date = new Date(start); date.setUTCDate(start.getUTCDate() + (wd < 0 ? di : wd));
    const header = studyText(plan.headers?.[ci] || `Task ${ci + 1}`);
    const subject = ci === outputIndex && coreSubject !== "Other" ? coreSubject : studySubjectFor(text,header);
    if (subject === "RBI") return null;
    return { id:`${sweep.id}::${day.weekday || di}::${ci}`, isoDate:date.toISOString().slice(0,10), header, text, subject, noteId:sweep.id };
  }).filter(Boolean)});
}

function studyMediumSummary(text) {
  const clean=studyText(text);
  if (clean.length<=330) return clean;
  const first=clean.slice(0,330), stop=Math.max(first.lastIndexOf("."),first.lastIndexOf(";"),first.lastIndexOf("·"));
  return `${first.slice(0,stop>170?stop:310).trim()}…`;
}

function studyMonthLabel(key) {
  const [year,month]=String(key).split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB",{month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(year,month-1,1)));
}

function studyTaskLabel(item) {
  const t=`${item.header} ${item.text}`.toLowerCase();
  if(item.subject==="Tests & Review") return /mock/.test(t)?"Mock test":/quiz|question set|mcq/.test(t)?"Quiz":"Review session";
  if(item.subject==="Answer Writing") return /sample answer|model answer|suggested answer|answer framework/.test(t)?"Question + sample answer":"Question only";
  return item.header;
}

function studyOutputParts(text,max=3) {
  const clean=studyText(text);
  const named=clean.match(/^["“']([^"”']+)["”']\s*[—–:-]\s*(.*)$/);
  const title=named?.[1]||"Notebook output";
  const body=named?.[2]||clean;
  const raw=body.split(/\s+[·•]\s+|;\s+(?=[A-Z0-9"“'])|\.\s+(?=[A-Z"“'])/).map(s=>s.trim()).filter(Boolean);
  const bullets=(raw.length>1?raw:[body]).slice(0,max).map(s=>s.length>155?`${s.slice(0,152).trim()}…`:s);
  return {title,bullets,more:raw.length>max||body.length>bullets.join(" ").length+30};
}

function StudyItemPreview({item,expanded=false}) {
  if(!/output/i.test(item.header)) return <span>{expanded?studyMediumSummary(item.text):studyMediumSummary(item.text).slice(0,220)}</span>;
  const parts=studyOutputParts(item.text,expanded?5:3);
  return <div className="study-output-preview"><strong>{parts.title}</strong><ul>{parts.bullets.map((part,i)=><li key={i}>{part}</li>)}</ul>{parts.more&&<em>More detail available inside</em>}</div>;
}

function StudyChecklist({go}) {
  const ds=window.UPSC;
  const [entries,setEntries]=React.useState([]), [loading,setLoading]=React.useState(true);
  const [state,setState]=React.useState(()=>{try{return JSON.parse(localStorage.getItem(STUDY_LIST_KEY))||{}}catch(e){return {}}});
  const [view,setView]=React.useState("due"), [query,setQuery]=React.useState(""), [closed,setClosed]=React.useState(()=>Object.fromEntries(STUDY_ORDER.map(s=>[s,true]))), [closedMonths,setClosedMonths]=React.useState({}), [selected,setSelected]=React.useState(null), [focusItem,setFocusItem]=React.useState(null);
  React.useEffect(()=>{let live=true; const sweeps=ds.noteDocuments.filter(d=>d.cadence==="sunday"&&d.date<=ds.todayIso);
    Promise.all(sweeps.map(s=>ds.loadNoteDocument(s.id).then(({content})=>buildStudyChecklistEntries(s,parseWeekPlan(content))).catch(()=>[]))).then(all=>{if(live){setEntries(all.flat().sort((a,b)=>a.isoDate.localeCompare(b.isoDate)));setLoading(false)}}); return()=>{live=false};
  },[ds.todayIso]);
  const tick=(id,k,v)=>setState(cur=>{const next={...(cur[id]||{}),[k]:v}; if(k==="read"&&!v)next.revised=false; const n={...cur,[id]:next}; if(!n[id].read&&!n[id].revised)delete n[id]; localStorage.setItem(STUDY_LIST_KEY,JSON.stringify(n)); return n});
  const q=query.trim().toLowerCase();
  const shown=entries.filter(e=>(view==="all"||(e.isoDate<=ds.todayIso&&(!state[e.id]?.read||!state[e.id]?.revised)))&&(!q||`${e.subject} ${e.header} ${e.text} ${e.isoDate}`.toLowerCase().includes(q)));
  const groups=STUDY_ORDER.map(subject=>({subject,items:shown.filter(e=>e.subject===subject)})).filter(g=>g.items.length);
  const read=entries.filter(e=>state[e.id]?.read).length, revised=entries.filter(e=>state[e.id]?.revised).length;
  const dueEntries=entries.filter(e=>e.isoDate<=ds.todayIso&&(!state[e.id]?.read||!state[e.id]?.revised));
  const todayItems=dueEntries.filter(e=>e.isoDate===ds.todayIso);
  // Keep recovery deliberately small: one earliest unread task and, when eligible, one old revision.
  // Completing either naturally advances the next item from the beginning of the plan.
  const backlogPick=dueEntries.find(e=>e.isoDate<ds.todayIso&&!state[e.id]?.read)||null;
  const revisionPick=dueEntries.find(e=>e.isoDate<ds.todayIso&&state[e.id]?.read&&!state[e.id]?.revised&&((new Date(`${ds.todayIso}T00:00:00Z`)-new Date(`${e.isoDate}T00:00:00Z`))/86400000)>=7)||null;
  const priority=[...todayItems,backlogPick,revisionPick].filter(Boolean).filter((e,i,a)=>a.findIndex(x=>x.id===e.id)===i).slice(0,6);
  const priorityKind=(item)=>item.isoDate===ds.todayIso?"today":item.id===backlogPick?.id?"catchup":"revision";
  const focusPool=shown.length?shown:dueEntries;
  const focusIndex=focusItem?focusPool.findIndex(e=>e.id===focusItem.id):-1;
  const selectedItems=selected?entries.filter(e=>e.isoDate===selected.isoDate&&e.subject===selected.subject):[];
  const openFullSource=()=>{setSelected(null);window.dispatchEvent(new CustomEvent("pariksha:open-note",{detail:{cadence:"sunday",id:selected.noteId}}))};
  const practiceFor=(item)=>{
    if(!/mock|quiz|sectional|\bcsat\b|\bmcq/i.test(item.text))return null;
    const wanted=["polity","economy","environment","history","geography","science","technology","international","relations","csat","ethics"].filter(k=>item.text.toLowerCase().includes(k));
    return ds.questionSets.filter(q=>["sectional","csat","weekly-quiz","ai","csr"].includes(q.sourceType)&&q.isoDate).map(q=>{
      const days=Math.abs((new Date(`${q.isoDate}T00:00:00Z`)-new Date(`${item.isoDate}T00:00:00Z`))/86400000);
      const label=String(q.label||"").toLowerCase();
      let score=Math.max(0,8-days)+(q.sourceType==="sectional"&&/sectional/i.test(item.text)?6:0)+(q.sourceType==="csat"&&/csat/i.test(item.text)?8:0)+wanted.filter(k=>label.includes(k)).length*9;
      return {q,score,days};
    }).filter(x=>x.days<=8).sort((a,b)=>b.score-a.score||a.days-b.days)[0]?.q||null;
  };
  const openPractice=(item)=>{const target=practiceFor(item);if(target){setSelected(null);setFocusItem(null);go("test",{setId:target.id})}};
  const subjectPct=(items)=>Math.round(items.filter(i=>state[i.id]?.read&&state[i.id]?.revised).length/(items.length||1)*100);
  return <article className="study-checklist-card">
    <div className="study-checklist-head"><div><span className="eyebrow small"><span className="eyebrow-line"/> From the start of your plan</span><h2>Subject-wise study checklist</h2><p>Do today's work, then recover one older task. The backlog moves forward one manageable step at a time.</p></div><div className="study-checklist-summary"><span><strong>{read}</strong><small>read</small></span><span><strong>{revised}</strong><small>revised</small></span><span><strong>{entries.length}</strong><small>total</small></span></div></div>
    {!loading&&priority.length>0&&<section className="study-priority"><div className="study-priority-head"><div><span className="eyebrow small"><span className="eyebrow-line"/> Today's study rhythm</span><h3>Today + one step from the past</h3><p>Finish today's plan, then clear the earliest missed task. An older revision appears here once it becomes eligible.</p></div><button className="btn btn-green sm" onClick={()=>setFocusItem(priority[0])}><Icon name="play" size={14}/> Focus now</button></div><div className="study-priority-list">{priority.map(item=>{const kind=priorityKind(item);return <button className={kind==="catchup"?"is-catchup":""} key={item.id} onClick={()=>setFocusItem(item)}><span className={`priority-kind ${kind}`}>{kind==="today"?"Today":kind==="catchup"?"Past catch-up":"Revision due"}</span><strong>{item.subject}<em className="study-task-type">{studyTaskLabel(item)}</em></strong><small>{formatIsoDate(item.isoDate)} · {studyMediumSummary(item.text)}</small><Icon name="arrowR" size={14}/></button>})}</div></section>}
    <div className="study-checklist-toolbar"><div className="study-checklist-tabs"><button className={view==="due"?"on":""} onClick={()=>setView("due")}>Still to finish</button><button className={view==="all"?"on":""} onClick={()=>setView("all")}>All items</button></div><label className="study-checklist-search"><Icon name="search" size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search books, chapters or topics…" aria-label="Search study checklist"/>{query&&<button onClick={()=>setQuery("")} aria-label="Clear checklist search"><Icon name="x" size={13}/></button>}</label><div className="study-checklist-key"><span>First reading</span><span>Revision</span></div></div>
    {loading&&<p className="muted study-checklist-message">Gathering every study day from your plan…</p>}{!loading&&!groups.length&&<p className="study-checklist-empty"><Icon name="check" size={18}/> Everything has been read and revised.</p>}
    {!loading&&groups.map(g=>{const allSubjectItems=entries.filter(i=>i.subject===g.subject),months=[...new Set(g.items.map(i=>i.isoDate.slice(0,7)))].sort().reverse(),pct=subjectPct(allSubjectItems);return <section className="study-subject" key={g.subject}><button className="study-subject-toggle" onClick={()=>setClosed(c=>({...c,[g.subject]:!c[g.subject]}))}><span><Icon name={closed[g.subject]?"chevR":"chevDown"} size={16}/><strong>{g.subject}</strong><small>{g.items.length} shown · {months.length} month{months.length===1?"":"s"}</small></span><span className="study-subject-progress"><i><b style={{width:`${pct}%`}}/></i><em>{pct}% complete</em></span><span className="study-subject-counts"><em>{allSubjectItems.filter(i=>state[i.id]?.read).length} read</em><em>{allSubjectItems.filter(i=>state[i.id]?.revised).length} revised</em></span></button>{!closed[g.subject]&&<div className="study-subject-months">{months.map((month)=>{const items=g.items.filter(i=>i.isoDate.startsWith(month)),allMonthItems=allSubjectItems.filter(i=>i.isoDate.startsWith(month));const key=`${g.subject}::${month}`,pct=subjectPct(allMonthItems);const isClosed=closedMonths[key]!==false;return <section className="study-month" key={month}><button className="study-month-toggle" onClick={()=>setClosedMonths(c=>({...c,[key]:!isClosed}))}><span><Icon name={isClosed?"chevR":"chevDown"} size={14}/><strong>{studyMonthLabel(month)}</strong><small>{items.length} shown</small></span><span className="study-month-progress"><i><b style={{width:`${pct}%`}}/></i><em>{pct}%</em></span><span><em>{allMonthItems.filter(i=>state[i.id]?.read).length}/{allMonthItems.length} read</em><em>{allMonthItems.filter(i=>state[i.id]?.revised).length}/{allMonthItems.length} revised</em></span></button>{!isClosed&&<div className="study-subject-items">{items.map(i=><div className={`study-checklist-item${state[i.id]?.read&&state[i.id]?.revised?" complete":""}`} key={i.id}><button className="study-checklist-copy" onClick={()=>setSelected(i)} aria-label={`Show ${i.subject} details for ${formatIsoDate(i.isoDate)}`}><span className="study-checklist-date">{formatIsoDate(i.isoDate)} · {studyTaskLabel(i)}</span><StudyItemPreview item={i}/><em className="study-checklist-more">View subject detail <Icon name="arrowR" size={12}/></em></button><label><input type="checkbox" checked={!!state[i.id]?.read} onChange={e=>tick(i.id,"read",e.target.checked)}/><span>Read</span></label><label className={!state[i.id]?.read?"locked":""} title={!state[i.id]?.read?"Complete the first reading to unlock revision":""}><input type="checkbox" disabled={!state[i.id]?.read} checked={!!state[i.id]?.revised} onChange={e=>tick(i.id,"revised",e.target.checked)}/><span>{state[i.id]?.read?"Revised":"Locked"}</span></label></div>)}</div>}</section>})}</div>}</section>})}
    {selected&&<div className="study-detail-layer" role="presentation" onMouseDown={()=>setSelected(null)}><section className="study-detail-card" role="dialog" aria-modal="true" aria-label={`${selected.subject} study detail`} onMouseDown={e=>e.stopPropagation()}><header><div><span className="eyebrow small"><span className="eyebrow-line"/> {formatIsoDate(selected.isoDate)}</span><h3>{selected.subject}</h3><p>The useful middle layer: what to do, without reproducing the entire Sweep.</p></div><button className="icon-btn ghost" onClick={()=>setSelected(null)} aria-label="Close subject detail"><Icon name="x" size={18}/></button></header><div className="study-detail-content">{selectedItems.map(item=>{const practice=practiceFor(item);return <article className={practice?"is-practice":""} key={item.id} onClick={practice?()=>openPractice(item):undefined}><span>{studyTaskLabel(item)}</span><div className="study-detail-preview"><StudyItemPreview item={item} expanded/></div>{practice&&<button className="study-detail-primary" onClick={()=>openPractice(item)}><Icon name="play" size={14}/> Start {practice.label||"quiz"}</button>}{!practice&&item.text.length>330&&<button className="study-detail-link" onClick={openFullSource}>Read full detail <Icon name="arrowR" size={13}/></button>}<div onClick={e=>e.stopPropagation()}><label><input type="checkbox" checked={!!state[item.id]?.read} onChange={e=>tick(item.id,"read",e.target.checked)}/> {practice?"Attempted":"First reading"}</label><label className={!state[item.id]?.read?"locked":""}><input type="checkbox" disabled={!state[item.id]?.read} checked={!!state[item.id]?.revised} onChange={e=>tick(item.id,"revised",e.target.checked)}/> {!state[item.id]?.read?"Complete first":practice?"Reviewed":"Revision"}</label></div></article>})}</div><footer className="study-detail-footer"><div><strong>Need the surrounding instructions?</strong><span>Open this date in the original Sunday Sweep.</span></div><button className="btn btn-green sm" onClick={openFullSource}>Open full source <Icon name="arrowR" size={14}/></button></footer></section></div>}
    {focusItem&&<div className="study-focus-layer" role="presentation" onMouseDown={()=>setFocusItem(null)}><section className="study-focus-card" role="dialog" aria-modal="true" aria-label="Study focus mode" onMouseDown={e=>e.stopPropagation()}><header><span>Focus mode · {focusIndex+1} of {focusPool.length}</span><button className="icon-btn ghost" onClick={()=>setFocusItem(null)} aria-label="Close focus mode"><Icon name="x" size={18}/></button></header><div className="study-focus-body"><span className="study-focus-subject">{focusItem.subject}</span><time>{formatIsoDate(focusItem.isoDate)} · {focusItem.header}</time><h3>{studyMediumSummary(focusItem.text)}</h3>{practiceFor(focusItem)&&<button className="btn btn-green" onClick={()=>openPractice(focusItem)}><Icon name="play" size={15}/> Start practice</button>}<div className="study-focus-checks"><label><input type="checkbox" checked={!!state[focusItem.id]?.read} onChange={e=>tick(focusItem.id,"read",e.target.checked)}/>{practiceFor(focusItem)?"Attempted":"First reading complete"}</label><label className={!state[focusItem.id]?.read?"locked":""}><input type="checkbox" disabled={!state[focusItem.id]?.read} checked={!!state[focusItem.id]?.revised} onChange={e=>tick(focusItem.id,"revised",e.target.checked)}/>{!state[focusItem.id]?.read?"Revision unlocks after reading":practiceFor(focusItem)?"Reviewed":"Revision complete"}</label></div></div><footer><button disabled={focusIndex<=0} onClick={()=>setFocusItem(focusPool[focusIndex-1])}><Icon name="arrowL" size={14}/> Previous</button><button className="study-focus-source" onClick={()=>{setSelected(focusItem);setFocusItem(null)}}>View details</button><button disabled={focusIndex<0||focusIndex>=focusPool.length-1} onClick={()=>setFocusItem(focusPool[focusIndex+1])}>Next <Icon name="arrowR" size={14}/></button></footer></section></div>}
  </article>;
}
Object.assign(window,{StudyChecklist,buildStudyChecklistEntries,studySubjectFor});
