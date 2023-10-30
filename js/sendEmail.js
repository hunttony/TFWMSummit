const { google } = require('googleapis');
const authenticateWithGoogle = require('./gmailAuth');

const sendEmail = async () => {
  try {
    const auth = await authenticateWithGoogle();
    const gmail = google.gmail({ version: 'v1', auth });

    const rawEmail = 'From: your-gmail@gmail.com\n' +
                     'To: recipient@example.com\n' +
                     'Subject: Subject of the Email\n' +
                     'Content-Type: text/plain; charset=utf-8\n' +
                     '\n' +
                     'This is the text content of the email.';

    const encodedEmail = Buffer.from(rawEmail).toString('base64');

    const message = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail,
      },
    });

    console.log('Email sent:', message.data);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

sendEmail();
