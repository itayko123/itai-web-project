import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function ContactModal({ therapist, open, onClose, type = "message" }) {
  const [form, setForm] = useState({ patient_name: "", patient_email: "", patient_phone: "", message: "", preferred_format: "", tos_accepted: false });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.tos_accepted) { toast.error("יש לאשר את תנאי השימוש"); return; }
    if (!form.patient_name || !form.patient_email) { toast.error("יש למלא שם ואימייל"); return; }
    setLoading(true);
    const contactData = {
      therapist_id: therapist.id,
      ...form,
      contact_type: type,
      lead_month: new Date().toISOString().slice(0, 7),
    };
    const { error } = await supabase.from("ContactRequest").insert(contactData);
    if (error) throw error;
    // Notify admin and therapist directly
    await supabase.functions.invoke("notify-new-contact", {
      body: { ...contactData, therapist_name: therapist.full_name, therapist_email: therapist.email }
    });
    setLoading(false);
    toast.success("הפנייה נשלחה בהצלחה!");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right">פנייה אל {therapist?.full_name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
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

          {/* ToS */}
          <div className="bg-muted/50 rounded-xl p-3 flex items-start gap-3">
            <Checkbox
              id="tos"
              checked={form.tos_accepted}
              onCheckedChange={v => setForm({...form, tos_accepted: v})}
              className="mt-0.5"
            />
            <label htmlFor="tos" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
              קראתי ואני מסכים/ה ל
              <Link to="/terms" className="text-primary underline mx-1" onClick={onClose}>תנאי השימוש</Link>
              ומבין/ה כי הפלטפורמה אינה אחראית לתהליך הטיפול עצמו.
            </label>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full font-semibold">
            {loading ? "שולח..." : "שלח פנייה"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}