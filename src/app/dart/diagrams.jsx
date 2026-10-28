import styles from './dart.module.css';

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
const screenRows = {
  personnel: [['DART person ID', 'Stable identifier'], ['Workforce source', 'Linked by source ID'], ['Position assignment', 'Dated and versioned'], ['Correction', 'Earlier value retained']],
  learning: [['Course', 'Published version'], ['Admission', 'Eligibility reviewed'], ['Instructor', 'Credential checked'], ['Class times', 'Changes confirmed']],
  selection: [['Position requirement', 'Published definition'], ['Qualification evidence', 'Current for interval'], ['Available dates', 'Checked against need'], ['Selection reason', 'Saved with decision']],
  communications: [['Notice', 'Related work linked'], ['Email / text', 'Provider receipt saved'], ['Acknowledgment', 'Person action saved'], ['Written response', 'Reply history retained']],
};
function Box({x,y,w=204,title,subtitle}) { return <g><rect x={x} y={y} width={w} height="76" fill="white" stroke="#a4b1ad"/><path d={`M${x} ${y}v76`} stroke="#318275" strokeWidth="3"/><text x={x+16} y={y+30} className={styles.svgTitle}>{title}</text><text x={x+16} y={y+53} className={styles.svgSmall}>{subtitle}</text></g>; }
function Arrow({x1,y1,x2,y2}) { const end=x2-6; return <g fill="none" stroke="#83968e" strokeWidth="1.2"><path d={`M${x1} ${y1}L${end} ${y2}`}/><path d={`M${end-5} ${y2-4}l5 4-5 4`}/></g>; }
export default function DartDiagram({kind}) {
  const data=diagrams[kind]; if(!data) return null;
  const [type,title,labels,caption]=data;
  return <figure className={styles.figure}><div className={styles.figureScroll}><svg viewBox="0 0 1000 380" role="img" aria-label={`${title}. ${caption}`} className={styles.diagram}>
    <rect x=".5" y=".5" width="999" height="379" fill="#f7f9f8" stroke="#dce4df"/>
    <path d="M0 47h1000" stroke="#dce4df"/><text x="22" y="29" className={styles.svgTitle}>{title}</text>
    {type==='flow' && <>
      {labels.map((label,i)=><g key={label}><text x={46+i*240} y="111" className={styles.svgNumber}>{String(i+1).padStart(2,'0')}</text><Box x={40+i*240} y={135} w={200} title={label} subtitle={['Defined input','Current rules','Saved evidence','Saved result'][i]}/>{i<3&&<Arrow x1={240+i*240} y1={173} x2={280+i*240} y2={173}/>}</g>)}
      <path d="M60 256h880" stroke="#bccdc4" strokeDasharray="4 5"/><text x="40" y="295" className={styles.svgSmall}>SCOPED ACCESS</text><text x="280" y="295" className={styles.svgSmall}>RECORD VERSIONS</text><text x="520" y="295" className={styles.svgSmall}>ACTOR + REASON</text><text x="760" y="295" className={styles.svgSmall}>RETAINED HISTORY</text>
    </>}
    {type==='model' && <>
      <g fill="none" stroke="#b6c8bd" strokeWidth="1.2"><path d="M250 128H385M615 128H750M250 278H385M615 278H750M135 166v74M500 166v74M865 166v74M250 128L385 278M615 128L750 278"/></g>
      {labels.map((label,i)=><Box key={label} x={20+(i%3)*365} y={i<3?90:240} w={230} title={label} subtitle={['Identity and source','Evidence and its version','Dates and requirements','Operational context','Saved decision','Saved history'][i]}/>)}
    </>}
    {type==='timeline' && <>
      <path d="M65 158h870" stroke="#98b2a5"/>{labels.map((label,i)=><g key={label}><circle cx={65+i*173} cy="158" r="6" fill="white" stroke="#318275" strokeWidth="2"/><text x={65+i*173} y="126" textAnchor="middle" className={styles.svgNumber}>{String(i+1).padStart(2,'0')}</text><text x={65+i*173} y="194" textAnchor="middle" className={styles.svgTitle}>{label}</text><path d={`M${65+i*173} 215v35`} stroke="#d2ddd6"/></g>)}
      <rect x="35" y="264" width="930" height="64" fill="white" stroke="#d3dfd7"/><text x="55" y="289" className={styles.svgTitle}>Decision history</text><text x="55" y="310" className={styles.svgSmall}>Source facts → saved rules → actor and reason → event time → prior versions</text>
    </>}
    {type==='screen' && <>
      <rect x="24" y="69" width="952" height="288" fill="white" stroke="#cdd9d2"/><path d="M24 110h952M664 110v247" stroke="#d7e1da"/><text x="44" y="95" className={styles.svgTitle}>Operational record</text><text x="692" y="95" className={styles.svgSmall}>REVIEW BASIS</text>
      {(screenRows[kind]||[]).map(([a,b],i)=><g key={a}><path d={`M44 ${166+i*52}h594`} stroke="#e3e9e5"/><text x="44" y={146+i*52} className={styles.svgTitle}>{a}</text><text x="285" y={146+i*52} className={styles.svgSmall}>{b}</text></g>)}
      {labels.map((label,i)=><g key={label}><rect x="692" y={132+i*48} width="7" height="7" fill="none" stroke="#318275"/><text x="710" y={140+i*48} className={styles.svgTitle}>{label}</text><path d={`M710 ${152+i*48}h${160-i*19}`} stroke="#d4dfd8"/></g>)}
    </>}
    {type==='boundary' && <>
      <rect x="265" y="75" width="470" height="257" fill="#eff5f1" stroke="#92afa0" strokeDasharray="5 5"/><text x="285" y="102" className={styles.svgSmall}>CONTROLLED SYSTEM BOUNDARY</text>
      <Box x={20} y={169} w={215} title={labels[0]} subtitle="Known sign-in identity"/><Arrow x1={235} y1={207} x2={285} y2={207}/><Box x={285} y={126} w={430} title={labels[1]} subtitle="Scope • policy • record version"/><path d="M500 202v25" stroke="#83968e"/><Box x={285} y={227} w={430} title={labels[2]} subtitle="Protected records • retained events"/><Arrow x1={735} y1={207} x2={765} y2={207}/><Box x={765} y={169} w={215} title={labels[3]} subtitle="Approved access"/>
    </>}
  </svg></div><figcaption>{caption}</figcaption></figure>;
}
