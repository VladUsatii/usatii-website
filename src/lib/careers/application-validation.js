import { APPLICATION_FIELDS, DEMOGRAPHIC_FIELDS, LANGUAGES, MAX_RESUME_BYTES } from './application-fields.js';

export class ApplicationError extends Error {
  constructor(message, status = 400, field = null) {
    super(message);
    this.status = status;
    this.field = field;
  }
}

export function validateApplication(form) {
  const answers = {};
  for (const field of [...APPLICATION_FIELDS, ...DEMOGRAPHIC_FIELDS]) {
    if (field.type === 'languages') {
      const values = form.getAll(field.name);
      if (!values.length || values.length > LANGUAGES.length || values.some(value => typeof value !== 'string' || !LANGUAGES.includes(value))) {
        throw new ApplicationError('Select at least one language, or choose “Prefer not to disclose”.', 400, field.name);
      }
      answers[field.name] = [...new Set(values)];
      continue;
    }
    const raw = form.get(field.name);
    if (raw !== null && typeof raw !== 'string') throw new ApplicationError(`Invalid ${field.label.toLowerCase()}.`, 400, field.name);
    const value = (raw || '').trim();
    if (field.required && !value) throw new ApplicationError(`Please complete: ${field.label}`, 400, field.name);
    if (value.length > (field.max || 500)) throw new ApplicationError(`${field.label} is too long.`, 400, field.name);
    if (value && field.options && !field.options.includes(value)) throw new ApplicationError(`Choose a valid answer for: ${field.label}`, 400, field.name);
    if (value && field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) throw new ApplicationError('Enter a valid email address.', 400, field.name);
    if (value && field.type === 'url') {
      let url;
      try { url = new URL(value); } catch { /* validated below */ }
      if (!url || !['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new ApplicationError(`Enter an http or https URL for ${field.label.toLowerCase()}.`, 400, field.name);
    }
    answers[field.name] = value;
  }
  if (answers.languages.includes('Prefer not to disclose') && answers.languages.length > 1) throw new ApplicationError('Choose languages or “Prefer not to disclose”, rather than both.', 400, 'languages');
  if (answers.languages.includes('Other') && !answers.otherLanguages) throw new ApplicationError('Please specify your other languages.', 400, 'otherLanguages');
  if (form.get('privacyConsent') !== 'yes') throw new ApplicationError('Please acknowledge the application privacy notice.', 400, 'privacyConsent');
  answers.email = answers.email.toLowerCase();
  answers.privacyConsent = true;
  answers.privacyNoticeVersion = '2026-10-22';
  const demographics = {};
  for (const field of DEMOGRAPHIC_FIELDS) {
    if (answers[field.name] && answers[field.name] !== 'Prefer not to disclose') demographics[field.name] = answers[field.name];
    delete answers[field.name];
  }
  return { answers, demographics };
}

export async function validateResume(file) {
  if (!file || typeof file.arrayBuffer !== 'function' || !file.size) throw new ApplicationError('Attach your résumé as a PDF, DOC, or DOCX file.', 400, 'resume');
  if (file.size > MAX_RESUME_BYTES) throw new ApplicationError('Your résumé must be 3 MB or smaller.', 400, 'resume');
  const extension = String(file.name).split('.').pop().toLowerCase();
  const bytes = Buffer.from(await file.arrayBuffer());
  const valid = extension === 'pdf' ? bytes.subarray(0, 5).toString() === '%PDF-'
    : extension === 'doc' ? bytes.subarray(0, 8).equals(Buffer.from('d0cf11e0a1b11ae1', 'hex'))
    : extension === 'docx' ? bytes.subarray(0, 4).equals(Buffer.from('504b0304', 'hex')) && bytes.includes(Buffer.from('word/document.xml'))
    : false;
  if (!valid) throw new ApplicationError('Upload a valid PDF, DOC, or DOCX résumé.', 400, 'resume');
  const name = String(file.name).replace(/[\x00-\x1f\x7f/\\]/g, '_').slice(-255);
  const mime = { pdf: 'application/pdf', doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }[extension];
  return { name, mime, bytes, size: bytes.length };
}
