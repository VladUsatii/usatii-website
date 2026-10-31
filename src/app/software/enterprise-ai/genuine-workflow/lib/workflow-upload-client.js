export async function uploadWorkFlowFile({api,path,file,columnId}) {
 if(file.size>5*1024*1024)throw new Error('Demo attachments must be under 5 MB.');
 const fileData=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});
 return api(path,{method:'POST',body:JSON.stringify({fileData,name:file.name,contentType:file.type||'application/octet-stream',columnId})});
}
