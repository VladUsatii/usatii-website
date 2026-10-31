'use client';
import { useLayoutEffect, useRef } from 'react';

export default function WorkFlowGridViewport({ onViewportChange, children, ...props }) {
  const root = useRef(null), callback = useRef(onViewportChange);
  useLayoutEffect(() => { callback.current = onViewportChange; });
  useLayoutEffect(() => {
    const node = root.current;
    let frame;
    const measure = () => callback.current({ left: node.scrollLeft, width: node.clientWidth || window.innerWidth });
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    observer?.observe(node);
    node.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => { cancelAnimationFrame(frame); observer?.disconnect(); node.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  return <div {...props} ref={root}>{children}</div>;
}
