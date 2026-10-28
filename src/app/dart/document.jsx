import Link from 'next/link';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import {dartPages,dartGroups,dartHref} from '@/lib/dart/content';
import {dartRequirements,requirementGroups} from '@/lib/dart/requirements';
import guides from '@/lib/dart/guides.json';
import {DartNavigation} from './navigation';
import DartDiagram from './diagrams';
import GuideLibrary from './guide-library';
import styles from './dart.module.css';
import LinkedText from './linked-text';
import {SectionHeading} from './motion';
import EvaluationResults from './evaluation-results';
const navPages=dartPages.map(({slug,group,title,description,sections})=>({slug,group,title,description,href:dartHref(slug),sections:sections.map(({id,title})=>({id,title}))}));
function Requirements() {return <div className={styles.requirements}>{requirementGroups.map(([prefix,title])=><div key={prefix} id={`requirement-${prefix.replace('.','-')}`}><h3><span>{prefix}</span> {title}</h3>{dartRequirements.filter(([id])=>id.startsWith(`${prefix}.`)).map(([id,name,slug,description])=><div className={styles.requirement} key={id}><span>{id}</span><div><Link href={dartHref(slug)}>{name}</Link><p>{description}</p></div></div>)}</div>)}</div>;}
export default function DartDocument({page}) {
 const index=dartPages.findIndex(p=>p.slug===page.slug),previous=dartPages[index-1],next=dartPages[index+1];
 return <div className={styles.root}><Header/><a className={styles.skipLink} href="#dart-content">Skip to DART content</a><div className={styles.layout} id="dart-top">
   <DartNavigation pages={navPages} groups={dartGroups} current={page.slug}/>
   <main id="dart-content" className={styles.main}>
    <header className={styles.pageHeader}><h1>{page.slug?page.title:"Overview"}</h1><p>{page.description}</p></header>
    <article className={styles.article}>{page.sections.map(section=><section key={section.id} id={section.id} className={styles.section}>
      <SectionHeading id={section.id}>{section.title}</SectionHeading>
      {section.paragraphs.map((p,i)=><p key={i}><LinkedText text={p} current={page.slug}/></p>)}
      {section.evaluation&&<EvaluationResults kind={section.evaluation}/>}
      {section.diagram&&<DartDiagram kind={section.diagram}/>}
      {section.table&&<div className={styles.tableScroll}><table><thead><tr>{section.table.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{section.table.rows.map(([a,b])=><tr key={a}><th scope="row">{a}</th><td>{b}</td></tr>)}</tbody></table></div>}
      {section.requirements&&<Requirements/>}
      {section.guideLibrary&&<GuideLibrary guides={guides}/>}
    </section>)}</article>
    <nav className={styles.pagination} aria-label="Documentation pages">{previous?<Link href={dartHref(previous.slug)}><span><small>Previous</small>{previous.title}</span></Link>:<span/>}{next&&<Link href={dartHref(next.slug)}><span><small>Next</small>{next.title}</span></Link>}</nav>
   </main>
  </div><Footer/></div>;
}
