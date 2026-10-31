'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import RetroIcon from './retro-icon';
import OperationsDashboard from './operations-dashboard';
import photos from './archive-photos.json';
import styles from './data-scenes.module.css';

const filenames = ['Q4_budget_FINAL.xlsx', 'New Folder', 'meeting_04.wav', 'client-list_old.csv', 'proposal_v7.doc', 'IMG_2048.jpg', 'Archive', 'notes copy.txt', 'inventory_BACKUP.zip', 'scan_001.pdf', 'call_recording.mp3', 'Untitled Folder', 'project-final-FINAL.doc', 'site_visit.jpeg', 'pricing_2021.xls', 'DO_NOT_DELETE', 'voice_memo.aiff', 'customer_export.csv', 'old contracts', 'Screenshot 12.png', 'handoff_notes.txt', 'backup (2).zip'];
const kinds = ['sheet', 'folder', 'audio', 'sheet', 'document', 'photo', 'archive', 'notes', 'archive', 'document', 'audio', 'folder', 'document', 'photo', 'sheet', 'archive', 'audio', 'sheet', 'folder', 'photo', 'notes', 'archive'];
const files = Array.from({length:132}, (_, i) => {
  let x = ((i * 73 + (i % 7) * 19) % 991) / 10;
  const y = 6 + ((i * 47 + Math.floor(i / 7) * 29) % 780) / 10;
  // Leave the wallpaper's question readable, with disorder crowding its edges.
  if (x > 20 && x < 78 && y > 24 && y < 65) x = i % 2 ? 5 + (x % 14) : 81 + (x % 13);
  return {name: filenames[i % filenames.length], kind:kinds[i % kinds.length], x, y, rotate: (i % 5 - 2) * 3, z: i % 13};
});
const apps = [{kind:'folder', label:'Company files'}, {kind:'notes', label:'Notes'}, {kind:'globe', label:'Intranet'}, {kind:'lock', label:'Access'}, {kind:'archive', label:'Backups'}, {kind:'trash', label:'Trash'}];

export function ClutteredDesktop({ embedded = false }) {
  const [app, setApp] = useState(null);
  const area = useRef(null);
  return <section className={`${styles.desktop} ${embedded ? styles.desktopEmbedded : ''}`} aria-label='A cluttered company desktop' ref={area}>
    <div className={styles.menu}><span className={styles.menuMark} aria-hidden='true'>▧</span><strong>Desktop</strong><span>File</span><span>Edit</span><span>View</span><span className={styles.menuRight}>Company computer</span></div>
    <div className={styles.wallpaper}><h2>Were you ever going<br />to organize your<br />company’s information<br />so AI could actually<br />use it intelligently?</h2></div>
    <div className={styles.files} aria-hidden='true'>{files.map((file, index) => <motion.div key={index} className={styles.file} style={{left:`${file.x}%`,top:`${file.y}%`,zIndex:file.z,rotate:file.rotate}} drag dragConstraints={area} dragMomentum={false} whileDrag={{zIndex:30,scale:1.08}}><RetroIcon kind={file.kind} id={`file-${index}`}/><span>{file.name}</span></motion.div>)}</div>
    {app !== null && <div className={styles.appWindow} role='dialog' aria-label={apps[app].label} onKeyDown={event=>{if(event.key==='Escape')setApp(null);}}>
      <div className={styles.windowTitle}><button type='button' onClick={()=>setApp(null)} aria-label='Close desktop window' autoFocus>×</button><span>{apps[app].label}</span><span aria-hidden='true'>▤</span></div>
      <div className={styles.windowTools}><RetroIcon kind={apps[app].kind} id='window-tool'/><span>{app === 5 ? 'Nothing is ever really gone.' : 'Somewhere in here…'}</span></div>
      <div className={styles.windowFiles}>{filenames.slice(app,app+6).map((name,i)=><div key={name}><RetroIcon kind={kinds[app+i]} id={`window-${i}`}/><span>{name}</span></div>)}</div>
      <div className={styles.windowStatus}>Illustrative desktop · no company data</div>
    </div>}
    <div className={styles.dock} role='toolbar' aria-label='Illustrative desktop apps'>{apps.map((item,index)=><button type='button' key={item.label} aria-label={`Open ${item.label}`} aria-pressed={app===index} onClick={()=>setApp(app===index?null:index)}><RetroIcon kind={item.kind} id={`dock-${index}`}/><span>{item.label}</span></button>)}</div>
    <span className={styles.desktopFootnote}>A familiar kind of information architecture.</span>
  </section>;
}

