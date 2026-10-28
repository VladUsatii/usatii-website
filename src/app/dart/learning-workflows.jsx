'use client';
import {Label,Paper,Book,State,Gate,Wire,WorkflowFigure} from './workflow-primitives';

const captions={
 'learn-course-versions':'Classes A and B keep course version 1. A changed lesson creates a new course draft; publication makes version 2 available for a later class.',
 'learn-admissions':'Submitting an application does not reserve a seat. Required approvals and funding are checked before the configured selection and capacity rules are applied.',
 'learn-assessment-gates':'A completed starting check opens the other work even when its score is below the pass mark. A final test waits for the other required work. Ordinary lessons have their own completion rules.',
 'learn-scorm-review':'A package’s completion report is saved as progress. The DART lesson remains Opened until a different, eligible assigned instructor checks it and any required attendance.',
 'learn-practice-retry':'A failed result starts the practice path. Only an approved instructor review of the learner’s practice report adds an extra attempt.',
 'learn-grade-correction':'Removing the last passing grade reopens the lesson. If course work becomes incomplete, verified credit receives a Rejected revision. Restoring credit needs a separate administrator review.',
 'learn-credit-basis':'All required lesson IDs and versions must be complete. The native workflow saves one credit award with its evidence and a Verified training record.',
 'learn-certification-review':'The certificate file is checked before Pending review. Only permitted state changes are shown. Expired records cannot be verified or restored; renewal is a new linked record.',
 'learn-transcript-evidence':'The transcript combines three kinds of evidence without merging their meanings. In the example, a Verified training row can still be Expired and have a Stale source.',
};
function CourseVersions(){return <>
 <Book x={45} y={70} title="Published course v1" detail="Names lesson versions"/>
 <Wire d="M220 120H385V72H440"/><Wire d="M385 120V248H440"/>
 <Paper x={440} y={20} title="Class A" detail="Uses course v1"/><Paper x={440} y={195} title="Class B" detail="Uses course v1"/>
 <Label x={780} y={110} color="#278575">Earlier class work stays on v1</Label><Label x={780} y={166} size={14} color="#666">No link redirects it to v2</Label>
 <path d="M35 374H965" stroke="#e8e8e8"/>
 <Paper x={45} y={425} title="Changed lesson" detail="New lesson version"/>
 <Wire d="M220 486H335" label="Following course" x={275} y={460}/>
 <Paper x={340} y={425} title="Course v2 draft" detail="Review new references" color="#ac6c29"/>
 <Wire d="M515 486H655" label="Publish" x={585} y={460}/>
 <Book x={665} y={436} title="Published course v2" detail="Available for a later class" color="#278575"/>
 </>;}
function Admissions(){return <>
 <Paper x={25} y={45} title="Application draft" detail="No enrollment or seat"/>
 <Wire d="M200 104H260" label="Submit" x={230} y={83}/><Paper x={265} y={45} title="Submitted record" detail="Saved policy and forms"/>
 <Wire d="M440 104H485"/><Gate x={578} y={108} label="Required decisions complete?"/>
 <Wire d="M670 108H780" label="Yes" x={723} y={87}/><Paper x={785} y={45} title="Seat selection" detail="Configured policy + capacity" color="#278575"/>
 <Wire d="M578 173V288" label="Not yet" x={635} y={235}/><State x={578} y={310} label="Requested or awaiting funding" detail="Does not open lessons" color="#ac6c29"/>
 <Wire d="M870 178V310H810V400" label="Selected + open seat" x={820} y={280}/><State x={810} y={420} label="Enrolled" detail="Rechecked at use"/>
 <Wire d="M950 178V565H445" label="Not selected or full" x={840} y={604}/><State x={430} y={565} label="Waitlisted" detail="No lesson access" color="#477cab"/>
 <Wire d="M430 553V420H285V300H375V181" label="Seat opens: recheck application" x={235} y={355} dashed/>
 </>;}
