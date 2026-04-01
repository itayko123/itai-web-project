// @ts-nocheck
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { BadgeCheck, MapPin, Globe, Video, Loader2, ArrowRight, Users, Languages, GraduationCap, Briefcase, BookOpen, AlertCircle, CheckCircle2, XCircle, Send, Phone, X } from "lucide-react";
import { buildLabelMap, SPECIALIZATION_GROUPS, TREATMENT_METHOD_GROUPS } from "@/lib/therapyOptions";
import { toast } from "sonner";
import { sanitizeFormData } from "@/utils/sanitize";
import { Helmet } from "react-helmet-async";

const professionLabels = { psychologist: "פסיכולוג/ית", psychiatrist: "פסיכיאטר/ית", psychotherapist: "פסיכותרפיסט/ית", social_worker: 'עו"ס קליני', counselor: "יועץ/ת" };
const formatLabels = { in_person: "פנים אל פנים", zoom: "זום", phone: "טלפון" };
const hmoLabels = { maccabi: "מכבי", clalit: "כללית", meuhedet: "מאוחדת", leumit: "לאומית", private: "פרטי" };
const langLabels = { hebrew: "עברית", english: "אנגלית", arabic: "ערבית", russian: "רוסית", french: "צרפתית", spanish: "ספרדית", amharic: "אמהרית" };
const specLabels = buildLabelMap(SPECIALIZATION_GROUPS, "he");
const treatmentLabels = buildLabelMap(TREATMENT_METHOD_GROUPS, "he");

/**
 * הערה חשובה לתיקון:
 * המפתח שמופיע כאן (6LeIxAc...) הוא מפתח בדיקה ל-v2.
 * כדי ש-v3 יעבוד, אתה חייב להחליף אותו במפתח Site Key מסוג v3 מהפאנל של reCAPTCHA.
 */
const RECAPTCHA_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"; 

async function getRecaptchaToken(action) {
  return new Promise((resolve) => {
    if (!window.grecaptcha) { 
      console.error("reCAPTCHA script missing");
      resolve(null); 
      return; 
    }
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action })
        .then(resolve)
        .catch((err) => {
          console.error("reCAPTCHA Execution Error:", err);
          resolve(null);
        });
    });
  });
}

