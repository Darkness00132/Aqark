import { SendEmailCommand } from '@aws-sdk/client-ses';
import sesClient from '../utils/amazonSES.js';
async function verifyEmail(verificationToken, email) {
    try {
        const result = await sesClient.send(new SendEmailCommand({
            Source: process.env.EMAIL_SOURCE,
            Destination: { ToAddresses: [email] },
            Message: {
                Subject: { Data: 'Verify Your Email Address' },
                Body: {
                    Html: {
                        Data: `
              <html>
                <body>
                  <h1>Verify Your Email Address</h1>
                  <p>Please click the link below to verify your email address:</p>
                  <a href="http://localhost:3000/api/users/verifyEmail?verificationToken=${verificationToken}">Verify Email</a>
                  <p>This link will expire in 10 minutes.</p>
                </body>
              </html>
            `,
                    },
                },
            },
        }));
        console.log('Email sent: ', result);
    }
    catch (error) {
        console.error('Error sending verification email:', error);
    }
}
export default verifyEmail;
//# sourceMappingURL=verifyEmail.js.map