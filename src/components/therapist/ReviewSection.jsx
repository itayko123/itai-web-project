import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Star, BadgeCheck, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

function StarPicker({ value, onChange, label }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground w-24">{label}</span>
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <Star
            key={i}
            className={`w-5 h-5 cursor-pointer transition-colors ${i <= (hovered || value) ? 'fill-amber-400 text-amber-400' : 'text-border'}`}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(i)}
          />
        ))}
      </div>
    </div>
  );
}

export default function ReviewSection({ therapistId }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [ratingPro, setRatingPro] = useState(5);
  const [ratingEmpathy, setRatingEmpathy] = useState(5);
  const [ratingComm, setRatingComm] = useState(5);
  const [content, setContent] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [recommended, setRecommended] = useState(true);

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", therapistId],
    queryFn: () => base44.entities.Review.filter({ therapist_id: therapistId, approved: true }),
  });

  const mutation = useMutation({
    mutationFn: data => base44.entities.Review.create(data),
    onSuccess: () => {
      qc.invalidateQueries(["reviews", therapistId]);
      toast.success("הביקורת נשלחה ותפורסם לאחר אישור");
      setShowForm(false);
      setContent("");
      setRating(5); setRatingPro(5); setRatingEmpathy(5); setRatingComm(5);
      setDisplayName("");
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) { toast.error("יש לכתוב ביקורת"); return; }
    mutation.mutate({
      therapist_id: therapistId,
      rating,
      rating_professionalism: ratingPro,
      rating_empathy: ratingEmpathy,
      rating_communication: ratingComm,
      content,
      is_anonymous: isAnonymous,
      display_name: isAnonymous ? "" : displayName,
      recommended,
    });
  };

  const avgSubRating = (r) => {
    const vals = [r.rating_professionalism, r.rating_empathy, r.rating_communication].filter(Boolean);
    return vals.length ? (vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1) : null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base">ביקורות ({reviews.length})</h3>
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)} className="text-xs">
          + כתוב ביקורת
        </Button>
      </div>

      {showForm && (
        <div className="bg-muted/40 rounded-xl p-4 space-y-4 border border-border">
          <div className="space-y-2">
            <p className="text-sm font-medium">דירוג</p>
            <StarPicker value={rating} onChange={setRating} label="כללי" />
            <StarPicker value={ratingPro} onChange={setRatingPro} label="מקצועיות" />
            <StarPicker value={ratingEmpathy} onChange={setRatingEmpathy} label="אמפתיה" />
            <StarPicker value={ratingComm} onChange={setRatingComm} label="תקשורת" />
          </div>

          <div>
            <p className="text-sm font-medium mb-1">האם תמליץ/י על המטפל?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setRecommended(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${recommended ? 'bg-emerald-100 border-emerald-400 text-emerald-700 font-semibold' : 'border-border text-muted-foreground'}`}
              >
                <ThumbsUp className="w-4 h-4" /> כן, ממליץ/ה
              </button>
              <button
                onClick={() => setRecommended(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${!recommended ? 'bg-red-100 border-red-400 text-red-700 font-semibold' : 'border-border text-muted-foreground'}`}
              >
                לא ממליץ/ה
              </button>
            </div>
          </div>

          <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="שתף/י את החוויה שלך..." rows={3} />

          <div className="flex items-center gap-2">
            <Switch checked={isAnonymous} onCheckedChange={setIsAnonymous} id="anon" />
            <Label htmlFor="anon" className="text-xs">פרסם אנונימית</Label>
          </div>

          {!isAnonymous && (
            <div>
              <Label className="text-xs">שם תצוגה</Label>
              <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="שם שיופיע בביקורת" className="mt-1 text-sm" />
            </div>
          )}

          <div className="flex justify-end">
            <Button size="sm" onClick={handleSubmit} disabled={mutation.isPending}>שלח ביקורת</Button>
          </div>
        </div>
      )}

      {reviews.length === 0 && !showForm && (
        <p className="text-sm text-muted-foreground text-center py-6">אין ביקורות עדיין. היה/י הראשון/ה!</p>
      )}

      <div className="space-y-3">
        {reviews.map(r => (
          <div key={r.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-start justify-between mb-2 gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                    ))}
                  </div>
                  {r.is_verified_patient && (
                    <span className="flex items-center gap-1 text-xs text-primary font-medium">
                      <BadgeCheck className="w-3 h-3" /> מטופל/ת מאומת/ת
                    </span>
                  )}
                  {r.recommended && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full">
                      <ThumbsUp className="w-3 h-3" /> ממליץ/ה
                    </span>
                  )}
                </div>
                {(r.rating_professionalism || r.rating_empathy || r.rating_communication) && (
                  <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground">
                    {r.rating_professionalism && <span>מקצועיות: {r.rating_professionalism}/5</span>}
                    {r.rating_empathy && <span>אמפתיה: {r.rating_empathy}/5</span>}
                    {r.rating_communication && <span>תקשורת: {r.rating_communication}/5</span>}
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {r.is_anonymous ? "אנונימי" : r.display_name || "משתמש"}
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}