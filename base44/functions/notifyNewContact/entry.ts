import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();

    const { data } = body;

    // Get therapist info - use passed data first, fallback to DB lookup
    let therapistName = data?.therapist_name || "לא ידוע";
    let therapistEmail = data?.therapist_email || null;
    if (!therapistEmail && data?.therapist_id) {
      const therapist = await base44.asServiceRole.entities.Therapist.get(data.therapist_id);
      if (therapist) {
        therapistName = therapist.full_name;
        therapistEmail = therapist.email || null;
      }
    }

    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    const subject = `פנייה חדשה התקבלה – ${data?.patient_name || "לא ידוע"}`;
    const body_html = `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2>📩 פנייה חדשה התקבלה</h2>
        <p><strong>שם מטופל/ת:</strong> ${data?.patient_name || "—"}</p>
        <p><strong>אימייל:</strong> ${data?.patient_email || "—"}</p>
        <p><strong>טלפון:</strong> ${data?.patient_phone || "—"}</p>
        <p><strong>מטפל/ת שפנו אליו/ה:</strong> ${therapistName}</p>
        <p><strong>הודעה:</strong> ${data?.message || "—"}</p>
        <p><strong>פורמט מועדף:</strong> ${data?.preferred_format || "—"}</p>
        <hr/>
        <p style="color:#888;font-size:12px;">הודעה אוטומטית ממערכת נפש טובה</p>
      </div>
    `;

    const emails = [];

    // Notify admin
    if (adminEmail) {
      emails.push(base44.asServiceRole.integrations.Core.SendEmail({
        to: adminEmail,
        subject,
        body: body_html,
      }));
    }

    // Notify therapist
    if (therapistEmail) {
      emails.push(base44.asServiceRole.integrations.Core.SendEmail({
        to: therapistEmail,
        subject,
        body: body_html,
      }));
    }

    await Promise.all(emails);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});