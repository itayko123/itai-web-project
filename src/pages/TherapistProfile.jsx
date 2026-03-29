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
import { BadgeCheck, MapPin, Globe, Video, Loader2, ArrowRight, Users, Languages, GraduationCap, Briefcase, BookOpen, AlertCircle, CheckCircle2, XCircle, Send } from "lucide-react";
import { buildLabelMap, SPECIALIZATION_GROUPS, TREATMENT_METHOD_GROUPS } from "@/lib/therapyOptions";
import { toast } from "sonner";
import { sanitizeFormData } from "@/utils/sanitize";

const professionLabels = { psychologist: "פסיכולוג/ית", psychiatrist: "פסיכיאטר/ית", psychotherapist: "פסיכותרפיסט/ית", social_worker: 'עו"ס קליני', counselor: "יועץ/ת" };
const formatLabels = { in_person: "פנים אל פנים", zoom: "זום", phone: "טלפון" };
const hmoLabels = { maccabi: "מכבי", clalit: "כללית", meuhedet: "מאוחדת", leumit: "לאומית", private: "פרטי" };
const langLabels = { hebrew: "עברית", english: "אנגלית", arabic: "ערבית", russian: "רוסית", french: "צרפתית", spanish: "ספרדית", amharic: "אמהרית" };
const specLabels = buildLabelMap(SPECIALIZATION_GROUPS, "he");
const treatmentLabels = buildLabelMap(TREATMENT_METHOD_GROUPS, "he");

function ContactForm({ therapist }) {
  const [form, setForm] = useState({ patient_name: "", patient_email: "", patient_phone: "", message: "", preferred_format: "", tos_accepted: false });
  const [submitted, setSubmitted] = useState(false);

  // Block form if therapist is not available
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
      const { error: contactError } = await supabase.from("ContactRequest").insert({
        therapist_id: therapist.id,
        ...sanitizeFormData(form),
        contact_type: "message",
        status: "pending", 
        created_date: new Date().toISOString(), // <--- הוספנו את השורה הזו!
      });
// ... המשך הקוד כרגיל
      
      if (contactError) throw contactError;

      // עדכון מונה הלידים
      const currentLeads = therapist.lead_count || 0;
      const { error: therapistError } = await supabase
        .from("Therapist")
        .update({ lead_count: currentLeads + 1 })
        .eq("id", therapist.id);
        
      if (therapistError) throw therapistError;
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("הפנייה נשלחה בהצלחה!");
    },
    onError: (error) => {
      console.error("Submission error:", error);
      toast.error("שגיאה בשליחת הפנייה");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.tos_accepted) { toast.error("יש לאשר את תנאי השימוש ומדיניות הפרטיות"); return; }
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-bold text-base flex items-center gap-2">
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
        <Textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="ספר/י בקצרה מה מביא/ה אותך לפנות..." rows={3} />
      </div>

      <div className="bg-muted/50 rounded-xl p-3 flex items-start gap-3">
        <Checkbox id="tos" checked={form.tos_accepted} onCheckedChange={v => setForm({...form, tos_accepted: v})} className="mt-0.5" />
        <label htmlFor="tos" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
          קראתי ואני מסכים/ה ל<Link to="/terms" className="text-primary underline mx-1">תנאי השימוש</Link> 
          ול<Link to="/privacy" className="text-primary underline mx-1">מדיניות הפרטיות</Link>, 
          ואני מאשר/ת את איסוף המידע והעברתו למטפל/ת. ידוע לי כי הפלטפורמה מקשרת בלבד ואינה אחראית על הטיפול עצמו.
        </label>
      </div>

      <Button type="submit" disabled={mutation.isPending} className="w-full font-semibold">
        {mutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin ml-2" />שולח...</> : "שלח פנייה"}
      </Button>
    </form>
  );
}

export default function TherapistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: therapist, isLoading } = useQuery({
    queryKey: ["therapist", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("Therapist").select("*").eq("id", id).limit(1);
      if (error) throw error;
      return data?.[0] ?? null;
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowRight className="w-4 h-4" />
        חזרה לחיפוש
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
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
                <p className="text-muted-foreground text-base mt-0.5">{professionLabels[therapist.profession]}</p>

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
                {therapist.languages?.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <Languages className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{(therapist.languages || []).map(l => langLabels[l] || l).join(", ")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* About section */}
          {therapist.about && (
            <div className="bg-card border border-border rounded-2xl p-7">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                אודות המטפל/ת
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">{therapist.about}</p>
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
                {(therapist.specializations || []).map(s => (
                  <Badge key={s} variant="secondary" className="text-sm px-3 py-1">{specLabels[s] || s}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Treatment methods */}
          {therapist.treatment_types?.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-7">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                שיטות וגישות טיפוליות
              </h2>
              <div className="flex flex-wrap gap-2">
                {(therapist.treatment_types || []).map(t => (
                  <Badge key={t} className="bg-accent text-accent-foreground text-sm px-3 py-1">{treatmentLabels[t] || t}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-20">
            {therapist.price_per_session && (
              <div className="mb-5 text-center pb-5 border-b border-border">
                <div className="text-4xl font-black text-foreground">₪{therapist.price_per_session}</div>
                <div className="text-sm text-muted-foreground">לפגישה</div>
              </div>
            )}

            <div className="border-b border-border pb-5 mb-5 space-y-3">
              {therapist.formats?.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Video className="w-4 h-4 text-primary" />
                  {therapist.formats.map(f => formatLabels[f]).join(", ")}
                </div>
              )}
              {therapist.hmo_affiliation?.length > 0 && (
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4 text-primary mt-0.5" />
                  <span>{therapist.hmo_affiliation.map(h => hmoLabels[h]).join(", ")}</span>
                </div>
              )}
              {therapist.languages?.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Languages className="w-4 h-4 text-primary" />
                  {therapist.languages.map(l => langLabels[l] || l).join(", ")}
                </div>
              )}
              {therapist.website && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4 text-primary" />
                  <a href={therapist.website} target="_blank" rel="noreferrer" className="hover:text-foreground truncate">אתר אינטרנט</a>
                </div>
              )}
            </div>

            {/* Inline Contact Form */}
            <ContactForm therapist={therapist} />

            {therapist.license_number && (
              <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground text-center">
                מספר רישיון: {therapist.license_number}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}