import styles from "./article.module.css";

// A shared projection keeps every building, person, and layer on the same
// 30° / 30° ground axes. The vertical axis is never skewed.
const C = Math.sqrt(3) / 2;
const project = (x, y, z = 0) => [660 + (x - y) * C, 490 + (x + y) / 2 - z];
const points = (vertices) => vertices.map(v => project(...v).join(",")).join(" ");
const plane = (x, y, z) => `matrix(${C} .5 ${-C} .5 ${project(x, y, z).join(" ")})`;

// The narrative groups the implemented customer, measurement, inventory,
// installer, commercial, workflow, and AI domains; buildings represent the
// operations those records describe, rather than additional software modules.
const layers = [
  { id: "04", name: "COORDINATE THE WORK", z: 0, color: "#ac6c29", wash: "#fcf7ef", lines: ["Review the estimate. Schedule the crew.", "Track materials and installation progress.", "People and AI work from the same records."], kind: "actions" },
  { id: "03", name: "CONNECT THE JOB", z: 100, color: "#278575", wash: "#f0f9f6", lines: ["Turn the measured scope into an estimate.", "Link materials, dates, and installers", "to the job they belong to."], kind: "relations" },
  { id: "02", name: "CAPTURE THE DETAILS", z: 200, color: "#477cab", wash: "#f1f6fc", lines: ["Save the calls, photos, and measurements.", "Keep the evidence, scope, and documents", "with the customer record."], kind: "records" },
  { id: "01", name: "START WITH THE REAL JOB", z: 300, color: "#8060a8", wash: "#f7f3fc", lines: ["A homeowner requests work.", "The office, suppliers, warehouse, and", "installers become part of the same job."], kind: "operations" },
];

