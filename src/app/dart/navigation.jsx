'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {AnimatePresence,motion,useReducedMotion} from 'framer-motion';
import {ChevronDown} from 'lucide-react';
import styles from './dart.module.css';

export function DartNavigation({pages,groups,current}) {
 const [open,setOpen]=useState(false),[expanded,setExpanded]=useState(current),[active,setActive]=useState('');
 const reduced=useReducedMotion();
 useEffect(()=>{setExpanded(current);setActive('');},[current]);
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setActive(entry.target.id);},{rootMargin:'-15% 0px -65% 0px'});
  for(const section of pages.find(p=>p.slug===current)?.sections||[]){const element=document.getElementById(section.id);if(element)observer.observe(element);}
  return ()=>observer.disconnect();
 },[current,pages]);
 return <aside className={styles.sidebar}>
  <Link className={styles.productName} href="/dart"><img src="/brand/dart-logo.webp" width="400" height="103" alt="DART" className={styles.productLogo}/></Link>
  <button className={styles.mobileToggle} onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls="dart-navigation">Explore DART</button>
  <div id="dart-navigation" className={`${styles.navContent} ${open?styles.navOpen:''}`}>
   <nav aria-label="DART documentation">{groups.map(group=><div className={styles.navGroup} key={group}><h2>{group}</h2>{pages.filter(p=>p.group===group).map(p=><div key={p.href} className={styles.navTopic}>
    <div className={styles.navTopicRow}>
     <Link href={p.href} aria-current={p.slug===current?'page':undefined} className={p.slug===current?styles.navActive:undefined} onClick={event=>{if(p.slug===current){event.preventDefault();setExpanded(expanded===p.slug?null:p.slug);}else setOpen(false);}}>{p.slug?p.title:'Overview'}</Link>
     <button className={styles.topicToggle} aria-label={`${expanded===p.slug?'Collapse':'Expand'} ${p.slug?p.title:'Overview'} sections`} aria-expanded={expanded===p.slug} aria-controls={`dart-sections-${p.slug||'overview'}`} onClick={()=>setExpanded(expanded===p.slug?null:p.slug)}><motion.span animate={{rotate:expanded===p.slug?180:0}} transition={{duration:reduced?0:.18}}><ChevronDown size={12} aria-hidden="true"/></motion.span></button>
    </div>
    <AnimatePresence initial={false}>{expanded===p.slug&&<motion.div id={`dart-sections-${p.slug||'overview'}`} initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:reduced?0:.2}} className={styles.sectionTree}><ul>{p.sections.map(section=><li key={section.id}><a href={`${p.href}#${section.id}`} aria-current={p.slug===current&&active===section.id?'location':undefined} onClick={()=>setOpen(false)}>{section.title}</a></li>)}</ul></motion.div>}</AnimatePresence>
   </div>)}</div>)}</nav>
  </div>
 </aside>;
}
