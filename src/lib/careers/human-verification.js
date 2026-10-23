import { createHmac, randomInt } from 'node:crypto';
import { createChallenge, verifySolution } from 'altcha-lib';
import { deriveKey } from 'altcha-lib/algorithms/pbkdf2';
import { ApplicationError } from './application-validation.js';

export function getCareerChallengeSecrets(secret = process.env.ALTCHA_HMAC_SECRET || process.env.PORTAL_AUTH_SECRET) {
  if (typeof secret !== 'string' || secret.length < 32) throw new ApplicationError('Applications are temporarily unavailable. Please try again later.', 503);
  // Domain separation keeps this signing key independent of portal sessions.
  const derive = context => createHmac('sha256', secret).update(context).digest('hex');
  return { hmacSignatureSecret: derive('usatii:career-challenge:v1'), hmacKeySignatureSecret: derive('usatii:career-solution:v1') };
}

export async function createCareerChallenge(roleId, secrets = getCareerChallengeSecrets()) {
  return createChallenge({
    algorithm: 'PBKDF2/SHA-256',
    cost: 1000,
    counter: randomInt(1000, 3000),
    deriveKey,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    data: { purpose: 'career_application', roleId },
    ...secrets,
  });
}

export async function verifyCareerHuman({ token, roleId }, secrets = getCareerChallengeSecrets()) {
  const invalid = () => new ApplicationError('The human check failed or expired. Please submit again to repeat it.', 400, 'humanVerification');
  if (typeof token !== 'string' || !token || token.length > 12000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(token)) throw invalid();
  let payload;
  try { payload = JSON.parse(Buffer.from(token, 'base64').toString('utf8')); } catch { throw invalid(); }
  const parameters = payload?.challenge?.parameters;
  if (!parameters || parameters.algorithm !== 'PBKDF2/SHA-256' || parameters.cost !== 1000 || parameters.keyLength !== 32 ||
      typeof parameters.nonce !== 'string' || !/^[a-f0-9]{16,128}$/i.test(parameters.nonce) ||
      !Number.isFinite(parameters.expiresAt) || parameters.expiresAt > Date.now() / 1000 + 610 ||
      parameters.data?.purpose !== 'career_application' || parameters.data?.roleId !== roleId ||
      typeof payload?.challenge?.signature !== 'string' || !payload.solution) throw invalid();
  let result;
  try { result = await verifySolution({ challenge: payload.challenge, solution: payload.solution, deriveKey, ...secrets }); }
  catch { throw invalid(); }
  if (!result.verified) throw invalid();
  // The database consumes this nonce atomically with application insertion.
  return { challengeId: parameters.nonce, expiresAt: new Date(parameters.expiresAt * 1000).toISOString() };
}
