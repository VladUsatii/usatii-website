'use client';
import {Label,Paper,Book,State,Gate,Wire,WorkflowFigure} from './workflow-primitives';

function Setup(){return <>
 <Paper x={25} y={30} title="Template version" detail="Coordinator saves setup"/>
 <Wire d="M200 92H285"/><Gate x={380} y={95} label="Different approver approves?"/>
 <Wire d="M475 95H605"/><Book x={610} y={40} title="Approved template" detail="Version stays with draft"/>
 <Wire d="M695 248V285H115V330"/>
 <Paper x={30} y={340} title="Incident draft" detail="Save dates, then submit"/>
 <Wire d="M205 404H335"/><Gate x={430} y={407} label="Different setup approver approves?"/>
 <Wire d="M525 407H705" label="Author still authorized" max={30} x={614} y={380}/>
 <Paper x={710} y={343} title="Planned incident" detail="No deployment orders" width={200} color="#278575"/>
 <Wire d="M810 480V530H200V555"/><Wire d="M500 530V555"/><Wire d="M810 530V555"/>
 <State x={200} y={570} label="Remote station" detail="UTC reporting location"/>
 <State x={500} y={570} label="Named units" detail="Assigned supervisor"/>
 <State x={810} y={570} label="Virtual staffing needs" detail="Separate positions to fill"/>
 </>;}
function TeamNeeds(){return <>
 <Book x={30} y={40} title="Team template v1" detail="Positions and equipment"/>
 <Wire d="M205 100H325"/><Paper x={330} y={35} title="Team request" detail="Keeps template v1" width={190}/>
 <Wire d="M525 100H585V310H650"/><Wire d="M585 310V530H650"/>
 <Paper x={655} y={245} title="Leader need" detail="Example: quantity 1" width={190} color="#8060a8"/>
 <Paper x={655} y={465} title="Member need" detail="Example: quantity 2" width={190}/>
 <Wire d="M850 310H910"/><State x={935} y={310} label="1 slot"/>
 <Wire d="M850 530H885V490H920"/><Wire d="M885 530V610H920"/>
 <State x={935} y={490} label="Slot 2"/><State x={935} y={610} label="Slot 3"/>
 <Label x={270} y={325} size={18} max={30}>Each need names its qualification version</Label>
 <Label x={270} y={410} size={15} max={33} color="#666">Specialties are checked separately</Label>
 <Label x={270} y={520} size={18} max={30}>Accepted orders add members</Label>
 <Label x={270} y={600} size={15} max={33} color="#666">A saved team request does not assign people or issue equipment</Label>
 </>;}
function Resource(){return <>
 <Paper x={30} y={40} title="Submitted request" detail="Need, quantity, reason" width={190}/>
 <Wire d="M225 104H315"/><Gate x={410} y={107} label="Different reviewer approves?"/>
 <Wire d="M505 107H650"/><State x={715} y={107} label="Approved" detail="Request decision saved"/>
 <Wire d="M715 210V290H385" label="No supporting agency" max={30} x={538} y={267}/>
 <Wire d="M800 120H900V320" label="Supporting agency named" max={30} x={790} y={251}/>
 <Paper x={805} y={335} title="Agency acceptance" detail="Separate agency reference" width={190} color="#8060a8"/>
 <Wire d="M900 470V525H535"/><Wire d="M380 290V510"/>
 <State x={380} y={530} label="Request authority ready" detail="Candidate checks can proceed"/>
 <Label x={300} y={380} size={15} max={34} color="#666">Agency-backed approval also needs a mission authorization reference</Label>
 <Label x={500} y={695} size={15} max={65} color="#666">Neither approval nor acceptance selects or deploys a responder</Label>
 </>;}
