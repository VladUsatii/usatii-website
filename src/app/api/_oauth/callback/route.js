import { google } from 'googleapis';

const oauth2cb = new google.auth.OAuth2(
  process.env.GOOGLE_OAUTH_CLIENT_ID,
  process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  `${process.env.BASE_URL}/api/oauth/callback`
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) return new Response('Missing code', { status: 400 });

  const { tokens } = await oauth2cb.getToken(code);
  const rt = tokens.refresh_token;
  console.log('Refresh Token:', rt);
  // TODO: persist rt (e.g. write to your DB or env)
  return new Response(
    JSON.stringify({ refresh_token: rt }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}