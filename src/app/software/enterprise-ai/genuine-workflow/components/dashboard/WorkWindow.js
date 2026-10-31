"use client";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import styles from "./WorkDialogs.module.css";
export default function WorkWindow({title,onClose,wide,maxWidth,children,footer}) {
  const dialog=useRef(null),reduce=useReducedMotion();
  useEffect(()=>{const el=dialog.current;el.showModal(); const previous=document.body.style.overflow;document.body.style.overflow="hidden";return()=>{el.close();document.body.style.overflow=previous;};},[]);
  return createPortal(<dialog ref={dialog} className={styles.backdrop} style={{margin:0,width:"100%",maxWidth:"none",height:"100%",maxHeight:"none",border:0}} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}} aria-label={title}><motion.section style={{maxWidth}} className={`${styles.dialog} ${wide?styles.wide:""}`} initial={{opacity:0,y:reduce?0:12}} animate={{opacity:1,y:0}} transition={{duration:reduce?0:.18}}><header className={styles.title}><h2>{title}</h2><button type="button" aria-label={`Close ${title}`} onClick={onClose}><X size={20}/></button></header>{children}{footer&&<footer className={styles.footer}>{footer}</footer>}</motion.section></dialog>,document.body);
}
