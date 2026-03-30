import { Resend } from 'resend';

// Vercel יקרא את המפתח הזה ממשתני הסביבה
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // אנחנו רוצים לאפשר רק בקשות POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // שולפים את הפרטים שנשלחו מהפרונטאנד
  const { name, email, phone, profession } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // כרגע זה ישלח מכתובת הטסטים של Resend
      to: ['itaykorin@gmail.com'], // האימייל שלך
      subject: '🎉 מטפל חדש נרשם וממתין לאישור!',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0f766e;">מטפל חדש נרשם למערכת</h2>
          <p>היי, מטפל חדש סיים את תהליך ההרשמה וממתין לאישורך.</p>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>שם:</strong> ${name || 'לא צוין'}</p>
            <p style="margin: 5px 0;"><strong>אימייל:</strong> ${email || 'לא צוין'}</p>
            <p style="margin: 5px 0;"><strong>טלפון:</strong> ${phone || 'לא צוין'}</p>
            <p style="margin: 5px 0;"><strong>תחום טיפול:</strong> ${profession || 'לא צוין'}</p>
          </div>
          
          <div style="text-align: right; margin-top: 25px;">
            <a href="https://itai-web-project.vercel.app/admin" style="background-color: #0f766e; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              מעבר לאישור בפאנל הניהול
            </a>
          </div>
          
          <br/>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            הודעה זו נשלחה אוטומטית ממערכת הרישום.
          </p>
        </div>
      `,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Resend Error:", error);
    res.status(400).json({ error: error.message });
  }
}