function AssessmentGates(){return <>
 <Paper x={20} y={220} title="Starting check" detail="If configured: save attempt" width={150}/>
 <Wire d="M175 284H210"/><Gate x={305} y={284} label="Starting check completed?"/>
 <Label x={116} y={410} size={14} color="#666">A low score still satisfies this gate</Label>
 <Wire d="M400 284H435V43H477"/><Wire d="M435 157H477"/><Wire d="M435 271H477"/><Wire d="M435 385H477"/><Wire d="M435 284V499H477"/>
 {[['Reading','Learner marks read'],['Quiz','Passing result'],['Assignment','Instructor scores rubric'],['Live','Instructor + attendance'],['SCORM 1.2','Saved report + instructor']].map(([a,b],i)=><g key={a}><State x={490} y={43+i*114} label={a} detail={b}/><Wire d={`M505 ${43+i*114}H707`}/></g>)}
 <path d="M710 43V499" stroke="#8c9992" fill="none"/>
 <Wire d="M710 284H755"/><Gate x={850} y={284} label="All other required work complete?"/>
 <Wire d="M850 350V464"/><Paper x={770} y={478} title="Final test" detail="If configured: must pass" width={165}/>
 </>;}
function ScormReview(){return <>
 <Book x={35} y={55} title="SCORM lesson" detail="Runs in sandboxed player"/>
 <Wire d="M210 110H320" label="Save / resume" x={265} y={85}/><Paper x={325} y={48} title="Player report" detail="Reports passed or completed"/>
 <Wire d="M500 110H730" label="Saves progress only" x={615} y={84}/><State x={790} y={110} label="DART lesson: Opened" detail="Needs review" color="#ac6c29"/>
 <Wire d="M410 183V330H530"/>
 <Paper x={535} y={274} title="Instructor check" detail="Different eligible person" color="#8060a8"/>
 <Wire d="M710 340H747"/><Gate x={840} y={340} label="Report and attendance ready?"/>
 <Wire d="M840 404V504" label="Yes" x={880} y={455}/><State x={840} y={525} label="Lesson: Completed" detail="Other course work still checked"/>
 <Label x={250} y={452} color="#666">A package report does not award credit</Label>
 </>;}
function PracticeRetry(){return <>
 <Paper x={30} y={45} title="Failed assessment" detail="Keeps original result"/>
 <Wire d="M205 107H300"/><Book x={305} y={50} title="Assigned reading" detail="Instructor adds instructions"/>
 <Wire d="M480 107H565"/><Paper x={570} y={45} title="Learner report" detail="Reports completed practice"/>
 <Wire d="M745 107H780"/><Gate x={875} y={110} label="Instructor approves retry?"/>
 <Wire d="M875 175V360" label="Yes" x={920} y={260}/><State x={875} y={385} label="One extra attempt" detail="Original pass rule still applies"/>
 <Wire d="M780 135H765V330H560" label="No" x={713} y={302}/><Book x={375} y={320} title="Follow-up practice" detail="New link to declined review" color="#ac6c29"/>
 <Wire d="M460 315V265H650V183" dashed label="New report and review" x={560} y={242}/>
 <Wire d="M875 490V565H170V183" label="Retry the original quiz or assignment" x={500} y={596}/>
 </>;}
function GradeCorrection(){return <>
 <Paper x={35} y={40} title="Saved grade" detail="Original rubric + pass mark"/>
 <Wire d="M210 102H305"/><Paper x={310} y={40} title="Corrected grade" detail="Reason + earlier grade link" color="#8060a8"/>
 <Wire d="M485 102H650"/><Gate x={745} y={105} label="Passing grade remains?"/>
 <Wire d="M840 105H900V265" label="Yes" x={920} y={185}/><State x={900} y={290} label="Lesson stays complete"/>
 <Wire d="M745 173V275H490" label="No" x={686} y={225}/><State x={405} y={275} label="Lesson: Opened" detail="Recheck whole course" color="#ac6c29"/>
 <Wire d="M405 370V442"/><Paper x={320} y={450} title="Credit: Rejected" detail="If course became incomplete" color="#ac6c29"/>
 <Wire d="M495 514H690" label="Later passing work" x={593} y={482} dashed/><Paper x={700} y={450} title="Credit review" detail="Different course administrator" color="#278575"/>
 <Label x={735} y={624} size={14} color="#666">A passing correction does not restore credit by itself</Label>
 </>;}
