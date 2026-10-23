import test from 'node:test';
import assert from 'node:assert/strict';
import { sendCareerApplicationNotification } from '../../src/lib/portal/resend.js';
import { applicationAdminPath, safeAdminReturnTo } from '../../src/lib/careers/admin-links.js';

const env={ RESEND_API_KEY:'test-key', RESEND_FROM_EMAIL:'USATII <test@example.com>', PORTAL_OWNER_EMAIL:'owner@example.com' };
const application={id:'42',roleTitle:'Federal Account Director, DART',resumeName:'resume.pdf',answers:{fullName:'Test <Candidate>',email:'candidate@example.com',phone:'555-0100',currentLocation:'Washington, DC',currentCompany:'Example',languages:['English'],linkedin:'https://example.com/profile',motivation:'Interested in DART',veteranStatus:'Do not send',disabilityStatus:'Do not send'}};

await test('email includes role, candidate details, reply-to, and exact authenticated application link',async()=>{
 let request;
 await sendCareerApplicationNotification(application,{env,fetchImpl:async(url,options)=>{request={url,options,body:JSON.parse(options.body)};return Response.json({id:'mail-42'});}});
 assert.equal(request.url,'https://api.resend.com/emails');
 assert.deepEqual(request.body.to,['owner@example.com']);
 assert.equal(request.body.reply_to,'candidate@example.com');
 assert.ok(request.body.subject.includes(application.roleTitle));
 for(const value of ['candidate@example.com','555-0100','Washington, DC','resume.pdf','https://www.usatii.com/dashboard?tab=applications&application=42']) assert.ok(request.body.text.includes(value));
 assert.ok(request.body.html.includes('Test &lt;Candidate&gt;'));
 assert.ok(!request.body.html.includes('Test <Candidate>'));
 assert.ok(!JSON.stringify(request.body).includes('Do not send'));
 assert.ok(!('attachments' in request.body));
 assert.equal(request.options.headers['Idempotency-Key'],'career-application-42');
});

await test('explicit career recipient overrides owner; missing configuration never sends',async()=>{
 let recipient;
 await sendCareerApplicationNotification(application,{env:{...env,CAREER_NOTIFICATION_EMAIL:'recruiting@example.com'},fetchImpl:async(_url,options)=>{recipient=JSON.parse(options.body).to[0];return Response.json({id:'ok'});}});
 assert.equal(recipient,'recruiting@example.com');
 await assert.rejects(sendCareerApplicationNotification(application,{env:{},fetchImpl:async()=>{throw new Error('Must not run');}}),error=>error.code==='resend_not_configured');
});

await test('transient delivery retries reuse the same key; permanent rejection is not retried',async()=>{
 const keys=[];
 await sendCareerApplicationNotification(application,{env,fetchImpl:async(_url,options)=>{keys.push(options.headers['Idempotency-Key']);return keys.length===1?new Response('',{status:503}):Response.json({id:'ok'});}});
 assert.deepEqual(keys,['career-application-42','career-application-42']);
 let attempts=0;
 await assert.rejects(sendCareerApplicationNotification(application,{env,fetchImpl:async()=>{attempts++;return new Response('',{status:422});}}));
 assert.equal(attempts,1);
});

await test('admin return paths preserve application selection and reject external or malformed redirects',()=>{
 const path=applicationAdminPath(42);
 assert.equal(path,'/dashboard?tab=applications&application=42');
 assert.equal(safeAdminReturnTo(path),path);
 for(const bad of ['https://evil.example','//evil.example','/dashboard/../../evil','/admin/login','/dashboard\\evil','/dashboard\n']) assert.equal(safeAdminReturnTo(bad),'/dashboard');
 assert.throws(()=>applicationAdminPath('42&tab=other'));
});
