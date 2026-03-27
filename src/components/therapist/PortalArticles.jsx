import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit2, FileText, Clock, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";

const categoryLabels = {
  anxiety: "חרדה", depression: "דיכאון", relationships: "זוגיות",
  parenting: "הורות", trauma: "טראומה", mindfulness: "מיינדפולנס", general: "כללי"
};

const statusColors = {
  draft: "secondary", pending: "outline", published: "default", rejected: "destructive"
};
const statusLabels = {
  draft: "טיוטה", pending: "ממתין לאישור", published: "פורסם", rejected: "נדחה"
};

export default function PortalArticles({ therapistId, therapistName }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", category: "general" });

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["portal-articles", therapistId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Article")
        .select("*")
        .eq("therapist_id", therapistId)
        .order("created_date", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!therapistId,
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const { error } = await supabase.from("Article").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-articles"] });
      toast.success("המאמר נשלח לאישור");
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const { error } = await supabase.from("Article").update(data).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["portal-articles"] });
      toast.success("המאמר עודכן");
      resetForm();
    },
  });

  const resetForm = () => {
    setForm({ title: "", excerpt: "", content: "", category: "general" });
    setShowForm(false);
    setEditingId(null);
  };

  const startEdit = (article) => {
    setForm({ title: article.title, excerpt: article.excerpt || "", content: article.content, category: article.category || "general" });
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.title || !form.content) { toast.error("יש למלא כותרת ותוכן"); return; }
    const data = {
      ...form,
      therapist_id: therapistId,
      therapist_name: therapistName,
      status: "pending",
      read_time_minutes: Math.ceil((form.content || "").split(" ").length / 200),
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base">המאמרים שלי</h3>
          <p className="text-xs text-muted-foreground mt-0.5">פרסם מאמרים מקצועיים ובנה נוכחות דיגיטלית</p>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(!showForm); }} className="gap-1">
          <PlusCircle className="w-4 h-4" /> מאמר חדש
        </Button>
      </div>

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>מאמרים פרמיום:</strong> מאמרים פרסומיים של מטפלים מאושרים מופיעים בדף הראשי ובדף המטפל. פרסום מאמרים כרוך בתשלום עמלה חודשית. <a href="/contact" className="underline">ליצירת קשר</a>
      </div>

      {showForm && (
        <div className="bg-muted/30 border border-border rounded-xl p-5 space-y-4">
          <h4 className="font-semibold text-sm">{editingId ? "ערוך מאמר" : "מאמר חדש"}</h4>
          <div>
            <Label className="text-xs">כותרת *</Label>
            <Input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="כותרת המאמר..." className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">קטגוריה</Label>
            <Select value={form.category} onValueChange={v => setForm(f => ({...f, category: v}))}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">תקציר קצר (1-2 משפטים)</Label>
            <Textarea value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} rows={2} className="mt-1" placeholder="תיאור קצר שיופיע בתצוגה מקדימה..." />
          </div>
          <div>
            <Label className="text-xs">תוכן המאמר *</Label>
            <Textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} rows={8} className="mt-1" placeholder="כתוב את המאמר המקצועי שלך כאן..." />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={isPending} size="sm">
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin ml-1" /> : null}
              {editingId ? "עדכן מאמר" : "שלח לאישור"}
            </Button>
            <Button variant="outline" size="sm" onClick={resetForm}>ביטול</Button>
          </div>
        </div>
      )}

      {isLoading && <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-primary" /></div>}

      {!isLoading && articles.length === 0 && !showForm && (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">עדיין לא פרסמת מאמרים</p>
        </div>
      )}

      <div className="space-y-3">
        {articles.map(article => (
          <div key={article.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant={statusColors[article.status]} className="text-xs">{statusLabels[article.status]}</Badge>
                  <Badge variant="outline" className="text-xs">{categoryLabels[article.category]}</Badge>
                </div>
                <h4 className="font-semibold text-sm">{article.title}</h4>
                {article.excerpt && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{article.excerpt}</p>}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.read_time_minutes || 1} דק' קריאה</span>
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.view_count || 0} צפיות</span>
                </div>
              </div>
              {article.status === "draft" || article.status === "rejected" ? (
                <Button size="sm" variant="outline" onClick={() => startEdit(article)} className="gap-1 flex-shrink-0">
                  <Edit2 className="w-3 h-3" /> ערוך
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}