function CreditBasis(){return <>
 <Label x={500} y={35} size={18}>The exact required lesson IDs and versions</Label>
 {['Reading complete','Quiz complete','Assignment complete','Live / SCORM checked'].map((t,i)=><Paper key={t} x={40+i*240} y={75} title={t} detail="Saved progress record" width={190}/>)}
 {[135,375,615,855].map(x=><Wire key={x} d={`M${x} 210V262H500V282`}/>)}
 <Gate x={500} y={350} label="Every required version completed?"/>
 <Wire d="M410 350H215" label="No: continue work" x={286} y={325}/><State x={155} y={350} label="No credit yet" color="#ac6c29"/>
 <Wire d="M500 416V455H345V490"/><Wire d="M500 455H745V490"/>
 <Paper x={250} y={500} title="Credit + saved basis" detail="Course, policy, class, progress" width={190} color="#278575"/>
 <Paper x={650} y={500} title="Verified training" detail="Enrollment becomes Completed" width={190} color="#278575"/>
 <Label x={500} y={675} size={14} color="#666">One native award per enrollment; no automatic position qualification</Label>
 </>;}
function CertificationReview(){return <>
 <Paper x={30} y={45} title="Certificate + details" detail="Person’s file; hash checked"/>
 <Wire d="M205 107H285"/><State x={345} y={107} label="Pending" detail="Not verified evidence" color="#ac6c29"/>
 <Wire d="M420 107H510"/><Gate x={605} y={110} label="Different certifier verifies?"/>
 <Wire d="M700 110H790" label="Yes" x={746} y={88}/><State x={870} y={110} label="Verified" detail="Dates and file checked"/>
 <Wire d="M605 174V305" label="Reject" x={657} y={242}/><State x={605} y={330} label="Rejected" color="#ac6c29"/>
 <Wire d="M870 215V330" label="Suspend" x={812} y={278}/><State x={870} y={355} label="Suspended" color="#477cab"/>
 <Wire d="M900 348H975V110H905" dashed/><Label x={950} y={253} size={14} max={10} color="#666">Restore if valid</Label>
 <Wire d="M870 455V530H675" label="Revoke" x={800} y={512}/><Wire d="M820 120H750V500H675" label="Revoke" x={710} y={430}/>
 <State x={605} y={530} label="Revoked" detail="No direct restore transition" color="#ac6c29"/>
 <Label x={250} y={528} color="#666">Renewal creates a new Pending record</Label><Label x={250} y={588} size={14} color="#666">Old evidence stays until the new review</Label>
 </>;}
function TranscriptEvidence(){return <>
 <Paper x={35} y={45} title="Course training" detail="Source ID + revision" width={200}/><Paper x={400} y={45} title="Outside certification" detail="Issuer + certificate number" width={200}/><Paper x={765} y={45} title="Qualification credential" detail="Local decision and dates" width={200}/>
 <Wire d="M135 180V235H500V280"/><Wire d="M500 180V280"/><Wire d="M865 180V235H500"/>
 <Book x={415} y={295} title="Combined transcript" detail="Kinds and history kept distinct"/>
 <Wire d="M500 490V535H170V560"/><Wire d="M500 535V560"/><Wire d="M500 535H830V560"/>
 <State x={170} y={575} label="Status: Verified" detail="Review decision"/>
 <State x={500} y={575} label="Dates: Expired" detail="Validity period" color="#ac6c29"/>
 <State x={830} y={575} label="Source: Stale" detail="Feed freshness" color="#477cab"/>
 <Label x={500} y={715} size={14} color="#666">An example external training row can have all three properties</Label>
 </>;}
const scenes={
 'learn-course-versions':[CourseVersions,650],
 'learn-admissions':[Admissions,730],
 'learn-assessment-gates':[AssessmentGates,690],
 'learn-scorm-review':[ScormReview,670],
 'learn-practice-retry':[PracticeRetry,650],
 'learn-grade-correction':[GradeCorrection,680],
 'learn-credit-basis':[CreditBasis,730],
 'learn-certification-review':[CertificationReview,670],
 'learn-transcript-evidence':[TranscriptEvidence,760],
};
export default function LearningWorkflow({kind}){
 const entry=scenes[kind];if(!entry)return null;const[Scene,height]=entry;
 return <WorkflowFigure caption={captions[kind]} height={height}><Scene/></WorkflowFigure>;
}
