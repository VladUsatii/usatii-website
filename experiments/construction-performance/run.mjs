import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { cpus, platform, arch } from 'node:os';
import { createRequire } from 'node:module';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const repo = process.env.BENCH_SOURCE || '/Users/vladusatii/Dev/REBUILDITINC';
const load = file => import(pathToFileURL(path.join(repo, file)));
const {geometryArea, deriveProjectMapQuantities} = await load('lib/measure/geometry.js');
const {triangulatePolygon} = await load('lib/measure/polygon-triangulation.js');
const {compileWorkFlowFormula, evaluateWorkFlowFormula} = await load('lib/workflow-platform/formula.js');
const {ShapeUtils, Vector2} = await load('node_modules/three/build/three.module.js');
const threeVersion = JSON.parse(await readFile(path.join(repo,'node_modules/three/package.json'),'utf8')).version;
let seed=20261009;
const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
const median = a => [...a].sort((a,b)=>a-b)[Math.floor(a.length/2)];
const pct=(a,p)=>[...a].sort((a,b)=>a-b)[Math.ceil(a.length*p)-1];
const results=[]; const observations=[]; let sink=0;
function time(cases, engines, reps=21) {
  const samples=Object.fromEntries(Object.keys(engines).map(k=>[k,[]]));
  for(let i=0;i<10;i++) for(const fn of Object.values(engines)) for(const c of cases) sink+=Number(fn(c))||0;
  const pilots=Object.values(engines).map(fn=>{const start=performance.now();for(const c of cases)sink+=Number(fn(c))||0;return performance.now()-start;});
  const loops=Math.min(8192,Math.max(1,Math.ceil(5/Math.max(.001,Math.min(...pilots)))));
  for(let r=0;r<reps;r++) {
    const names=Object.keys(engines); if(r%2) names.reverse();
    for(const name of names) { const start=performance.now(); for(let b=0;b<loops;b++)for(const c of cases) sink+=Number(engines[name](c))||0; samples[name].push((performance.now()-start)/(cases.length*loops)); }
  }
  return Object.fromEntries(Object.entries(samples).map(([name,rawMs])=>[name,{medianMs:median(rawMs),p95Ms:pct(rawMs,.95),batchLoops:loops,rawMs}]));
}
const fixtures=[];
for(const vertices of [8,16,32,64,128]) {
  const cases=Array.from({length:80},(_,j)=>{
    const rx=3+random()*12, rz=3+random()*12;
    const radii=Array.from({length:vertices},(_,i)=>(i%2?0.55:1)*(0.85+random()*.15));
    const points=radii.map((r,i)=>({x:rx*r*Math.cos(i*2*Math.PI/vertices),y:0,z:rz*r*Math.sin(i*2*Math.PI/vertices)}));
    // Independent analytic oracle: radial wedges of a simple star-shaped polygon.
    const expected=rx*rz*Math.sin(2*Math.PI/vertices)/2*radii.reduce((s,r,i)=>s+r*radii[(i+1)%vertices],0);
    if(j%2) points.reverse();
    return {id:`polygon-${vertices}-${j}`,points,contour:points.map(p=>new Vector2(p.x,p.z)),expected};
  });
  fixtures.push(...cases.map(({contour,...c})=>c));
  const areaFns={'USATII area':c=>geometryArea({points:c.points}),'Three.js area':c=>Math.abs(ShapeUtils.area(c.contour))};
  const triFns={'USATII triangulation':c=>triangulatePolygon(c.points),'Three.js Earcut':c=>ShapeUtils.triangulateShape(c.contour.slice(),[])};
  for(const [task,engines] of [['Floor area',areaFns],['Surface triangulation',triFns]]) {
    const timing=time(cases,Object.fromEntries(Object.entries(engines).map(([name,fn])=>[name,c=>task==='Floor area'?fn(c):fn(c).length])));
    const scores=Object.fromEntries(Object.entries(engines).map(([name,fn])=>{
      let pass=0,maxRelativeError=0;
      for(const c of cases){const output=fn(c); const actual=task==='Floor area'?output:output.reduce((s,[a,b,d])=>{const p=c.points[a],q=c.points[b],r=c.points[d];return s+Math.abs((q.x-p.x)*(r.z-p.z)-(q.z-p.z)*(r.x-p.x))/2},0); observations.push({task,engine:name,id:c.id,expected:c.expected,actual,output}); const err=Math.abs(actual-c.expected)/c.expected;maxRelativeError=Math.max(maxRelativeError,err);if(err<=1e-9 && (task==='Floor area'||output.length===vertices-2))pass++;}
      return [name,{...timing[name],passed:pass,total:cases.length,maxRelativeError}];
    }));
    results.push({task,size:vertices,sizeUnit:'vertices',scores});
  }
}
const columns=[{id:'quantity',label:'Quantity',type:'number'},{id:'price',label:'Price',type:'number'},{id:'budget',label:'Budget',type:'number'}];
const formulaCases=[];
for(let i=0;i<1000;i++){
 const quantity=1+Math.floor(random()*100),price=1+Math.floor(random()*1000),budget=500+Math.floor(random()*50000);
 for(const [source,expected] of [['{Quantity} * {Price}',quantity*price],['IF({Quantity} * {Price} > {Budget}, "Over", "Within")',quantity*price>budget?'Over':'Within'],['MAX(0, {Budget} - {Quantity} * {Price})',Math.max(0,budget-quantity*price)]]) formulaCases.push({source,values:{quantity,price,budget},expected});
}
const require = createRequire(import.meta.url);
const {HyperFormula} = require('/private/tmp/usatii-performance-reference/node_modules/hyperformula');
const hf = HyperFormula.buildFromArray(formulaCases.map(c=>[c.values.quantity,c.values.price,c.values.budget]), {licenseKey:'gpl-v3'});
formulaCases.forEach((c,i)=>{c.competitorSource='='+c.source.replaceAll('{Quantity}',`A${i+1}`).replaceAll('{Price}',`B${i+1}`).replaceAll('{Budget}',`C${i+1}`)});
const formulaFns={'USATII compile + evaluate':c=>evaluateWorkFlowFormula(compileWorkFlowFormula(c.source,columns).ast,c.values),'HyperFormula calculateFormula':c=>({ok:true,value:hf.calculateFormula(c.competitorSource,0)})};
const formulaTiming=time(formulaCases,Object.fromEntries(Object.entries(formulaFns).map(([k,fn])=>[k,c=>fn(c).ok])));
const formulaScores=Object.fromEntries(Object.entries(formulaFns).map(([name,fn])=>[name,{...formulaTiming[name],passed:formulaCases.filter(c=>{const r=fn(c);observations.push({task:"Work Flow formulas",engine:name,source:c.source,values:c.values,expected:c.expected,actual:r});return r.ok&&r.value===c.expected}).length,total:formulaCases.length}]));
results.push({task:'Work Flow formulas',size:3000,sizeUnit:'cases',scores:formulaScores});
const edgeCases=[{source:'IF(1 = 0, 1 / 0, 42)',expected:42},{source:'IFERROR(1 / 0, 42)',expected:42},{source:'ROUNDUP(-1.25, 1)',expected:-1.3},{source:'ROUNDDOWN(-1.25, 1)',expected:-1.2}].map(c=>({...c,actual:evaluateWorkFlowFormula(compileWorkFlowFormula(c.source).ast),hyperformula:hf.calculateFormula('='+c.source,0)}));
hf.destroy();
const hashes={};for(const file of ['lib/measure/geometry.js','lib/measure/polygon-triangulation.js','lib/workflow-platform/formula.js'])hashes[file]=createHash('sha256').update(await readFile(path.join(repo,file))).digest('hex');
const report={timestamp:new Date().toISOString(),method:{scope:'Local CPU function benchmarks. Synthetic valid polygons. Not capture accuracy, UI completion, cloud latency, or a HOVER/monday product benchmark.',seed:20261009,warmupPasses:10,timedPasses:21,timing:'Median and p95 of 21 batch means; adaptive identical loop counts per pair target 5ms for faster engine; p95 is NOT individual request tail latency.',formulaScope:'Compile/evaluate existing references; HyperFormula populated-sheet setup excluded; USATII columns/values setup excluded. Warm caches retained.',order:'alternated each round',preprocessing:'Inputs and native-format conversion outside timer for both geometry engines; triangulation array copy inside Three.js timer to prevent mutation.',oracle:'Analytic radial wedge area; triangle count n-2; formula expected results calculated independently.',toleranceRelative:1e-9},environment:{node:process.version,platform:platform(),arch:arch(),cpu:cpus()[0].model,threeVersion,hyperformulaVersion:HyperFormula.version},hashes,results,edgeCases,sink};
await writeFile(new URL('./observations.json',import.meta.url),JSON.stringify(observations,null,2));
await writeFile(new URL('./results.json',import.meta.url),JSON.stringify(report,null,2));
await writeFile(new URL('./fixtures.json',import.meta.url),JSON.stringify({polygons:fixtures,formulas:formulaCases},null,2));
console.log(JSON.stringify({results:results.map(r=>({...r,scores:Object.fromEntries(Object.entries(r.scores).map(([k,{rawMs,...v}])=>[k,v]))})),edgeCases},null,2));
