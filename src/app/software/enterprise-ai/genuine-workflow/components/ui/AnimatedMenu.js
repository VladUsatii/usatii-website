"use client";
import styles from "./Selector.module.css";
import { motion, useReducedMotion } from "framer-motion";
import { useDismissibleLayer } from "../dashboard/useDismissibleLayer.js";
export default function AnimatedMenu({ref,children,onDismiss,className="",...props}) {
  const ownRef=useDismissibleLayer(Boolean(onDismiss),onDismiss),reduce=useReducedMotion();
  return <motion.div {...props} className={`${styles.actionMenu} ${className}`} ref={node=>{ownRef.current=node;if(typeof ref==='function')ref(node);else if(ref)ref.current=node;}} initial={{opacity:0,y:reduce?0:-4,scale:reduce?1:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:reduce?0:-3}} transition={{duration:reduce?0:.14}}>{children}</motion.div>;
}
