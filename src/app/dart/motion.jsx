'use client';
import {motion,useReducedMotion} from 'framer-motion';
import {Link2} from 'lucide-react';
import styles from './dart.module.css';
export function SectionHeading({id,children}) {
 const reduced=useReducedMotion();
 return <h2><motion.a href={`#${id}`} initial="rest" whileHover="active" whileFocus="active"><span>{children}</span><motion.span className={styles.headingAnchor} aria-hidden="true" variants={{rest:{opacity:0,x:-4},active:{opacity:1,x:0}}} transition={{duration:reduced?0:.16}}><Link2 size={16}/></motion.span></motion.a></h2>;
}
export function FigureReveal({children,className}) {
 const reduced=useReducedMotion();
 return <motion.figure className={className} initial={reduced?false:{opacity:0,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.45}}>{children}</motion.figure>;
}
