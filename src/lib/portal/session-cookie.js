function bytesToBase64Url(bytes) {
  let binary = '';
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  const base64 =
    typeof btoa === 'function'
      ? btoa(binary)
      : Buffer.from(binary, 'binary').toString('base64');

  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlToBytes(value) {
  const padded = value + '==='.slice((value.length + 3) % 4);
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  const binary =
    typeof atob === 'function'
      ? atob(base64)
      : Buffer.from(base64, 'base64').toString('binary');
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function textToBase64Url(text) {
  return bytesToBase64Url(new TextEncoder().encode(text));
}

function base64UrlToText(value) {
  return new TextDecoder().decode(base64UrlToBytes(value));
}

async function signPayload(encodedPayload, secret) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(encodedPayload)
  );

  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createSignedSessionValue(payload, secret) {
  const encodedPayload = textToBase64Url(JSON.stringify(payload));
  const encodedSignature = await signPayload(encodedPayload, secret);
  return `${encodedPayload}.${encodedSignature}`;
}

export async function verifySignedSessionValue(value, secret) {
  if (!value || typeof value !== 'string') return null;

  const [encodedPayload, encodedSignature] = value.split('.');
  if (!encodedPayload || !encodedSignature) return null;

  const expectedSignature = await signPayload(encodedPayload, secret);
  if (expectedSignature !== encodedSignature) return null;

  try {
    return JSON.parse(base64UrlToText(encodedPayload));
  } catch {
    return null;
  }
}
