'use client';
import {motion,useReducedMotion} from 'framer-motion';
import articleStyles from '@/app/news/introducing-usatii-for-construction/article.module.css';
import {FigureReveal} from './motion';
import styles from './dart.module.css';
const suites=[['Service',56],['HTTP',21],['PostgreSQL',4],['Browser',7]];
export default function EvaluationResults({kind}){
 const reduced=useReducedMotion();
 if(kind!=='checks')return null;
 return <FigureReveal className={`${articleStyles.performance} ${styles.resultFigure}`}>
  <h3>Integration checks across four layers.</h3>
  <div className={articleStyles.plotLegend}><span><i style={{background:'#2868b2'}}/>Passed checks</span></div>
  <motion.svg initial={reduced?false:"hidden"} whileInView="visible" viewport={{once:true}} viewBox="0 0 680 415" role="img" aria-label="October 16, 2026 focused evaluation: 56 service checks, 21 HTTP checks, 4 PostgreSQL checks, and 7 browser checks passed. No failures in these final focused runs.">
   {[0,14,28,42,56].map(n=><g key={n}><line x1="72" x2="630" y1={350-n/56*270} y2={350-n/56*270} stroke={n===0?'#333':'#ececec'}/><text x="58" y={354-n/56*270} textAnchor="end">{n}</text></g>)}
   <line x1="72" x2="72" y1="65" y2="350" stroke="#333"/>
   {suites.map(([name,count],i)=><g key={name}><motion.rect x={105+i*136} width="62" y={350-count/56*270} height={count/56*270} fill="#2868b2" variants={{hidden:{scaleY:0},visible:{scaleY:1}}} style={{originY:1}} transition={{duration:.7,delay:i*.08}}/><text x={136+i*136} y={338-count/56*270} textAnchor="middle">{count}</text><text x={136+i*136} y="376" textAnchor="middle">{name}</text></g>)}
   <text transform="translate(18 215) rotate(-90)" textAnchor="middle">Checks passed</text>
  </motion.svg>
  <div className={articleStyles.plotResult}><strong>88 passed</strong><span>Final focused runs · October 16, 2026</span><a href="/dart/evaluation-results.json">Read the saved results</a></div>
  <figcaption>Counts describe separate test layers. They are not user-capacity or speed measurements.</figcaption>
 </FigureReveal>;
}
