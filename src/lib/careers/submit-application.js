import { roles } from './roles.js';
import { MAX_APPLICATION_BYTES } from './application-fields.js';
import { ApplicationError, validateApplication, validateResume } from './application-validation.js';

async function readForm(request) {
  const length = Number(request.headers.get('content-length'));
  if (Number.isFinite(length) && length > MAX_APPLICATION_BYTES) throw new ApplicationError('Your application is too large. Keep your résumé under 3 MB.', 413);
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data;')) throw new ApplicationError('Submit the application using the form on the role page.', 415);
  if (!request.body) throw new ApplicationError('An application is required.');
  const reader = request.body.getReader();
  let total = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_APPLICATION_BYTES) {
        await reader.cancel();
        throw new ApplicationError('Your application is too large. Keep your résumé under 3 MB.', 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    const bounded = new Request(request.url, { method: 'POST', headers: { 'Content-Type': request.headers.get('content-type') }, body: Buffer.concat(chunks) });
    return await bounded.formData();
  } catch {
    throw new ApplicationError('Unable to read this application. Please try again.');
  }
}

export function createCareerApplicationHandler({ verifyHuman, saveApplication, notifyApplication = async () => {}, recordTelemetry = async () => {} }) {
  return async function POST(request) {
    const startedAt = Date.now();
    let status = 201;
    let errorMessage = null;
    const respond = (body, statusCode) => Response.json(body, { status: statusCode, headers: { 'Cache-Control': 'no-store', ...(statusCode === 429 ? { 'Retry-After': '3600' } : {}) } });
    try {
      const url = new URL(request.url);
      const origin = request.headers.get('origin');
      if ((origin && origin !== url.origin) || request.headers.get('sec-fetch-site') === 'cross-site') throw new ApplicationError('Please submit your application from the USATII website.', 403);
      const form = await readForm(request);
      // A trap field supplements proof of work; it never replaces verification.
      if (form.get('websiteCompany')) throw new ApplicationError('Unable to verify this submission.', 400);
      const role = roles.find(role => role.slug === form.get('roleId'));
      if (!role) throw new ApplicationError('This role is unavailable. Return to the available roles list.', 400, 'roleId');
      const ipAddress = (request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '').trim().slice(0, 64);
      if (!ipAddress && process.env.NODE_ENV === 'production') throw new ApplicationError('Unable to verify this submission. Please try again.', 400);
      const application = validateApplication(form);
      const verification = await verifyHuman({ token: form.get('altcha'), roleId: role.slug });
      const resume = await validateResume(form.get('resume'));
      const id = await saveApplication({ role, ...application, resume, verification, ipAddress: ipAddress || '127.0.0.1' });
      try { await notifyApplication(id); }
      catch { console.error('Career notification remains queued for retry.'); }
      return respond({ success: true }, 201);
    } catch (error) {
      status = error instanceof ApplicationError ? error.status : error?.code === '23505' ? 409 : 503;
      errorMessage = error instanceof ApplicationError ? error.message : status === 409
        ? 'An application for this role has already been received for this email address.'
        : 'We could not save your application. Your form is still here; please try again later.';
      // Never log answers, file contents, or database errors containing candidate data.
      if (status === 503) console.error('Career application unavailable:', error?.code || error?.name || 'unknown');
      return respond({ error: errorMessage, ...(error?.field ? { field: error.field } : {}) }, status);
    } finally {
      try { await recordTelemetry({ routeKey: '/api/careers', method: 'POST', statusCode: status, latencyMs: Date.now() - startedAt, errorMessage: status >= 500 ? 'Application service unavailable' : null }); }
      catch { /* Telemetry must not turn a saved application into a failed response. */ }
    }
  };
}