function PhoneRevealModal({ therapist, open, onClose }) {
  const [form, setForm] = useState({ patient_name: "", contact_info: "" });
  const [revealed, setRevealed] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      // 1. קבלת טוקן
      const token = await getRecaptchaToken("phone_reveal");
      if (!token) throw new Error("לא ניתן היה להפיק טוקן אבטחה. בדוק חוסמי פרסומות.");

      // 2. אימות מול הפונקציה ב-Supabase
      const { data: captchaRes, error: captchaError } = await supabase.functions.invoke("verifyRecaptcha", { 
        body: { token } 
      });
      
      // הדפסת התגובה המלאה מהשרת כדי להבין למה זה נכשל
      console.log("Full Captcha Response from Server:", captchaRes);

      if (captchaError || !captchaRes || captchaRes.success === false) {
          // חילוץ הודעת השגיאה המדויקת מהשרת
          const serverMsg = captchaRes?.error_codes?.join(", ") || captchaRes?.message || "אימות אנושי נכשל";
          console.error("Verification Details:", serverMsg);
          throw new Error(`הפעולה זוהתה כבוט: ${serverMsg}`);
      }

      // 3. שמירת הפנייה
      const { error: contactError } = await supabase.from("ContactRequest").insert({
        therapist_id: therapist.id,
        patient_name: sanitizeFormData(form).patient_name,
        patient_phone: sanitizeFormData(form).contact_info,
        contact_type: "phone_reveal",
        status: "responded",
        created_date: new Date().toISOString(),
      });
      if (contactError) throw contactError;

      // 4. עדכון מונה
      const currentLeads = therapist.lead_count || 0;
      await supabase.from("Therapist").update({ lead_count: currentLeads + 1 }).eq("id", therapist.id);
    },
    onSuccess: () => {
      setRevealed(true);
      toast.success("המספר נחשף בהצלחה!");
    },
    onError: (error) => {
      console.error("Final Error State:", error);
      toast.error(error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.patient_name || !form.contact_info) {
      toast.error("יש למלא את כל השדות");
      return;
    }
    mutation.mutate();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1">
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6 sm:p-8 text-right" dir="rtl">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Phone className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-center mb-2">צפייה במספר טלפון</h2>
          
          {revealed ? (
            <div className="text-center space-y-4 py-4">
              <p className="text-muted-foreground">המספר של {therapist.full_name}:</p>
              <a href={`tel:${therapist.phone}`} className="inline-block text-3xl font-black text-primary hover:underline" dir="ltr">
                {therapist.phone}
              </a>
              <Button onClick={onClose} className="w-full mt-4" variant="outline">סגור</Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground text-center mb-6">
                כדי לראות את המספר, אנא השאר פרטים בסיסיים והוכח שאינך רובוט.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>שם מלא *</Label>
                  <Input 
                    value={form.patient_name} 
                    onChange={e => setForm({...form, patient_name: e.target.value})} 
                    placeholder="ישראל ישראלי" 
                    required 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>טלפון / אימייל  *</Label>
                  <Input 
                    value={form.contact_info} 
                    onChange={e => setForm({...form, contact_info: e.target.value})} 
                    placeholder="לצורך זיהוי ספאם" 
                    required 
                  />
                </div>
                
                <div className="text-xs text-muted-foreground text-center pt-2">
                  לחיצה על חשיפת מספר מהווה אישור לאימות אנושי (reCAPTCHA v3)
                </div>

                <Button type="submit" disabled={mutation.isPending} className="w-full font-bold bg-emerald-500 hover:bg-emerald-600 text-white mt-2">
                  {mutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin ml-2" />מאמת...</> : "אני לא רובוט - הצג מספר"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ContactForm({ therapist }) {
  const [form, setForm] = useState({ patient_name: "", patient_email: "", patient_phone: "", message: "", preferred_format: "", tos_accepted: false });
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getRecaptchaToken("contact_form");
      if (!token) throw new Error("בעיית אבטחה (reCAPTCHA)");
      
      const { data: captchaRes } = await supabase.functions.invoke("verifyRecaptcha", { body: { token } });
      if (!captchaRes?.success) throw new Error("אימות אנושי נכשל");

      const { error: contactError } = await supabase.from("ContactRequest").insert({
        therapist_id: therapist.id,
        ...sanitizeFormData(form),
        contact_type: "message",
        status: "pending", 
        created_date: new Date().toISOString(),
      });
      if (contactError) throw contactError;

      const currentLeads = therapist.lead_count || 0;
      await supabase.from("Therapist").update({ lead_count: currentLeads + 1 }).eq("id", therapist.id);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("הפנייה נשלחה!");
    },
    onError: (error) => toast.error(error.message)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tos_accepted) { toast.error("יש לאשר את תנאי השימוש"); return; }
    mutation.mutate();
  };

  if (submitted) return (
    <div className="text-center py-8">
      <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
      <h3 className="font-bold text-lg">נשלח בהצלחה!</h3>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-right">
      <h3 className="font-bold text-base flex items-center gap-2 justify-end mb-1">
        פנה/י אל המטפל
        <Send className="w-4 h-4 text-primary" />
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">שם מלא *</Label>
          <Input value={form.patient_name} onChange={e => setForm({...form, patient_name: e.target.value})} required />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">טלפון</Label>
          <Input value={form.patient_phone} onChange={e => setForm({...form, patient_phone: e.target.value})} />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">אימייל *</Label>
        <Input type="email" value={form.patient_email} onChange={e => setForm({...form, patient_email: e.target.value})} required />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">פורמט מועדף</Label>
        <Select onValueChange={v => setForm({...form, preferred_format: v})}>
          <SelectTrigger dir="rtl"><SelectValue placeholder="בחר פורמט" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="in_person">פנים אל פנים</SelectItem>
            <SelectItem value="zoom">זום</SelectItem>
            <SelectItem value="phone">טלפון</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">הודעה</Label>
        <Textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={2} />
      </div>
      <div className="flex items-start gap-2 justify-end">
        <label htmlFor="tos" className="text-xs text-muted-foreground cursor-pointer">
          אני מסכים ל<Link to="/terms" className="underline">תנאי השימוש</Link>
        </label>
        <Checkbox id="tos" checked={form.tos_accepted} onCheckedChange={v => setForm({...form, tos_accepted: v})} />
      </div>
      <Button type="submit" disabled={mutation.isPending} className="w-full">
        {mutation.isPending ? "שולח..." : "שלח פנייה"}
      </Button>
    </form>
  );
}

