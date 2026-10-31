'use client';
import { useEffect, useState } from 'react';
import Header from '@/app/_components/header';
import styles from './enterprise-header.module.css';
export default function EnterpriseHeader() {
  const [atTop,setAtTop]=useState(true);
  useEffect(()=>{
    const header=document.querySelector('header');if(!header)return;
    const measure=()=>document.documentElement.style.setProperty('--enterprise-nav-height',`${header.getBoundingClientRect().height}px`);
    measure();const observer=new ResizeObserver(measure);observer.observe(header);
    return()=>{observer.disconnect();document.documentElement.style.removeProperty('--enterprise-nav-height');};
  },[]);
  useEffect(()=>{
    const update=()=>setAtTop(window.scrollY<48);
    update();window.addEventListener('scroll',update,{passive:true});
    return()=>window.removeEventListener('scroll',update);
  },[]);
  return <Header className={`${styles.header} ${atTop?styles.atTop:''}`}/>;
}
