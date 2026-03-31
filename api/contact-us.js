import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // שולפים את הפרטים שנשלחו מטופס צור קשר, כולל טוקן הריקאפצ'ה שהפרונטאנד צריך לשלוח
  const { name, email, phone, message, recaptchaToken } = req.body;

  // מוודאים שבכלל נשלח טוקן
  if (!recaptchaToken) {
    return res.status(400).json({ error: 'חסר טוקן אימות. לא ניתן לשלוח את הפנייה.' });
  }

  try {
    // 1. אימות ה-reCAPTCHA מול השרתים של גוגל
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;
    const recaptchaRes = await fetch(verifyUrl, { method: 'POST' });
    const recaptchaData = await recaptchaRes.json();

    // בודקים אם האימות נכשל או שהציון נמוך מדי (ב-v3 ציון מתחת ל-0.5 נחשב לרוב כבוט)
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      console.error('Recaptcha verification failed:', recaptchaData);
      return res.status(400).json({ error: 'אימות אנושי נכשל (נחשדת כרובוט). לא ניתן לשלוח את ההודעה.' });
    }

    // 2. האימות עבר בהצלחה - ממשיכים לשליחת המייל
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // בטסטים זה נשאר ככה
      to: ['itaykorin@gmail.com'], // <<< תשנה לאימייל שלך!
      subject: `✉️ הודעה חדשה מטופס צור קשר: ${name}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0f766e;">פנייה חדשה - צור קשר (אומת כמשתמש אנושי)</h2>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
            <p><strong>שם הפונה:</strong> ${name || 'לא צוין'}</p>
            <p><strong>אימייל:</strong> ${email || 'לא צוין'}</p>
            <p><strong>טלפון:</strong> ${phone || 'לא צוין'}</p>
            <hr style="border: none; border-top: 1px solid #ccc; margin: 15px 0;" />
            <p><strong>תוכן ההודעה:</strong></p>
            <p style="white-space: pre-wrap;">${message || 'אין תוכן'}</p>
          </div>
        </div>
      `,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: error.message || 'שגיאה פנימית בשרת' });
  }
}