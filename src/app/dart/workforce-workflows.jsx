'use client';
import {Label,Paper,Book,State,Gate,Wire,WorkflowFigure} from './workflow-primitives';

function Request(){return <>
 <Paper x={35} y={40} title="Position request" detail="Names published version"/>
 <Wire d="M210 100H295"/><State x={345} y={100} label="Pending" detail="No task book yet" color="#ac6c29"/>
 <Wire d="M420 100H510"/><Gate x={605} y={103} label="Different administrator approves?"/>
 <Wire d="M700 103H785" label="Approve" x={742} y={77}/><Book x={790} y={48} title="Task book opens" detail="Keeps assigned version"/>
 <Wire d="M605 170V320H455" label="Return" x={552} y={255}/><State x={375} y={320} label="Returned" detail="Person may resubmit" color="#477cab"/>
 <Wire d="M375 305V235H245V100H332" dashed/>
 <Wire d="M635 166V505" label="Deny" x={679} y={400}/><State x={635} y={525} label="Denied" detail="Decision stays saved" color="#ac6c29"/>
 <Label x={220} y={515} size={16}>Staff can also assign books directly</Label>
 <Label x={220} y={575} size={14} color="#666">Opening a book does not award a credential</Label>
 </>;}
function Evidence(){return <>
 <Paper x={30} y={35} title="Task observation" detail="Narrative + observed date"/>
 <Wire d="M205 98H300"/><Gate x={395} y={100} label="Different evaluator verifies?"/>
 <Wire d="M490 100H600" label="Verify" x={543} y={75}/><State x={660} y={100} label="Verified task evidence" detail="One required task"/>
 <Wire d="M395 167V245H125" label="Return" x={333} y={218}/><State x={110} y={245} label="New evidence" detail="Old review is preserved" color="#ac6c29"/>
 <Wire d="M110 233V175" dashed/>
 <Wire d="M660 205V285"/><Gate x={660} y={355} label="All tasks and training current?"/>
 <Wire d="M565 355H400" label="Yes: submit" x={481} y={328}/><Paper x={220} y={291} title="Submitted packet" detail="Saved evidence snapshot" color="#8060a8"/>
 <Wire d="M305 425V510H535"/><Gate x={630} y={515} label="Certifier approves after recheck?"/>
 <Wire d="M725 515H805" label="Approve" x={764} y={490}/><Paper x={810} y={451} title="Active credential" detail="Expiry within saved rules" color="#278575"/>
 <Label x={280} y={610} size={15} max={50} color="#666">Returned packets can be corrected; denied books need a new attempt</Label>
 </>;}
function Availability(){return <>
 <Label x={500} y={35} size={18}>Example: change part of an approved interval</Label>
 <path d="M90 112H910M90 103V121M910 103V121" stroke="#8c9992" fill="none"/>
 <Label x={90} y={86} size={15}>Day 1</Label><Label x={910} y={86} size={15}>Day 10</Label>
 <path d="M90 145H910V195H90Z" stroke="#278575" fill="#f7fbf9"/>
 <Label x={500} y={176} max={55} color="#278575">Approved Available: days 1–10</Label>
 <Paper x={160} y={265} title="Change request" detail="Days 4–6: Unavailable" width={190}/>
 <Wire d="M355 327H470"/><Gate x={565} y={330} label="Different supervisor approves?"/>
 <Wire d="M565 398V455" label="Yes" x={607} y={432}/>
 <path d="M90 470H330V525H90Z M340 470H660V525H340Z M670 470H910V525H670Z" stroke="#8c9992" fill="white"/>
 <Label x={210} y={503} color="#278575">Days 1–3: Available</Label><Label x={500} y={503} color="#ac6c29">Days 4–6: Unavailable</Label><Label x={790} y={503} color="#278575">Days 7–10: Available</Label>
 <Label x={500} y={585} size={16}>The earlier interval becomes Superseded</Label>
 <Label x={500} y={643} size={15} max={65} color="#666">A request for days 2–8 is blocked by the approved unavailable dates</Label>
 </>;}
function Readiness(){return <>
 <Paper x={35} y={225} title="Requested work" detail="Position version + dates + zone" width={190}/>
 <Wire d="M230 289H280V60H335"/><Wire d="M280 188H335"/><Wire d="M280 289V316H335"/><Wire d="M280 316V444H335"/>
 {[
 ['Credential','Active for the whole period'],
 ['Required training','Verified, valid, current source'],
 ['Availability','Fresh approved dates; no gaps'],
 ['Rules and linked records','Effective rules; no hidden conflict'],
 ].map(([label,detail],i)=><g key={label}><State x={350} y={60+i*128} label={label} detail={detail}/><Wire d={`M550 ${60+i*128}H650`}/></g>)}
 <path d="M655 60V444" stroke="#8c9992" fill="none"/>
 <Wire d="M655 252H705"/><Gate x={800} y={252} label="All readiness checks pass?"/>
 <Wire d="M800 320V400H850V475" label="Yes" x={842} y={372}/><State x={850} y={495} label="Meets requirements" detail="No order issued"/>
 <Wire d="M710 270H685V565H540" label="No" x={649} y={529}/><State x={445} y={565} label="Not confirmed" detail="Shows each blocking reason" color="#ac6c29"/>
 </>;}
