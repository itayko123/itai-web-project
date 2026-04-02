// @ts-nocheck
import { useState, useEffect } from "react";
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

const professionSlugs = {
  psychologist: 'psychologist', psychiatrist: 'psychiatrist',
  psychotherapist: 'psychotherapist', social_worker: 'social-worker', counselor: 'counselor',
};

const cityMap = {
  'תל אביב':'tel-aviv','ירושלים':'jerusalem','חיפה':'haifa',
  'ראשון לציון':'rishon-lezion','פתח תקווה':'petah-tikva','אשדוד':'ashdod',
  'נתניה':'netanya','באר שבע':'beer-sheva','הרצליה':'herzliya',
  'רמת גן':'ramat-gan','רעננה':'raanana','כפר סבא':'kfar-saba',
  'הוד השרון':'hod-hasharon','מודיעין':'modiin','בני ברק':'bnei-brak',
  'חולון':'holon','בת ים':'bat-yam','רחובות':'rehovot','נס ציונה':'nes-ziona',
  'גבעתיים':'givatayim','לוד':'lod','רמלה':'ramla','נהריה':'nahariya',
  'עכו':'acre','כרמיאל':'karmiel','נצרת':'nazareth','טבריה':'tiberias',
  'צפת':'safed','חדרה':'hadera','ראש העין':'rosh-haayin','אילת':'eilat',
  'דימונה':'dimona','קריית גת':'kiryat-gat','בית שמש':'beit-shemesh',
  'מעלה אדומים':'maale-adumim','מבשרת ציון':'mevasseret-zion',
};

export default function TherapistManagement({ onImageClick }) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

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
                      onClick={(e) => { e.stopPropagation(); if(onImageClick) onImageClick(t.photo_url); }}
                    />
                  : <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">{t.full_name?.charAt(0)}</div>
                }
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate flex items-center gap-1">
                    {t.full_name}
                    {t.license_verified && <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{t.email}</div>
                  {t.slug && (
                    <div className="text-xs font-mono text-muted-foreground/60 truncate">/{t.slug}</div>
                  )}
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
                    {t.slug && <div className="col-span-full"><span className="font-medium text-foreground">URL: </span><span className="font-mono">/therapist/{t.slug}</span></div>}
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
  const [slugTaken, setSlugTaken] = useState(false);
  const set = (field, val) => setData(prev => ({ ...prev, [field]: val }));

  const autoSlug = (() => {
    const namePart = data.name_en?.trim() || '';
    const prof = professionSlugs[data.profession] || '';
    const city = cityMap[data.city?.trim()] || data.city?.toLowerCase().replace(/\s+/g, '-') || '';
    return [namePart, prof, city].filter(Boolean).join('-')
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  })();

  // Real-time duplicate slug check
  useEffect(() => {
    if (!data.slug) { setSlugTaken(false); return; }
    const check = async () => {
      const { data: existing } = await supabase
        .from('Therapist')
        .select('id')
        .eq('slug', data.slug)
        .neq('id', data.id)
        .maybeSingle();
      setSlugTaken(!!existing);
    };
    const timeout = setTimeout(check, 500);
    return () => clearTimeout(timeout);
  }, [data.slug, data.id]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div><Label className="text-xs">שם מלא</Label><Input className="mt-1 h-8 text-sm" value={data.full_name || ""} onChange={e => set("full_name", e.target.value)} /></div>
        <div><Label className="text-xs">עיר</Label><Input className="mt-1 h-8 text-sm" value={data.city || ""} onChange={e => {
          set("city", e.target.value);
          // auto-update slug city part when city changes
          const namePart = data.name_en?.trim() || '';
          const prof = professionSlugs[data.profession] || '';
          const city = cityMap[e.target.value?.trim()] || e.target.value?.toLowerCase().replace(/\s+/g, '-') || '';
          if (namePart) {
            const newSlug = [namePart, prof, city].filter(Boolean).join('-').replace(/-+/g, '-').replace(/^-|-$/g, '');
            set("slug", newSlug);
          }
        }} /></div>
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

      {/* Slug Section */}
      <div className="bg-muted/40 border border-border rounded-xl p-3 space-y-3">
        <Label className="text-xs font-bold">כתובת URL של הפרופיל</Label>

        <div>
          <Label className="text-xs text-muted-foreground">שם באנגלית (בסיס ה-URL)</Label>
          <Input
            className="mt-1 h-8 text-sm font-mono"
            dir="ltr"
            value={data.name_en || ""}
            onChange={e => {
              const cleaned = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
              set("name_en", cleaned);
              const prof = professionSlugs[data.profession] || '';
              const city = cityMap[data.city?.trim()] || data.city?.toLowerCase().replace(/\s+/g, '-') || '';
              const newSlug = [cleaned, prof, city].filter(Boolean).join('-').replace(/-+/g, '-').replace(/^-|-$/g, '');
              set("slug", newSlug);
            }}
            placeholder="moshe-levi"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs text-muted-foreground">slug מלא (ניתן לעריכה ידנית)</Label>
            <button
              type="button"
              onClick={() => set("slug", autoSlug)}
              className="text-xs text-primary hover:underline"
            >
              ↺ חדש אוטומטית
            </button>
          </div>
          <Input
            className={`h-8 text-sm font-mono ${slugTaken ? 'border-destructive' : ''}`}
            dir="ltr"
            value={data.slug || ""}
            onChange={e => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-'))}
            placeholder="moshe-levi-psychologist-tel-aviv"
          />
          {data.slug && !slugTaken && (
            <p className="text-xs text-primary font-mono mt-1 bg-primary/5 px-2 py-1 rounded">
              🔗 /therapist/{data.slug}
            </p>
          )}
          {slugTaken && (
            <p className="text-xs text-destructive bg-destructive/10 px-2 py-1 rounded mt-1 font-medium">
              ⚠️ ה-slug הזה כבר תפוס! נסה אחד מהאפשרויות:<br/>
              <span className="font-mono">{data.slug}-2</span> ·{' '}
              <span className="font-mono">{data.slug}-children</span> ·{' '}
              <span className="font-mono">{data.slug}-cbt</span>
            </p>
          )}
        </div>

        <div className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          💡 אם יש שני מטפלים עם אותו שם ועיר, הוסף מספר או התמחות:<br/>
          <span className="font-mono">moshe-levi-psychologist-tel-aviv-2</span><br/>
          <span className="font-mono">moshe-levi-children-psychologist-tel-aviv</span><br/>
          <span className="font-mono">moshe-levi-cbt-psychologist-tel-aviv</span>
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
        <Button size="sm" onClick={onSave} disabled={isSaving || slugTaken} className="gap-1">
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} שמור
        </Button>
        <Button size="sm" variant="outline" onClick={onCancel} className="gap-1"><X className="w-3.5 h-3.5" /> ביטול</Button>
      </div>
    </div>
  );
}