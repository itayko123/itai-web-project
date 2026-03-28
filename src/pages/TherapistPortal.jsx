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
        // אנחנו עדיין מבקשים מ-Supabase לסדר, למקרה שזה יעבוד
        .order("created_date", { ascending: false }) 
        .limit(50);
        
      if (error) throw error;
      
      // הנה הקסם: סידור כפוי ב-JavaScript מהחדש לישן!
      const sortedData = (data || []).sort((a, b) => {
        // הופכים את התאריכים לזמן אמיתי ומחסרים ביניהם כדי לסדר
        return new Date(b.created_date) - new Date(a.created_date);
      });
      
      return sortedData;
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

  // פונקציה שמחזירה את הסטטוס למצב הקודם
  const undoResponded = useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from('ContactRequest')
        .update({ status: 'pending' }) 
        .eq('id', id);
        
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      // תיקון: השתמשנו ב-qc וב-queryKey הנכון
      qc.invalidateQueries({ queryKey: ["my-contact-requests"] });
      toast.success("פעולת העדכון בוטלה");
    }
  });

  const markResponded = useMutation({
    mutationFn: async (id) => {
      const { data, error } = await supabase
        .from("ContactRequest")
        .update({ status: "responded" })
        .eq("id", id)
        .select(); 

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("לא נמצאה שורה לעדכון במסד הנתונים!");
      }
      return id; 
    },
    onSuccess: (id) => {
      qc.invalidateQueries({ queryKey: ["my-contact-requests"] });
      
      // שיניתי ל-toast.success כדי שזה יהיה בולט
      toast.success('הפנייה סומנה כטופלה', {
        action: {
          label: 'ביטול',
          onClick: () => undoResponded.mutate(id)
        },
        duration: 5000,
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error("שגיאה: " + err.message);
    },
  });

  if (!user) return <div className="p-10 text-center">יש להתחבר</div>;
  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
  if (!therapist) return <div className="p-10 text-center">פרופיל לא נמצא</div>;

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
    toast.success("הרישיון הועלה");
    setUploadingLicense(false);
  };

  const tabs = ["פניות מטופלים", "פרטי פרופיל", "המאמרים שלי"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-l from-primary/10 to-accent rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-primary/20">
              {therapist.photo_url ? (
                <img src={therapist.photo_url} alt={therapist.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary/60">{therapist.full_name?.charAt(0)}</div>
              )}
            </div>
            <label className="absolute -bottom-2 -left-2 w-7 h-7 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80">
              {uploadingPhoto ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Upload className="w-3.5 h-3.5 text-white" />}
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
            </label>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black">{therapist.full_name}</h1>
              {therapist.license_verified && <Badge className="bg-primary/10 text-primary border-none"><BadgeCheck className="w-3 h-3 ml-1" /> מאומת</Badge>}
              <Badge variant={therapist.status === "approved" ? "default" : "secondary"}>{therapist.status === "approved" ? "פעיל" : "ממתין"}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{therapist.city}</p>
          </div>
          <Button size="sm" variant="outline" onClick={startEdit} className="gap-1"><Edit2 className="w-3.5 h-3.5" /> ערוך</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className={`bg-card border rounded-xl p-4 text-center ${pendingCount > 0 ? "border-primary/40 bg-primary/5" : ""}`}>
          <div className="text-2xl font-black">{pendingCount}</div>
          <div className="text-xs text-muted-foreground">פניות חדשות</div>
        </div>
        <div className="bg-card border rounded-xl p-4 text-center">
          <div className="text-2xl font-black">{requests.length}</div>
          <div className="text-xs text-muted-foreground">סה״כ פניות</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 border-b overflow-x-auto">
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
            {t} {i === 0 && pendingCount > 0 && <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full mr-1">{pendingCount}</span>}
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
                    <Badge variant={r.status === "responded" ? "secondary" : "default"} className="text-[10px]">
                      {r.status === "responded" ? "טופל" : "חדש"}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1 mt-1">
                    {r.patient_phone && <a href={`tel:${r.patient_phone}`} className="flex items-center gap-1 text-xs text-primary underline"><Phone className="w-3 h-3" /> {r.patient_phone}</a>}
                    {r.patient_email && <a href={`mailto:${r.patient_email}`} className="flex items-center gap-1 text-xs text-primary underline"><Mail className="w-3 h-3" /> {r.patient_email}</a>}
                  </div>
                  {r.message && <p className="text-sm bg-muted/40 rounded-lg p-2 mt-2">{r.message}</p>}
                  <p className="text-[10px] text-muted-foreground mt-2">
                    תאריך פנייה: {r.created_date ? new Date(r.created_date).toLocaleDateString("he-IL") : "לא זמין"}
                  </p>
                </div>
                {r.status !== "responded" && (
                  <Button size="sm" onClick={() => markResponded.mutate(r.id)} disabled={markResponded.isPending}>
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
        <div className="bg-card border rounded-xl p-5 space-y-5">
          {editMode ? (
            <div className="space-y-4">
              <Input placeholder="שם מלא" value={editData.full_name} onChange={e => setEditData(d => ({...d, full_name: e.target.value}))} />
              <Textarea placeholder="אודות" value={editData.about} onChange={e => setEditData(d => ({...d, about: e.target.value}))} rows={4} />
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="טלפון" value={editData.phone} onChange={e => setEditData(d => ({...d, phone: e.target.value}))} />
                <Input placeholder="מחיר" type="number" value={editData.price_per_session} onChange={e => setEditData(d => ({...d, price_per_session: e.target.value}))} />
              </div>
              
              <GroupedCheckboxSelect label="שיטות טיפול" groups={TREATMENT_METHOD_GROUPS} selected={editTreatments} onChange={setEditTreatments} />
              <GroupedCheckboxSelect label="התמחויות" groups={SPECIALIZATION_GROUPS} selected={editSpecs} onChange={setEditSpecs} />

              <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <span className="text-sm font-medium">זמין למטופלים חדשים</span>
                <Switch checked={editData.immediate_availability} onCheckedChange={v => setEditData(d => ({...d, immediate_availability: v}))} />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={updateMutation.isPending}>{updateMutation.isPending ? "שומר..." : "שמור שינויים"}</Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>ביטול</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm"><span className="font-bold">אודות:</span> {therapist.about}</p>
              <p className="text-sm"><span className="font-bold">עיר:</span> {therapist.city}</p>
              <Button size="sm" onClick={startEdit} variant="outline">ערוך פרטים</Button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Articles */}
      {tab === 2 && therapist && <PortalArticles therapistId={therapist.id} therapistName={therapist.full_name} />}
    </div>
  );
}