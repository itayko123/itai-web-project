// @ts-nocheck
import { useState } from "react";
import imageCompression from 'browser-image-compression';
import { supabase } from "@/lib/supabase";
import { uploadTherapistFile } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BadgeCheck, CheckCircle, Upload, Loader2, FileText, Camera } from "lucide-react";
import { toast } from "sonner";
import GroupedCheckboxSelect from "@/components/therapist/GroupedCheckboxSelect";
import { SPECIALIZATION_GROUPS, TREATMENT_METHOD_GROUPS } from "@/lib/therapyOptions";
import { useLanguage } from "@/lib/LanguageContext";
import { sanitizeFormData } from "@/utils/sanitize";

const checkboxGroup = (label, items, selected, setSelected) => (
  <div className="space-y-1">
    <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <button
          key={item.value}
          type="button"
          onClick={() => setSelected(prev => prev.includes(item.value) ? prev.filter(x => x !== item.value) : [...prev, item.value])}
          className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${selected.includes(item.value) ? 'border-primary bg-accent text-foreground font-medium' : 'border-border text-muted-foreground hover:border-primary/30'}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  </div>
);

export default function RegisterTherapist() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [licenseDocUrl, setLicenseDocUrl] = useState("");
  const [form, setForm] = useState({ full_name: "", profession: "", license_number: "", about: "", city: "", phone: "", email: "", price_per_session: "", years_experience: "" });
  const [formats, setFormats] = useState([]);
  const [hmos, setHmos] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [languages, setLanguages] = useState([]);

  const professions = [
    { value: "psychologist", label: t.profPsychologist || "פסיכולוג/ית" },
    { value: "psychiatrist", label: t.profPsychiatrist || "פסיכיאטר/ית" },
    { value: "psychotherapist", label: t.profPsychotherapist || "פסיכותרפיסט/ית" },
    { value: "social_worker", label: t.profSocialWorker || "עו\"ס קליני" },
    { value: "counselor", label: t.profCounselor || "יועץ/ת" },
  ];

  const formatOptions = [
    { value: "in_person", label: t.formatInPerson || "פנים אל פנים" },
    { value: "zoom", label: t.formatZoom || "זום" },
    { value: "phone", label: t.formatPhone || "טלפון" },
  ];

  const hmoOptions = [
    { value: "maccabi", label: t.hmoMaccabi || "מכבי" },
    { value: "clalit", label: t.hmoClalit || "כללית" },
    { value: "meuhedet", label: t.hmoMeuhedet || "מאוחדת" },
    { value: "leumit", label: t.hmoLeumit || "לאומית" },
    { value: "menora", label: t.hmoMenora || "מנורה מבטחים" },
    { value: "harel", label: t.hmoHarel || "הראל" },
    { value: "clal_insurance", label: t.hmoClal || "כלל ביטוח" },
    { value: "migdal", label: t.hmoMigdal || "מגדל" },
    { value: "phoenix", label: t.hmoPhoenix || "הפניקס" },
    { value: "ayalon", label: t.hmoAyalon || "איילון" },
    { value: "private", label: t.hmoPrivate || "פרטי (ללא ביטוח)" },
  ];

  const languageOptions = [
    { value: "hebrew", label: t.langHebrew || "עברית" },
    { value: "english", label: t.langEnglish || "אנגלית" },
    { value: "arabic", label: t.langArabic || "ערבית" },
    { value: "russian", label: t.langRussian || "רוסית" },
    { value: "french", label: t.langFrench || "צרפתית" },
    { value: "spanish", label: t.langSpanish || "ספרדית" },
    { value: "amharic", label: t.langAmharic || "אמהרית" },
  ];

