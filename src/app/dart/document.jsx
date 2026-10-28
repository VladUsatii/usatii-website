import Link from 'next/link';
import Header from '@/app/_components/header';
import Footer from '@/app/_components/footer';
import {dartPages,dartGroups,dartHref} from '@/lib/dart/content';
import {dartRequirements,requirementGroups} from '@/lib/dart/requirements';
import guides from '@/lib/dart/guides.json';
import {DartNavigation,DartContents} from './navigation';
import DartDiagram from './diagrams';
import GuideLibrary from './guide-library';
import styles from './dart.module.css';
import LinkedText from './linked-text';
const navPages=dartPages.map(({slug,group,title,description})=>({slug,group,title,description,href:dartHref(slug)}));
function Requirements() {return <div className={styles.requirements}>{requirementGroups.map(([prefix,title])=><div key={prefix} id={`requirement-${prefix.replace('.','-')}`}><h3><span>{prefix}</span> {title}</h3>{dartRequirements.filter(([id])=>id.startsWith(`${prefix}.`)).map(([id,name,slug,description])=><div className={styles.requirement} key={id}><span>{id}</span><div><Link href={dartHref(slug)}>{name}</Link><p>{description}</p></div></div>)}</div>)}</div>;}
export default function DartDocument({page}) {
 const index=dartPages.findIndex(p=>p.slug===page.slug),previous=dartPages[index-1],next=dartPages[index+1];
 const toc=page.sections.map(({id,title})=>({id,title}));
 return <div className={styles.root}><Header/><a className={styles.skipLink} href="#dart-content">Skip to DART content</a><div className={styles.layout} id="dart-top">
   <DartNavigation pages={navPages} groups={dartGroups} current={page.slug}/>
   <main id="dart-content" className={styles.main}>
    <header className={styles.pageHeader}><h1>{page.title}</h1><p>{page.description}</p>{!page.slug&&<div className={styles.headerActions}><Link href="/quote-request">Request a demonstration </Link><Link href="/dart/requirements">Explore federal capabilities </Link></div>}</header>
    <article className={styles.article}>{page.sections.map(section=><section key={section.id} id={section.id} className={styles.section}>
      <h2><a href={`#${section.id}`}>{section.title}</a></h2>
      {section.paragraphs.map((p,i)=><p key={i}><LinkedText text={p} current={page.slug}/></p>)}
      {section.diagram&&<DartDiagram kind={section.diagram}/>}
      {section.table&&<div className={styles.tableScroll}><table><thead><tr>{section.table.headers.map(h=><th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{section.table.rows.map(([a,b])=><tr key={a}><th scope="row">{a}</th><td>{b}</td></tr>)}</tbody></table></div>}
      {section.requirements&&<Requirements/>}
      {section.guideLibrary&&<GuideLibrary guides={guides}/>}
    </section>)}</article>
    <nav className={styles.pagination} aria-label="Documentation pages">{previous?<Link href={dartHref(previous.slug)}><span><small>Previous</small>{previous.title}</span></Link>:<span/>}{next&&<Link href={dartHref(next.slug)}><span><small>Next</small>{next.title}</span></Link>}</nav>
   </main><DartContents sections={toc}/>
  </div><Footer/></div>;
}
