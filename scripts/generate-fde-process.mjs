import { writeFileSync } from 'node:fs';

// Both layouts use the same process and wireframe geometry.
const stages = [
  {
    title: 'Prepare the assessment', subtitle: 'Agree on the problem and the people involved.',
    left: ['Customer team', 'Executive sponsor', 'Department representatives', 'IT · security · finance'],
    right: ['Working materials', 'Workflows · SOPs · records', 'Systems and API access', 'Task volumes and costs'],
    output: ['Assessment inputs', 'People, evidence, and approved access'],
  },
  {
    title: 'Observe the operation', subtitle: 'FDEs work alongside the customer’s departments.',
    left: ['Five dimensions', 'Workflows · data', 'Inefficiencies · business logic', 'Automation opportunities'],
    right: ['Field discovery', 'Observe work and meetings', 'Capture exceptions', 'Rotate across departments'],
    output: ['Discovery record', 'Notes, bottlenecks, and baseline measurements'],
  },
  {
    title: 'Select and scope the pilot', subtitle: 'A 60–90 minute selection with both teams.',
    left: ['Selection criteria', 'Business impact', 'Feasibility · data readiness', 'Operational risk'],
    right: ['Pilot Charter', 'Scope and exclusions', 'Data and responsibilities', 'Success criteria'],
    output: ['Agreed test', 'One priority workflow and measurable targets'],
  },
  {
    title: 'Engineer and test', subtitle: 'Build the proof of value around the agreed scope.',
    left: ['Pilot development', 'Approved test data', 'Workflow and integration', 'Human review points'],
    right: ['Evaluation', 'Compare with the baseline', 'Check critical data fields', 'Document results'],
    output: ['Working pilot', 'Software, test results, and a demonstration'],
  },
  {
    title: 'Review at the bootcamp', subtitle: 'Four hours with leadership and affected staff.',
    left: ['Demonstration', 'How the pilot was built', 'How it was tested', 'Employees use the solution'],
    right: ['Value assessment', 'Time · accuracy · costs', 'Feedback and improvements', 'Capacity and payback'],
    output: ['Joint evaluation', 'Measured value and an implementation decision'],
  },
  {
    title: 'Implement and expand', subtitle: 'Production work is scoped and priced separately.',
    left: ['Production proposal', 'Engineering and integration', 'Testing and deployment', 'Disclosed ongoing costs'],
    right: ['Handoff and roadmap', 'Training and adoption', 'Support and maintenance', 'Next-priority workflows'],
    output: ['Operational software', 'Deploy the solution and review the next use case'],
  },
];
const esc = (s) => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const label = (x,y,text,size=14,color='#171717',weight=400) => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}">${esc(text)}</text>`;
function window(x, lines) {
  return `<rect x="${x}" y="89" width="184" height="103" fill="white" stroke="#c9c9c9"/>` +
    label(x+11,111,lines[0],14,'#171717',500) +
    lines.slice(1).map((s,i)=>label(x+11,135+i*19,s,12,'#555')).join('');
}
function frame(stage, index, x, y) {
  return `<g transform="translate(${x} ${y})">
    <path d="M0 0L9 -9H421V251L412 260M412 0L421 -9" fill="none" stroke="#999" stroke-width="1"/>
    <rect width="412" height="260" fill="white" stroke="#555" stroke-width="1.1"/>
    <path d="M0 72H412M0 205H412" stroke="#ddd"/>
    ${label(17,30,`${index+1}. ${stage.title}`,20,'#171717',500)}
    ${label(17,54,stage.subtitle,12,'#666')}
    ${window(16,stage.left)}${window(212,stage.right)}
    ${label(17,226,stage.output[0],12,'#666')}
    ${label(17,247,stage.output[1],13,'#171717',500)}
  </g>`;
}
function render(mobile) {
  const width=mobile?460:960, height=mobile?1900:1040;
  const positions=mobile?stages.map((_,i)=>[20,46+i*306]):[[32,64],[512,64],[512,388],[32,388],[32,712],[512,712]];
  const connectors=mobile
    ? stages.slice(0,-1).map((_,i)=>`M226 ${46+i*306+260}V${46+(i+1)*306-12}`)
    : ['M444 194H500','M718 324V376','M512 518H456','M238 648V700','M444 842H500'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="fde-title fde-description">
<title id="fde-title">The forward-deployed engineering process</title>
<desc id="fde-description">Six stages connect the customer team, field observations, pilot selection, engineering, bootcamp evaluation, and production implementation. Each frame shows the activities and resulting deliverable. Production work follows the pilot evaluation under a separate proposal.</desc>
<defs><marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M1 1L7 4L1 7" fill="none" stroke="#888" stroke-width="1"/></marker></defs>
<rect width="${width}" height="${height}" fill="white"/>
<g font-family="Arial, Helvetica, sans-serif">
<g fill="none" stroke="#999" stroke-width="1.2" marker-end="url(#arrow)">${connectors.map(d=>`<path d="${d}"/>`).join('')}</g>
${stages.map((stage,i)=>frame(stage,i,...positions[i])).join('')}
</g></svg>\n`;
}
writeFileSync('public/documentation/fde-process.svg',render(false));
writeFileSync('public/documentation/fde-process-mobile.svg',render(true));
