import { parsePhoneNumberFromString } from 'libphonenumber-js/min';

export function workFlowContact(value, type) {
  if (!['phone', 'email', 'text', 'short_text', 'long_text'].includes(type)) return null;
  const raw = String(typeof value === 'object' && value ? value.raw || value.normalized || '' : value || '').trim();
  if (/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(raw)) {
    return { kind: 'email', label: raw, href: `mailto:${encodeURIComponent(raw)}`, gmailHref: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(raw)}` };
  }
  if (!/^[+\d().\s-]+(?:\s*(?:ext\.?|x)\s*\d+)?$/i.test(raw) || raw.replace(/\D/g, '').length < 10) return null;
  const phone = parsePhoneNumberFromString(raw, value?.country || 'US');
  if (!phone?.isValid()) return null;
  const extension = value?.extension || phone.ext;
  phone.setExt(undefined);
  return { kind: 'phone', label: `${phone.country === 'US' || phone.country === 'CA' ? phone.formatNational() : phone.formatInternational()}${extension ? ` ext. ${extension}` : ''}`, href: `tel:${phone.number}${extension ? `;ext=${encodeURIComponent(extension)}` : ''}` };
}
