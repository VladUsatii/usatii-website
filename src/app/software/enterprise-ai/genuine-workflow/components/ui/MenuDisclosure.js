"use client";
import { ChevronDown } from "lucide-react";
import { Children, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useDismissibleLayer } from "../dashboard/useDismissibleLayer.js";
export default function MenuDisclosure({children,className,showChevron=false}) {
 const reduce=useReducedMotion();
 const [open,setOpen]=useState(false),root=useDismissibleLayer(open,()=>setOpen(false));
 const [summary,...content]=Children.toArray(children);
 return <div ref={root} className={className}><button {...summary.props} type="button" aria-haspopup="menu" aria-expanded={open} onClick={event=>{summary.props.onClick?.(event);if(!event.defaultPrevented)setOpen(!open);}}>{summary.props.children}{showChevron&&<motion.span className="ml-2 inline-flex text-neutral-400" animate={{rotate:open?180:0}} transition={{duration:reduce?0:.14}}><ChevronDown size={13}/></motion.span>}</button><AnimatePresence>{open&&<motion.div key="menu" initial={{opacity:0,y:reduce?0:-4}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reduce?0:-3}} transition={{duration:reduce?0:.14}} onClick={event=>{if(event.target.closest('button')&&!event.target.closest('[data-selector-trigger]')&&!event.target.closest('[role="combobox"]'))setOpen(false);}}>{content}</motion.div>}</AnimatePresence></div>;
}
