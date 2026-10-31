'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ClutteredDesktop } from './data-scenes';
import styles from './computer-zoom.module.css';

// Normalized inner-glass bounds in the office photograph. Kept in one place so
// the physical bezel and live desktop always share the same camera geometry.
const GLASS = { left: .35, top: .178, width: .332, height: .354 };
const IMAGE_ASPECT = 1.5;
const clamp = value => Math.max(0, Math.min(1, value));

export default function ComputerZoom() {
  const section = useRef(null);
  const stage = useRef(null);
  const [size, setSize] = useState({ width:1440, height:836, ready:false });
  const [interactive, setInteractive] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target:section, offset:['start start','end end'] });
  const progress = useTransform(scrollYProgress, value => {
    if (reduced) return 1;
    const t = clamp((value - .10) / .68);
    return t * t * (3 - 2 * t);
  });
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setSize({width:entry.contentRect.width,height:entry.contentRect.height,ready:true});
    });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const update = value => setInteractive(value >= .999);
    update(progress.get());
    return progress.on('change', update);
  }, [progress]);

  const {width,height} = size;
  // Cover the viewport without letterboxing. The aperture uses the same
  // image geometry, preserving screen alignment throughout the zoom.
  const imageWidth = Math.max(width, height * IMAGE_ASPECT);
  const imageHeight = imageWidth / IMAGE_ASPECT;
  const imageLeft = (width-imageWidth)/2;
  const imageTop = (height-imageHeight)/2;
  const glassWidth = imageWidth*GLASS.width;
  const glassHeight = imageHeight*GLASS.height;
  const centerX = imageLeft+imageWidth*(GLASS.left+GLASS.width/2);
  const centerY = imageTop+imageHeight*(GLASS.top+GLASS.height/2);
  const finalScale = Math.max(width/glassWidth,height/glassHeight)*1.04;
  const cameraScale = useTransform(progress, [0,1], [1,finalScale]);
  const cameraX = useTransform(progress, [0,1], [0,width/2-centerX]);
  const cameraY = useTransform(progress, [0,1], [0,height/2-centerY]);
  const apertureX = useTransform(progress, t => centerX+(width/2-centerX)*t-glassWidth*(1+(finalScale-1)*t)/2);
  const apertureY = useTransform(progress, t => centerY+(height/2-centerY)*t-glassHeight*(1+(finalScale-1)*t)/2);
  const apertureW = useTransform(cameraScale, scale => glassWidth*scale);
  const apertureH = useTransform(cameraScale, scale => glassHeight*scale);
  const contentScaleX = useTransform(cameraScale, scale => Math.min(glassWidth*scale/width,1));
  const contentScaleY = useTransform(cameraScale, scale => Math.min(glassHeight*scale/height,1));
  const curvature = useTransform(progress, [0,.65,1], [12,12,0]);
  const glassOpacity = useTransform(progress, [0,.65,.92,1], [.32,.22,0,0]);
  const roomOpacity = useTransform(progress,[0,.97,1],[1,1,0]);
  const hintOpacity = useTransform(scrollYProgress,[0,.08,.22],[1,1,0]);

  return <section ref={section} className={`${styles.sequence} ${reduced?styles.reduced:''}`} aria-label='From a 1990s office computer into its desktop'>
    <div ref={stage} className={styles.stage}>
      <div className={styles.scene}>
        <motion.img className={styles.office} src='/enterprise-ai/office-crt.webp' width='1536' height='1024' alt='A beige 1990s CRT computer on a wooden office desk' draggable={false} style={{width:imageWidth,height:imageHeight,left:imageLeft,top:imageTop,scale:cameraScale,x:cameraX,y:cameraY,transformOrigin:`${imageWidth*(GLASS.left+GLASS.width/2)}px ${imageHeight*(GLASS.top+GLASS.height/2)}px`,opacity:roomOpacity}}/>
        <motion.div className={styles.aperture} style={{left:apertureX,top:apertureY,width:apertureW,height:apertureH,borderRadius:curvature}}>
          <motion.div className={styles.liveDesktop} inert={!interactive} style={{width,height,x:'-50%',y:'-50%',scaleX:contentScaleX,scaleY:contentScaleY,pointerEvents:interactive?'auto':'none'}}>
            <ClutteredDesktop embedded />
          </motion.div>
          <motion.div className={styles.glass} aria-hidden='true' style={{opacity:glassOpacity}}/>
        </motion.div>
      </div>
      <motion.p className={styles.scrollHint} style={{opacity:reduced?0:hintOpacity}}>Every company has a desktop like this.<span>Scroll to take a closer look ↓</span></motion.p>
    </div>
  </section>;
}
