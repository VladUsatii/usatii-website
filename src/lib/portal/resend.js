function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export async function sendPasswordResetEmail({ email, resetUrl }) {
  const apiKey = String(process.env.RESEND_API_KEY || '').trim();
  const from = String(process.env.RESEND_FROM_EMAIL || '').trim();

  if (!apiKey || !from) {
    const error = new Error('Password reset email delivery is not configured.');
    error.code = 'resend_not_configured';
    throw error;
  }

  const safeUrl = escapeHtml(resetUrl);
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Reset your USATII password',
      text: `Use this link to reset your USATII password: ${resetUrl}\n\nThis link expires in one hour. If you did not request it, you can ignore this email.`,
      html: `
        <div style="background:#f5f5f5;padding:32px 16px;font-family:Arial,sans-serif;color:#171717">
          <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e5e5;border-radius:16px;padding:32px">
            <p style="margin:0 0 24px;font-size:13px;font-weight:700;letter-spacing:.12em">USATII</p>
            <h1 style="margin:0;font-size:28px;line-height:1.15">Reset your password</h1>
            <p style="margin:18px 0;color:#525252;line-height:1.6">Open the secure link below to choose a new password. The link expires in one hour and can be used once.</p>
            <a href="${safeUrl}" style="display:inline-block;margin:8px 0 24px;background:#171717;color:#ffffff;text-decoration:none;border-radius:10px;padding:13px 18px;font-weight:700">Reset password</a>
            <p style="margin:0;color:#737373;font-size:13px;line-height:1.6">If you did not request this reset, you can ignore this email. Your current password will continue to work.</p>
          </div>
        </div>
      `,
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || 'Resend rejected the password reset email.');
    error.code = 'resend_delivery_failed';
    error.status = response.status;
    throw error;
  }

  return payload;
}

// Call only after the correspondence has been saved. Delivery failures must not
// cause visitors to resubmit an already saved request.
export async function sendLeadNotification({ kind, id, details, replyTo, suspectedSpam = false }) {
  const apiKey = String(process.env.RESEND_API_KEY || '').trim();
  const from = String(process.env.RESEND_FROM_EMAIL || '').trim();
  const to = String(process.env.LEAD_NOTIFICATION_EMAIL || process.env.PORTAL_OWNER_EMAIL || '').trim();
  if (!apiKey || !from || !to) throw new Error('Lead notification email is not configured. Set RESEND_API_KEY, RESEND_FROM_EMAIL, and LEAD_NOTIFICATION_EMAIL or PORTAL_OWNER_EMAIL.');
  const subject = `${suspectedSpam ? '[Suspected spam] ' : ''}${kind === 'chat' ? 'New USATII live chat' : 'New USATII quote request'} #${id}`;
  const text = Object.entries(details).map(([key, value]) => `${key}: ${value || '—'}`).join('\n\n') + '\n\nDashboard: https://www.usatii.com/admin';
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    signal: AbortSignal.timeout(10000),
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `lead-${kind}-${id}` },
    body: JSON.stringify({ from, to: [to], subject, text, ...(replyTo ? { reply_to: replyTo } : {}), html: `<div style="font-family:Arial,sans-serif;white-space:pre-wrap;${suspectedSpam ? 'color:#be123c;text-decoration:line-through;' : ''}">${escapeHtml(text)}</div>` }),
  });
  if (!response.ok) throw new Error(`Lead notification delivery failed (${response.status}).`);
  return response.json();
}

export async function sendCareerApplicationNotification({ id, roleTitle, answers, resumeName }, { env = process.env, fetchImpl = fetch } = {}) {
  const apiKey = String(env.RESEND_API_KEY || '').trim();
  const from = String(env.RESEND_FROM_EMAIL || '').trim();
  const to = String(env.CAREER_NOTIFICATION_EMAIL || env.PORTAL_OWNER_EMAIL || env.LEAD_NOTIFICATION_EMAIL || '').trim();
  if (!apiKey || !from || !to) {
    const error = new Error('Career notification email is not configured.');
    error.code = 'resend_not_configured';
    throw error;
  }
  if (!/^\d{1,18}$/.test(String(id))) throw new Error('Invalid application ID.');
  const adminUrl = new URL(`/dashboard?tab=applications&application=${id}`, env.BASE_URL || 'https://www.usatii.com').toString();
  const details = [
    ['Role', roleTitle], ['Candidate', answers.fullName], ['Email', answers.email],
    ['Phone', answers.phone], ['Current location', answers.currentLocation],
    ['Current employer', answers.currentCompany], ['School / university', answers.university],
    ['Languages', Array.isArray(answers.languages) ? answers.languages.join(', ') : ''],
    ['LinkedIn', answers.linkedin], ['GitHub', answers.github], ['Portfolio', answers.portfolio],
    ['Resume', resumeName], ['Interest in the role', String(answers.motivation || '').slice(0, 1200)],
  ];
  const text = `New USATII application #${id}\n\n${details.filter(([, value]) => value).map(([label, value]) => `${label}: ${value}`).join('\n\n')}\n\nReview application: ${adminUrl}\n\nSign in as an administrator to see the full application and download the resume.`;
  const body = {
    from, to: [to],
    subject: `New application: ${String(roleTitle).replace(/[\r\n]/g, ' ')} — ${String(answers.fullName).replace(/[\r\n]/g, ' ')}`,
    text,
    html: `<div style="max-width:640px;font-family:Arial,sans-serif;color:#171717"><h1 style="font-size:22px">New career application</h1>${details.filter(([, value]) => value).map(([label, value]) => `<p style="line-height:1.5"><strong>${escapeHtml(label)}</strong><br/>${escapeHtml(value).replaceAll('\n', '<br/>')}</p>`).join('')}<p><a href="${escapeHtml(adminUrl)}" style="display:inline-block;padding:12px 18px;background:#171717;color:#fff;text-decoration:none;border-radius:6px">Review application #${escapeHtml(id)}</a></p><p style="font-size:12px;color:#737373">Administrator sign-in is required. Voluntary self-identification answers are not included in this email.</p></div>`,
    reply_to: answers.email,
  };
  // An idempotency key makes transport retries safe if Resend accepted a request
  // but the connection dropped before we received its response.
  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST', signal: AbortSignal.timeout(10000),
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `career-application-${id}` },
        body: JSON.stringify(body),
      });
      if (response.ok) return response.json();
      const error = new Error('Career notification delivery failed.');
      error.code = `resend_http_${response.status}`;
      if (response.status !== 429 && response.status < 500) throw error;
      lastError = error;
    } catch (error) {
      if (error.code?.startsWith('resend_http_') && !['resend_http_429'].includes(error.code) && Number(error.code.slice(12)) < 500) throw error;
      lastError = error;
    }
  }
  throw lastError || new Error('Career notification delivery failed.');
}
