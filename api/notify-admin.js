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
      to: ['itaykorin@gmail.com'], // <<< תשנה את זה לאימייל שלך (האדמין)
      subject: '🎉 מטפל חדש נרשם וממתין לאישור!',
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0f766e;">מטפל חדש נרשם למערכת</h2>
          <p>היי, מטפל חדש סיים את תהליך ההרשמה וממתין לאישורך.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
            <p><strong>שם:</strong> ${name || 'לא צוין'}</p>
            <p><strong>אימייל:</strong> ${email || 'לא צוין'}</p>
            <p><strong>טלפון:</strong> ${phone || 'לא צוין'}</p>
            <p><strong>תחום טיפול:</strong> ${profession || 'לא צוין'}</p>
          </div>
          <br/>
          <p>אנא היכנס לפאנל הניהול ב-Supabase או במערכת כדי לאשר אותו.</p>
        </div>
      `,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("Resend Error:", error); // זה ידפיס את השגיאה המפורטת בלוגים של ורסל
    res.status(400).json({ error: error.message });
  }
}