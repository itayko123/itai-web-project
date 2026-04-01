// @ts-nocheck
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

// פונקציית העזר ל-reCAPTCHA
async function getRecaptchaToken(action) {
  return new Promise((resolve) => {
    if (!window.grecaptcha) { resolve(null); return; }
    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute("6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI", { action })
        .then(resolve)
        .catch(() => resolve(null));
    });
  });
}

// קומפוננטת המודל לחשיפת טלפון
function PhoneRevealModal({ therapist, open, onClose }) {
  const [form, setForm] = useState({ patient_name: "", contact_info: "" });
  const [revealed, setRevealed] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      const token = await getRecaptchaToken("phone_reveal");
      if (!token) throw new Error("לא ניתן היה לאמת שאינך רובוט.");
      
      const { data: captchaRes, error: captchaError } = await supabase.functions.invoke("verifyRecaptcha", { body: { token } });
      if (captchaError || captchaRes?.success === false) throw new Error("אימות אנושי נכשל.");

      await supabase.from("ContactRequest").insert({
        therapist_id: therapist.id,
        patient_name: sanitizeFormData(form).patient_name,
        patient_phone: sanitizeFormData(form).contact_info,
        contact_type: "phone_reveal",
        status: "responded",
        created_date: new Date().toISOString(),
      });

      const currentLeads = therapist.lead_count || 0;
      await supabase.from("Therapist").update({ lead_count: currentLeads + 1 }).eq("id", therapist.id);
    },
    onSuccess: () => {
      setRevealed(true);
      toast.success("המספר נחשף!");
    },
    onError: (error) => toast.error(error.message || "שגיאה בחשיפת המספר")
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        <div className="p-8">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4 mx-auto"><Phone className="w-6 h-6 text-emerald-600" /></div>
          <h2 className="text-xl font-bold text-center mb-6">צפייה במספר טלפון</h2>
          {revealed ? (
            <div className="text-center space-y-4 py-4">
              <p className="text-muted-foreground">המספר של {therapist.full_name}:</p>
              <a href={`tel:${therapist.phone}`} className="text-3xl font-black text-primary block" dir="ltr">{therapist.phone}</a>
              <Button onClick={onClose} className="w-full mt-4" variant="outline">סגור</Button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
              <div className="space-y-1.5">
                <Label>שם מלא *</Label>
                <Input value={form.patient_name} onChange={e => setForm({...form, patient_name: e.target.value})} required />
              </div>
              <div className="space-y-1.5">
                <Label>טלפון / אימייל *</Label>
                <Input value={form.contact_info} onChange={e => setForm({...form, contact_info: e.target.value})} required />
              </div>
              <Button type="submit" disabled={mutation.isPending} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold">
                {mutation.isPending ? "מאמת..." : "הצג מספר"}
              </Button>
            </form>
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
      const { data: captchaRes } = await supabase.functions.invoke("verifyRecaptcha", { body: { token } });
      if (captchaRes?.success === false) throw new Error("אימות נכשל");

      await supabase.from("ContactRequest").insert({
        therapist_id: therapist.id,
        ...sanitizeFormData(form),
        contact_type: "message",
        status: "pending",
        created_date: new Date().toISOString(),
      });
    },
    onSuccess: () => { setSubmitted(true); toast.success("הפנייה נשלחה!"); },
    onError: () => toast.error("שגיאה בשליחת הפנייה")
  });

  if (!therapist.immediate_availability) return <p className="text-center text-sm text-muted-foreground py-4">המטפל אינו זמין לפניות חדשות</p>;
  if (submitted) return <div className="text-center py-6"><CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-2" /><p className="font-bold">הפנייה נשלחה!</p></div>;

  return (
    <form onSubmit={(e) => { e.preventDefault(); if(form.tos_accepted) mutation.mutate(); else toast.error("יש לאשר תנאי שימוש"); }} className="space-y-3">
      <h3 className="font-bold flex items-center gap-2"><Send className="w-4 h-4 text-primary" /> פנה/י למטפל</h3>
      <Input placeholder="שם מלא *" value={form.patient_name} onChange={e => setForm({...form, patient_name: e.target.value})} required />
      <Input placeholder="טלפון *" value={form.patient_phone} onChange={e => setForm({...form, patient_phone: e.target.value})} required />
      <Input placeholder="אימייל *" type="email" value={form.patient_email} onChange={e => setForm({...form, patient_email: e.target.value})} required />
      <Textarea placeholder="הודעה..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={3} />
      <div className="flex items-start gap-2 py-2">
        <Checkbox id="tos" checked={form.tos_accepted} onCheckedChange={v => setForm({...form, tos_accepted: v})} />
        <label htmlFor="tos" className="text-[11px] leading-tight text-muted-foreground">אני מאשר/ת את תנאי השימוש באתר</label>
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

  if (isLoading) return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  if (!therapist) return <div className="text-center py-20"><p>מטפל לא נמצא</p><Button onClick={() => navigate("/therapists")} variant="link">חזרה לחיפוש</Button></div>;

  const profLabel = professionLabels[therapist.profession] || therapist.profession || "מטפל/ת";
  // תמיכה בשני שמות שדות אפשריים (bio או about)
  const bioContent = therapist.bio || therapist.about;
  // תמיכה בשני שמות שדות לתמונה
  const profileImg = therapist.profile_image_url || therapist.photo_url;

  return (
    <>
      <Helmet>
        <title>{`${therapist.full_name} - ${profLabel} | מצא לי מטפל`}</title>
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowRight className="w-4 h-4 ml-1" /> חזרה
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-right" dir="rtl">
          <div className="lg:col-span-2 space-y-5">
            {/* Header Card */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex gap-6 flex-col md:flex-row items-center md:items-start text-center md:text-right">
                <div className="w-32 h-32 rounded-2xl overflow-hidden bg-accent flex-shrink-0 shadow-inner">
                  {profileImg ? (
                    <img src={profileImg} alt={therapist.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-primary/30 bg-primary/5">{therapist.full_name?.charAt(0)}</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                    <h1 className="text-3xl font-black">{therapist.full_name}</h1>
                    {therapist.license_verified && <Badge variant="secondary" className="w-fit mx-auto md:mx-0 bg-emerald-50 text-emerald-700 border-emerald-100"><BadgeCheck className="w-3 h-3 ml-1" /> מאומת</Badge>}
                  </div>
                  <p className="text-xl text-muted-foreground mb-3">{profLabel}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {therapist.city}</span>
                    <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4" /> {therapist.years_experience || therapist.years_of_experience} שנות ניסיון</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            {bioContent && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-2"><BookOpen className="w-5 h-5 text-primary" /> אודות</h2>
                <div className="text-base leading-relaxed text-slate-700 whitespace-pre-wrap">{bioContent}</div>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" /> התמחויות</h3>
                <div className="flex flex-wrap gap-2">
                  {therapist.specializations?.map(s => <Badge key={s} variant="outline">{specLabels[s] || s}</Badge>)}
                </div>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5">
                <h3 className="font-bold mb-3 flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> קופות חולים ושפות</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>קופות:</strong> {therapist.hmo_affiliation?.map(h => hmoLabels[h] || h).join(", ") || "פרטי"}</p>
                  <p><strong>שפות:</strong> {therapist.languages?.map(l => langLabels[l] || l).join(", ")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-card border-2 border-primary/10 rounded-2xl p-6 sticky top-24 shadow-md">
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-primary">₪{therapist.price_per_session}</div>
                <div className="text-sm text-muted-foreground mt-1">לפגישה</div>
              </div>

              {therapist.phone && therapist.immediate_availability && (
                <Button 
                  onClick={() => setShowPhoneModal(true)} 
                  className="w-full h-12 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 mb-6 shadow-emerald-100 shadow-lg"
                >
                  <Phone className="w-5 h-5 ml-2" /> הצג מספר טלפון
                </Button>
              )}

              <ContactForm therapist={therapist} />
              
              {therapist.website && (
                <a href={therapist.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full mt-4 text-sm text-primary hover:underline">
                  <Globe className="w-4 h-4" /> לאתר המטפל/ת
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <PhoneRevealModal therapist={therapist} open={showPhoneModal} onClose={() => setShowPhoneModal(false)} />
    </>
  );
}