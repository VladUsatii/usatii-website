'use client';
import {motion,useReducedMotion} from 'framer-motion';
import {FigureReveal} from './motion';
import styles from './dart.module.css';
import LearningWorkflow from './learning-workflows';

const diagrams = {
  platform: ['model', 'A connected operational record', ['Personnel', 'Qualifications', 'Availability', 'Incident needs', 'Deployment', 'Accountability'], 'Evidence and dates connect the workforce to the incident, accepted deployment, and field record.'],
  relationships: ['model', 'The incident and workforce model', ['Person', 'Task book', 'Training', 'Incident', 'Order revision', 'Station visit'], 'Each record keeps its own ID and history. Links show how the work connects.'],
  personnel: ['screen', 'Personnel / record inspection', ['Source identifier', 'Employment', 'Position', 'History'], 'The person record connects dated workforce facts to their source and correction history.'],
  readiness: ['flow', 'Readiness over a requested interval', ['Position requirements', 'Verified evidence', 'Dates and conflicts', 'Explained result'], 'The assessment checks evidence against the requirement and dates. The result retains reasons, not just a status.'],
  development: ['flow', 'Development and qualification progress', ['Development plan', 'Mentoring', 'Learning evidence', 'Reviewed progress'], 'Goals, mentoring, and course evidence support a reviewed development record. Certification remains a separate decision.'],
  learning: ['screen', 'Learning / class administration', ['Course version', 'Admission review', 'Instructor', 'Sessions'], 'Class administration connects the saved course basis, admitted learners, qualified instructors, and schedule.'],
  assessment: ['flow', 'Learning and assessment', ['Published lesson', 'Learner work', 'Score and review', 'Course credit'], 'Required work and reviewed results determine completion. Corrections preserve the earlier grading evidence.'],
  training: ['model', 'Training evidence and qualification', ['Course result', 'External certificate', 'Verified training', 'Transcript', 'Qualification', 'Readiness'], 'Course and external evidence contribute to the transcript and readiness through their own review and validity rules.'],
  incident: ['model', 'Incident structure', ['Incident', 'Duty station', 'Staffing need', 'Team template', 'Accepted order', 'Supervisor'], 'Incident needs, stations, team requirements, accepted work, and supervision form the operational structure.'],
  selection: ['screen', 'Staffing / compare responders', ['Qualifications', 'Available dates', 'Specialties', 'Past deployments'], 'Candidate comparison exposes the conditions behind eligibility before the selection and reason are saved.'],
  deployment: ['timeline', 'From staffing need to return home', ['Select', 'Review', 'Accept', 'Travel', 'Daily checks', 'Return'], 'The order is independently reviewed and accepted before field work. End steps, checkout, and equipment are reconciled before completion.'],
  accountability: ['flow', 'Accountability is a responder action', ['Check becomes due', 'Notice is delivered', 'Responder replies', 'Supervisor follows up'], 'Provider delivery is separate from a person’s reply. Missing responses and approved exceptions remain visible.'],
  location: ['timeline', 'Physical visits and virtual assignments', ['Travel', 'Station A', 'Time away', 'Station B', 'Checkout', 'Rest'], 'Location reporting keeps physical and virtual time separate and counts overlapping visits once.'],
  equipment: ['timeline', 'Equipment custody and readiness', ['Available', 'Issue', 'Held', 'Return', 'Inspect', 'Available'], 'Return and inspection are distinct steps. Missing items and loss review retain their deployment hold until resolved.'],
  planning: ['model', 'One workforce, competing incident needs', ['Workforce snapshot', 'Policy version', 'Incident A', 'Incident B', 'Staffing result', 'Saved comparison'], 'Scenarios evaluate competing demand against the same workforce facts and retain the policy and input basis.'],
  report: ['flow', 'A reproducible operational report', ['Scope and filters', 'Authorized build', 'Saved file and hash', 'Checked download'], 'The report keeps the rules and source records used to build it. DART checks access during the build and again on download.'],
  integration: ['flow', 'Check source data before saving', ['Capture original', 'Map and validate', 'Independent review', 'Apply and reconcile'], 'Staff can review the original input and any conflicts. Saved reviews and receipts show what happened next.'],
  studio: ['model', 'Connected data becomes operational work', ['Source API', 'Mapped record', 'Typed links', 'Operational page', 'Rule', 'Task or notice'], 'Published connected data links to real DART records. Reviewed rules can create tasks and notices from source changes.'],
  access: ['boundary', 'Check access before acting', ['Federated identity', 'Current permissions', 'Record protection', 'Allowed operation'], 'Before allowing an action, the server checks who is asking and what they may do. It also checks the record’s protection rules.'],
  communications: ['screen', 'Communications / delivery and response', ['Conversation', 'Provider receipt', 'Acknowledgment', 'Reply history'], 'Delivery evidence, conversation history, and a person’s response are separate records.'],
  records: ['flow', 'Protection through the record lifecycle', ['Label and scope', 'Use and export', 'Retention or hold', 'Reviewed removal'], 'Handling rules apply to use and export. Retention, holds, and approval constrain disposal.'],
  exercise: ['timeline', 'Exercise control and corrective action', ['Plan', 'Assign', 'Start', 'Release', 'Review', 'Follow up'], 'The controller releases scenarios and records results. Corrective actions are assigned and tracked before closure.'],
  offline: ['flow', 'A limited offline responder session', ['Authorized download', 'Short-lived copy', 'Queued action', 'Recheck on sync'], 'Offline arrival, availability, and acknowledgment actions are checked again when the responder reconnects.'],
  architecture: ['boundary', 'Application and service boundaries', ['Identity provider', 'DART services', 'PostgreSQL history', 'Private providers'], 'Domain services enforce the rules. The deployment configures identity, database, workers, files, and external providers.'],
  federal: ['boundary', 'The agency deployment boundary', ['Agency identity', 'Application controls', 'Approved services', 'Assessment evidence'], 'Hosting, identity, data handling, operations, and assessment evidence are defined for the selected agency system.'],
  migration: ['flow', 'A staged legacy transition', ['Map and cleanse', 'Pilot and compare', 'Controlled coexistence', 'Cutover and reconcile'], 'Each phase retains source identity and reconciliation evidence. Rollback and authoritative writers are defined before activation.'],
};
// Shared 30-degree projection, matching the construction article's wireframes.
const C=Math.sqrt(3)/2;
const project=(x,y,z=0)=>[600+(x-y)*C,550+(x+y)/2-z];
const vertices=points=>points.map(v=>project(...v).join(',')).join(' ');
function Face({points,...props}){return <polygon points={vertices(points)} {...props}/>;}
function Line({a,b,...props}){const [x1,y1]=project(...a),[x2,y2]=project(...b);return <line x1={x1} y1={y1} x2={x2} y2={y2} {...props}/>;}
function Solid({x,y,z=0,w=52,d=38,h=48}){return <g><Face points={[[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]]} fill="white"/><Face points={[[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]]} fill="white"/><Face points={[[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]]} fill="white"/></g>;}
function Person({x,y,z=0}){const [px,py]=project(x,y,z);return <g transform={`translate(${px} ${py})`} fill="white"><ellipse cx="0" cy="2" rx="15" ry="6" fill="none" opacity=".25"/><circle cx="0" cy="-49" r="8"/><path d="M-13-13v-17q0-11 13-11t13 11v17M-8-13v13M8-13v13M-3-28v14M3-28v14" fill="none"/></g>;}
function Station({x,y,z=0}){return <g><Solid x={x} y={y} z={z} w={90} d={56} h={49}/><Face points={[[x-5,y-4,z+49],[x+95,y-4,z+49],[x+95,y+28,z+76],[x-5,y+28,z+76]]} fill="white"/><Face points={[[x-5,y+60,z+49],[x+95,y+60,z+49],[x+95,y+28,z+76],[x-5,y+28,z+76]]} fill="white"/>{[12,59].map(dx=><Face key={dx} points={[[x+dx,y+56,z+17],[x+dx+17,y+56,z+17],[x+dx+17,y+56,z+34],[x+dx,y+56,z+34]]} fill="white"/>)}<Face points={[[x+35,y+56,z],[x+53,y+56,z],[x+53,y+56,z+31],[x+35,y+56,z+31]]} fill="white"/><Line a={[x+98,y+56,z]} b={[x+98,y+56,z+96]}/><Face points={[[x+98,y+56,z+96],[x+125,y+56,z+96],[x+125,y+56,z+79],[x+98,y+56,z+79]]} fill="white"/></g>;}
function Vehicle({x,y,z=0}){return <g><Solid x={x} y={y} z={z+9} w={85} d={38} h={28}/><Solid x={x+46} y={y+3} z={z+37} w={30} d={32} h={18}/>{[17,67].map(dx=>{const [px,py]=project(x+dx,y+39,z+10);return <ellipse key={dx} cx={px} cy={py} rx="8" ry="10" fill="white"/>;})}</g>;}
function Paper({x,y,z=0}){return <g>{[0,5,10].map(dz=><Face key={dz} points={[[x,y,z+dz],[x+76,y,z+dz],[x+76,y+53,z+dz],[x,y+53,z+dz]]} fill="white"/>)}{[13,23,33].map(dy=><Line key={dy} a={[x+10,y+dy,z+11]} b={[x+62,y+dy,z+11]} opacity=".45"/>)}<Line a={[x+10,y+42,z+11]} b={[x+35,y+42,z+11]} opacity=".45"/></g>;}
function Equipment({x,y,z=0}){return <g><Solid x={x} y={y} z={z} w={68} d={42} h={44}/><Line a={[x+25,y+12,z+44]} b={[x+25,y+12,z+55]}/><Line a={[x+25,y+12,z+55]} b={[x+45,y+12,z+55]}/><Line a={[x+45,y+12,z+55]} b={[x+45,y+12,z+44]}/><Line a={[x,y+42,z+22]} b={[x+68,y+42,z+22]}/><Line a={[x+34,y+42,z+8]} b={[x+34,y+42,z+36]}/></g>;}
function Server({x,y,z=0}){return <g><Solid x={x} y={y} z={z} w={55} d={46} h={100}/>{[18,42,66,90].map(dz=><g key={dz}><Line a={[x+8,y+46,z+dz]} b={[x+45,y+46,z+dz]}/><Line a={[x+8,y+46,z+dz-7]} b={[x+14,y+46,z+dz-7]}/></g>)}</g>;}
function Label({x,y,z=0,children}){const [px,py]=project(x,y,z);return <text x={px} y={py} textAnchor="middle" stroke="none" fill="currentColor" fontSize="13" fontFamily="var(--font-inter)">{children}</text>;}
const layers=[
 {z:0,color:'#ac6c29',wash:'#fcf7ef',name:'Follow the response',detail:'Orders, daily checks, and return'},
 {z:100,color:'#278575',wash:'#f0f9f6',name:'Connect the work',detail:'People, incidents, and assignments'},
 {z:200,color:'#477cab',wash:'#f1f6fc',name:'Keep the evidence',detail:'Training, qualifications, and availability'},
 {z:300,color:'#8060a8',wash:'#f7f3fc',name:'Start with the team',detail:'Responders and the places they serve'},
];
function PlatformScene(){return <>{layers.map(({z,color,wash,name,detail},index)=>{const [lx,ly]=project(-210,150,z);return <g key={z} stroke={color} strokeWidth="1.1" color={color}><Face points={[[-210,-150,z],[210,-150,z],[210,150,z],[-210,150,z]]} fill={wash}/><path d={`M${lx-12} ${ly}H30`} fill="none" opacity=".5"/><text x="24" y={ly-12} stroke="none" fill={color} fontSize="17" fontWeight="500">{name}</text><text x="24" y={ly+21} stroke="none" fill="#777" fontSize="11">{detail}</text>
 {index===3?<><Station x={-130} y={-80} z={z+2}/><Vehicle x={70} y={-75} z={z+2}/><Person x={-30} y={75} z={z+2}/><Person x={55} y={88} z={z+2}/><Person x={110} y={55} z={z+2}/></>:index===2?<><Paper x={-160} y={-72} z={z+3}/><Paper x={-30} y={-20} z={z+3}/><Paper x={95} y={-80} z={z+3}/></>:index===1?<><Line a={[-150,-50,z+3]} b={[130,80,z+3]}/><Line a={[-150,70,z+3]} b={[130,-80,z+3]}/>{[[-150,-50],[-150,70],[130,80],[130,-80]].map(([x,y],i)=><Person key={i} x={x} y={y} z={z+3}/>)}</>:<><Line a={[-150,-70,z+3]} b={[145,70,z+3]}/><Paper x={-165} y={-90} z={z+4}/><Equipment x={95} y={35} z={z+4}/></>}
 </g>;})}</>;}
