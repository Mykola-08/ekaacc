import { jwtVerify, createRemoteJWKSet } from 'jose';

const ISSUER = process.env.AUTH0_ISSUER_BASE_URL;
const AUDIENCE = process.env.AUTH0_AUDIENCE;
const JWKS_URI = `${ISSUER}/.well-known/jwks.json`;

const JWKS = createRemoteJWKSet(new URL(JWKS_URI));

export async function verifyAuth(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `${ISSUER}/`, // Auth0 issuer usually has a trailing slash
      audience: AUDIENCE,
    });
    return payload;
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return null;
  }
}