function IncidentClose(){return <>
 <State x={100} y={60} label="Planned"/><Wire d="M115 60H335" label="Start incident" x={225} y={35}/>
 <State x={350} y={60} label="Active"/><Wire d="M365 60H585" label="Wind down" x={476} y={35}/>
 <State x={600} y={60} label="Winding down"/>
 <Wire d="M600 150V220H350V112" label="Response grows: return to Active" max={40} x={475} y={202} dashed/>
 <Wire d="M615 60H800V305"/>
 <State x={220} y={340} label="Deployments Completed"/>
 <State x={220} y={480} label="No open orders" detail="Draft through Issued block closure"/>
 <Wire d="M430 340H650V370H705"/><Wire d="M430 480H650V370"/>
 <Gate x={800} y={375} label="All open work resolved?"/>
 <Wire d="M800 443V555" label="Yes" x={846} y={510}/><State x={800} y={575} label="Closed" detail="Automatic due jobs paused"/>
 <Label x={330} y={675} size={15} max={50} color="#666">The incident and its decisions remain in history</Label>
 </>;}
function Candidate(){return <>
 <Paper x={25} y={260} title="Saved staffing slot" detail="Person + dates + station" width={190}/>
 <Wire d="M220 324H245V65H350"/><Wire d="M245 324H350"/><Wire d="M245 324V575H350"/>
 <State x={365} y={65} label="Readiness + specialties" detail="Whole-period requirements"/>
 <State x={365} y={325} label="Schedule + policy limits" detail="Orders, classes, time away"/>
 <State x={365} y={575} label="Request authority" detail="Approval or agency acceptance"/>
 <Wire d="M530 65H600V250H645"/><Wire d="M530 325H600"/><Wire d="M530 575H600V250"/>
 <Gate x={740} y={250} label="Any failed check or hard block?"/>
 <Wire d="M835 250H925V90" label="Yes" x={919} y={205}/><State x={925} y={65} label="Not eligible" color="#ac6c29"/>
 <Wire d="M740 318V435" label="No" x={777} y={390}/><Gate x={740} y={505} label="Allowed overlap remains?"/>
 <Wire d="M835 505H900V605" label="Yes" x={921} y={567}/><State x={900} y={625} max={18} label="Needs overlap approval" color="#ac6c29"/>
 <Wire d="M645 505H565V700" label="No" x={603} y={560}/><State x={565} y={720} label="Eligible"/>
 </>;}
function Ranking(){return <>
 <Paper x={30} y={35} title="Station visits" detail="Actual time in the period" width={190}/>
 <Paper x={30} y={260} title="Past-time entries" detail="Latest non-void revisions" width={190}/>
 <Wire d="M225 100H280V215H350"/><Wire d="M225 325H280V215"/>
 <Gate x={445} y={215} label="Complete history confirmed?"/>
 <Wire d="M445 283V470" label="No" x={488} y={385}/><State x={445} y={490} label="Unranked" detail="Missing is not zero" color="#ac6c29"/>
 <Wire d="M540 215H650" label="Yes" x={591} y={190}/><Paper x={655} y={150} title="Eligible group" detail="Only Eligible gets a rank" width={200} color="#278575"/>
 <Wire d="M755 290V380"/><Paper x={655} y={395} title="Approved method" detail="Less time or longer since" width={200} color="#8060a8"/>
 <Wire d="M755 535V625"/><State x={755} y={645} label="Ranked candidates" detail="Fixed slot draw breaks ties"/>
 <Label x={240} y={650} size={15} max={35} color="#666">Overlapping actual time is counted once</Label>
 </>;}
function SelectionReview(){return <>
 <Paper x={35} y={35} title="Displayed comparison" detail="Facts the approver reviewed" width={210}/>
 <Paper x={385} y={35} title="Current comparison" detail="Recomputed checks + history" width={210}/>
 <Wire d="M140 180V260H300V290"/><Wire d="M490 180V260H300"/>
 <Gate x={300} y={360} label="Same displayed comparison?"/>
 <Wire d="M395 360H650" label="Yes: separate approval" max={30} x={525} y={334}/><Paper x={655} y={295} title="Approval saved" detail="Binds facts and revision" width={200} color="#278575"/>
 <Wire d="M205 360H95V520" label="No" x={145} y={335}/><State x={95} y={540} label="Refresh and review" color="#ac6c29"/>
 <Wire d="M755 435V510"/><Gate x={755} y={580} label="Approval still matches?"/>
 <Label x={755} y={493} size={14} color="#666">At issue and acceptance</Label>
 <Wire d="M660 580H455" label="No" x={555} y={555}/><State x={360} y={580} label="New revision + review" color="#ac6c29"/>
 <Wire d="M850 580H920V685" label="Yes" x={913} y={640}/><State x={920} y={705} label="May proceed"/>
 </>;}
