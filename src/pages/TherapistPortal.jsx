import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { uploadTherapistFile } from "@/lib/storage";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, UserCircle2, Mail, Phone, BadgeCheck, Edit2, Save, X, Upload, FileText, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import PortalArticles from "@/components/therapist/PortalArticles";
import GroupedCheckboxSelect from "@/components/therapist/GroupedCheckboxSelect";
import { SPECIALIZATION_GROUPS, TREATMENT_METHOD_GROUPS } from "@/lib/therapyOptions";

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

export default function TherapistPortal() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [tab, setTab] = useState(0);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingLicense, setUploadingLicense] = useState(false);

  // Multi-select edit state
  const [editFormats, setEditFormats] = useState([]);
  const [editHmos, setEditHmos] = useState([]);
  const [editTreatments, setEditTreatments] = useState([]);
  const [editSpecs, setEditSpecs] = useState([]);
  const [editLanguages, setEditLanguages] = useState([]);

  const { data: therapistList = [], isLoading } = useQuery({
    queryKey: ["my-therapist-profile", user?.email],
    queryFn: async () => {
      const { data, error } = await supabase.from("Therapist").select("*").eq("email", user?.email);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user?.email,
  });

  const therapist = therapistList[0];

  const { data: requests = [] } = useQuery({
    queryKey: ["my-contact-requests", therapist?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ContactRequest")
        .select("*")
        .eq("therapist_id", therapist?.id)
        .order("created_at", { ascending: false }) // שינוי ל-created_at כסטנדרט
        .limit(50);
      
      if (error) {
        // ניסיון fallback לעמודה בשם אחר אם הדירוג נכשל
        const { data: dataAlt, error: errorAlt } = await supabase
          .from("ContactRequest")
          .select("*")
          .eq("therapist_id", therapist?.id)
          .order("created_date", { ascending: false });
        if (errorAlt) throw errorAlt;
        return dataAlt ?? [];
      }
      return data ?? [];
    },
    enabled: !!therapist?.id,
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from("Therapist").update(data).eq("id", therapist.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-therapist-profile"] });
      toast.success("הפרופיל עודכן בהצלחה");
      setEditMode(false);
    },
    onError: () => toast.error("שגיאה בעדכון הפרופיל"),
  });

  const markResponded = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("ContactRequest")
        .update({ status: "responded" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("הפנייה סומנה כטופלה!");
      qc.invalidateQueries({ queryKey: ["my-contact-requests"] });
    },
    onError: (err) => {
      console.error("Update request error:", err);
      toast.error("העדכון נכשל! בדוק את הרשאות ה-RLS במסד הנתונים.");
    },
  });

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <UserCircle2 className="w-12 h-12 text-primary" />
        <h1 className="text-xl font-bold">אזור מטפלים</h1>
        <p className="text-muted-foreground text-sm">יש להתחבר כדי לגשת לאזור המטפלים.</p>
        <Button onClick={() => window.location.assign("/")}>התחבר</Button>
      </div>
    );
  }

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  if (!therapist) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <UserCircle2 className="w-12 h-12 text-muted-foreground" />
        <h1 className="text-xl font-bold">פרופיל מטפל לא נמצא</h1>
        <p className="text-muted-foreground text-sm">הכתובת {user.email} אינה משויכת לפרופיל מטפל במערכת.</p>
        <Button asChild variant="outline"><a href="/register-therapist">הירשם כמטפל</a></Button>
      </div>
    );
  }

  const pendingCount = requests.filter(r => !r.status || r.status === "pending").length;

  const startEdit = () => {
    setTab(1);
    setEditData({
      full_name: therapist.full_name || "",
      about: therapist.about || "",
      phone: therapist.phone || "",
      address: therapist.address || "",
      city: therapist.city || "",
      website: therapist.website || "",
      price_per_session: therapist.price_per_session || "",
      years_experience: therapist.years_experience || "",
      immediate_availability: therapist.immediate_availability || false,
    });
    setEditFormats(therapist.formats || []);
    setEditHmos(therapist.hmo_affiliation || []);
    setEditTreatments(therapist.treatment_types || []);
    setEditSpecs(therapist.specializations || []);
    setEditLanguages(therapist.languages || []);
    setEditMode(true);
  };

  const handleSave = () => {
    updateMutation.mutate({
      ...editData,
      price_per_session: editData.price_per_session ? Number(editData.price_per_session) : undefined,
      years_experience: editData.years_experience ? Number(editData.years_experience) : undefined,
      formats: editFormats,
      hmo_affiliation: editHmos,
      treatment_types: editTreatments,
      specializations: editSpecs,
      languages: editLanguages,
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingPhoto(true);
    const fileUrl = await uploadTherapistFile(file, "photos");
    await supabase.from("Therapist").update({ photo_url: fileUrl }).eq("id", therapist.id);
    qc.invalidateQueries({ queryKey: ["my-therapist-profile"] });
    toast.success("תמונת הפרופיל עודכנה");
    setUploadingPhoto(false);
  };

  const handleLicenseUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingLicense(true);
    const fileUrl = await uploadTherapistFile(file, "licenses");
    await supabase.from("Therapist").update({ license_document_url: fileUrl }).eq("id", therapist.id);
    qc.invalidateQueries({ queryKey: ["my-therapist-profile"] });
    toast.success("מסמך הרישיון הועלה בהצלחה. הצוות שלנו יאמת אותו בקרוב.");
    setUploadingLicense(false);
  };

  const tabs = ["פניות מטופלים", "פרטי פרופיל", "המאמרים שלי"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-l from-primary/10 to-accent rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4 flex-wrap">
          {/* Photo */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-primary/20">
              {therapist.photo_url ? (
                <img src={therapist.photo_url} alt={therapist.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary/60">
                  {therapist.full_name?.charAt(0)}
                </div>
              )}
            </div>
            <label className="absolute -bottom-2 -left-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors">
              {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Upload className="w-3.5 h-3.5 text-white" />}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
            </label>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black">{therapist.full_name}</h1>
              {therapist.license_verified && (
                <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                  <BadgeCheck className="w-3 h-3" /> מאומת
                </div>
              )}
              <Badge variant={therapist.status === "approved" ? "default" : therapist.status === "pending" ? "secondary" : "destructive"} className="text-xs">
                {therapist.status === "approved" ? "פעיל" : therapist.status === "pending" ? "ממתין לאישור" : "נדחה"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{therapist.city}</p>
            <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
          </div>
          <Button size="sm" variant="outline" onClick={startEdit} className="gap-1 flex-shrink-0">
            <Edit2 className="w-3.5 h-3.5" /> ערוך פרופיל
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: "פניות חדשות", value: pendingCount, highlight: pendingCount > 0 },
          { label: "סה״כ פניות", value: requests.length },
        ].map(s => (
          <div key={s.label} className={`bg-card border rounded-xl p-4 text-center ${s.highlight ? "border-primary/40 bg-primary/5" : "border-border"}`}>
            <div className="text-2xl font-black text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b border-border overflow-x-auto">
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t} {i === 0 && pendingCount > 0 && <span className="mr-1.5 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
          </button>
        ))}
      </div>

      {/* Tab: Contact Requests */}
      {tab === 0 && (
        <div className="space-y-3">
          {requests.length === 0 && <p className="text-center py-12 text-muted-foreground text-sm">אין פניות עדיין</p>}
          {requests.map(r => (
            <div key={r.id} className={`bg-card border rounded-xl p-4 ${(!r.status || r.status === "pending") ? "border-primary/30" : "border-border"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{r.patient_name}</span>
                    <Badge variant={r.status === "responded" ? "secondary" : "default"} className="text-xs">
                      {r.status === "responded" ? "טופל" : r.status === "viewed" ? "נצפה" : "חדש"}
                    </Badge>
                  </div>
                  {r.patient_phone && (
                    <a href={`tel:${r.patient_phone}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <Phone className="w-3 h-3" /> {r.patient_phone}
                    </a>
                  )}
                  {r.patient_email && (
                    <a href={`mailto:${r.patient_email}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                      <Mail className="w-3 h-3" /> {r.patient_email}
                    </a>
                  )}
                  {r.message && <p className="text-sm bg-muted/40 rounded-lg p-2 mt-1">{r.message}</p>}
                  {r.preferred_format && <p className="text-xs text-muted-foreground">פורמט: {r.preferred_format}</p>}
                  <p className="text-xs text-muted-foreground">
                    {r.created_at || r.created_date 
                      ? new Date(r.created_at || r.created_date).toLocaleDateString("he-IL") 
                      : "תאריך לא זמין"}
                  </p>
                </div>
                {r.status !== "responded" && (
                  <Button size="sm" variant="outline" onClick={() => markResponded.mutate(r.id)} disabled={markResponded.isPending}>
                    {markResponded.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "סמן כטופל"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Profile Edit */}
      {tab === 1 && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-5">
          {editMode ? (
            <>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">שם מלא</Label>
                  <Input value={editData.full_name} onChange={e => setEditData(d => ({...d, full_name: e.target.value}))} className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">אודות (תיאור עצמי)</Label>
                  <Textarea value={editData.about} onChange={e => setEditData(d => ({...d, about: e.target.value}))} rows={4} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">טלפון</Label>
                    <Input value={editData.phone} onChange={e => setEditData(d => ({...d, phone: e.target.value}))} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">מחיר לפגישה (₪)</Label>
                    <Input type="number" value={editData.price_per_session} onChange={e => setEditData(d => ({...d, price_per_session: e.target.value}))} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">עיר</Label>
                    <Input value={editData.city} onChange={e => setEditData(d => ({...d, city: e.target.value}))} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">שנות ניסיון</Label>
                    <Input type="number" value={editData.years_experience} onChange={e => setEditData(d => ({...d, years_experience: e.target.value}))} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm">כתובת קליניקה</Label>
                  <Input value={editData.address} onChange={e => setEditData(d => ({...d, address: e.target.value}))} className="mt-1" />
                </div>
                {checkboxGroup("פורמט טיפול", [
                  {value:"in_person",label:"פנים אל פנים"},{value:"zoom",label:"זום"},{value:"phone",label:"טלפון"}
                ], editFormats, setEditFormats)}

                {checkboxGroup("קופות חולים וחברות ביטוח", [
                  {value:"maccabi",label:"מכבי"},{value:"clalit",label:"כללית"},{value:"meuhedet",label:"מאוחדת"},{value:"leumit",label:"לאומית"},
                  {value:"menora",label:"מנורה"},{value:"harel",label:"הראל"},{value:"clal_insurance",label:"כלל ביטוח"},
                  {value:"migdal",label:"מגדל"},{value:"phoenix",label:"הפניקס"},{value:"ayalon",label:"איילון"},
                  {value:"private",label:"פרטי"}
                ], editHmos, setEditHmos)}

                <GroupedCheckboxSelect
                  label="שיטות טיפול"
                  groups={TREATMENT_METHOD_GROUPS}
                  selected={editTreatments}
                  onChange={setEditTreatments}
                />

                <GroupedCheckboxSelect
                  label="תחומי טיפול והתמחויות"
                  groups={SPECIALIZATION_GROUPS}
                  selected={editSpecs}
                  onChange={setEditSpecs}
                />

                {checkboxGroup("שפות טיפול", [
                  {value:"hebrew",label:"עברית"},{value:"english",label:"אנגלית"},{value:"arabic",label:"ערבית"},{value:"russian",label:"רוסית"},{value:"french",label:"צרפתית"},{value:"spanish",label:"ספרדית"},{value:"amharic",label:"אמהרית"}
                ], editLanguages, setEditLanguages)}

                <div className="bg-muted/30 rounded-xl p-4 space-y-3 border border-border">
                  <Label className="text-sm font-semibold">זמינות</Label>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">פתוח/ה למטופלים חדשים</p>
                      <p className="text-xs text-muted-foreground">יופיע בפרופיל הציבורי שלך</p>
                    </div>
                    <Switch checked={editData.immediate_availability} onCheckedChange={v => setEditData(d => ({...d, immediate_availability: v}))} />
                  </div>
                  <div className={`text-xs font-medium px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${editData.immediate_availability ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                    {editData.immediate_availability ? "✓ מוצג כזמין למטופלים חדשים" : "✗ מוצג כלא זמין כעת"}
                  </div>
                </div>

                {/* License Upload */}
                <div className="border border-dashed border-border rounded-xl p-4">
                  <Label className="text-sm font-medium">העלאת מסמך רישיון מקצועי</Label>
                  <p className="text-xs text-muted-foreground mt-1 mb-3">העלה/י תעודת הסמכה או רישיון מקצועי לאימות</p>
                  {therapist.license_document_url && (
                    <div className="flex items-center gap-2 text-xs text-primary mb-2">
                      <FileText className="w-4 h-4" />
                      <a href={therapist.license_document_url} target="_blank" rel="noreferrer" className="underline">מסמך קיים – צפייה</a>
                    </div>
                  )}
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-secondary text-secondary-foreground px-3 py-2 rounded-lg text-xs font-medium hover:bg-secondary/80 transition-colors">
                    {uploadingLicense ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {uploadingLicense ? "מעלה..." : "בחר קובץ"}
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleLicenseUpload} disabled={uploadingLicense} />
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleSave} disabled={updateMutation.isPending} className="gap-1">
                  {updateMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  שמור שינויים
                </Button>
                <Button variant="outline" onClick={() => setEditMode(false)} className="gap-1">
                  <X className="w-3.5 h-3.5" /> ביטול
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-3 text-sm">
              {[
                { label: "תיאור", value: therapist.about },
                { label: "טלפון", value: therapist.phone },
                { label: "אימייל", value: therapist.email },
                { label: "עיר", value: therapist.city },
                { label: "כתובת", value: therapist.address },
                { label: "מחיר לפגישה", value: therapist.price_per_session ? `₪${therapist.price_per_session}` : null },
                { label: "שנות ניסיון", value: therapist.years_experience ? `${therapist.years_experience} שנים` : null },
                { label: "מספר רישיון", value: therapist.license_number },
              ].map(item => item.value && (
                <div key={item.label} className="flex gap-2">
                  <span className="font-medium text-muted-foreground text-xs w-28 flex-shrink-0">{item.label}:</span>
                  <span className="text-sm">{item.value}</span>
                </div>
              ))}
              {therapist.license_document_url && (
                <div className="flex items-center gap-2 text-xs text-primary">
                  <FileText className="w-4 h-4" />
                  <a href={therapist.license_document_url} target="_blank" rel="noreferrer" className="underline">צפה במסמך הרישיון שהועלה</a>
                </div>
              )}
              <Button size="sm" onClick={startEdit} variant="outline" className="gap-1 mt-2">
                <Edit2 className="w-3.5 h-3.5" /> ערוך פרטים
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Articles */}
      {tab === 2 && therapist && <PortalArticles therapistId={therapist.id} therapistName={therapist.full_name} />}
    </div>
  );
}