function WorkScene({labels,kind,type}){
 const boundary=type==='boundary',timeline=type==='timeline';
 const floorZ=35;
 const positions=labels.map((_,i)=>timeline?[-255+i*100,0]:labels.length>4?[-210+(i%3)*210,i<3?-110:110]:[[-170,-80],[100,-80],[100,100],[-170,100]][i]);
 return <g strokeWidth="1.1" stroke="#547e8e" color="#477cab">
  <Face points={[[-315,-170,floorZ],[315,-170,floorZ],[315,180,floorZ],[-315,180,floorZ]]} fill="#f7fafc" stroke="#d4dfe5"/>
  {boundary&&<Face points={[[-215,-130,floorZ+2],[230,-130,floorZ+2],[230,140,floorZ+2],[-215,140,floorZ+2]]} fill="none" stroke="#8060a8" strokeDasharray="5 5"/>}
  {positions.slice(1).map(([x,y],i)=><Line key={i} a={[...positions[i],floorZ+3]} b={[x,y,floorZ+3]} stroke="#278575" strokeDasharray={timeline?undefined:'4 4'}/>)}
  {positions.map(([x,y],i)=><g key={i} stroke={['#8060a8','#477cab','#278575','#ac6c29'][i%4]} color={['#8060a8','#477cab','#278575','#ac6c29'][i%4]}>
   {boundary?(i===0?<Person x={x+25} y={y+25} z={floorZ}/>:i===1?<Station x={x-25} y={y} z={floorZ}/>:i===2?<Server x={x} y={y} z={floorZ}/>:<Paper x={x-20} y={y} z={floorZ}/>):kind==='equipment'?(i%2===0?<Equipment x={x} y={y} z={floorZ}/>:<Person x={x+25} y={y+25} z={floorZ}/>):timeline?(i===3||kind==='location'&&i===0?<Vehicle x={x-25} y={y} z={floorZ}/>:i===0||i===labels.length-1?<Station x={x-25} y={y} z={floorZ}/>:<Person x={x+25} y={y+25} z={floorZ}/>):i%2===0?<Paper x={x-15} y={y} z={floorZ}/>:<Person x={x+25} y={y+25} z={floorZ}/>}
   <Label x={x+28} y={y+62} z={floorZ-12}>{labels[i]}</Label>
  </g>)}
 </g>;
}
export default function DartDiagram({kind}){
 const reduced=useReducedMotion();if(kind.startsWith('learn-'))return <LearningWorkflow kind={kind}/>;const data=diagrams[kind];if(!data)return null;
 const [type,title,labels,caption]=data,overview=kind==='platform'||kind==='relationships';
 return <FigureReveal className={styles.figure}><svg viewBox={overview?'0 0 1000 820':'130 220 940 610'} role="img" aria-label={title} className={styles.diagram}>
  <title>{title}</title><desc>{caption}</desc>
  <motion.g initial={reduced?false:{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:.7}}>{overview?<PlatformScene/>:<WorkScene kind={kind} type={type} labels={labels}/>}</motion.g>
 </svg><figcaption>{caption}</figcaption></FigureReveal>;
}
