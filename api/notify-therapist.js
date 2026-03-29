import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { therapistEmail, therapistName, patientName, patientPhone } = req.body;

  try {
    const data = await resend.emails.send({
      from: 'FindMyTherapist <onboarding@resend.dev>', // בייצור: תשנה לכתובת הדומיין שלך
      to: [therapistEmail], // נשלח ישירות למטפל
      subject: `🎉 פנייה חדשה התקבלה מ-${patientName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #0f766e;">שלום ${therapistName || 'מטפל/ת יקר/ה'},</h2>
          <p>התקבלה פנייה חדשה עבורך באתר!</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>שם הפונה:</strong> ${patientName || 'לא צוין'}</p>
            <p style="margin: 0;"><strong>טלפון:</strong> ${patientPhone || 'לא צוין'}</p>
          </div>
          <p>כדי לצפות בתוכן ההודעה המלא ולנהל את הפניות שלך, היכנס לאזור האישי באתר.</p>
          <br/>
          <a href="https://itai-web-project.vercel.app/therapist-portal" style="background-color: #0f766e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">כניסה לאזור האישי</a>
        </div>
      `,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}