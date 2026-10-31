// Browser-only transport for the unmodified Work Flow UI contracts. Never calls
// REBUILDITINC or a production API. All changes stay in this browser's demo store.
import photos from '../archive-photos.json';
import { parseCsv } from '../workflow-demo-model';
let memory;
const copy=value=>JSON.parse(JSON.stringify(value));const uid=()=>crypto.randomUUID();
const meta=[['Manufacturing','Lisboa, Portugal'],['Manufacturing','Lisboa, Portugal'],['Engineering',''],['Mission operations',''],['Manufacturing','Lisboa, Portugal'],['Maritime','Ballyquintin, Co. Down'],['Streetscape',''],['Agriculture','']];
function seed(){return {board:{id:'archive',name:'Company archive',workspaceId:'company',revision:'1',activeSchemaVersionId:'schema-1',visibility:'private',settings:{hierarchyMaxDepth:10},state:'active'},workspace:{id:'company',name:'Company workspace'},columns:[{id:'name',stableKey:'name',label:'Record name',type:'name',width:360,rank:'0',settings:{}},{id:'category',stableKey:'category',label:'Category',type:'text',width:150,rank:'1',settings:{}},{id:'location',stableKey:'location',label:'Location',type:'text',width:180,rank:'2',settings:{}},{id:'files',stableKey:'files',label:'Source file',type:'asset_refs',width:110,rank:'3',settings:{}},{id:'access',stableKey:'access',label:'Access',type:'status',width:140,rank:'4',settings:{options:[{id:'internal',label:'Internal',color:'#579bfc'},{id:'restricted',label:'Restricted',color:'#e2445c'},{id:'team',label:'Team only',color:'#a25ddc'}]}},{id:'source',stableKey:'source',label:'Original record',type:'url',width:190,rank:'5',settings:{}}],groups:[{id:'archive-records',title:'Company archive',color:'#a25ddc',rank:'0',revision:'1',state:'active'}],items:photos.slice(0,8).map((photo,i)=>({id:`photo-${i}`,boardId:'archive',groupId:'archive-records',name:photo.title,rank:String(i).padStart(8,'0'),revision:'1',depth:0,state:'active',parentItemId:null,childCount:0,updateCount:0,values:{category:meta[i][0],location:meta[i][1],files:[],access:'internal',source:photo.source}})),views:[],events:[],updates:{},drafts:{},assets:photos.slice(0,8).map((photo,i)=>({id:`asset-${i}`,itemId:`photo-${i}`,targetId:`photo-${i}`,columnId:'files',logicalName:photo.title,demoPhotoIndex:i,revision:'1',state:'active',version:{id:`version-${i}`,originalFilename:`archive-${i+1}.jpg`,contentType:'image/jpeg',scanStatus:'clean',previewUrl:photo.src,downloadUrl:photo.src}})),relations:[],dependencies:[],collections:{},plans:{}};}
function state(){if(!memory){memory=seed();try{for(const key of ['usatii-genuine-workflow-v1','usatii-genuine-workflow-v2','usatii-enterprise-workflow-v3','usatii-demo:last-board-id'])localStorage.removeItem(key);}catch{}}return memory;}
function persist(s){memory=s;}
function event(s,label,targetId,before,after){s.events.unshift({id:uid(),kind:'item',eventType:label,action:label,summary:label,actorName:'Demo user',actor_principal_id:'demo',actorPrincipalId:'demo',targetId,itemId:targetId,createdAt:new Date().toISOString(),created_at:new Date().toISOString(),before,after});s.board.revision=String(Number(s.board.revision)+1);persist(s);}
function activeItems(s){return s.items.filter(item=>item.state==='active').map(item=>({...item,childCount:s.items.filter(child=>child.parentItemId===item.id&&child.state==='active').length}));}
function payload(s,url){let items=activeItems(s);const search=url.searchParams.get('search');if(search)items=items.filter(item=>item.name.toLowerCase().includes(search.toLowerCase()));items.sort((a,b)=>String(a.rank).localeCompare(String(b.rank)));return {board:s.board,columns:s.columns,groups:s.groups.filter(g=>g.state==='active'),items,relations:s.relations,dependencies:s.dependencies,hasMoreItems:false,nextOffset:null,currentPrincipalId:'demo'};}
function field(item,id){return id==='item.name'?item.name:id==='item.groupId'?item.groupId:item.values[id];}
function matches(item,rule){if(!rule)return true;if(rule.op==='and')return rule.children.every(r=>matches(item,r));if(rule.op==='or')return rule.children.some(r=>matches(item,r));const value=field(item,rule.fieldId),text=String(value??'').toLowerCase(),query=String(rule.value??'').toLowerCase();switch(rule.op){case'isEmpty':return !value||value.length===0;case'isNotEmpty':return !!value&&value.length!==0;case'equals':case'eq':case'is':return text===query;case'notEquals':case'neq':return text!==query;case'notContains':return !text.includes(query);case'gt':return Number(value)>Number(rule.value);case'lt':return Number(value)<Number(rule.value);case'gte':return Number(value)>=Number(rule.value);case'lte':return Number(value)<=Number(rule.value);case'startsWith':return text.startsWith(query);case'endsWith':return text.endsWith(query);case'in':return (rule.value||[]).map(String).includes(String(value));default:return text.includes(query);}}
function queryItems(s,query={}){return activeItems(s).filter(item=>matches(item,query.where)).sort((a,b)=>{for(const sort of query.sort||[]){const diff=String(field(a,sort.fieldId)??'').localeCompare(String(field(b,sort.fieldId)??''),undefined,{numeric:true});if(diff)return diff*(sort.direction==='desc'?-1:1);}return 0;});}
export async function demoRequest(path,options={}){
 const s=state(),url=new URL(path,'https://demo.local'),parts=url.pathname.replace('/api/work-flow/v1/','').split('/'),method=options.method||'GET',body=typeof options.body==='string'?JSON.parse(options.body||'{}'):options.body||{},mutating=method!=='GET';
 const result=data=>({data:copy(data),meta:{pageInfo:{hasNextPage:false,endCursor:null}}});
 if(path.startsWith('/api/dashboard/team-members'))return {items:[{id:'demo',name:'Demo user',department:'Operations'}]};
 if(parts[0]==='navigation')return result({boards:[s.board],workspaces:[s.workspace],folders:[],defaultWorkspaceId:s.workspace.id});
 if(parts[0]==='queries'){const definition=body.query||s.views.find(view=>view.activeVersion.id===body.viewVersionId)?.activeVersion.query;return result({items:queryItems(s,definition),hasMoreItems:false});}
 if(parts[0]==='schema-versions'){
  if(parts[2]==='validate')return result({valid:true,errors:[]});
  if(parts[2]==='publish'){s.columns=s.drafts[parts[1]]?.columns||s.columns;event(s,'Schema published',s.board.id);return result({board:s.board,schemaVersion:{id:parts[1],state:'published'}});}
  if(parts[2]==='columns'){const draft=s.drafts[parts[1]];if(!draft)throw new Error('Schema draft not found');const col=draft.columns.find(c=>c.id===parts[3]);if(col){if(method==='DELETE')draft.columns=draft.columns.filter(c=>c.id!==col.id);else Object.assign(col,body);persist(s);return result({column:col});}}
 }
 if(parts[0]==='bulk'){
  if(parts[1]==='plan'){const id=uid(),plan={id,queryHash:id,...body,affectedCount:body.selection.itemIds.length,impact:{affectedCount:body.selection.itemIds.length,warnings:[]},expiresAt:new Date(Date.now()+300000).toISOString(),preview:{count:body.selection.itemIds.length},errors:[],warnings:[]};s.plans[id]=plan;return result({plan});}
  const plan=s.plans[body.planId];if(plan){for(const item of s.items.filter(item=>plan.selection.itemIds.includes(item.id))){const action=plan.action;if(action.type==='move_group')item.groupId=action.groupId;else if(action.type==='archive'||action.type==='trash')item.state=action.type==='trash'?'trashed':'archived';else if(action.columnId)item.values[action.columnId]=action.value;}event(s,'Bulk action applied',s.board.id);return result({result:{succeeded:plan.selection.itemIds.length}});}
 }
 if(parts[0]==='targets'&&parts[1]==='item'){
  const itemId=parts[2];if(parts[3]==='assets'){
    if(method==='POST'&&body.fileData){const asset={id:uid(),itemId,columnId:body.columnId||'files',logicalName:body.name,state:'active',revision:'1',version:{id:uid(),contentType:body.contentType,originalFilename:body.name,scanStatus:'clean',previewUrl:body.fileData,downloadUrl:body.fileData}};s.assets.push(asset);event(s,'File attached',itemId);return result({asset});}
    return result({assets:s.assets.filter(asset=>asset.itemId===itemId&&asset.state==='active')});
   }
  if(['threads','updates'].includes(parts[3])){s.updates[itemId]||=[];if(mutating){s.updates[itemId].push({id:uid(),body:body.body||body.content||body.text,authorName:'Demo user',authorPrincipalId:'demo',createdAt:new Date().toISOString(),replies:[],reactions:[]});event(s,'Update posted',itemId);}return result({threads:s.updates[itemId],updates:s.updates[itemId],participants:[{id:'demo',label:'Demo user'}],mentionCandidates:[],subscribers:[],events:s.events.filter(e=>e.itemId===itemId)});}
  if(parts[3]==='activity')return result({events:s.events.filter(e=>e.itemId===itemId),participants:[{id:'demo',label:'Demo user'}],columns:s.columns});
 }
 if(parts[0]==='assets'){const asset=s.assets.find(a=>a.id===parts[1]);if(asset){if(mutating){Object.assign(asset,body);event(s,'Attachment updated',asset.itemId);}return result({asset,versions:[asset.version]});}}
 if(parts[0]==='boards'){
  if(parts.length===1)return result({boards:[s.board]});
  const area=parts[2],id=parts[3],action=parts[4];
  if(!area){if(mutating){Object.assign(s.board,body);event(s,'Board settings updated',s.board.id);}return result(payload(s,url));}
  if(area==='live')return result({revision:s.board.revision,stamp:s.board.revision});
  if(area==='access')return result({currentPrincipalId:'demo',canManage:true,visibility:s.board.visibility,principals:[{id:'demo',displayName:'Demo user',isBoardOwner:true,roleKey:'owner'}],roles:[]});
  if(area==='groups'){
   if(method==='POST'&&!id){const group={id:uid(),title:body.title,color:body.color||'#579bfc',rank:String(s.groups.length),revision:'1',state:'active'};s.groups.push(group);event(s,'Group created',group.id);return result({group});}
   const group=s.groups.find(g=>g.id===id);if(group&&mutating){Object.assign(group,body);group.revision=String(Number(group.revision)+1);event(s,'Group updated',group.id);return result({group,boardRevision:s.board.revision});}return result({groups:s.groups});
  }
  if(area==='items'){
   if(method==='POST'&&!id){const item={id:uid(),name:body.name,boardId:s.board.id,groupId:body.groupId||s.groups[0].id,parentItemId:body.parentItemId||null,depth:body.parentItemId?1:0,rank:String(s.items.length).padStart(8,'0'),revision:'1',state:'active',values:body.values||{},childCount:0,updateCount:0};s.items.push(item);event(s,'Record created',item.id);return result({item,boardRevision:s.board.revision});}
   const item=s.items.find(i=>i.id===id);if(!item)throw new Error('Record not found');
   if(action==='children')return result({items:activeItems(s).filter(child=>child.parentItemId===item.id),hasMoreItems:false,nextOffset:null});
   if(action==='duplicate'){const duplicate={...copy(item),id:uid(),name:`${item.name} copy`,revision:'1',rank:String(s.items.length).padStart(8,'0')};s.items.push(duplicate);event(s,'Record duplicated',duplicate.id);return result({item:duplicate,boardRevision:s.board.revision});}
   if(mutating){const before=copy(item);if(['archive','trash','restore'].includes(action))item.state=action==='restore'?'active':action==='trash'?'trashed':'archived';else {Object.assign(item,{...body,values:{...item.values,...body.values}});if(body.beforeId||body.afterId){const target=s.items.find(i=>i.id===(body.beforeId||body.afterId));if(target)item.rank=String(Number(target.rank)+(body.beforeId?-.5:.5));}}item.revision=String(Number(item.revision)+1);event(s,action==='move'?'Record moved':'Record updated',item.id,before,item);}
   return result({item,boardRevision:s.board.revision,events:s.events.filter(e=>e.itemId===item.id)});
  }
  if(area==='schema-versions'){
   if(!id){const schemaVersion={id:uid(),boardId:s.board.id};s.drafts[schemaVersion.id]={...schemaVersion,columns:copy(s.columns)};persist(s);return result({schemaVersion});}
   const draft=s.drafts[id];if(!draft)throw new Error('Schema draft not found');
   if(parts[4]==='columns'){
    let column=draft.columns.find(c=>c.id===parts[5]);if(method==='POST'&&!parts[5]){column={id:uid(),stableKey:uid(),label:body.label,type:body.type,readOnly:body.readOnly,settings:body.settings||{},width:150,rank:String(draft.columns.length)};draft.columns.push(column);}else if(column){if(method==='DELETE')draft.columns=draft.columns.filter(c=>c.id!==column.id);else Object.assign(column,body);}persist(s);return result({column});
   }
  }
  if(area==='views'){
   if(!id){if(method==='POST'){const view={id:uid(),name:body.name,type:body.type,scope:body.scope,revision:'1',activeVersion:{id:uid(),viewType:body.type,query:body.query,presentation:body.presentation}};s.views.push(view);event(s,'View saved',view.id);return result({view});}return result({views:s.views});}
   const view=s.views.find(v=>v.id===id);if(!view)throw new Error('View not found');if(mutating){if(body.query)view.activeVersion.query=body.query;if(body.presentation)view.activeVersion.presentation=body.presentation;Object.assign(view,Object.fromEntries(Object.entries(body).filter(([key])=>!['query','presentation'].includes(key))));view.revision=String(Number(view.revision)+1);if(['deleted','trashed'].includes(body.state))s.views=s.views.filter(v=>v.id!==id);event(s,'View updated',view.id);}return result({view,items:queryItems(s,view.activeVersion.query)});
  }
  if(area==='assets')return result({assets:s.assets});
  if(area==='activity')return result({events:s.events,participants:[{id:'demo',label:'Demo user'}]});
  if(area==='columns'&&id){const column=s.columns.find(c=>c.id===id);if(column&&mutating){Object.assign(column,body);event(s,'Column updated',column.id);}return result({column});}
  if(area==='recovery')return result({items:s.items.filter(i=>i.state!=='active'),boards:[]});
  // Genuine secondary surfaces read/write their own browser-local collections.
  if(['automations','dashboards','documents','forms','templates','subscribers','relations','dependencies','updates','threads','notifications'].includes(area)){
   s.collections[area]||=[];const list=s.collections[area];if(mutating){const entry=id?list.find(x=>x.id===id):null;if(entry)Object.assign(entry,body);else list.push({id:uid(),...body,revision:'1',state:'active',activeVersion:{...body}});event(s,`${area} updated`,s.board.id);}return result({[area]:list,participants:[],widgets:[],events:s.events,canManage:true});
  }
 }
 if(parts[0]==='imports'){
  const csv=parseCsv(body.csvText||''),headers=csv[0]||[];
  if(parts[1]==='analyze')return result({headers,columns:s.columns,rowCount:Math.max(0,csv.length-1),sample:csv.slice(1,6).map(row=>Object.fromEntries(headers.map((header,i)=>[header,row[i]||'']))),suggestedMapping:Object.fromEntries(headers.map(header=>[header,s.columns.find(c=>c.label.toLowerCase()===header.toLowerCase())?.stableKey||null]))});
  let imported=0;for(const row of csv.slice(1)){const values={};let name='';headers.forEach((header,i)=>{const key=body.mapping?.[header];if(key==='name')name=row[i];else if(key){const col=s.columns.find(c=>c.stableKey===key||c.id===key);if(col)values[col.id]=row[i];}});if(!name)continue;s.items.push({id:uid(),boardId:s.board.id,groupId:body.groupId||s.groups[0].id,name,values,rank:String(s.items.length).padStart(8,'0'),revision:'1',state:'active',depth:0,childCount:0,updateCount:0});imported++;}event(s,'CSV imported',s.board.id);return result({job:{result:{imported,failed:csv.length-1-imported}}});
 }
 if(['notifications','templates','automations','forms','documents','dashboards','recovery','domain-types','principals','teams'].includes(parts[0]))return result({[parts[0]]:s.collections[parts[0]]||[],items:[],events:[],participants:[],unreadCount:0});
 throw new Error(`This demo does not connect to the production service for ${parts.join('/')}.`);
}
