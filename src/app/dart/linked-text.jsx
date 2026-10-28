import Link from 'next/link';
import {dartHref} from '@/lib/dart/content';
import {dartReferences} from '@/lib/dart/references';
import {dartGlossary} from '@/lib/dart/glossary';
import DefinedTerm from './defined-term';

const topics = [
 ['evaluation',['evaluation results','saved evaluation records']],
 ['core-concepts',['source identifiers','effective time','recorded time']],
 ['personnel',['personnel records','personnel batches','personnel record','source identifier','person links']],
 ['readiness',['Position Task Books','Position Task Book','task books','task book','readiness','qualifications','availability']],
 ['development',['development plans','development plan','mentoring','deployment evaluations']],
 ['learning-administration',['course catalog','class schedule','instructor credentials','course registration','admissions','training alerts']],
 ['learning-delivery',['online lessons','online learning','SCORM 1.2','gradebook','rubrics','assessments']],
 ['training-records',['training records','training evidence','course credit','transcript','outside certifications']],
 ['incidents',['incident setup','incident structure','duty stations','incident templates','team templates','force packages','resource requests']],
 ['staffing',['responder selection','staffing decision','staffing needs','staffing need','selection rules']],
 ['deployments',['deployment orders','deployment order','accepted order','order revisions','demobilization']],
 ['accountability',['daily accountability','daily checks','daily check','accountability checks']],
 ['locations-rest',['location reports','rest policy','location history']],
 ['equipment',['equipment custody','equipment holds','equipment hold','loss review','equipment']],
 ['planning',['surge planning','surge simulation','decision replay','readiness forecasts','policy comparisons','planning simulations']],
 ['analytics',['saved reports','saved report','report builder','workforce history','staffing forecasts','training-needs reports']],
 ['integrations',['data exchange','source adapters','source ownership','source batches','outbound exchanges','integration health','integrations']],
 ['integration-studio',['Integration Studio','custom record types','API mappings','connected data','custom actions']],
 ['developer-tools',['read-only MCP','MCP key','domain APIs','DART commands','terminal']],
 ['communications',['email and text','audio and video','provider receipts','provider delivery','shared conversations','notifications','Chats']],
 ['security-access',['permission sets','permissions','federated sign-in','access requests','independent approval']],
 ['records-privacy',['record protection','retention schedules','retention schedule','CUI labels','private files','retention holds']],
 ['exercises',['exercise workspace','exercise plans','exercise plan','exercises']],
 ['user-experience',['offline responder','offline access','time zones','time zone','language selector']],
 ['help-support',['Help & support','in-app help','help tasks','guided help','support requests']],
 ['architecture',['application architecture','background workers','PostgreSQL','background jobs']],
 ['federal',['federal deployment','government deployment','Section 508','Authority to Operate','FedRAMP High']],
 ['implementation',['legacy migration','data migration','phased rollout','cutover','implementation']],
 ['procurement',['procurement','support agreement']],
 ['requirements',['61 capabilities','requirements index','capability index']],
];
export default function LinkedText({text,current}) {
 const terms=[...dartReferences, ...topics.filter(([slug])=>slug!==current).flatMap(([slug,phrases])=>phrases.map(phrase=>({slug,phrase})))];
 const matches=[];
 for(const term of terms){const pattern=new RegExp(`\\b${term.phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}\\b`,'ig');let match;while((match=pattern.exec(text))!==null)matches.push({...term,start:match.index,end:match.index+match[0].length});}
 matches.sort((a,b)=>a.start-b.start||(b.end-b.start)-(a.end-a.start));
 const glossary=dartGlossary.filter(([, ,pages])=>!pages||pages.includes(current));
 const usedDefinitions=new Set();let definitionKey=0;
 const definitionFor=value=>glossary.find(([phrase])=>value.toLowerCase()===phrase.toLowerCase()||value.toLowerCase()===phrase.toLowerCase()+'s');
 const define=part=>{
  const candidates=[];
  for(const [phrase,definition] of glossary){
   if(usedDefinitions.has(phrase))continue;
   const pattern=new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}s?\\b`,'ig');
   let m;while((m=pattern.exec(part))!==null)candidates.push({phrase,definition,start:m.index,end:m.index+m[0].length});
  }
  candidates.sort((a,b)=>a.start-b.start||(b.end-b.start)-(a.end-a.start));
  const output=[];let offset=0;
  for(const term of candidates){if(term.start<offset||usedDefinitions.has(term.phrase))continue;output.push(part.slice(offset,term.start),<DefinedTerm key={`term-${definitionKey++}`} definition={term.definition}>{part.slice(term.start,term.end)}</DefinedTerm>);usedDefinitions.add(term.phrase);offset=term.end;}
  output.push(part.slice(offset));return output;
 };
 const nodes=[];const used=new Set();let end=0,internalCount=0;
 for(const match of matches){
  const target=match.href||dartHref(match.slug);
  if(match.start<end||used.has(target)||(!match.href&&internalCount>=3))continue;
  nodes.push(...define(text.slice(end,match.start)));
  const value=text.slice(match.start,match.end),term=definitionFor(value);
  const style=target.startsWith('https://')?{'--source-icon':`url("https://www.google.com/s2/favicons?domain=${new URL(target).hostname}&sz=32")`}:undefined;
  if(term&&!usedDefinitions.has(term[0])){nodes.push(<DefinedTerm key={match.start} href={target} style={style} definition={term[1]}>{value}</DefinedTerm>);usedDefinitions.add(term[0]);}
  else nodes.push(<Link key={match.start} href={target} style={style}>{value}</Link>);
  end=match.end;used.add(target);if(!match.href)internalCount++;
 }
 nodes.push(...define(text.slice(end)));return nodes;
}
