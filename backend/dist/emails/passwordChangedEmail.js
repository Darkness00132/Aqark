import { SendEmailCommand } from '@aws-sdk/client-ses';
import sesClient from '../utils/amazonSES.js';
async function passwordChangedEmail(email) {
    try {
        const result = await sesClient.send(new SendEmailCommand({
            Source: process.env.EMAIL_SOURCE,
            Destination: { ToAddresses: [email] },
            Message: {
                Subject: { Data: 'Password Changed Successfully' },
                Body: {
                    Html: {
                        Data: `
            <html>
              <body>
                <h1>Password Changed Successfully</h1>
                <p>Your password has been changed successfully.</p>
              </body>
            </html>
          `,
                    },
                },
            },
        }));
        console.log('email send: ', result);
    }
    catch (e) {
        console.log('faild to send email: ', e);
    }
}
export default passwordChangedEmail;
//# sourceMappingURL=passwordChangedEmail.js.map