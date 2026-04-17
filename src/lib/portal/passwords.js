import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

export function validateStrongPassword(password) {
  const value = String(password || '');

  if (value.length < 12) return 'Password must be at least 12 characters long.';
  if (!/[a-z]/.test(value)) return 'Password must include at least one lowercase letter.';
  if (!/[A-Z]/.test(value)) return 'Password must include at least one uppercase letter.';
  if (!/[0-9]/.test(value)) return 'Password must include at least one number.';
  if (!/[^A-Za-z0-9]/.test(value)) return 'Password must include at least one symbol.';

  return null;
}

export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(String(password || ''), salt, 64);
  return `scrypt:${salt}:${Buffer.from(derived).toString('hex')}`;
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return false;

  const [algorithm, salt, expectedHash] = storedHash.split(':');
  if (algorithm !== 'scrypt' || !salt || !expectedHash) return false;

  const derived = await scrypt(String(password || ''), salt, 64);
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const candidateBuffer = Buffer.from(derived);

  if (expectedBuffer.length !== candidateBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, candidateBuffer);
}
