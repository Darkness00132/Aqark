const resend = require("../utils/resend");

async function forgetPasswordEmail(resetPasswordToken: string, email: string) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL,
    to: [email],
    subject: "إعادة تعيين كلمة المرور",
    html: `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;700&display=swap" rel="stylesheet">
          <style>
            body {
              background-color: #f6f9fc;
              font-family: 'Cairo', Arial, sans-serif;
              color: #404040;
              line-height: 1.6;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background-color: #ffffff;
              border: 1px solid #f0f0f0;
              padding: 40px;
              border-radius: 8px;
            }
            .button {
              display: inline-block;
              padding: 12px 20px;
              margin-top: 15px;
              background-color: #FF5722;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
            }
            p {
              margin: 16px 0;
              font-size: 16px;
            }
            .footer {
              margin-top: 20px;
              font-size: 14px;
              color: #555;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>إعادة تعيين كلمة المرور 👋</h2>
            <p>لقد طلبت إعادة تعيين كلمة المرور الخاصة بك. اضغط على الزر أدناه لتعيين كلمة مرور جديدة:</p>
            <a href="${process.env.FRONTEND_URL}/reset-password?resetPasswordToken=${resetPasswordToken}" class="button">إعادة تعيين كلمة المرور</a>
            <p class="footer">
              إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة بأمان.
            </p>
            <p class="footer">
              للحفاظ على أمان حسابك، لا تشارك هذا الرابط مع أي شخص آخر.
            </p>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    return console.error({ error });
  }
}

export default forgetPasswordEmail;
