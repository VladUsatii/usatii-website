import { scrypt, createDecipheriv } from 'node:crypto';
import { promisify } from 'node:util';
const deriveKey = promisify(scrypt);

export async function decryptResume(password, document) {
  if (typeof password !== 'string' || !password || password.length > 128) {
    throw new Error('Invalid password');
  }
  const key = await deriveKey(password, Buffer.from(document.salt, 'base64'), 32);
  const cipher = createDecipheriv('aes-256-gcm', key, Buffer.from(document.iv, 'base64'));
  cipher.setAuthTag(Buffer.from(document.tag, 'base64'));
  return Buffer.concat([cipher.update(Buffer.from(document.data, 'base64')), cipher.final()]);
}