function Line({ a, b, ...props }) {
  const [x1,y1] = project(...a), [x2,y2] = project(...b);
  return <line x1={x1} y1={y1} x2={x2} y2={y2} {...props} />;
}
function Face({ vertices, ...props }) { return <polygon points={points(vertices)} {...props} />; }
function Box({ x, y, z, w, d, h, fill = "white" }) {
  return <g><Face vertices={[[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]]} fill={fill} /><Face vertices={[[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]]} fill={fill} /><Face vertices={[[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]]} fill="white" /></g>;
}
function Window({ x, y, z, w = 12, h = 13, side = false }) {
  return <Face vertices={side ? [[x,y,z],[x,y+w,z],[x,y+w,z+h],[x,y,z+h]] : [[x,y,z],[x+w,y,z],[x+w,y,z+h],[x,y,z+h]]} fill="white" />;
}
function Caption({ x, y, z, children }) {
  const [px,py] = project(x,y,z);
  return <text x={px} y={py} textAnchor="middle" fontSize="8" fontFamily="monospace" letterSpacing=".5" fill="currentColor" stroke="none">{children}</text>;
}
function House({ x, y, z }) {
  const w=73,d=52,h=37,r=24;
  return <g><Box x={x} y={y} z={z} w={w} d={d} h={h} />
    <Face vertices={[[x,y,z+h],[x+w,y,z+h],[x+w,y+d/2,z+h+r],[x,y+d/2,z+h+r]]} fill="white" />
    <Face vertices={[[x,y+d,z+h],[x+w,y+d,z+h],[x+w,y+d/2,z+h+r],[x,y+d/2,z+h+r]]} fill="white" />
    <Face vertices={[[x+w,y,z+h],[x+w,y+d,z+h],[x+w,y+d/2,z+h+r]]} fill="white" />
    {[10,49].map(dx=><Window key={dx} x={x+dx} y={y+d} z={z+15} />)}
    <Window x={x+30} y={y+d} z={z} w={13} h={25} />
    <Window x={x+w} y={y+15} z={z+13} w={17} h={16} side />
    {[8,18,28].map(dz=><Line key={dz} a={[x,y+d,z+dz]} b={[x+w,y+d,z+dz]} opacity=".25" />)}
    <Caption x={x+37} y={y+d+15} z={z}>PROPERTY</Caption>
  </g>;
}
function Factory({ x,y,z }) {
  const w=85,d=55,h=27;
  return <g><Box x={x} y={y} z={z} w={w} d={d} h={h} />
    {[0,28,56].map(dx=><g key={dx}><Face vertices={[[x+dx,y,z+h],[x+dx+28,y,z+h+17],[x+dx+28,y+d,z+h+17],[x+dx,y+d,z+h]]} fill="white" /><Face vertices={[[x+dx,y+d,z+h],[x+dx+28,y+d,z+h],[x+dx+28,y+d,z+h+17]]} fill="white" /></g>)}
    <Box x={x+6} y={y+8} z={z+h+6} w={9} d={9} h={37} />
    <Box x={x+22} y={y+8} z={z+h+15} w={7} d={7} h={22} />
    {[8,29,50,71].map(dx=><Window key={dx} x={x+dx} y={y+d} z={z+9} w={8} h={10} />)}
    <Caption x={x+42} y={y+d+15} z={z}>SUPPLIER / FACTORY</Caption>
  </g>;
}
function Warehouse({ x,y,z }) {
  const w=70,d=64,h=32;
  return <g><Box x={x} y={y} z={z} w={w} d={d} h={h} />
    <Face vertices={[[x,y,z+h],[x+w/2,y,z+h+15],[x+w/2,y+d,z+h+15],[x,y+d,z+h]]} fill="white" />
    <Face vertices={[[x+w/2,y,z+h+15],[x+w,y,z+h],[x+w,y+d,z+h],[x+w/2,y+d,z+h+15]]} fill="white" />
    <Face vertices={[[x,y+d,z+h],[x+w,y+d,z+h],[x+w/2,y+d,z+h+15]]} fill="white" />
    <Window x={x+12} y={y+d} z={z} w={32} h={25} />
    {[5,10,15,20].map(v=><Line key={v} a={[x+12,y+d,z+v]} b={[x+44,y+d,z+v]} />)}
    {[10,25,40,55].map(v=><Line key={v} a={[x+w,y+v,z]} b={[x+w,y+v,z+h]} opacity=".35" />)}
    <Box x={x+52} y={y+d+3} z={z} w={14} d={11} h={12} />
    <Box x={x+54} y={y+d+5} z={z+12} w={10} d={8} h={8} />
    <Caption x={x+35} y={y+d+24} z={z}>WAREHOUSE</Caption>
  </g>;
}
function Office({ x,y,z }) {
  const w=47,d=48,h=53;
  return <g><Box x={x} y={y} z={z} w={w} d={d} h={h} />
    <Box x={x+10} y={y+11} z={z+h} w={21} d={18} h={5} />
    {[10,27,44].map(dz=><g key={dz}>{[7,27].map(dx=><Window key={dx} x={x+dx} y={y+d} z={z+dz-6} w={11} h={10} />)}{[7,27].map(dy=><Window key={dy} x={x+w} y={y+dy} z={z+dz-6} w={11} h={10} side />)}</g>)}
    <Caption x={x+24} y={y+d+16} z={z}>OFFICE</Caption>
  </g>;
}
function Installer({ x,y,z, flip=false }) {
  const [px,py]=project(x,y,z);
  return <g transform={`translate(${px} ${py}) scale(${flip?-1:1} 1)`} strokeWidth="1.05" fill="white" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="0" cy="1" rx="12" ry="4" fill="none" opacity=".25" />
    <path d="M-5 -18 L-7 -2 L-2 0 L1 -13 L5 -1 L10 -2 L5 -20" />
    <path d="M-5 -31 L5 -31 L8 -18 L-7 -18 Z" />
    <path d="M-5 -28 L-12 -18 L-9 -16 L-1 -25 M5 -29 L13 -23 L19 -29" fill="none" />
    <circle cx="0" cy="-38" r="5" />
    <path d="M-7 -39 Q-7 -47 0 -47 Q7 -47 7 -39 Z M-8 -39 H8 M0 -46 V-40" />
    <path d="M-3 -30 V-20 M3 -30 V-20 M-6 -23 H7" />
    <path d="M14 -30 L22 -32 L24 -22 L16 -20 Z" />
  </g>;
}
function Operations({ z }) {
  return <g stroke="currentColor" strokeWidth=".95" strokeLinejoin="round">
    <House x={-151} y={-85} z={z+2} />
    <Factory x={-26} y={-99} z={z+2} />
    <Office x={-136} y={38} z={z+2} />
    <Warehouse x={83} y={-3} z={z+2} />
    <Installer x={-5} y={73} z={z+2} />
    <Installer x={31} y={80} z={z+2} flip />
    <Box x={8} y={102} z={z+2} w={24} d={12} h={9} />
    <Caption x={12} y={128} z={z}>INSTALLERS</Caption>
  </g>;
}
function Record({ x,y,z,kind,label }) {
  return <g><Box x={x} y={y} z={z} w={73} d={56} h={5} />
    <g transform={plane(x+6,y+5,z+5)} fill="none" strokeWidth="1">
      {kind==="plan" ? <><path d="M5 7 H58 V39 H5 Z M28 7 V25 H58 M28 31 V39" /><path d="M3 44 H59 M3 41 V47 M59 41 V47" strokeWidth=".6" /></> : kind==="call" ? <>{[8,15,22,29,36,43,50].map((v,i)=><path key={v} d={`M${v} ${23-[6,12,8,18,13,6,10][i]/2} v${[6,12,8,18,13,6,10][i]}`} />)}<path d="M6 40 H56" strokeWidth=".5" /></> : <><path d="M12 3 H46 L55 12 V44 H12 Z M46 3 V12 H55 M20 20 H45 M20 27 H45 M20 34 H37" /></>}
    </g><Caption x={x+36} y={y+69} z={z}>{label}</Caption>
  </g>;
}
function Relationship({ x,y,z,label }) {
  return <g><Box x={x} y={y} z={z} w={73} d={50} h={8} /><g transform={plane(x+7,y+9,z+8)} fill="none"><rect x="3" y="4" width="18" height="21" /><rect x="40" y="4" width="18" height="21" /><path d="M21 14 H40 M28 10 L32 14 L28 18" /><path d="M7 10 H16 M7 16 H16 M44 10 H53 M44 16 H53" opacity=".5" /></g><Caption x={x+36} y={y+67} z={z}>{label}</Caption></g>;
}
function Action({ x,y,z,kind,label }) {
  return <g><Box x={x} y={y} z={z} w={73} d={54} h={5} /><g transform={plane(x+8,y+4,z+5)} fill="none">
    {kind==="calendar"?<><rect x="6" y="5" width="48" height="37" /><path d="M6 15 H54 M16 0 V10 M44 0 V10" />{[0,1,2].map(i=><path key={i} d={`M${14+i*14} 23 h5 M${14+i*14} 33 h5`} />)}</>:kind==="materials"?<><rect x="8" y="14" width="40" height="27" /><path d="M8 14 L18 4 H58 L48 14 M48 41 L58 31 V4 M28 14 V41 M8 28 H48" /></>:<><path d="M10 3 H49 V43 H10 Z M19 14 H39 M19 22 H34 M21 32 L27 38 L40 27" /></>}
    </g><Caption x={x+36} y={y+69} z={z}>{label}</Caption></g>;
}
function Layer({ layer }) {
  const {z,color,wash,kind}=layer;
  return <g style={{color}} stroke={color} strokeWidth=".85" strokeLinejoin="round">
    <Face vertices={[[-180,120,z],[180,120,z],[180,120,z-8],[-180,120,z-8]]} fill={wash} />
    <Face vertices={[[180,-120,z],[180,120,z],[180,120,z-8],[180,-120,z-8]]} fill={wash} />
    <Face vertices={[[-180,-120,z],[180,-120,z],[180,120,z],[-180,120,z]]} fill={wash} />
    {[-60,60].map(x=><Line key={x} a={[x,-120,z]} b={[x,120,z]} opacity=".16" />)}
    <Line a={[-180,0,z]} b={[180,0,z]} opacity=".16" />
    <Line a={[-140,75,z+1]} b={[145,75,z+1]} strokeDasharray="3 4" opacity=".6" />
    {kind==="operations"?<Operations z={z} />:kind==="records"?<>{[["call","CALLS & PHOTOS"],["plan","MEASUREMENTS"],["document","SCOPE & FILES"]].map(([type,label],i)=><Record key={label} x={-159+i*120} y={45} z={z+1} kind={type} label={label} />)}</>:kind==="relations"?<>{["CUSTOMER → SCOPE","SCOPE → ESTIMATE","MATERIALS → JOB"].map((label,i)=><Relationship key={label} x={-159+i*120} y={45} z={z+1} label={label} />)}</>:<>{[["check","REVIEW & APPROVE"],["calendar","SCHEDULE CREWS"],["materials","TRACK MATERIALS"]].map(([type,label],i)=><Action key={label} x={-159+i*120} y={45} z={z+1} kind={type} label={label} />)}</>}
  </g>;
}
export default function OntologyModel() {
  return <figure className={styles.ontologyModel}><svg viewBox="0 0 1120 675" role="img" aria-labelledby="usatii-model-title usatii-model-description">
    <title id="usatii-model-title">Usatii for Construction: the real job, its records, its relationships, and the work that follows</title>
    <desc id="usatii-model-description">A 30-degree isometric wireframe shows a house, supplier factory, office, warehouse, and installers on a violet operations layer. Below, blue records capture calls, photos, measurements, and scope. Teal relationships connect the customer, estimate, materials, and job. The amber action layer represents reviewing estimates, scheduling crews, and tracking materials.</desc>
    <g stroke="#b9b9b9" strokeWidth=".65" strokeDasharray="3 5" fill="none">{[[-180,-120],[180,-120],[-180,120],[180,120]].map(([x,y])=><Line key={`${x}-${y}`} a={[x,y,-8]} b={[x,y,300]} />)}</g>
    {layers.map(layer=><Layer key={layer.id} layer={layer} />)}
    {layers.map(({id,name,z,color,lines})=>{const [x,y]=project(-180,120,z);return <g key={id} fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"><path d={`M${x} ${y} H354 L335 ${y-16} H25`} stroke={color} strokeWidth=".8" fill="none" /><circle cx={x} cy={y} r="2" fill={color} /><text x="25" y={y-29} fill={color} fontSize="12.5" letterSpacing=".35">{id} / {name}</text>{lines.map((line,i)=><text key={line} x="25" y={y+4+i*16} fill="#555b62" fontSize="11">{line}</text>)}</g>;})}
  </svg></figure>;
}