const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    
    try {
      // 1. הגדרות הכיווץ שלנו
      const options = {
        maxSizeMB: 0.1, // מקסימום 100KB לתמונה
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/webp' // הופך אוטומטית לפורמט שגוגל אוהב
      };

      // 2. מכווצים את התמונה!
      const compressedFile = await imageCompression(file, options);
      
      // 3. שולחים ל-Supabase את התמונה המכווצת (compressedFile) במקום המקורית
      const fileUrl = await uploadTherapistFile(compressedFile, "photos");
      
      setPhotoUrl(fileUrl);
      toast.success(t.registerPhotoUploaded || "תמונה הועלתה בהצלחה");
    } catch (error) {
      console.error("Error compressing image:", error);
      toast.error("הייתה בעיה בעיבוד התמונה, נסה תמונה אחרת.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleLicenseUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLicense(true);
    const fileUrl = await uploadTherapistFile(file, "licenses");
    setLicenseDocUrl(fileUrl);
    setUploadingLicense(false);
    toast.success(t.registerLicenseUploaded || "מסמך הרישיון הועלה בהצלחה");
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.full_name || !form.profession || !form.license_number) {
      toast.error(t.registerRequiredFields || "יש למלא שדות חובה");
      return;
    }
    setLoading(true);
    
    const therapistData = {
      ...sanitizeFormData(form),
      price_per_session: form.price_per_session ? Number(form.price_per_session) : undefined,
      years_experience: form.years_experience ? Number(form.years_experience) : undefined,
      formats,
      hmo_affiliation: hmos,
      treatment_types: treatments,
      specializations,
      languages,
      photo_url: photoUrl || undefined,
      license_document_url: licenseDocUrl || undefined,
      status: "pending",
    };

    try {
      // 1. קודם כל שומרים את המטפל במסד הנתונים
      const { error } = await supabase.from("Therapist").insert(therapistData);
      if (error) throw error;

      // 2. מיד לאחר השמירה המוצלחת - שולחים את המייל אליך!
      // מחלצים את השם היפה של המקצוע (למשל "פסיכולוג/ית" במקום "psychologist")
      const professionLabel = professions.find(p => p.value === form.profession)?.label || form.profession;
      
      try {
        await fetch('/api/notify-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: form.full_name,
            email: form.email,
            phone: form.phone,
            profession: professionLabel
          }),
        });
      } catch (emailError) {
        console.error("שליחת האימייל נכשלה, אבל המטפל נשמר במסד הנתונים:", emailError);
        // אנחנו תופסים פה את השגיאה כדי שאם המייל נכשל מאיזושהי סיבה, 
        // המטפל עדיין יראה הודעת הצלחה (כי הוא באמת נשמר ב-Supabase).
      }

      setLoading(false);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("אירעה שגיאה בשמירת הנתונים. נסה שוב.");
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-6">
        <CheckCircle className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-3">{t.registerSuccess}</h1>
      <p className="text-muted-foreground text-sm leading-relaxed">{t.registerSuccessDesc}</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-accent rounded-2xl mb-4">
          <BadgeCheck className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{t.registerTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.registerSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-2xl p-6">
        {/* Profile photo upload */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
            {photoUrl ? (
              <img src={photoUrl} alt={t.registerPhotoAlt || "תמונת פרופיל"} className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-6 h-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <Label className="text-xs font-medium">{t.registerPhotoLabel || "תמונת פרופיל"}</Label>
            <p className="text-xs text-muted-foreground mb-2">{t.registerPhotoHint || "תמונה מקצועית מגדילה את אמון המטופלים"}</p>
            <label className="inline-flex items-center gap-1.5 cursor-pointer bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-secondary/80 transition-colors">
              {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {uploadingPhoto ? (t.registerUploading || "מעלה...") : (t.registerUploadPhoto || "העלה תמונה")}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">{t.registerFullName || "שם מלא"} *</Label>
            <Input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} placeholder={t.registerFullNamePlaceholder || "ד״ר ישראל לוי"} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t.registerLicenseNumber || "מספר רישיון"} *</Label>
            <Input value={form.license_number} onChange={e => setForm({...form, license_number: e.target.value})} placeholder="12345" />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t.registerProfession || "מקצוע"} *</Label>
          <Select onValueChange={v => setForm({...form, profession: v})}>
            <SelectTrigger><SelectValue placeholder={t.registerSelectProfession || "בחר מקצוע"} /></SelectTrigger>
            <SelectContent>
              {professions.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">{t.registerAbout || "אודות"}</Label>
          <Textarea value={form.about} onChange={e => setForm({...form, about: e.target.value})} placeholder={t.registerAboutPlaceholder || "ספר/י על גישת הטיפול שלך, ניסיונך והתמחויותיך..."} rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">{t.registerCity || "עיר"}</Label>
            <Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder={t.registerCityPlaceholder || "תל אביב"} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t.registerPrice || "מחיר לפגישה (₪)"}</Label>
            <Input type="number" value={form.price_per_session} onChange={e => setForm({...form, price_per_session: e.target.value})} placeholder="350" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t.registerPhone || "טלפון"}</Label>
            <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="050-0000000" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t.registerEmail || "אימייל"}</Label>
            <Input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@example.com" />
          </div>
        </div>

        {checkboxGroup(t.registerFormat || "פורמט טיפול", formatOptions, formats, setFormats)}
        {checkboxGroup(t.registerHmo || "קופות חולים וחברות ביטוח", hmoOptions, hmos, setHmos)}

        <GroupedCheckboxSelect
          label={t.registerTreatmentMethods || "שיטות טיפול"}
          groups={TREATMENT_METHOD_GROUPS}
          selected={treatments}
          onChange={setTreatments}
        />

        <GroupedCheckboxSelect
          label={t.registerSpecializations || "תחומי טיפול והתמחויות"}
          groups={SPECIALIZATION_GROUPS}
          selected={specializations}
          onChange={setSpecializations}
        />

        {checkboxGroup(t.registerLanguages || "שפות טיפול", languageOptions, languages, setLanguages)}

        {/* License document upload */}
        <div className="border border-dashed border-border rounded-xl p-4 space-y-2">
          <Label className="text-sm font-medium flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> {t.registerLicenseDoc || "העלאת מסמך רישיון מקצועי (מומלץ)"}
          </Label>
          <p className="text-xs text-muted-foreground">{t.registerLicenseDocHint || "העלה/י תעודת הסמכה, רישיון מקצועי, או אישור מהרשות המוסמכת. מסמך זה מאפשר לנו לאמת את פרטיך מהר יותר."}</p>
          {licenseDocUrl && (
            <div className="flex items-center gap-2 text-xs text-primary">
              <FileText className="w-4 h-4" /> {t.registerLicenseUploaded || "מסמך הועלה בהצלחה ✓"}
            </div>
          )}
          <label className="inline-flex items-center gap-1.5 cursor-pointer bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-secondary/80 transition-colors">
            {uploadingLicense ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {uploadingLicense ? (t.registerUploading || "מעלה...") : licenseDocUrl ? (t.registerReplaceFile || "החלף קובץ") : (t.registerChooseFile || "בחר קובץ (PDF / תמונה)")}
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleLicenseUpload} disabled={uploadingLicense} />
          </label>
        </div>

        <Button type="submit" disabled={loading} className="w-full font-bold">
          {loading ? (t.registerUploading || "שולח...") : t.registerSubmit}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          {t.registerFootnote || "הפרופיל יפורסם רק לאחר אימות הרישיון המקצועי"}
        </p>
      </form>
    </div>
  );
}