import resend from '../utils/resend.js';

async function verifyEmail(verifyUrl: string, email: string) {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL!,
    to: [email],
    subject: 'تأكيد البريد الإلكتروني الخاص بك',
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
        background-color: #4CAF50;
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
      <h2>أهلاً بك في عقارك 👋</h2>
      <p>شكرًا لتسجيلك معنا. من فضلك قم بتأكيد بريدك الإلكتروني بالضغط على الزر أدناه:</p>
      <a href="${verifyUrl}" class="button">تأكيد البريد الإلكتروني</a>
      <p class="footer">
        إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذه الرسالة بأمان.
      </p>
      <p class="footer">
        للحفاظ على أمان حسابك، لا تقم بمشاركة هذا البريد الإلكتروني مع أي شخص آخر.
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

export default verifyEmail;
