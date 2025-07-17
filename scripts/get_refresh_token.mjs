import { google } from 'googleapis';
import readline from 'node:readline/promises';
import open from 'open';

const CLIENT_ID     = process.env.GOOGLE_OAUTH_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
const REDIRECT_URI  = 'http://localhost:3000/api/oauth/callback';   // use any URI you‘ve added in Cloud Console

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const oauth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
const url   = oauth.generateAuthUrl({ access_type: 'offline', prompt: 'consent', scope: SCOPES });

console.log('\nOpen this URL in your browser:\n', url);
await open(url);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const code = await rl.question('\nPaste the code Google shows you: ');
rl.close();

const { tokens } = await oauth.getToken(code.trim());
console.log('\nAdd this to .env:\nGOOGLE_REFRESH_TOKEN=', tokens.refresh_token);