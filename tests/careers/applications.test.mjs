import test from 'node:test';
import assert from 'node:assert/strict';
import { APPLICATION_FIELDS, MAX_RESUME_BYTES, MAX_APPLICATION_BYTES } from '../../src/lib/careers/application-fields.js';
import { ApplicationError, validateApplication, validateResume } from '../../src/lib/careers/application-validation.js';
import { createCareerApplicationHandler } from '../../src/lib/careers/submit-application.js';
import { createCareerChallenge, getCareerChallengeSecrets, verifyCareerHuman } from '../../src/lib/careers/human-verification.js';
import { solveChallenge, createChallenge } from 'altcha-lib';
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';
import { roles } from '../../src/lib/careers/roles.js';

function formFor(roleId = roles[0].slug) {
  const form = new FormData();
  for (const field of APPLICATION_FIELDS) {
    if (!field.required || field.type === 'languages') continue;
    form.set(field.name, field.options?.[0] || (field.type === 'email' ? 'Candidate@Example.com' : 'Candidate response'));
  }
  form.set('roleId', roleId);
  form.append('languages', 'English');
  form.set('privacyConsent', 'yes');
  form.set('altcha', 'proof');
  form.set('resume', new File(['%PDF-1.4\n1 0 obj <<>> endobj\n%%EOF'], 'resume.pdf', { type: 'application/pdf' }));
  return form;
}
function request(form, headers = {}) {
  return new Request('https://usatii.com/api/careers', { method: 'POST', body: form, headers: { origin: 'https://usatii.com', 'x-forwarded-for': '192.0.2.1', ...headers } });
}

await test('validation preserves recruiting responses and isolates voluntary survey data', () => {
  const form = formFor();
  form.set('veteranStatus', 'I identify as a protected veteran');
  form.set('disabilityStatus', 'Prefer not to disclose');
  form.set('partnerSharing', 'No, keep my application with USATII');
  const { answers, demographics } = validateApplication(form);
  assert.equal(answers.email, 'candidate@example.com');
  assert.equal(answers.privacyConsent, true);
  assert.equal(answers.partnerSharing, 'No, keep my application with USATII');
  assert.deepEqual(demographics, { veteranStatus: 'I identify as a protected veteran' });
  assert.ok(!('veteranStatus' in answers) && !('disabilityStatus' in answers));
});

await test('required answers, URLs, enums, privacy acknowledgement, and languages are checked on the server', () => {
  for (const [field, value] of [['email','bad'],['github','javascript:alert(1)'],['workAuthorization','Maybe'],['privacyConsent','no'],['fullName','x'.repeat(121)]]) {
    const form = formFor(); form.set(field,value);
    assert.throws(() => validateApplication(form), error => error.field === field);
  }
  const blank = formFor(); blank.delete('currentLocation');
  assert.throws(() => validateApplication(blank), error => error.field === 'currentLocation');
  const noLanguages = formFor(); noLanguages.delete('languages');
  assert.throws(() => validateApplication(noLanguages), error => error.field === 'languages');
  const conflicting = formFor(); conflicting.append('languages','Prefer not to disclose');
  assert.throws(() => validateApplication(conflicting), error => error.field === 'languages');
  const other = formFor(); other.set('languages','Other');
  assert.throws(() => validateApplication(other), error => error.field === 'otherLanguages');
});

await test('résumé contents, format, and size are validated rather than trusting browser MIME types', async () => {
  const pdf = await validateResume(formFor().get('resume'));
  assert.equal(pdf.mime,'application/pdf');
  assert.equal(pdf.bytes.subarray(0,5).toString(),'%PDF-');
  await assert.rejects(validateResume(new File(['<script>bad()</script>'],'resume.pdf',{type:'application/pdf'})));
  await assert.rejects(validateResume(new File(['hello'],'resume.exe',{type:'application/pdf'})));
  await assert.rejects(validateResume({ name:'resume.pdf', size:MAX_RESUME_BYTES+1, arrayBuffer() { throw new Error('Must not read oversize file'); } }), /3 MB/);
  await assert.rejects(validateResume(null), /Attach/);
});

const secrets=getCareerChallengeSecrets('test-only-secret-'.repeat(4));
const challenge=await createCareerChallenge(roles[0].slug,secrets);
const solution=await solveChallenge({challenge,deriveKey});
assert.ok(solution);
const encode = (challenge, solution) => Buffer.from(JSON.stringify({challenge,solution})).toString('base64');
const token=encode(challenge,solution);

await test('actual ALTCHA proof verifies and returns the nonce for atomic database consumption', async () => {
  const result=await verifyCareerHuman({token,roleId:roles[0].slug},secrets);
  assert.equal(result.challengeId,challenge.parameters.nonce);
  assert.ok(new Date(result.expiresAt)>new Date());
});

