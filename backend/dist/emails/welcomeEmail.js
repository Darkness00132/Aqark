import resend from '../utils/resend.js';
async function WelcomeEmail(email) {
    const { data, error } = await resend.emails.send({
        from: process.env.EMAIL,
        to: [email],
        subject: 'مرحبًا بك في عقارك!',
        html: `  <!DOCTYPE html>
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
      <h2>مرحبًا بك في عقارك 👋</h2>
      <p>نشكر تسجيلك معنا! نحن سعداء بانضمامك إلى منصتنا ونتطلع لمساعدتك في العثور على العقارات المناسبة.</p>
      <p>ابدأ الآن بالبحث عن العقارات أو أضف عقاراتك لتصل إلى المزيد من العملاء بسهولة.</p>
      <a href=${process.env.FRONTEND_URL} class="button">ابدأ الآن</a>
      <p class="footer">
        إذا لم تقم بإنشاء حساب، يمكنك تجاهل هذه الرسالة بأمان.
      </p>
      <p class="footer">
        للحفاظ على أمان حسابك، لا تشارك هذا البريد مع أي شخص آخر.
      </p>
    </div>
  </body>
</html> `,
    });
    if (error) {
        return console.error({ error });
    }
}
export default WelcomeEmail;
//# sourceMappingURL=welcomeEmail.js.map