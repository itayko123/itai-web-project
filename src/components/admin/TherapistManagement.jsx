// @ts-nocheck
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, Edit2, X, Save, Search, BadgeCheck, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const profLabels = { psychologist: "פסיכולוג/ית", psychiatrist: "פסיכיאטר/ית", psychotherapist: "פסיכותרפיסט/ית", social_worker: 'עו"ס קליני', counselor: "יועץ/ת" };
const statusColors = { approved: "default", pending: "secondary", rejected: "destructive" };
const statusLabels = { approved: "פעיל", pending: "ממתין", rejected: "נדחה" };

export default function TherapistManagement() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: therapists = [], isLoading } = useQuery({
    queryKey: ["admin-all-therapists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Therapist")
        .select("*")
        .order("created_date", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { error } = await supabase.from("Therapist").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries(["admin-all-therapists"]); toast.success("פרופיל עודכן"); setEditId(null); },
    onError: () => toast.error("שגיאה בעדכון"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("Therapist").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries(["admin-all-therapists"]); toast.success("מטפל נמחק"); setConfirmDelete(null); },
    onError: () => toast.error("שגיאה במחיקה"),
  });

  const startEdit = (t) => {
    setEditData({ ...t });
    setEditId(t.id);
    setExpandedId(t.id);
  };

  const filtered = therapists.filter(t =>
    t.full_name?.includes(search) ||
    t.email?.includes(search) ||
    t.city?.includes(search) ||
    t.license_number?.includes(search)
  );

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם, אימייל, עיר..."
            className="pr-9"
          />
        </div>
        <Badge variant="outline" className="text-xs">{filtered.length} מטפלים</Badge>
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted/50 rounded-lg">
        <div className="col-span-3">שם</div>
        <div className="col-span-2">מקצוע</div>
        <div className="col-span-2">עיר / טלפון</div>
        <div className="col-span-2">מחיר / ניסיון</div>
        <div className="col-span-1">סטטוס</div>
        <div className="col-span-2 text-center">פעולות</div>
      </div>

      <div className="space-y-2">
        {filtered.map(t => (
          <div key={t.id} className="bg-card border border-border rounded-xl overflow-hidden">
            {/* Row */}
            <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
              <div className="col-span-3 flex items-center gap-2 min-w-0">
                {t.photo_url
                  ? <img 
                      src={t.photo_url} 
                      alt={t.full_name} 
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 cursor-pointer ring-2 ring-transparent hover:ring-primary/50 transition-all" 
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(t.photo_url); }}
                    />
                  : <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">{t.full_name?.charAt(0)}</div>
                }
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate flex items-center gap-1">
                    {t.full_name}
                    {t.license_verified && <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{t.email}</div>
                </div>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground">{profLabels[t.profession]}</div>
              <div className="col-span-2 text-xs text-muted-foreground">
                <div>{t.city}</div>
                <div>{t.phone}</div>
              </div>
              <div className="col-span-2 text-xs text-muted-foreground">
                {t.price_per_session && <div>₪{t.price_per_session}</div>}
                {t.years_experience && <div>{t.years_experience} שנים</div>}
              </div>
              <div className="col-span-1">
                <Badge variant={statusColors[t.status] || "secondary"} className="text-xs">
                  {statusLabels[t.status] || t.status}
                </Badge>
              </div>
              <div className="col-span-2 flex items-center justify-center gap-1">
                <Button size="sm" variant="outline" className="h-7 px-2 gap-1 text-xs" onClick={() => startEdit(t)}>
                  <Edit2 className="w-3 h-3" /> עריכה
                </Button>
                <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive hover:bg-destructive/10" onClick={() => setConfirmDelete(t.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
                <button onClick={() => setExpandedId(expandedId === t.id ? null : t.id)} className="p-1 text-muted-foreground hover:text-foreground">
                  {expandedId === t.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Expanded / Edit */}
            {expandedId === t.id && (
              <div className="border-t border-border bg-muted/30 px-4 py-4">
                {editId === t.id ? (
                  <EditForm
                    data={editData}
                    setData={setEditData}
                    onSave={() => updateMutation.mutate({ id: t.id, data: editData })}
                    onCancel={() => setEditId(null)}
                    isSaving={updateMutation.isPending}
                  />
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-muted-foreground">
                    {t.about && <div className="col-span-full"><span className="font-medium text-foreground">אודות: </span>{t.about}</div>}
                    <div><span className="font-medium text-foreground">רישיון: </span>{t.license_number}</div>
                    <div><span className="font-medium text-foreground">אימות: </span>{t.license_verified ? "מאומת ✓" : "לא מאומת"}</div>
                    {t.formats?.length > 0 && <div><span className="font-medium text-foreground">פורמט: </span>{t.formats.join(", ")}</div>}
                    {t.hmo_affiliation?.length > 0 && <div><span className="font-medium text-foreground">קופות: </span>{t.hmo_affiliation.join(", ")}</div>}
                    {t.languages?.length > 0 && <div><span className="font-medium text-foreground">שפות: </span>{t.languages.join(", ")}</div>}
                    {t.specializations?.length > 0 && <div className="col-span-full"><span className="font-medium text-foreground">התמחויות: </span>{t.specializations.join(", ")}</div>}
                  </div>
                )}
              </div>
            )}

            {/* Delete confirm */}
            {confirmDelete === t.id && (
              <div className="border-t border-destructive/30 bg-destructive/5 px-4 py-3 flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-destructive">האם למחוק את פרופיל {t.full_name} לצמיתות?</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="destructive" onClick={() => deleteMutation.mutate(t.id)} disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "מחק"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setConfirmDelete(null)}>ביטול</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground text-sm">לא נמצאו מטפלים</div>}
    </div>
  );
}

function EditForm({ data, setData, onSave, onCancel, isSaving }) {
  const set = (field, val) => setData(prev => ({ ...prev, [field]: val }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div><Label className="text-xs">שם מלא</Label><Input className="mt-1 h-8 text-sm" value={data.full_name || ""} onChange={e => set("full_name", e.target.value)} /></div>
        <div><Label className="text-xs">עיר</Label><Input className="mt-1 h-8 text-sm" value={data.city || ""} onChange={e => set("city", e.target.value)} /></div>
        <div><Label className="text-xs">טלפון</Label><Input className="mt-1 h-8 text-sm" value={data.phone || ""} onChange={e => set("phone", e.target.value)} /></div>
        <div><Label className="text-xs">מחיר לפגישה (₪)</Label><Input type="number" className="mt-1 h-8 text-sm" value={data.price_per_session || ""} onChange={e => set("price_per_session", Number(e.target.value))} /></div>
        <div><Label className="text-xs">שנות ניסיון</Label><Input type="number" className="mt-1 h-8 text-sm" value={data.years_experience || ""} onChange={e => set("years_experience", Number(e.target.value))} /></div>
        <div>
          <Label className="text-xs">סטטוס</Label>
          <Select value={data.status} onValueChange={v => set("status", v)}>
            <SelectTrigger className="mt-1 h-8 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">ממתין</SelectItem>
              <SelectItem value="approved">פעיל</SelectItem>
              <SelectItem value="rejected">נדחה</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs">אודות</Label>
        <Textarea className="mt-1 text-sm" rows={3} value={data.about || ""} onChange={e => set("about", e.target.value)} />
      </div>
      <div className="flex items-center gap-3">
        <Switch checked={!!data.license_verified} onCheckedChange={v => set("license_verified", v)} />
        <Label className="text-xs">רישיון מאומת</Label>
        <Switch checked={!!data.immediate_availability} onCheckedChange={v => set("immediate_availability", v)} />
        <Label className="text-xs">זמין/ה לפגישה מיידית</Label>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={onSave} disabled={isSaving} className="gap-1">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} שמור
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="gap-1"><X className="w-3.5 h-3.5" /> ביטול</Button>
      </div>
      {/* מודל הגדלת תמונה */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="תמונת מטפל מוגדלת" 
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}