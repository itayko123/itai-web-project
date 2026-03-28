import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageCircle, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const [loading, setLoading] = useState(false);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. שמירה בטבלת ContactRequest ב-Supabase
      const { error } = await supabase.from("ContactRequest").insert({
        patient_name: form.name,
        patient_email: form.email,
        message: `נושא: ${form.subject}\n\n${form.message}`,
        contact_type: "general", // מסמן שזו פנייה כללית לאתר
        therapist_id: null,      // אין מטפל ספציפי
        lead_month: new Date().toISOString().slice(0, 7)
      });

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      // 2. הפעלת הפונקציה לשליחת מייל (מוסתרת כרגע בהערה כדי למנוע את השגיאה)
      /*
      await supabase.functions.invoke("notify-new-contact", {
        body: {
          patient_name: form.name,
          patient_email: form.email,
          message: `נושא: ${form.subject}\n\n${form.message}`,
          therapist_name: "צוות האתר (פנייה כללית)",
        }
      });
      */

      setSent(true);
      // איפוס הטופס
      setForm({ name: "", email: "", subject: "", message: "" });
      
    } catch (err) {
      console.error("Error submitting general contact form:", err);
      // כאן אפשר להוסיף הודעת שגיאה למשתמש (toast.error) אם אתה משתמש ב-Sonner כמו בקומפוננטה הקודמת
      alert("אירעה שגיאה בשליחת הפנייה. נסה שוב מאוחר יותר.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black mb-2">{t.contactTitle}</h1>
        <p className="text-muted-foreground">{t.contactSubtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Info */}
        <div className="space-y-6">
          <div className="bg-accent/40 rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t.contactEmail}</p>
                <p className="text-muted-foreground text-sm">info@findmytherapist.co.il</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t.contactPhone}</p>
                <p className="text-muted-foreground text-sm">03-123-4567</p>
                <p className="text-xs text-muted-foreground">{t.contactHours}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t.contactWhatsApp}</p>
                <p className="text-muted-foreground text-sm">050-123-4567</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <p className="font-bold text-red-800 text-sm mb-1">{t.contactEmergency}</p>
            <p className="text-red-700 text-sm">{t.contactEmergencyText}</p>
            <a href="tel:1201" className="inline-block mt-2 bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-red-700 transition-colors">
              {t.contactEmergencyBtn}
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-6">
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center gap-4">
              <CheckCircle2 className="w-12 h-12 text-primary" />
              <h2 className="text-xl font-bold">{t.contactSent}</h2>
              <p className="text-muted-foreground text-sm">{t.contactSentDesc}</p>
              <Button variant="outline" onClick={() => setSent(false)}>{t.contactSendAnother}</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-1.5 block">{t.contactFullName}</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Israel Israelson" required />
              </div>
              <div>
                <Label className="mb-1.5 block">{t.contactEmailLabel}</Label>
                <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="israel@email.com" required />
              </div>
              <div>
                <Label className="mb-1.5 block">{t.contactSubjectLabel}</Label>
                <Input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder={t.contactSubjectPlaceholder} required />
              </div>
              <div>
                <Label className="mb-1.5 block">{t.contactMessageLabel}</Label>
                <Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder={t.contactMessagePlaceholder} rows={5} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full">{loading ? "שולח..." : t.contactSendBtn}</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}