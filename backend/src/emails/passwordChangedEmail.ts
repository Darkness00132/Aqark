const resend = require("../utils/resend");

async function passwordChangedEmail(email: string) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL,
    to: [email],
    subject: "تم تغيير كلمة المرور بنجاح",
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
            <h2>تم تغيير كلمة المرور 👋</h2>
            <p>تم تغيير كلمة المرور الخاصة بحسابك بنجاح.</p>
            <p>إذا لم تكن أنت من قام بهذا التغيير، يرجى الاتصال بنا فورًا لاتخاذ الإجراءات اللازمة.</p>
            <p class="footer">
              للحفاظ على أمان حسابك، لا تشارك هذه المعلومات مع أي شخص آخر.
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

export default passwordChangedEmail;
