// Conservative signals only; a flag is a review aid, never a rejection.
export function getQuoteQuality({ fullName = '', message = '' } = {}) {
  const text = String(message).trim();
  const reasons = [];
  if (/[\uFFFD\u0000-\u0008\u000E-\u001F]/u.test(text)) reasons.push('Corrupted text');
  if (/(.)\1{7,}/u.test(text)) reasons.push('Repeated characters');
  const words = text.match(/[a-zA-Z]+/g) || [];
  const garbled = words.filter((word) => word.length >= 9 && (/^[^aeiouy]+$/i.test(word) || (word.length >= 14 && /[a-z][A-Z][a-z].*[A-Z]/.test(word))));
  if (garbled.length && garbled.join('').length >= words.join('').length * 0.6) reasons.push('Likely garbled message');
  if (/^(asdf|qwer|zxcv|testtest)/i.test(text.replace(/\s/g, ''))) reasons.push('Keyboard or test text');
  return { suspectedSpam: reasons.length > 0, reasons };
}