function Trainee(){return <>
 <Book x={30} y={40} title="Open task book" detail="Position + saved version"/>
 <Wire d="M205 100H305"/><Gate x={400} y={103} label="Different approver authorizes?"/>
 <Wire d="M495 103H650"/><Paper x={655} y={40} title="Trainee duties" detail="Dates + eligible supervisor" width={200} color="#8060a8"/>
 <Wire d="M755 180V335H650V365"/>
 <Paper x={80} y={370} title="Other checks" detail="Training, dates, conflicts" width={200}/>
 <Wire d="M285 435H555"/><Gate x={650} y={435} label="All other checks pass?"/>
 <Wire d="M745 435H860V565" label="Yes" x={858} y={510}/><State x={860} y={585} label="Training order path" detail="Not a qualification award"/>
 <Label x={340} y={610} size={16} max={40}>Only the main qualification reason is set aside</Label>
 </>;}
function OrderLifecycle(){return <>
 <State x={90} y={60} label="Draft" detail="Choice + comparison saved"/>
 <Wire d="M105 60H345" label="Submit; recheck" x={225} y={35}/><State x={360} y={60} label="Submitted"/>
 <Wire d="M375 60H685" label="Different approver + current comparison" max={45} x={530} y={35}/><State x={700} y={60} label="Approved"/>
 <Wire d="M715 60H900V270" label="Issue; recheck" x={819} y={212}/><State x={900} y={290} label="Issued" detail="Notice asks for a reply"/>
 <Wire d="M810 290H625V395"/><Gate x={625} y={465} label="Reply to initial offer"/>
 <Wire d="M530 465H220" label="Decline" x={377} y={439}/><State x={145} y={465} label="Declined" detail="Initial offer only" color="#ac6c29"/>
 <Wire d="M625 533V600" label="Accept + recheck" max={30} x={743} y={576}/><Paper x={530} y={615} title="Accepted revision" detail="Deployment + checks created" width={200} color="#278575"/>
 <Label x={225} y={720} size={15} max={35} color="#666">Notice delivery does not accept an order</Label>
 </>;}
function Extension(){return <>
 <Book x={30} y={35} title="Accepted revision 1" detail="Continues to govern the deployment"/>
 <path d="M340 100H930" fill="none" stroke="#278575" strokeWidth="2"/>
 <Label x={630} y={75} size={18} max={50} color="#278575">Earlier accepted dates stay in force</Label>
 <Paper x={280} y={290} title="Draft revision 2" detail="Extension; same start + station" width={200}/>
 <Wire d="M485 355H575"/><State x={625} y={355} label="Review and issue" detail="New checks and approval"/>
 <Wire d="M725 355H755"/><Gate x={850} y={355} label="Responder accepts revision 2?"/>
 <Wire d="M945 355H975V255H115V245" label="Decline: keep revision 1" max={35} x={535} y={235} dashed/>
 <Wire d="M850 423V545" label="Accept" x={901} y={498}/><Paper x={750} y={560} title="Accepted revision 2" detail="Extended dates now apply" width={200} color="#278575"/>
 <Label x={345} y={650} size={15} max={40} color="#666">A completed deployment cannot be extended</Label>
 </>;}
