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
            <p style="margin:0 0 24px;font-size:13px;font-weight:700;letter-spacing:.12em">USATII MEDIA</p>
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
