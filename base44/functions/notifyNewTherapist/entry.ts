import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { data } = body;

    const adminEmail = Deno.env.get("ADMIN_EMAIL");

    const subject = `מטפל/ת חדש/ה נרשם/ה – ${data?.full_name || "לא ידוע"}`;
    const body_html = `
      <div dir="rtl" style="font-family: Arial, sans-serif;">
        <h2>🆕 מטפל/ת חדש/ה נרשם/ה לאתר</h2>
        <p><strong>שם:</strong> ${data?.full_name || "—"}</p>
        <p><strong>מקצוע:</strong> ${data?.profession || "—"}</p>
        <p><strong>אימייל:</strong> ${data?.email || "—"}</p>
        <p><strong>טלפון:</strong> ${data?.phone || "—"}</p>
        <p><strong>עיר:</strong> ${data?.city || "—"}</p>
        <p><strong>מספר רישיון:</strong> ${data?.license_number || "—"}</p>
        <p><strong>סטטוס:</strong> ${data?.status || "pending"}</p>
        <hr/>
        <p style="color:#888;font-size:12px;">הודעה אוטומטית ממערכת נפש טובה – נדרשת בדיקה ואישור</p>
      </div>
    `;

    if (!adminEmail) {
      return Response.json({ success: false, reason: "ADMIN_EMAIL not set" });
    }

    await base44.asServiceRole.integrations.Core.SendEmail({
      to: adminEmail,
      subject,
      body: body_html,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});