'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './dart.module.css';
export function DartNavigation({pages,groups,current}) {
  const [query,setQuery]=useState(''),[open,setOpen]=useState(false);
  const filtered=pages.filter(p=>`${p.title} ${p.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <aside className={styles.sidebar}>
    <Link className={styles.productName} href="/dart"><span>DART<small>Usatii for Emergency Management</small></span></Link>
    <button className={styles.mobileToggle} onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="dart-navigation">Explore DART</button>
    <div id="dart-navigation" className={`${styles.navContent} ${open?styles.navOpen:''}`}>
      <label className={styles.search}><span className={styles.srOnly}>Find DART documentation</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a capability…"/></label>
      <nav aria-label="DART documentation">{groups.map(group=>{const entries=filtered.filter(p=>p.group===group);return entries.length>0&&<div className={styles.navGroup} key={group}><h2>{group}</h2>{entries.map(p=><Link key={p.href} href={p.href} aria-current={p.slug===current?'page':undefined} className={p.slug===current?styles.navActive:undefined} onClick={()=>{setOpen(false);setQuery('');}}>{p.title=== 'DART'?'Overview':p.title}</Link>)}</div>;})}{!filtered.length&&<p className={styles.noResults}>No matching topics.</p>}</nav>

    </div>
  </aside>;
}
export function DartContents({sections}) {
  const [active,setActive]=useState(sections[0]?.id);
  useEffect(()=>{
    const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setActive(entry.target.id);},{rootMargin:'-15% 0px -65% 0px'});
    for(const section of sections){const element=document.getElementById(section.id);if(element)observer.observe(element);}
    return ()=>observer.disconnect();
  },[sections]);
  return <aside className={styles.contents}><p>On this page</p><nav aria-label="On this page">{sections.map(s=><a key={s.id} href={`#${s.id}`} aria-current={active===s.id?'location':undefined}>{s.title}</a>)}</nav><a className={styles.backTop} href="#dart-top">Back to top</a></aside>;
}
