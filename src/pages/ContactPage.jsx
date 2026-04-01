// @ts-nocheck
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageCircle, CheckCircle2, Loader2, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { toast } from "sonner";

// פונקציית העזר ל-reCAPTCHA
async function getRecaptchaToken(action) {
  return new Promise((resolve) => {
    if (!window.grecaptcha) { resolve(null); return; }
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute("6LfXwZ4sAAAAAIY_n0rmhrbRCxNzCtEOMqLTfJnT", { action })
        .then(resolve)
        .catch(() => resolve(null));
    });
  });
}

export default function ContactPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 0. אימות אנושי (reCAPTCHA) 
      const token = await getRecaptchaToken("contact_admin");
      if (!token) throw new Error("לא ניתן היה לאמת שאינך רובוט (חסר טוקן).");
      
      const { data: captchaRes, error: captchaError } = await supabase.functions.invoke("verifyRecaptcha", { body: { token } });
      
      if (captchaError || captchaRes?.success === false) {
           console.error("Recaptcha failed:", captchaRes);
           throw new Error("אימות אנושי נכשל (נחשדת כרובוט). לא ניתן לשלוח הודעה.");
      }

      // 1. שמירה בטבלת ContactRequest ב-Supabase
      const { error } = await supabase.from("ContactRequest").insert({
        patient_name: form.name,
        patient_email: form.email,
        message: `נושא: ${form.subject}\n\n${form.message}`,
        contact_type: "general",
        therapist_id: null,
        lead_month: new Date().toISOString().slice(0, 7)
      });

      if (error) throw error;

      // 2. הפעלת הפונקציה החדשה שלנו לשליחת מייל דרך Resend
      try {
        const emailResponse = await fetch('/api/contact-us', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: `נושא: ${form.subject}`, 
            message: form.message
          }),
        });
        
        if (!emailResponse.ok) {
           console.error("שליחת האימייל לאדמין נכשלה, אבל הפנייה נשמרה ב-Supabase.");
        }
      } catch (emailError) {
         console.error("Error sending notification email:", emailError);
      }

      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      
    } catch (err) {
      console.error("Error submitting general contact form:", err);
      toast.error(err.message || "אירעה שגיאה בשליחת הפנייה. נסה שוב מאוחר יותר.");
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
        {/* Info & Social */}
        <div className="space-y-6">
          <div className="bg-accent/40 rounded-2xl p-6 space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t.contactEmail}</p>
                <p className="text-muted-foreground text-sm hover:text-primary transition-colors cursor-pointer">info@findmytherapist.co.il</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t.contactPhone}</p>
                <p className="text-muted-foreground text-sm hover:text-primary transition-colors cursor-pointer" dir="ltr">03-123-4567</p>
                <p className="text-xs text-muted-foreground">{t.contactHours}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">{t.contactWhatsApp}</p>
                <p className="text-muted-foreground text-sm hover:text-primary transition-colors cursor-pointer" dir="ltr">050-123-4567</p>
              </div>
            </div>
            
            {/* === SOCIAL MEDIA LINKS === */}
            <div className="pt-4 border-t border-border/60">
              <p className="font-semibold text-sm mb-3">עקבו אחרינו</p>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-all shadow-sm">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all shadow-sm">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm">
                  <Twitter className="w-4 h-4" />
                </a>
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
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
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
              
              <div className="text-[11px] text-muted-foreground text-center pt-2">
                שליחת הפנייה מהווה אישור לאימות אנושי (reCAPTCHA)
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> שולח...</> : t.contactSendBtn}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}