const modulo = (n, size) => ((n % size) + size) % size;
export function InfiniteArchive() {
  const section = useRef(null);
  const viewport = useRef(null);
  const tiles = useRef([]);
  const engine = useRef({x:0,y:0,vx:0,vy:0,down:false,lastX:0,lastY:0,time:0,frame:0,morph:0,targets:[]});
  const [layout,setLayout] = useState({cols:7,rows:6,w:280,h:220});
  const [dragging,setDragging] = useState(false);
  const [boardLoaded,setBoardLoaded] = useState(false);
  useEffect(()=>{const el=section.current;if(!el)return;const inspect=()=>{if(el.querySelectorAll('[data-archive-cell]').length>=8)setBoardLoaded(true);};const observer=new MutationObserver(inspect);observer.observe(el,{childList:true,subtree:true});inspect();return()=>observer.disconnect();},[]);
  useEffect(()=>{
    let first=0,second=0;
    const jump=()=>{if(window.location.hash!=='#beyond-chat')return;first=requestAnimationFrame(()=>{second=requestAnimationFrame(()=>{const el=section.current;if(el)window.scrollTo({top:window.scrollY+el.getBoundingClientRect().top+(el.offsetHeight-window.innerHeight)*.98,behavior:'instant'});});});};
    jump();window.addEventListener('hashchange',jump);return()=>{cancelAnimationFrame(first);cancelAnimationFrame(second);window.removeEventListener('hashchange',jump);};
  },[]);
  const reduced = useReducedMotion();
  const {scrollYProgress} = useScroll({target:section,offset:['start end','end end']});
  const opacity = useTransform(scrollYProgress,[0,.22,.40,.60],[0,0,1,0]);
  const titleY = useTransform(scrollYProgress,[.3,.7],[45,0]);
  const shade = useTransform(scrollYProgress,[0,.35,.60,.88],[.13,.18,.65,0]);
  const boardOpacity = useTransform(scrollYProgress,value=>boardLoaded?Math.max(0,Math.min(1,(value-.58)/.27)):0);
  const archiveOpacity = useTransform(scrollYProgress,value=>boardLoaded?1-Math.max(0,Math.min(1,(value-.78)/.08)):1);
  const shadeOpacity = useTransform(scrollYProgress,value=>boardLoaded&&value>.6?Math.max(0,.65*(1-(value-.6)/.28)):Math.min(.65,.13+value*.8));
  useEffect(()=>{
    const sync=value=>{
      const state=engine.current;
      state.morph=!boardLoaded?0:reduced?(value>.82?1:0):Math.max(0,Math.min(1,(value-.58)/.28));
      if(state.morph>0){state.vx=0;state.vy=0;}
      boardOpacity.set(boardLoaded?Math.max(0,Math.min(1,(value-.58)/.27)):0);
      archiveOpacity.set(boardLoaded?1-Math.max(0,Math.min(1,(value-.78)/.08)):1);
      shadeOpacity.set(boardLoaded&&value>.6?Math.max(0,.65*(1-(value-.6)/.28)):Math.min(.65,.13+value*.8));
      if(!state.frame&&state.draw)state.frame=requestAnimationFrame(state.draw);
    };
    sync(scrollYProgress.get());return scrollYProgress.on('change',sync);
  },[boardLoaded,reduced,scrollYProgress,boardOpacity,archiveOpacity,shadeOpacity]);

  useEffect(()=>{
    const observer=new ResizeObserver(([entry])=>{
      const {width,height}=entry.contentRect;
      const w=width<600?190:width<1000?250:320;
      const h=Math.round(w*.76);
      setLayout({cols:Math.ceil(width/w)+2,rows:Math.ceil(height/h)+2,w,h});
    });
    observer.observe(viewport.current);
    return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    const state=engine.current;
    const {cols,rows,w,h}=layout;
    let previous=0;
    const draw=(time)=>{
      const delta=previous?Math.min((time-previous)/16.67,2):1;previous=time;
      if(!state.down){state.x+=state.vx*delta;state.y+=state.vy*delta;state.vx*=Math.pow(.94,delta);state.vy*=Math.pow(.94,delta);}
      state.x=modulo(state.x,cols*w);state.y=modulo(state.y,rows*h);
      const bounds=viewport.current.getBoundingClientRect();
      const targets=[...viewport.current.parentElement.querySelectorAll('[data-archive-cell]')].sort((a,b)=>Number(a.dataset.archiveCell)-Number(b.dataset.archiveCell)).map(el=>{const r=el.getBoundingClientRect();return {x:r.left-bounds.left,y:r.top-bounds.top,w:r.width,h:r.height};});
      const t=state.morph*state.morph*(3-2*state.morph);
      tiles.current.forEach((el,i)=>{if(!el)return;const x=modulo((i%cols)*w+state.x,cols*w)-w,y=modulo(Math.floor(i/cols)*h+state.y,rows*h)-h,target=targets[i%targets.length];
        if(t>0&&target){el.style.transform=`translate3d(${x+(target.x-x)*t}px,${y+(target.y-y)*t}px,0)`;el.style.width=`${w+(target.w-w)*t}px`;el.style.height=`${h+(target.h-h)*t}px`;el.style.padding=`${(1-t)*10}px ${(1-t)*12}px ${(1-t)*24}px`;el.style.opacity=i<8?'1':String(1-t);const caption=el.querySelector('span');if(caption)caption.style.opacity=String(Math.max(0,1-t*4));}
        else{el.style.transform=`translate3d(${x}px,${y}px,0)`;el.style.width=`${w}px`;el.style.height=`${h}px`;el.style.padding='';el.style.opacity='1';const caption=el.querySelector('span');if(caption)caption.style.opacity='1';}
      });
      if(state.down||Math.abs(state.vx)>.08||Math.abs(state.vy)>.08)state.frame=requestAnimationFrame(draw);else state.frame=0;
    };
    state.draw=draw;
    state.frame=requestAnimationFrame(draw);
    return ()=>cancelAnimationFrame(state.frame);
  },[layout]);
  const wake=()=>{const s=engine.current;if(!s.frame&&s.draw)s.frame=requestAnimationFrame(s.draw);};
  const down=event=>{
    if(event.button!==0||engine.current.morph>0)return;
    const s=engine.current;s.down=true;s.vx=0;s.vy=0;s.lastX=event.clientX;s.lastY=event.clientY;s.time=event.timeStamp;
    event.currentTarget.setPointerCapture(event.pointerId);setDragging(true);wake();
  };
  const move=event=>{
    const s=engine.current;if(!s.down)return;
    const dx=event.clientX-s.lastX,dy=event.clientY-s.lastY,dt=Math.max(event.timeStamp-s.time,8);
    s.x+=dx;s.y+=dy;s.vx=Math.max(-40,Math.min(40,dx/dt*16));s.vy=Math.max(-40,Math.min(40,dy/dt*16));
    s.lastX=event.clientX;s.lastY=event.clientY;s.time=event.timeStamp;wake();
  };
  const up=event=>{const s=engine.current;s.down=false;if(reduced||event.type==='pointercancel'||event.timeStamp-s.time>100){s.vx=0;s.vy=0;}setDragging(false);wake();};
  const key=event=>{
    const vectors={ArrowLeft:[100,0],ArrowRight:[-100,0],ArrowUp:[0,100],ArrowDown:[0,-100]};
    if(!vectors[event.key])return;event.preventDefault();const [x,y]=vectors[event.key];engine.current.x+=x;engine.current.y+=y;engine.current.vx=0;engine.current.vy=0;wake();
  };
  return <section ref={section} className={styles.archiveSection} aria-label='Explore a photographic archive'>
    <div className={styles.archiveSticky}>
      <motion.div className={styles.boardArrival} style={{opacity:boardOpacity,pointerEvents:useTransform(scrollYProgress,value=>value>=.86?'auto':'none'),visibility:useTransform(scrollYProgress,value=>value>.58?'visible':'hidden')}}><div className={styles.boardSurface}><OperationsDashboard embedded /></div></motion.div>
      <motion.div ref={viewport} style={{opacity:archiveOpacity,pointerEvents:useTransform(scrollYProgress,value=>value>.58?'none':'auto')}} className={`${styles.archiveViewport} ${dragging?styles.dragging:''}`} role='region' tabIndex={0} aria-label='Infinite photo field. Drag in any direction, or use arrow keys. Swipe vertically to continue the page.' onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} onKeyDown={key}>
        <div className={styles.tiles} aria-hidden='true'>{Array.from({length:layout.cols*layout.rows},(_,i)=>{
          const photo=photos[i<8?i:(i*7+Math.floor(i/layout.cols)*3)%photos.length];
          return <div key={i} ref={el=>{tiles.current[i]=el;}} className={styles.tile} style={{width:layout.w,height:layout.h}}><img src={photo.src} alt='' width='640' height='480' draggable={false} loading='lazy'/><span>{String(i+1).padStart(3,'0')} / {photo.title}</span></div>;
        })}</div>
      </motion.div>
      <motion.div aria-hidden='true' className={styles.archiveShade} style={{opacity:shadeOpacity}}/>
      <motion.div className={styles.filmGrain} aria-hidden='true' style={{opacity:useTransform(scrollYProgress,[.6,.85],[.15,0])}}/>
      <motion.div className={styles.filmEdge} aria-hidden='true' style={{opacity:archiveOpacity}}><span>USATII / COMPANY MEMORY</span><span>35 MM — ∞</span></motion.div>
      <motion.h2 className={styles.archiveTitle} style={{opacity,y:reduced?0:titleY}}>Build AI using your<br />company’s most<br />valuable data.</motion.h2>
      <motion.div className={styles.archiveBottom} style={{opacity:useTransform(scrollYProgress,[.5,.65],[1,0]),pointerEvents:useTransform(scrollYProgress,value=>value>.65?'none':'auto')}}><span>Drag to explore <span aria-hidden='true'>↔</span> Scroll to continue</span><span>Archival photography via <a href='https://nos.twnsnd.co/' target='_blank' rel='noreferrer'>New Old Stock</a> · <a href='/enterprise-ai/archive/sources.json' target='_blank' rel='noreferrer'>Sources</a></span></motion.div>
    </div>
  </section>;
}
