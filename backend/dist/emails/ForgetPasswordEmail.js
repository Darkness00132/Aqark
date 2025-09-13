import { SendEmailCommand } from '@aws-sdk/client-ses';
import sesClient from '../utils/amazonSES.js';
async function forgetPasswordEmail(resetPasswordToken, email) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
    try {
        const result = await sesClient.send(new SendEmailCommand({
            Source: process.env.EMAIL_SOURCE,
            Destination: { ToAddresses: [email] },
            Message: {
                Subject: { Data: 'Reset your password' },
                Body: {
                    Html: {
                        Data: `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`,
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
export default forgetPasswordEmail;
//# sourceMappingURL=ForgetPasswordEmail.js.map