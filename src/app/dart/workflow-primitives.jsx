'use client';
import {useId} from 'react';
import {FigureReveal} from './motion';
import styles from './dart.module.css';

export function Label({x,y,children,size=18,anchor='middle',color='#333',max=24}){const words=String(children).split(' '),lines=[];let line='';for(const word of words){if((line+' '+word).trim().length>max){lines.push(line);line=word;}else line=(line+' '+word).trim();}if(line)lines.push(line);return <text x={x} y={y} textAnchor={anchor} fill={color} stroke="none" fontSize={size} fontFamily="var(--font-inter)">{lines.map((l,i)=><tspan x={x} dy={i?21:0} key={i}>{l}</tspan>)}</text>;}
export function Paper({x,y,title,detail,color='#477cab',width=170}){return <g stroke={color} strokeWidth="1.3" fill="white"><path d={`M${x} ${y}h${width-18}l18 18v110H${x}Z`}/><path d={`M${x+width-18} ${y}v18h18`} fill="none"/><Label x={x+width/2} y={y+42} size={18} max={16} color={color}>{title}</Label>{detail&&<Label x={x+width/2} y={y+88} size={15} max={22} color="#666">{detail}</Label>}</g>;}
export function Book({x,y,title,detail,color='#8060a8'}){return <g stroke={color} strokeWidth="1.3" fill="white"><path d={`M${x} ${y+8}q42-18 85 0 43-18 85 0v110q-43-18-85 0-43-18-85 0Z`}/><path d={`M${x+85} ${y+8}v110`} fill="none"/><Label x={x+85} y={y+151} color={color}>{title}</Label><Label x={x+85} y={y+179} size={15} max={22} color="#666">{detail}</Label></g>;}
export function State({x,y,label,detail,color='#278575',max=24}){return <g><circle cx={x} cy={y} r="10" fill="white" stroke={color} strokeWidth="2"/><Label x={x} y={y+35} max={max} color={color}>{label}</Label>{detail&&<Label x={x} y={y+78} size={15} max={22} color="#666">{detail}</Label>}</g>;}
export function Gate({x,y,label}){return <g><path d={`M${x} ${y-62}l88 62-88 62-88-62Z`} fill="#fcfaf6" stroke="#ac6c29" strokeWidth="1.3"/><Label x={x} y={y-19} size={16} max={17} color="#805522">{label}</Label></g>;}
export function Wire({d,label,x,y,dashed=false,max=24}){return <g><path d={d} fill="none" stroke="#8c9992" strokeWidth="1.3" strokeDasharray={dashed?'5 5':undefined} markerEnd="var(--workflow-arrow)"/>{label&&<Label x={x} y={y} size={14} max={max} color="#666">{label}</Label>}</g>;}
export function WorkflowFigure({caption,children,height}){
 const id='workflow-arrow-'+useId().replaceAll(':','');
 return <FigureReveal className={styles.figure}><div className={styles.learningFigureScroll} tabIndex={0} role="region" aria-label="Workflow diagram"><svg viewBox={`0 0 1000 ${height}`} className={styles.learningWorkflow} role="img" aria-label={caption} style={{'--workflow-arrow':`url(#${id})`}}><title>{caption}</title><defs><marker id={id} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1l6 3-6 3" fill="none" stroke="#8c9992"/></marker></defs>{children}</svg></div><figcaption>{caption}</figcaption></FigureReveal>;
}
