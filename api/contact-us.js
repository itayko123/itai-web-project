import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // שולפים את הפרטים שנשלחו מטופס צור קשר
  const { name, email, phone, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>', // בטסטים זה נשאר ככה
      to: ['itaykorin@gmail.com'], // <<< תשנה לאימייל שלך!
      subject: `✉️ הודעה חדשה מטופס צור קשר: ${name}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #0f766e;">פנייה חדשה - צור קשר</h2>
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
    res.status(400).json({ error: error.message });
  }
}