await test('missing, forged, altered, wrong-role, and expired proofs are rejected', async () => {
  for (const invalidToken of ['', 'not base64', 'a'.repeat(12001), Buffer.from('{}').toString('base64')]) {
    await assert.rejects(verifyCareerHuman({token:invalidToken,roleId:roles[0].slug},secrets), error => error.status === 400);
  }
  const forged=structuredClone(challenge); forged.signature='00'.repeat(32);
  await assert.rejects(verifyCareerHuman({token:encode(forged,solution),roleId:roles[0].slug},secrets));
  const changed=structuredClone(challenge); changed.parameters.cost=1;
  await assert.rejects(verifyCareerHuman({token:encode(changed,solution),roleId:roles[0].slug},secrets));
  await assert.rejects(verifyCareerHuman({token,roleId:roles[1].slug},secrets));
  const expired=await createChallenge({algorithm:'PBKDF2/SHA-256',cost:1000,counter:1,deriveKey,expiresAt:new Date(Date.now()-1000),data:{purpose:'career_application',roleId:roles[0].slug},...secrets});
  await assert.rejects(verifyCareerHuman({token:encode(expired,solution),roleId:roles[0].slug},secrets));
  assert.throws(()=>getCareerChallengeSecrets(''), error => error.status === 503);
});

await test('every published role can submit; persistence receives full answers and actual résumé bytes', async () => {
  for (const role of roles) {
    let saved;
    const handler=createCareerApplicationHandler({verifyHuman:async()=>({challengeId:'test',expiresAt:new Date(Date.now()+600000).toISOString()}),saveApplication:async application=>{saved=application;}});
    const response=await handler(request(formFor(role.slug)));
    assert.equal(response.status,201);
    assert.equal(saved.role.slug,role.slug);
    assert.equal(saved.answers.email,'candidate@example.com');
    assert.ok(Buffer.isBuffer(saved.resume.bytes));
    assert.equal(saved.verification.challengeId,'test');
  }
});

await test('no persistence on failed verification, invalid role, bad file, cross-site request, honeypot, or oversize body', async () => {
  let saved=0;
  const handler=createCareerApplicationHandler({verifyHuman:async()=>{throw new ApplicationError('Check failed',400);},saveApplication:async()=>saved++});
  assert.equal((await handler(request(formFor()))).status,400);
  const invalidRole=formFor('retired-role');
  assert.equal((await handler(request(invalidRole))).status,400);
  assert.equal((await handler(request(formFor(),{origin:'https://attacker.example'}))).status,403);
  const trapped=formFor();trapped.set('websiteCompany','spam');
  assert.equal((await handler(request(trapped))).status,400);
  assert.equal((await handler(request(formFor(),{'content-length':String(MAX_APPLICATION_BYTES+1)}))).status,413);
  const invalidFile=formFor(); invalidFile.set('resume',new File(['fake'],'fake.pdf'));
  const handler2=createCareerApplicationHandler({verifyHuman:async()=>({}),saveApplication:async()=>saved++});
  assert.equal((await handler2(request(invalidFile))).status,400);
  assert.equal(saved,0);
});

await test('duplicate and throttled responses remain actionable, and telemetry cannot hide a saved application', async () => {
  const base={verifyHuman:async()=>({}),saveApplication:async()=>{throw Object.assign(new Error('Do not expose DB detail'),{code:'23505'});}};
  const duplicate=await createCareerApplicationHandler(base)(request(formFor()));
  assert.equal(duplicate.status,409);
  assert.ok(!(await duplicate.text()).includes('DB detail'));
  const limited=await createCareerApplicationHandler({...base,saveApplication:async()=>{throw new ApplicationError('Try later',429);}})(request(formFor()));
  assert.equal(limited.status,429);
  assert.equal(limited.headers.get('retry-after'),'3600');
  const saved=await createCareerApplicationHandler({verifyHuman:async()=>({}),saveApplication:async()=>{},recordTelemetry:async()=>{throw new Error('unavailable');}})(request(formFor()));
  assert.equal(saved.status,201);
});

await test('notifications run only after persistence, and delivery failure cannot undo an accepted application', async () => {
 const events=[];
 const handler=createCareerApplicationHandler({verifyHuman:async()=>({}),saveApplication:async()=>{events.push('saved');return '42';},notifyApplication:async id=>{events.push(`notify:${id}`);throw new Error('mail down');}});
 const originalError=console.error;
 console.error=()=>{};
 try { assert.equal((await handler(request(formFor()))).status,201); } finally { console.error=originalError; }
 assert.deepEqual(events,['saved','notify:42']);
 let notified=false;
 const rejected=createCareerApplicationHandler({verifyHuman:async()=>({}),saveApplication:async()=>{throw Object.assign(new Error('duplicate'),{code:'23505'});},notifyApplication:async()=>{notified=true;}});
 assert.equal((await rejected(request(formFor()))).status,409);
 assert.equal(notified,false);
});
