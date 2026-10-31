"use client";
import { useEffect, useRef } from "react";
export function isWithinDismissibleLayer(target, roots) {
  let node = target;
  const seen = new Set();
  while (node && !seen.has(node)) {
    if (roots.some(root => root?.contains(node))) return true;
    seen.add(node);
    const owner = node.closest?.('[data-selector-trigger]')?.dataset.selectorTrigger;
    node = owner ? document.getElementById(`${owner}-root`) : null;
  }
  return false;
}
export function useDismissibleLayer(open, onDismiss) {
  const rootRef=useRef(null),dismissRef=useRef(onDismiss);
  useEffect(()=>{dismissRef.current=onDismiss;},[onDismiss]);
  useEffect(()=>{
    if(!open)return;
    const inside=target=>isWithinDismissibleLayer(target,[rootRef.current]);
    const outside=e=>{if(!inside(e.target))dismissRef.current?.();};
    const escape=e=>{if(e.key==='Escape'&&!e.defaultPrevented){e.preventDefault();dismissRef.current?.();rootRef.current?.querySelector('button,summary')?.focus();}};
    document.addEventListener('pointerdown',outside,true);document.addEventListener('focusin',outside);document.addEventListener('keydown',escape);
    return()=>{document.removeEventListener('pointerdown',outside,true);document.removeEventListener('focusin',outside);document.removeEventListener('keydown',escape);};
  },[open]);
  return rootRef;
}
