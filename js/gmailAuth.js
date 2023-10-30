const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);

const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
const TOKEN_PATH = 'token.json';

const authenticateWithGoogle = async () => {
  // Load client secrets from a file you download from the Google Developer Console
  const credentials = await readFileAsync('credentials.json');
  const { client_id, client_secret, redirect_uris } = JSON.parse(credentials);
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  try {
    // Check if we have previously stored a token.
    const token = await readFileAsync(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    return oAuth2Client;
  } catch (err) {
    return await getNewToken(oAuth2Client);
  }
};

const getNewToken = async (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this URL:', authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve, reject) => {
    rl.question('Enter the code from that page here: ', async (code) => {
      rl.close();

      try {
        const token = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(token.tokens);
        // Store the token to disk for later program executions
        await fs.promises.writeFile(TOKEN_PATH, JSON.stringify(token.tokens));
        console.log('Token stored to', TOKEN_PATH);
        resolve(oAuth2Client);
      } catch (err) {
        reject(err);
      }
    });
  });
};

module.exports = authenticateWithGoogle;
