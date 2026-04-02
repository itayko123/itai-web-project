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

// פונקציית העזר ל-reCAPTCHA - משופרת עם לוגים
async function getRecaptchaToken(action) {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.grecaptcha) { 
      console.error("reCAPTCHA script not found on page. Make sure it's in index.html");
      resolve(null); 
      return; 
    }
    window.grecaptcha.ready(() => {
      try {
        window.grecaptcha
          .execute("6LfXwZ4sAAAAAIY_n0rmhrbRCxNzCtEOMqLTfJnT", { action })
          .then((token) => {
            if (!token) console.warn("reCAPTCHA returned an empty token.");
            resolve(token);
          })
          .catch((err) => {
            console.error("reCAPTCHA execution error:", err);
            resolve(null);
          });
      } catch (err) {
        console.error("reCAPTCHA ready block error:", err);
        resolve(null);
      }
    });
  });
}

// קומפוננטת המודל לחשיפת טלפון
function PhoneRevealModal({ therapist, open, onClose }) {
  const [form, setForm] = useState({ patient_name: "", contact_info: "" });
  const [revealed, setRevealed] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      // 1. קבלת טוקן מגוגל
      const token = await getRecaptchaToken("phone_reveal");
      if (!token) throw new Error("לא ניתן היה לאמת שאינך רובוט (חסר טוקן). בדוק חיבור אינטרנט או חוסמי פרסומות.");
      
      // 2. אימות מול השרת (Supabase Edge Function)
      // 2. אימות מול השרת (Supabase Edge Function)
      const { data: captchaRes, error: captchaError } = await supabase.functions.invoke("verifyRecaptcha", { 
        body: { token } 
      });
      
      if (captchaError || captchaRes?.success === false) {
          console.error("Server-side Recaptcha verification failed. Full Details:", captchaRes, "Error:", captchaError); 
          
          // ניסיון לחלץ את הסיבה המדויקת משרתי גוגל במידה ומוחזרת
          const errorCodes = captchaRes?.["error-codes"] ? captchaRes["error-codes"].join(", ") : "";
          const specificError = errorCodes ? `סיבה טכנית מגוגל: ${errorCodes}` : captchaRes?.message;
          
          throw new Error(specificError || "אימות אנושי נכשל (נחשדת כרובוט). לא ניתן לחשוף מספר.");
      }

      // 3. רישום הבקשה בבסיס הנתונים
      const { error: contactError } = await supabase.from("ContactRequest").insert({
        therapist_id: therapist.id,
        patient_name: sanitizeFormData(form).patient_name,
        patient_phone: sanitizeFormData(form).contact_info,
        contact_type: "phone_reveal",
        status: "responded",
        created_date: new Date().toISOString(),
      });
      if (contactError) throw contactError;

      // 4. עדכון מונה הלידים של המטפל
      const currentLeads = therapist.lead_count || 0;
      const { error: therapistError } = await supabase
        .from("Therapist")
        .update({ lead_count: currentLeads + 1 })
        .eq("id", therapist.id);
      if (therapistError) throw therapistError;
    },
    onSuccess: () => {
      setRevealed(true);
      toast.success("המספר נחשף בהצלחה!");
    },
    onError: (error) => {
      console.error("Error revealing phone:", error);
      toast.error(error.message || "שגיאה בחשיפת המספר, נסה שוב.");
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
        
        <div className="p-6 sm:p-8">
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
                  לחיצה על חשיפת מספר מהווה אישור לאימות אנושי (reCAPTCHA)
                </div>

                <Button type="submit" disabled={mutation.isPending} className="w-full font-bold bg-emerald-500 hover:bg-emerald-600 text-white mt-2">
                  {mutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin ml-2" />מאמת ומציג...</> : "אני לא רובוט - הצג מספר"}
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

  if (!therapist.immediate_availability) {
    return (
      <div className="text-center py-6 space-y-2">
        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center mx-auto">
          <XCircle className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="font-medium text-sm">המטפל/ת אינו/ה זמין/ה כעת</p>
        <p className="text-xs text-muted-foreground">לא ניתן לשלוח פנייה למטפל שאינו מקבל מטופלים חדשים כרגע.</p>
      </div>
    );
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getRecaptchaToken("contact_form");
      if (!token) throw new Error("לא ניתן היה לאמת שאינך רובוט (חסר טוקן).");
      
      const { data: captchaRes, error: captchaError } = await supabase.functions.invoke("verifyRecaptcha", { body: { token } });
      
      if (captchaError || captchaRes?.success === false) {
           console.error("Recaptcha failed:", captchaRes);
           throw new Error("אימות אנושי נכשל (נחשדת כרובוט). לא ניתן לשלוח הודעה.");
      }

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
      toast.success("הפנייה נשלחה בהצלחה!");
    },
    onError: (error) => {
      toast.error(error.message || "שגיאה בשליחת הפנייה");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tos_accepted) { toast.error("יש לאשר את תנאי השימוש"); return; }
    if (!form.patient_name || !form.patient_email) { toast.error("יש למלא שם ואימייל"); return; }
    mutation.mutate();
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-3" />
        <h3 className="font-bold text-lg mb-1">הפנייה נשלחה!</h3>
        <p className="text-sm text-muted-foreground">המטפל יצור איתך קשר בהקדם.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="font-bold text-base flex items-center gap-2 mb-1">
        <Send className="w-4 h-4 text-primary" />
        פנה/י אל המטפל
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">שם מלא *</Label>
          <Input value={form.patient_name} onChange={e => setForm({...form, patient_name: e.target.value})} placeholder="ישראל ישראלי" />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">טלפון</Label>
          <Input value={form.patient_phone} onChange={e => setForm({...form, patient_phone: e.target.value})} placeholder="050-0000000" />
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">אימייל *</Label>
        <Input type="email" value={form.patient_email} onChange={e => setForm({...form, patient_email: e.target.value})} placeholder="email@example.com" />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">פורמט מועדף</Label>
        <Select onValueChange={v => setForm({...form, preferred_format: v})}>
          <SelectTrigger><SelectValue placeholder="בחר פורמט" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="in_person">פנים אל פנים</SelectItem>
            <SelectItem value="zoom">זום</SelectItem>
            <SelectItem value="phone">טלפון</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">הודעה (אופציונלי)</Label>
        <Textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="ספר/י בקצרה מה מביא/ה אותך לפנות..." rows={2} />
      </div>

      <div className="bg-muted/50 rounded-lg p-2.5 flex items-start gap-2.5">
        <Checkbox id="tos" checked={form.tos_accepted} onCheckedChange={v => setForm({...form, tos_accepted: v})} className="mt-0.5" />
        <label htmlFor="tos" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
          קראתי ואני מסכים/ה ל
          <Link to="/terms" className="text-primary underline mx-1">תנאי השימוש</Link>
          ומבין/ה כי הפלטפורמה אינה אחראית לתהליך.
        </label>
      </div>

      <div className="text-[11px] text-muted-foreground text-center">
        שליחת הפנייה מהווה אישור לאימות אנושי (reCAPTCHA)
      </div>

      <Button type="submit" disabled={mutation.isPending} className="w-full font-semibold h-9">
        {mutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin ml-2" />שולח...</> : "שלח פנייה"}
      </Button>
    </form>
  );
}

export default function TherapistProfile() {
  const { slug } = useParams();
  const navigate = useNavigate(); // ← ADD THIS


const { data: therapist, isLoading } = useQuery({
  queryKey: ['therapist', slug],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('Therapist')
      .select('*')
      .eq('slug', slug)   // ← new
      .single();
    if (error) throw error;
    return data;
  },
});


  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  if (!therapist) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground">מטפל לא נמצא</p>
    </div>
  );

  const profLabel = professionLabels[therapist.profession] || "מטפל/ת";
  const cityText = therapist.city ? `ב${therapist.city}` : "";
  const metaTitle = `${therapist.full_name} - ${profLabel} ${cityText} | מצא לי מטפל`;
  const metaDescription = therapist.about 
    ? therapist.about.substring(0, 150) + "..."
    : `צפו בפרופיל של ${therapist.full_name}, ${profLabel} ${cityText}. קראו מידע מקצועי, בדקו זמינות וצרו קשר ישירות ללא עמלות.`;

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {therapist.photo_url && <meta property="og:image" content={therapist.photo_url} />}
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowRight className="w-4 h-4" />
          חזרה לחיפוש
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">
          <div className="lg:col-span-2 space-y-5 text-right">
            {/* Header card */}
            <div className="bg-card border border-border rounded-2xl p-7">
              <div className="flex gap-6 flex-wrap">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-accent flex-shrink-0 shadow">
                  {therapist.photo_url ? (
                    <img src={therapist.photo_url} alt={therapist.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/40">
                      {therapist.full_name?.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-2xl font-bold">{therapist.full_name}</h1>
                    {therapist.license_verified && (
                      <div className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full text-sm font-medium">
                        <BadgeCheck className="w-4 h-4" />
                        רישיון מאומת
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-base mt-0.5">{profLabel}</p>

                  <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                    therapist.immediate_availability
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {therapist.immediate_availability
                      ? <><CheckCircle2 className="w-3.5 h-3.5" /> פתוח/ה למטופלים חדשים</>
                      : <><XCircle className="w-3.5 h-3.5" /> לא זמין/ה כעת</>
                    }
                  </div>

                  <div className="flex flex-wrap gap-3 mt-3">
                    {therapist.city && (
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />{therapist.city}
                      </span>
                    )}
                    {therapist.years_experience && (
                      <span className="text-sm text-muted-foreground">{therapist.years_experience} שנות ניסיון</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* פרטי השירות */}
            {(therapist.formats?.length > 0 || therapist.hmo_affiliation?.length > 0 || therapist.languages?.length > 0) && (
              <div className="bg-card border border-border rounded-2xl p-7">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {therapist.formats?.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-2xl text-primary flex-shrink-0">
                        <Video className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-0.5">אופני טיפול</h4>
                        <p className="text-base font-bold text-foreground">
                          {therapist.formats.map(f => formatLabels[f]).join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                  {therapist.hmo_affiliation?.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-2xl text-primary flex-shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-0.5">קבלת קהל</h4>
                        <p className="text-base font-bold text-foreground">
                          {therapist.hmo_affiliation.map(h => hmoLabels[h]).join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                  {therapist.languages?.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-2xl text-primary flex-shrink-0">
                        <Languages className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-0.5">שפות טיפול</h4>
                        <p className="text-base font-bold text-foreground">
                          {therapist.languages.map(l => langLabels[l] || l).join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* About section */}
            {therapist.about && (
              <div className="bg-card border border-border rounded-2xl p-7">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  אודות המטפל/ת
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">{therapist.about}</p>
                <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">
                    כל מה שכתוב באודות המטפל/ת הוא באחריותו/ה הבלעדית. הפלטפורמה אינה אחראית לתוכן שנכתב על ידי המטפלים.
                  </p>
                </div>
              </div>
            )}

            {/* Specializations */}
            {therapist.specializations?.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-7">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-primary" />
                  תחומי התמחות
                </h2>
                <div className="flex flex-wrap gap-2">
                  {therapist.specializations.map(s => (
                    <Badge key={s} variant="secondary" className="text-sm px-3 py-1">{specLabels[s] || s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5 sticky top-20 shadow-sm text-right">
              {therapist.price_per_session && (
                <div className="mb-4 text-center pb-4 border-b border-border">
                  <div className="text-3xl font-black text-foreground">₪{therapist.price_per_session}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">לפגישה</div>
                </div>
              )}

              {therapist.phone && therapist.immediate_availability && (
                <div className="mb-4 relative">
                  <button
                    onClick={() => setShowPhoneModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                    style={{ animation: "phonePulse 2s infinite" }}
                  >
                    <Phone className="w-5 h-5" />
                    הצג מספר טלפון
                  </button>
                  <style>{`
                    @keyframes phonePulse {
                      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); transform: scale(1); }
                      70% { box-shadow: 0 0 0 12px rgba(16, 185, 129, 0); transform: scale(1.02); }
                      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); transform: scale(1); }
                    }
                  `}</style>
                </div>
              )}

              {therapist.website && (
                <div className="mb-4">
                  <a href={therapist.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-muted hover:bg-muted/80 text-foreground font-medium py-2 rounded-xl transition-colors text-sm">
                    <Globe className="w-4 h-4 text-primary" />
                    מעבר לאתר המטפל/ת
                  </a>
                </div>
              )}

              <ContactForm therapist={therapist} />

              {therapist.license_number && (
                <div className="mt-3 pt-3 border-t border-border text-[11px] text-muted-foreground text-center">
                  מספר רישיון: {therapist.license_number}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PhoneRevealModal
        therapist={therapist}
        open={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
      />
    </>
  );
}