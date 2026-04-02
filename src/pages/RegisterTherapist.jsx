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
import { Switch } from "@/components/ui/switch";
import { BadgeCheck, CheckCircle, Upload, Loader2, FileText, Camera } from "lucide-react";
import { toast } from "sonner";
import GroupedCheckboxSelect from "@/components/therapist/GroupedCheckboxSelect";
import { SPECIALIZATION_GROUPS, TREATMENT_METHOD_GROUPS } from "@/lib/therapyOptions";
import { useLanguage } from "@/lib/LanguageContext";
import { sanitizeFormData } from "@/utils/sanitize";
import { generateTherapistSlug } from '@/utils/slugify';

const professionSlugs = {
  psychologist: 'psychologist',
  psychiatrist: 'psychiatrist',
  psychotherapist: 'psychotherapist',
  social_worker: 'social-worker',
  counselor: 'counselor',
};

const cityMap = {
  'תל אביב':'tel-aviv','ירושלים':'jerusalem','חיפה':'haifa',
  'ראשון לציון':'rishon-lezion','פתח תקווה':'petah-tikva','אשדוד':'ashdod',
  'נתניה':'netanya','באר שבע':'beer-sheva','הרצליה':'herzliya',
  'רמת גן':'ramat-gan','רעננה':'raanana','כפר סבא':'kfar-saba',
  'הוד השרון':'hod-hasharon','מודיעין':'modiin','בני ברק':'bnei-brak',
  'חולון':'holon','בת ים':'bat-yam','רחובות':'rehovot','נס ציונה':'nes-ziona',
};

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
  const [form, setForm] = useState({
    full_name: "",
    name_en: "",       // ← NEW: English name for slug
    profession: "",
    license_number: "",
    about: "",
    city: "",
    phone: "",
    email: "",
    price_per_session: "",
    years_experience: ""
  });
  
  const [immediateAvailability, setImmediateAvailability] = useState(false); 
  
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

  // Auto-generate slug preview from name_en + profession + city
  const slugPreview = (() => {
    if (!form.name_en) return '';
    const prof = professionSlugs[form.profession] || '';
    const city = cityMap[form.city] || form.city?.toLowerCase().replace(/\s+/g, '-') || '';
    return [form.name_en, prof, city].filter(Boolean).join('-');
  })();

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    
    try {
      const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/webp'
      };

      const compressedFile = await imageCompression(file, options);
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
    if (!form.full_name || !form.profession || !form.license_number || !form.name_en) {
      toast.error("יש למלא שדות חובה כולל שם באנגלית");
      return;
    }
    setLoading(true);

    try {
      // בדיקת אימייל/טלפון כפולים
      const checkConditions = [];
      if (form.email) checkConditions.push(`email.eq.${form.email}`);
      if (form.phone) checkConditions.push(`phone.eq.${form.phone}`);

      if (checkConditions.length > 0) {
        const { data: existingRecords, error: checkError } = await supabase
          .from("Therapist")
          .select("email, phone")
          .or(checkConditions.join(','));

        if (checkError) throw checkError;

        if (existingRecords && existingRecords.length > 0) {
          const emailExists = form.email && existingRecords.some(r => r.email === form.email);
          const phoneExists = form.phone && existingRecords.some(r => r.phone === form.phone);

          if (emailExists && phoneExists) {
            toast.error("האימייל ומספר הטלפון כבר רשומים במערכת.");
          } else if (emailExists) {
            toast.error("כתובת האימייל הזו כבר רשומה במערכת.");
          } else if (phoneExists) {
            toast.error("מספר הטלפון הזה כבר רשום במערכת.");
          }
          setLoading(false);
          return;
        }
      }

      // בדיקת slug כפול
      const { data: slugExists } = await supabase
        .from('Therapist')
        .select('id')
        .eq('slug', slugPreview)
        .maybeSingle();

      if (slugExists) {
        toast.error("שם זה באנגלית כבר תפוס, נסה להוסיף מספר או שם אמצעי (לדוגמה: moshe-levi-2)");
        setLoading(false);
        return;
      }

      const therapistData = {
        ...sanitizeFormData(form),
        slug: slugPreview,
        price_per_session: form.price_per_session ? Number(form.price_per_session) : undefined,
        years_experience: form.years_experience ? Number(form.years_experience) : undefined,
        immediate_availability: immediateAvailability,
        formats,
        hmo_affiliation: hmos,
        treatment_types: treatments,
        specializations,
        languages,
        photo_url: photoUrl || undefined,
        license_document_url: licenseDocUrl || undefined,
        status: "pending",
      };

      const { error } = await supabase.from("Therapist").insert(therapistData);
      if (error) throw error;

      const professionLabel = professions.find(p => p.value === form.profession)?.label || form.profession;
      
      try {
        const response = await fetch('/api/notify-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.full_name,
            email: form.email,
            phone: form.phone,
            profession: professionLabel
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          console.error("שגיאה מהשרת של Resend:", result.error);
        } else {
          console.log("המייל נשלח! מזהה הודעה:", result.id);
        }
      } catch (emailError) {
        console.error("בעיית רשת או כתובת לא נמצאה:", emailError);
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

        {/* English name field for SEO slug */}
        <div className="space-y-1">
          <Label className="text-xs">שם באנגלית (לכתובת הפרופיל) *</Label>
          <Input
            value={form.name_en}
            onChange={e => setForm({...form, name_en: e.target.value
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
            })}
            placeholder="moshe-levi"
            dir="ltr"
          />
          <p className="text-xs text-muted-foreground">
            רק אותיות אנגליות ומקפים · ישמש כתובת הפרופיל שלך
          </p>
          {slugPreview && (
            <p className="text-xs text-primary font-mono bg-primary/5 px-2 py-1 rounded-lg">
              🔗 itai-web-project.vercel.app/therapist/{slugPreview}
            </p>
          )}
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
          <Label className="text-xs">{t.registerAbout || "אודות"} *</Label>
          <Textarea value={form.about} onChange={e => setForm({...form, about: e.target.value})} placeholder={t.registerAboutPlaceholder || "ספר/י על גישת הטיפול שלך, ניסיונך והתמחויותיך..."} rows={4} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-xs">{t.registerCity || "עיר"}</Label>
            <Input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder={t.registerCityPlaceholder || "תל אביב"} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t.registerPrice || "מחיר לפגישה (₪)"}</Label>
            <Input type="number" value={form.price_per_session} onChange={e => setForm({...form, price_per_session: e.target.value})} placeholder="350" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t.registerPhone || "טלפון"} *</Label>
            <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="050-0000000" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t.registerEmail || "אימייל"} *</Label>
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

        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl p-5 mt-8">
          <div className="space-y-1 pl-4">
            <Label className="text-base font-bold text-primary block">{t.registerImmediateAvailabilityTitle || "זמינות לקבלת מטופלים"}</Label>
            <p className="text-sm text-muted-foreground">{t.registerImmediateAvailabilityDesc || "האם יש לך פניות לקבל מטופלים חדשים באופן מיידי?"}</p>
          </div>
          <div dir="ltr" className="flex-shrink-0 scale-110">
            <Switch 
              checked={immediateAvailability} 
              onCheckedChange={setImmediateAvailability} 
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full font-bold mt-4">
          {loading ? (t.registerUploading || "שולח...") : t.registerSubmit}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          {t.registerFootnote || "הפרופיל יפורסם רק לאחר אימות הרישיון המקצועי"}
        </p>
      </form>
    </div>
  );
}