export default function TherapistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  const { data: therapist, isLoading } = useQuery({
    queryKey: ["therapist", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("Therapist").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
  if (!therapist) return <div className="text-center py-20">מטפל לא נמצא</div>;

  const profLabel = professionLabels[therapist.profession] || "מטפל/ת";

  return (
    <>
      <Helmet>
        <title>{therapist.full_name} | מצא לי מטפל</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-8 text-right" dir="rtl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
          <ArrowRight className="w-4 h-4" /> חזרה לחיפוש
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* כרטיס עליון */}
            <div className="bg-card border border-border rounded-2xl p-7 flex gap-6 flex-wrap md:flex-nowrap">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-accent flex-shrink-0 mx-auto md:mx-0">
                  {therapist.photo_url ? (
                    <img src={therapist.photo_url} alt={therapist.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/40">{therapist.full_name?.charAt(0)}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                    <h1 className="text-2xl font-bold">{therapist.full_name}</h1>
                    {therapist.license_verified && <BadgeCheck className="text-primary w-5 h-5" />}
                  </div>
                  <p className="text-muted-foreground text-center md:text-right">{profLabel}</p>
                  <div className="flex flex-wrap gap-3 mt-3 justify-center md:justify-start">
                    {therapist.city && <span className="flex items-center gap-1 text-sm"><MapPin className="w-4 h-4" />{therapist.city}</span>}
                    {therapist.years_experience && <span className="text-sm">{therapist.years_experience} שנות ניסיון</span>}
                  </div>
                </div>
            </div>

            {/* אודות */}
            {therapist.about && (
              <div className="bg-card border border-border rounded-2xl p-7">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> אודות
                </h2>
                <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{therapist.about}</p>
              </div>
            )}

            {/* התמחויות */}
            {therapist.specializations?.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-7">
                <h2 className="text-lg font-bold mb-4">תחומי התמחות</h2>
                <div className="flex flex-wrap gap-2">
                  {therapist.specializations.map(s => <Badge key={s} variant="secondary">{specLabels[s] || s}</Badge>)}
                </div>
              </div>
            )}
          </div>

          {/* סיידבר */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-20 shadow-sm">
              {therapist.price_per_session && (
                <div className="mb-4 text-center pb-4 border-b">
                  <div className="text-3xl font-black">₪{therapist.price_per_session}</div>
                  <div className="text-xs text-muted-foreground">לפגישה</div>
                </div>
              )}

              {therapist.phone && (
                <Button 
                  onClick={() => setShowPhoneModal(true)} 
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 mb-4"
                >
                  <Phone className="w-4 h-4 ml-2" /> הצג מספר טלפון
                </Button>
              )}

              <ContactForm therapist={therapist} />
            </div>
          </div>
        </div>
      </div>

      <PhoneRevealModal therapist={therapist} open={showPhoneModal} onClose={() => setShowPhoneModal(false)} />
    </>
  );
}