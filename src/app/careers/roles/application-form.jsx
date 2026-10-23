'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { APPLICATION_SECTIONS, DEMOGRAPHIC_FIELDS, LANGUAGES, MAX_RESUME_BYTES, RESUME_ACCEPT } from '@/lib/careers/application-fields';

const inputClass = 'mt-2 block min-h-11 w-full rounded-sm border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-950 focus:border-neutral-950 focus:outline-2 focus:outline-offset-2 focus:outline-neutral-950 disabled:opacity-60';

export default function ApplicationForm({ roleId, roleTitle }) {
  const [widgetReady, setWidgetReady] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [error, setError] = useState('');
  const [errorField, setErrorField] = useState('');
  const [languages, setLanguages] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);
  const widgetRef = useRef(null);
  const messageRef = useRef(null);
  const successRef = useRef(null);
  const busy = phase !== 'idle';

  useEffect(() => { if (error) messageRef.current?.focus(); }, [error]);
  useEffect(() => { if (submitted) successRef.current?.focus(); }, [submitted]);

  useEffect(() => {
    let cancelled = false;
    import('altcha').then(() => customElements.whenDefined('altcha-widget')).then(async () => {
      if (cancelled) return;
      const widget = widgetRef.current;
      // No external service, cookies, or behavioral-data collection is needed.
      await widget?.configure({ humanInteractionSignature: false, workers: 2 });
      if (!cancelled) setWidgetReady(true);
    }).catch(() => {
      if (!cancelled) setError('The human check could not load. Please reload this page and try again.');
    });
    return () => { cancelled = true; };
  }, []);

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setError('');
    setErrorField('');
    const data = new FormData(event.currentTarget);
    if (!data.getAll('languages').length) {
      setErrorField('languages');
      setError('Select at least one language, or choose “Prefer not to disclose”.');
      return;
    }
    const resume = data.get('resume');
    if (resume && resume.size > MAX_RESUME_BYTES) {
      setErrorField('resume');
      setError('Your résumé must be 3 MB or smaller.');
      return;
    }
    if (!widgetReady || !widgetRef.current?.verify) {
      setError('The human check is not ready. Please try again in a moment.');
      return;
    }
    try {
      setPhase('verifying');
      widgetRef.current.reset();
      const verification = await widgetRef.current.verify();
      if (!verification?.payload) {
        setErrorField('humanVerification');
        throw new Error('The human check could not complete. Check your connection and try again.');
      }
      data.set('altcha', verification.payload);
      setPhase('sending');
      const response = await fetch('/api/careers', { method: 'POST', body: data, signal: AbortSignal.timeout(45000) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.success) {
        setErrorField(result.field || '');
        throw new Error(result.error || 'We could not save your application. Please try again.');
      }
      setSubmitted(true);
    } catch (caught) {
      setError(caught.name === 'TimeoutError' ? 'The request timed out. Your form is still here. Please try again; duplicate submissions will be identified.' : caught.message || 'A network error prevented submission. Please try again.');
      widgetRef.current?.reset();
    } finally {
      setPhase('idle');
    }
  }

  function renderField(field) {
    const id = `application-${field.name}`;
    const invalid = errorField === field.name;
    const helpId = field.help ? `${id}-help` : undefined;
    if (field.type === 'languages') return <fieldset key={field.name} className="sm:col-span-2" aria-describedby={invalid ? 'application-error' : undefined}>
      <legend className="text-sm font-medium">Languages <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></legend>
      <p className="mt-1 text-xs leading-5 text-neutral-500">Select all that apply, or choose “Prefer not to disclose”.</p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {LANGUAGES.map(language => <label key={language} className="flex min-h-9 items-center gap-2 text-sm text-neutral-600">
          <input type="checkbox" name="languages" value={language} checked={languages.includes(language)} onChange={event => setLanguages(current => event.target.checked ? language === 'Prefer not to disclose' ? [language] : [...current.filter(item => item !== 'Prefer not to disclose'), language] : current.filter(item => item !== language))} className="h-4 w-4 accent-neutral-950" />{language}
        </label>)}
      </div>
    </fieldset>;
    const props = { id, name: field.name, required: field.required || (field.name === 'otherLanguages' && languages.includes('Other')), 'aria-invalid': invalid || undefined, 'aria-describedby': invalid ? [helpId, 'application-error'].filter(Boolean).join(' ') : helpId, className: inputClass };
    return <div key={field.name} className={field.type === 'textarea' || field.options || field.help ? 'sm:col-span-2' : ''}>
      <label htmlFor={id} className="text-sm font-medium">{field.label}{props.required ? <><span aria-hidden="true"> *</span><span className="sr-only"> (required)</span></> : <span className="ml-1 font-normal text-neutral-500">(optional)</span>}</label>
      {field.options ? <select {...props} defaultValue=""><option value="">Select an answer</option>{field.options.map(option => <option key={option}>{option}</option>)}</select>
        : field.type === 'textarea' ? <textarea {...props} rows={4} maxLength={field.max} />
          : <input {...props} type={field.type || 'text'} maxLength={field.max} autoComplete={field.autoComplete || 'off'} />}
      {field.help && <p id={helpId} className="mt-2 text-xs leading-5 text-neutral-500">{field.help}</p>}
    </div>;
  }

  if (submitted) return <section id="apply" ref={successRef} tabIndex={-1} className="scroll-mt-24 border-t border-neutral-200 pt-8 outline-none" aria-live="polite">
    <h2 className="text-2xl font-medium tracking-[-0.03em]">Expression of interest received</h2>
    <p className="mt-4 text-sm leading-6 text-neutral-600">Thank you for your interest in {roleTitle}. Your application and résumé have been saved. USATII will review your background and contact you if there is a potential fit.</p>
    <p className="mt-3 text-sm leading-6 text-neutral-600">This is an anticipated position, contingent upon contract award, approved funding, and applicable staffing approvals.</p>
    <Link href="/careers/roles" className="mt-5 inline-block text-sm underline underline-offset-4">View other roles</Link>
  </section>;

  return <section id="apply" className="scroll-mt-24 border-t border-neutral-200 pt-8" aria-labelledby="application-heading">
    <h2 id="application-heading" className="text-2xl font-medium tracking-[-0.03em]">Apply for this role</h2>
    <p className="mt-3 text-sm leading-6 text-neutral-600">Submit an expression of interest for {roleTitle}. Fields marked * are required. Employment remains contingent upon contract award or approved funding.</p>
    <form ref={formRef} onSubmit={submit} className="mt-8 space-y-10" aria-busy={busy}>
      <input type="hidden" name="roleId" value={roleId} />
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden"><label htmlFor="application-company-website">Leave this field empty</label><input id="application-company-website" name="websiteCompany" type="text" tabIndex={-1} autoComplete="off" /></div>
      <fieldset disabled={busy} className="space-y-10">
        <div>
          <label htmlFor="application-resume" className="text-sm font-medium">Résumé / CV <span aria-hidden="true">*</span><span className="sr-only"> (required)</span></label>
          <input id="application-resume" name="resume" type="file" accept={RESUME_ACCEPT} required aria-invalid={errorField === 'resume' || undefined} aria-describedby="resume-help" className="mt-3 block w-full text-sm text-neutral-600 file:mr-4 file:min-h-11 file:rounded-sm file:border file:border-neutral-300 file:bg-white file:px-4 file:text-sm file:text-neutral-950 hover:file:bg-neutral-50" />
          <p id="resume-help" className="mt-2 text-xs text-neutral-500">PDF, DOC, or DOCX. Maximum 3 MB.</p>
        </div>
        {APPLICATION_SECTIONS.map(section => <section key={section.title} className="border-t border-neutral-100 pt-7" aria-labelledby={`section-${section.title.replaceAll(' ', '-')}`}>
          <h3 id={`section-${section.title.replaceAll(' ', '-')}`} className="text-base font-medium">{section.title}</h3>
          <div className="mt-5 grid gap-x-5 gap-y-6 sm:grid-cols-2">{section.fields.map(renderField)}</div>
        </section>)}
        <section className="border-t border-neutral-100 pt-7" aria-labelledby="voluntary-heading">
          <h3 id="voluntary-heading" className="text-base font-medium">Voluntary self-identification</h3>
          <p className="mt-3 text-xs leading-5 text-neutral-500">You may skip these questions. Answers are stored separately and are not displayed in the hiring application inbox. Do not include medical details. This is an optional USATII survey, not a government form.</p>
          <div className="mt-5 grid gap-6">{DEMOGRAPHIC_FIELDS.map(renderField)}</div>
        </section>
        <div className="border-t border-neutral-100 pt-7">
          <label className="flex items-start gap-3 text-sm leading-6 text-neutral-600"><input type="checkbox" name="privacyConsent" value="yes" required className="mt-1 h-4 w-4 shrink-0 accent-neutral-950" /><span>I acknowledge that USATII will use my application information and résumé to evaluate my candidacy, communicate with me, and maintain recruiting records as described in the <Link href="/privacy#recruiting" className="underline underline-offset-4">privacy notice</Link>. *</span></label>
        </div>
      </fieldset>
      <div aria-label="Are you human?">
        <p className="text-sm font-medium">Are you human?</p>
        <p className="mt-2 text-xs leading-5 text-neutral-500">A quick, automatic check runs when you submit to help prevent application spam.</p>
        <altcha-widget ref={widgetRef} challenge={`/api/careers/challenge?roleId=${encodeURIComponent(roleId)}`} auto="off" display="bar" className="mt-3 block" />
      </div>
      {error && <div id="application-error" ref={messageRef} role="alert" tabIndex={-1} className="border-l-2 border-red-600 pl-4 text-sm leading-6 text-red-700 outline-none"><p>{error}</p>{errorField && errorField !== 'humanVerification' && <button type="button" onClick={() => { const field = formRef.current?.elements.namedItem(errorField); (field?.focus ? field : field?.[0])?.focus(); }} className="mt-2 underline underline-offset-4">Review this field</button>}</div>}
      <button type="submit" disabled={busy || !widgetReady} className="inline-flex min-h-11 items-center rounded-sm bg-neutral-950 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50">{phase === 'verifying' ? 'Verifying…' : phase === 'sending' ? 'Submitting…' : 'Submit application'}</button>
      <p role="status" aria-live="polite" className="sr-only">{phase === 'verifying' ? 'Running the automatic human verification check.' : phase === 'sending' ? 'Saving your application.' : ''}</p>
      <noscript><p className="text-sm text-neutral-600">JavaScript is required to complete the human verification check and submit this form.</p></noscript>
    </form>
  </section>;
}