function Visits(){return <>
 <State x={100} y={60} label="Accepted"/><Wire d="M115 60H385" label="Start travel" x={250} y={35}/><State x={400} y={60} label="Traveling"/>
 <Wire d="M415 60H735" label="Check in at planned station" max={35} x={575} y={35}/><State x={750} y={60} label="Active" detail="One open station visit"/>
 <Label x={295} y={205} size={15} max={47} color="#666">Direct check-in from Accepted is also supported</Label>
 <Wire d="M750 175V300" label="Check out" x={820} y={250}/><Gate x={750} y={370} label="End plan saved?"/>
 <Wire d="M655 370H300V510" label="No: close visit and continue travel" max={45} x={465} y={344}/><State x={300} y={530} label="Traveling" detail="May check in at next planned station"/>
 <Wire d="M750 438V510" label="Yes" x={800} y={490}/><State x={750} y={530} label="Returning" detail="Finish checks still apply"/>
 <Label x={470} y={695} size={15} max={65} color="#666">A planned move is not an arrival; a time correction cannot open or close a visit</Label>
 </>;}
function Demobilize(){return <>
 <Paper x={650} y={20} title="End plan + checkout" detail="Separate recorded actions" width={220}/>
 <Wire d="M875 85H930V210"/><State x={930} y={230} label="Returning"/>
 {[
 'All end steps closed',
 'Opened daily checks settled',
 'Outstanding equipment cleared',
 'Return confirmed if required',
 'Reviews submitted if required',
 'Order on accepted revision',
 ].map((label,n)=><g key={label}><State x={240} y={55+n*115} label={label}/><Wire d={`M445 ${55+n*115}H600`}/></g>)}
 <path d="M605 55V630" stroke="#8c9992" fill="none"/><Wire d="M605 400H670"/>
 <Wire d="M930 325V300H765V337"/><Gate x={765} y={405} label="All completion checks pass?"/>
 <Wire d="M765 473V640" label="Yes" x={810} y={570}/><State x={765} y={660} label="Completed" detail="Close supervision; cancel future checks"/>
 </>;}
const scenes={
 'ops-incident-setup':[Setup,760,'The template path reviews the template and incident setup separately. Setup approval creates a Planned incident and its initial records, without issuing orders.'],
 'ops-team-needs':[TeamNeeds,740,'This example team needs one leader and two members. The saved template version creates three staffing slots; people join only through their accepted orders.'],
 'ops-resource-authority':[Resource,755,'A request backed by another agency needs both approval and agency acceptance. A request without a supporting agency needs approval before linked candidate checks can proceed.'],
 'ops-incident-close':[IncidentClose,730,'Winding down can return to Active. Closing requires completed deployments and no open orders; the closed incident keeps its history and pauses its due-item jobs.'],
 'ops-candidate-check':[Candidate,820,'Readiness, specialties, authority, and scheduling are checked together. A hard block produces Not eligible; only a permitted overlap can proceed to separate approval.'],
 'ops-history-ranking':[Ranking,790,'Actual visits and saved past-time entries support history review. Only eligible people with confirmed history are ranked by the approved method; missing history stays unranked.'],
 'ops-selection-review':[SelectionReview,800,'Approval binds the comparison displayed to the approver. Issue and acceptance check that the approved facts and comparison still match before allowing the next step.'],
 'ops-trainee-gate':[Trainee,740,'Dated trainee authority permits the main qualification exception for a Training deployment. Current training, availability, specialties, and scheduling checks still apply.'],
 'ops-order-lifecycle':[OrderLifecycle,805,'For an initial offer, review, issue, and responder acceptance are separate steps. Acceptance creates the deployment against the accepted revision, with its daily checks and end steps.'],
 'ops-extension':[Extension,770,'A proposed extension follows a new review and reply cycle while the earlier accepted dates stay in force. A declined extension leaves the earlier acceptance intact.'],
 'ops-visit-path':[Visits,770,'Actual check-in opens a visit. Checkout returns the deployment to Traveling unless an end plan exists, in which case it moves to Returning and still needs completion checks.'],
 'ops-demobilize':[Demobilize,825,'Checkout after an end plan is only the start of return closure. All required checks must pass before Completed; the order end date alone does not complete the deployment.'],
};
export default function OperationsWorkflow({kind}){
 const entry=scenes[kind];if(!entry)return null;const[Scene,height,caption]=entry;
 return <WorkflowFigure height={height} caption={caption}><Scene/></WorkflowFigure>;
}
