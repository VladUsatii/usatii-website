'use client';
import {useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import Link from 'next/link';
import styles from './dart.module.css';

function placement(element) {
 const rect=element.getBoundingClientRect(),width=Math.min(280,window.innerWidth-32);
 if(rect.bottom<60||rect.top>window.innerHeight)return null;
 const above=rect.bottom+100>window.innerHeight;
 return {left:Math.max(16,Math.min(rect.left,window.innerWidth-width-16)),top:above?rect.top-8:rect.bottom+8,width,...above?{transform:'translateY(-100%)'}:{}};
}
export default function DefinedTerm({children,definition,href,style}) {
 const id=useId(),trigger=useRef(null),[position,setPosition]=useState(null);
 const show=event=>{const element=event.currentTarget;trigger.current=element;setPosition(placement(element));if(document.activeElement===element)requestAnimationFrame(()=>{if(document.activeElement===element)setPosition(placement(element));});};
 useEffect(()=>{
  if(!position)return;
  const scroll=()=>setPosition(trigger.current===document.activeElement?placement(trigger.current):null);
  const hide=()=>setPosition(null);
  window.addEventListener('scroll',scroll,true);window.addEventListener('resize',hide);
  return()=>{window.removeEventListener('scroll',scroll,true);window.removeEventListener('resize',hide);};
 },[position]);
 const Tag=href?Link:'span';
 return <Tag href={href} style={style} className={styles.definedTerm} tabIndex={href?undefined:0} aria-describedby={position?id:undefined} onMouseEnter={show} onMouseLeave={()=>setPosition(null)} onFocus={show} onBlur={()=>setPosition(null)} onKeyDown={event=>{if(event.key==='Escape'){setPosition(null);event.stopPropagation();}}}>{children}{position&&createPortal(<span role="tooltip" id={id} className={styles.definitionTooltip} style={position}><i>{definition}</i></span>,document.body)}</Tag>;
}
