'use client';
import {reviewedWorkflows} from '@/lib/dart/workflows';
import {Paper,State,Gate,Wire,WorkflowFigure} from './workflow-primitives';
function anchor(node,side){
 const state=node.type==='state',gate=node.type==='gate';
 return [node.x+(side==='left'?-(state?140:gate?95:105):side==='right'?(state?140:gate?95:105):0),node.y+(side==='top'?-(state?16:gate?70:72):side==='bottom'?(state?(node.detail?140:80):gate?70:72):0)];
}
function route(edge,lookup){
 const from=anchor(lookup[edge.from],edge.fromSide),to=anchor(lookup[edge.to],edge.toSide);
 const via=edge.via||(['left','right'].includes(edge.fromSide)?[[(from[0]+to[0])/2,from[1]],[(from[0]+to[0])/2,to[1]]]:[[from[0],(from[1]+to[1])/2],[to[0],(from[1]+to[1])/2]]);
 return {d:'M'+from.join(' ')+' '+[...via,to].map(p=>'L'+p.join(' ')).join(' '),x:edge.labelX??(from[0]+to[0])/2,y:edge.labelY??((from[1]+to[1])/2-16)};
}
export default function ReviewedWorkflow({kind}){
 const graph=reviewedWorkflows[kind];if(!graph)return null;
 const lookup=Object.fromEntries(graph.nodes.map(n=>[n.id,n]));
 return <WorkflowFigure caption={graph.caption} height={graph.height}>{graph.edges.map((edge,i)=><Wire key={i} {...route(edge,lookup)} label={edge.label} max={16}/>)}{graph.nodes.map(node=>node.type==='gate'?<Gate key={node.id} x={node.x} y={node.y} label={node.title}/>:node.type==='state'?<State key={node.id} x={node.x} y={node.y} label={node.title} detail={node.detail} max={20}/>:<Paper key={node.id} x={node.x-100} y={node.y-64} title={node.title} detail={node.detail} width={200}/>)}</WorkflowFigure>;
}
