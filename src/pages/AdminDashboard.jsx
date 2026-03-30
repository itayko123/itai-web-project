// @ts-nocheck
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Mail, Phone, Loader2, ShieldAlert, BookOpen, MessageSquare, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import TherapistManagement from "@/components/admin/TherapistManagement";

// סידרנו את הטאבים מחדש: הרשמות מטפלים יהיה הראשון (הימני ביותר)
const TABS = ["הרשמות מטפלים", "ניהול מטפלים", "סטטיסטיקת פניות", "מאמרים ממתינים"];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0); 
  
  // ה-state עבור התמונה המוגדלת עבר לרמת האב
  const [selectedImage, setSelectedImage] = useState(null);

  // יאשר כניסה אם אתה אדמין ב-DB *או* אם זה האימייל הספציפי שלך
  if (user?.role !== "admin" && user?.email !== "itaykorin@gmail.com") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <ShieldAlert className="w-12 h-12 text-destructive" />
        <h1 className="text-xl font-bold">אין גישה</h1>
        <p className="text-muted-foreground text-sm">דף זה זמין למנהלים בלבד.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative">
      <h1 className="text-2xl font-black mb-6">פאנל ניהול</h1>

      <div className="flex gap-2 mb-6 border-b border-border flex-wrap">
        {TABS.map((t, i) => (
          <button
            key={i}
            onClick={() => setTab(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === i ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* העברנו את הפונקציה לפתיחת תמונה כ-prop */}
      {tab === 0 && <TherapistRegistrations onImageClick={setSelectedImage} />}
      {tab === 1 && <TherapistManagement onImageClick={setSelectedImage} />}
      {tab === 2 && <ContactRequests />}
      {tab === 3 && <PendingArticles />}

      {/* מודל הגדלת תמונה - עכשיו הוא גלובלי לכל הדאשבורד */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 md:top-8 md:right-8 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors z-[110]"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img 
            src={selectedImage} 
            alt="תמונה מוגדלת" 
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain relative z-[105]"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}

// ==========================================================
// שאר הקומפוננטות
// ==========================================================

function ContactRequests() {
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ContactRequest")
        .select("*")
        .order("created_date", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });
  
  const { data: therapists = [] } = useQuery({
    queryKey: ["admin-all-therapists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Therapist")
        .select("*")
        .eq("status", "approved")
        .order("created_date", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
  });

  const safeRequests = requests || [];
  const safeTherapists = therapists || [];

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prevMonth = (() => { const d = new Date(now.getFullYear(), now.getMonth() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; })();

  const leadCounts = safeRequests.reduce((acc, r) => {
    acc[r.therapist_id] = (acc[r.therapist_id] || 0) + 1;
    return acc;
  }, {});
  
  const monthlyLeads = safeRequests.reduce((acc, r) => {
    const month = r.lead_month || r.created_date?.slice(0, 7) || "?";
    if (!acc[r.therapist_id]) acc[r.therapist_id] = {};
    acc[r.therapist_id][month] = (acc[r.therapist_id][month] || 0) + 1;
    return acc;
  }, {});

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 font-medium">
        ⚠️ תוכן הפניות (הודעות מטופלים) הוא פרטי ומוצג למטפלים בלבד. כאן מוצגת סטטיסטיקה בלבד.
      </div>

      {safeTherapists.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5">
          <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            סיכום פניות לפי מטפל (חודשי)
          </h2>
          <div className="space-y-2">
            {[...safeTherapists].sort((a, b) => (leadCounts[b.id] || 0) - (leadCounts[a.id] || 0)).map(t => {
              const thisMonth = monthlyLeads[t.id]?.[currentMonth] || 0;
              const lastMonth = monthlyLeads[t.id]?.[prevMonth] || 0;
              return (
                <div key={t.id} className="bg-muted/30 rounded-xl p-3 flex items-center justify-between gap-4 flex-wrap">
                  <span className="text-sm font-medium">{t.full_name}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground">חודש נוכחי: <span className="font-bold text-primary">{thisMonth}</span></span>
                    <span className="text-muted-foreground">חודש קודם: <span className="font-bold">{lastMonth}</span></span>
                    <Badge className="bg-primary/10 text-primary text-xs font-bold">סה״כ: {leadCounts[t.id] || 0}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {safeTherapists.length === 0 && <EmptyState text="אין נתוני פניות עדיין" />}
    </div>
  );
}

// קבלנו את הפונקציה onImageClick כ-prop
function TherapistRegistrations({ onImageClick }) {
  const qc = useQueryClient();

  const { data: therapists = [], isLoading } = useQuery({
    queryKey: ["admin-therapists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Therapist")
        .select("*")
        .eq("status", "pending")
        .order("created_date", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("Therapist")
        .update({ status: "approved", license_verified: true })
        .eq("id", id);
      if (error) {
        alert("שגיאת Supabase: " + error.message); 
        throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries(["admin-therapists"]);
      toast.success("מטפל אושר!");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("Therapist").update({ status: "rejected" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries(["admin-therapists"]); toast.success("מטפל נדחה"); },
  });

  const profLabels = { psychologist: "פסיכולוג/ית", psychiatrist: "פסיכיאטר/ית", psychotherapist: "פסיכותרפיסט/ית", social_worker: 'עו"ס קליני', counselor: "יועץ/ת" };

  if (isLoading) return <LoadingSpinner />;
  
  const safeTherapists = therapists || [];
  if (safeTherapists.length === 0) return <EmptyState text="אין הרשמות ממתינות" />;

  return (
    <div className="space-y-4 relative">
      {safeTherapists.map(t => (
        <div key={t.id} className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              
              {/* אזור השם */}
              <div className="flex items-center gap-2 mb-2">
                {t.photo_url ? (
                  <img 
                    src={t.photo_url} 
                    alt={t.full_name} 
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0 cursor-pointer ring-2 ring-transparent hover:ring-primary/50 transition-all" 
                    // שימוש בפונקציה שהועברה מהאב
                    onClick={(e) => { e.stopPropagation(); onImageClick(t.photo_url); }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {t.full_name?.charAt(0)}
                  </div>
                )}
                <span className="font-semibold">{t.full_name}</span>
                <Badge variant="secondary" className="text-xs">{profLabels[t.profession]}</Badge>
              </div>

              <p className="text-xs text-muted-foreground">רישיון: {t.license_number}</p>
              {t.city && <p className="text-xs text-muted-foreground">עיר: {t.city}</p>}
              {t.email && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Mail className="w-3 h-3" /> {t.email}
                </div>
              )}
              {t.phone && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Phone className="w-3 h-3" /> {t.phone}
                </div>
              )}
              {t.about && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.about}</p>}
              {t.license_document_url && (
                <a href={t.license_document_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1">
                  <ExternalLink className="w-3 h-3" /> מסמך רישיון
                </a>
              )}
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Button size="sm" className="gap-1" onClick={() => approveMutation.mutate(t.id)} disabled={approveMutation.isPending}>
                <Check className="w-3.5 h-3.5" /> אשר
              </Button>
              <Button size="sm" variant="destructive" className="gap-1" onClick={() => rejectMutation.mutate(t.id)} disabled={rejectMutation.isPending}>
                <X className="w-3.5 h-3.5" /> דחה
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PendingArticles() {
  const qc = useQueryClient();
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Article")
        .select("*")
        .eq("status", "pending")
        .order("created_date", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("Article").update({ status: "published" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries(["admin-articles"]); toast.success("מאמר פורסם!"); },
  });
  
  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("Article").update({ status: "rejected" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries(["admin-articles"]); toast.success("מאמר נדחה"); },
  });

  const categoryLabels = { anxiety: "חרדה", depression: "דיכאון", relationships: "זוגיות", parenting: "הורות", trauma: "טראומה", mindfulness: "מיינדפולנס", general: "כללי" };

  if (isLoading) return <LoadingSpinner />;
  
  const safeArticles = articles || [];
  if (safeArticles.length === 0) return <EmptyState text="אין מאמרים ממתינים לאישור" />;

  return (
    <div className="space-y-4">
      {safeArticles.map(a => (
        <div key={a.id} className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">{a.title}</span>
                {a.category && <Badge variant="secondary" className="text-xs">{categoryLabels[a.category] || a.category}</Badge>}
                {a.is_premium && <Badge className="text-xs bg-amber-100 text-amber-700">פרמיום</Badge>}
              </div>
              {a.therapist_name && <p className="text-xs text-muted-foreground">מאת: {a.therapist_name}</p>}
              {a.excerpt && <p className="text-sm text-muted-foreground bg-muted/40 rounded-lg p-2 line-clamp-3">{a.excerpt}</p>}
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Button size="sm" className="gap-1" onClick={() => approveMutation.mutate(a.id)} disabled={approveMutation.isPending}>
                <Check className="w-3.5 h-3.5" /> פרסם
              </Button>
              <Button size="sm" variant="destructive" className="gap-1" onClick={() => rejectMutation.mutate(a.id)} disabled={rejectMutation.isPending}>
                <X className="w-3.5 h-3.5" /> דחה
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function LoadingSpinner() {
  return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
}
function EmptyState({ text }) {
  return <div className="text-center py-16 text-muted-foreground text-sm">{text}</div>;
}