function Renewal(){return <>
 <Paper x={35} y={45} title="Earlier credential" detail="Saved award and history"/>
 <Wire d="M210 108H310" label="Start renewal" x={259} y={82}/><Book x={315} y={50} title="New task-book cycle" detail="Latest current rules"/>
 <Wire d="M490 108H590"/><Paper x={595} y={45} title="New evidence" detail="No copied task sign-offs"/>
 <Wire d="M680 180V300H545"/><Gate x={450} y={303} label="Renewal approved and prior eligible?"/>
 <Wire d="M450 371V425H245V475"/><Wire d="M450 425H745V475"/>
 <Paper x={150} y={485} title="Old: Superseded" detail="Original decision retained" width={190} color="#8060a8"/>
 <Paper x={650} y={485} title="New: Active" detail="Linked to earlier credential" width={190} color="#278575"/>
 <Label x={500} y={675} size={15} max={65} color="#666">A denied book uses a separate repeat attempt under its saved rules</Label>
 </>;}
function Mentoring(){return <>
 <Paper x={35} y={35} title="Mentor assignment" detail="Two people + goals + dates" width={190}/>
 <Wire d="M230 100H320V65H405"/><Wire d="M320 100V330H405"/>
 <Paper x={410} y={15} title="Meeting note" detail="Person or assigned mentor" width={190}/>
 <Paper x={410} y={270} title="Mentor review" detail="Assigned mentor only" width={190} color="#8060a8"/>
 <Label x={800} y={70} color="#278575">Past time within assignment</Label><Label x={800} y={130} size={14} color="#666">The same time check applies to both records</Label>
 <Wire d="M605 335H755" label="Correct latest review" x={679} y={305}/><Paper x={760} y={270} title="New review" detail="Earlier review stays linked" width={190} color="#8060a8"/>
 <Wire d="M130 170V495H300"/><Gate x={395} y={500} label="End before saved meeting or review?"/>
 <Wire d="M490 500H700" label="Yes" x={592} y={474}/><State x={780} y={500} label="End blocked" detail="Preserve recorded dates" color="#ac6c29"/>
 <Label x={395} y={635} size={15} max={60} color="#666">Extending an ended relationship needs a new assignment</Label>
 </>;}
function Plan(){return <>
 <Paper x={30} y={40} title="Draft plan" detail="Dated goals + milestones"/>
 <Wire d="M205 100H290" label="Person submits" x={245} y={75}/><State x={350} y={100} label="In review"/>
 <Wire d="M420 100H510"/><Gate x={605} y={103} label="Different reviewer approves?"/>
 <Wire d="M700 103H820" label="Approve" x={759} y={77}/><State x={875} y={103} label="Approved" detail="Progress can start"/>
 <Wire d="M605 170V265H130V183" label="Return: edit planned work" max={40} x={370} y={243} dashed/>
 <Wire d="M875 215V350H740"/><Paper x={565} y={286} title="Reported done" detail="All milestone reports done" color="#8060a8"/>
 <Wire d="M650 420V495H495"/><Gate x={400} y={498} label="Different reviewer checks evidence?"/>
 <Wire d="M400 566V610H700" label="Each goal Verified" x={558} y={588}/><State x={780} y={610} label="Plan can close" detail="Reviewer closes it"/>
 <Label x={230} y={665} size={15} max={35} color="#666">Progress reports do not award training or credentials</Label>
 </>;}
function Evaluation(){return <>
 <Paper x={30} y={40} title="Supervision period" detail="Deployment + assigned reviewer" width={190}/>
 <Wire d="M225 104H330"/><Gate x={425} y={107} label="Required supervision time reached?"/>
 <Wire d="M520 107H650" label="Yes" x={584} y={80}/><Paper x={655} y={40} title="Review obligation" detail="Assigned supervisor writes" width={190}/>
 <Wire d="M750 180V270H800V315"/><Paper x={705} y={325} title="Private draft" detail="Original form + all ratings" width={190} color="#8060a8"/>
 <Wire d="M700 390H520" label="Submit" x={611} y={365}/><Paper x={325} y={325} title="Submitted review" detail="Visible to permitted readers" width={190} color="#278575"/>
 <Wire d="M420 460V550H800V460" label="Correction: new draft; old submitted version stays" max={45} x={610} y={590} dashed/>
 <Label x={270} y={260} size={15} max={36} color="#666">The review period stays inside the supervisor’s dates</Label>
 </>;}
const scenes={
 'workforce-request':[Request,665,'A position request needs a different administrator’s approval before its version-pinned task book opens. Returning or denying the request does not award a qualification.'],
 'workforce-evidence':[Evidence,690,'Task evidence is reviewed before the packet is submitted. The certifier then checks current tasks and training again before awarding a dated credential.'],
 'workforce-availability':[Availability,710,'An approved change replaces only the selected dates. In this example, the unavailable middle days prevent confirmation for any assignment that overlaps them.'],
 'workforce-readiness':[Readiness,720,'Readiness checks the requested period against the credential, required training, availability, and applicable rules. It returns blocking reasons and does not issue a deployment order.'],
 'workforce-renewal':[Renewal,730,'Renewal opens a new task-book cycle under current rules. Only an approved award replaces the earlier credential; starting the renewal does not replace it.'],
 'workforce-mentoring':[Mentoring,695,'Meetings and mentor reviews share the assignment’s dates but have different authors. Review corrections keep earlier versions, and ending the relationship cannot cut off saved observations.'],
 'workforce-plan':[Plan,760,'Plan approval opens progress reporting. Every milestone must be reported done, and a different reviewer must verify each goal’s matching evidence before the plan can close.'],
 'workforce-evaluation':[Evaluation,660,'A qualifying supervision period creates a review obligation. Submitting shares the saved review with permitted readers; a correction starts a private draft while preserving the earlier submission.'],
};
export default function WorkforceWorkflow({kind}){
 const entry=scenes[kind];if(!entry)return null;const[Scene,height,caption]=entry;
 return <WorkflowFigure caption={caption} height={height}><Scene/></WorkflowFigure>;
}
