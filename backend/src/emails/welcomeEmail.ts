import { SendEmailCommand } from '@aws-sdk/client-ses';
import sesClient from '../utils/amazonSES.js';

async function WelcomeEmail(email: string) {
  try {
    const result = await sesClient.send(
      new SendEmailCommand({
        Source: process.env.EMAIL_SOURCE!,
        Destination: { ToAddresses: [email] },
        Message: {
          Subject: { Data: 'Welcome to Our Service!' },
          Body: {
            Html: {
              Data: `
            <html>
              <body>
                <h1>Welcome to Our Service!</h1>
                <p>We're glad to have you on board.</p>
              </body>
            </html>
            `,
            },
          },
        },
      }),
    );
    console.log('Email sent: ', result);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
}

export default WelcomeEmail;
