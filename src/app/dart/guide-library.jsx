'use client';
import {useDeferredValue,useState} from 'react';
import styles from './dart.module.css';
export default function GuideLibrary({guides}) {
 const [query,setQuery]=useState(''),[area,setArea]=useState('');const search=useDeferredValue(query.trim().toLowerCase());
 const areas=[...new Set(guides.map(g=>g.area))].sort();
 const filtered=guides.filter(g=>(!area||g.area===area)&&`${g.title} ${g.area} ${g.steps.join(' ')}`.toLowerCase().includes(search));
 return <div className={styles.guideLibrary}><div className={styles.guideFilters}><label>Find a help task<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try task books, NOAA, or permissions"/></label><label>Work area<select value={area} onChange={e=>setArea(e.target.value)}><option value="">All work areas</option>{areas.map(a=><option key={a}>{a}</option>)}</select></label></div><p className={styles.resultCount} role="status">{filtered.length} help tasks</p><div className={styles.guideResults}>{filtered.map(g=><details key={g.id}><summary>{g.title}<span>{g.area}</span></summary><ol>{g.steps.map((step,i)=><li key={i}>{step}</li>)}</ol><p className={styles.guideNote}>These steps run as a guided task inside DART. Your current permissions determine which controls are available.</p></details>)}{!filtered.length&&<p>No help tasks match. Try another term or work area.</p>}</div></div>;
}
