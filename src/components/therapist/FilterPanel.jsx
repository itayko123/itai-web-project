import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { SPECIALIZATION_GROUPS, TREATMENT_METHOD_GROUPS } from "@/lib/therapyOptions";
import { ISRAEL_LOCATIONS } from "@/lib/israelLocations";
import { useLanguage } from "@/lib/LanguageContext";

function CompactGroupedSelect({ label, groups, value, onChange, allLabel }) {
  const [open, setOpen] = useState(false);
  const allItems = groups.flatMap(g => g.items);
  const selectedLabel = allItems.find(i => i.value === value)?.label;

  return (
    <div className="space-y-1 relative">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <button
        type="button"
        aria-label={`פתח סינון ${label}`}
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="w-full h-9 flex items-center justify-between px-3 rounded-md border border-input bg-transparent text-sm hover:bg-muted/30 transition-colors"
      >
        <span className={selectedLabel ? "text-foreground" : "text-muted-foreground"}>
          {selectedLabel || allLabel}
        </span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>
      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-lg max-h-72 overflow-y-auto overscroll-contain" style={{WebkitOverflowScrolling: "touch"}}>
          <button
            type="button"
            onClick={() => { onChange("all"); setOpen(false); }}
            className="w-full text-right px-3 py-2 text-sm hover:bg-muted/40 text-muted-foreground"
          >
            {allLabel}
          </button>
          {groups.map(g => (
            <div key={g.group}>
              <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/30 border-t border-border">
                {g.group}
              </div>
              {g.items.map(item => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => { onChange(item.value); setOpen(false); }}
                  className={`w-full text-right px-4 py-1.5 text-xs hover:bg-accent transition-colors ${value === item.value ? "text-primary font-semibold" : "text-foreground"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterPanel({ filters, onChange, onReset }) {
  const { t } = useLanguage();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          {t.filters}
        </div>
        <button onClick={onReset} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
          <X className="w-3 h-3" /> {t.filterReset || "איפוס"}
        </button>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">{t.filterProfession || "מקצוע"}</Label>
        <Select value={filters.profession} onValueChange={v => onChange({ ...filters, profession: v })}>
          <SelectTrigger aria-label={t.filterProfession || "בחר מקצוע"} className="h-9 text-sm"><SelectValue placeholder={t.all} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="psychologist">{t.profPsychologist || "פסיכולוג/ית"}</SelectItem>
            <SelectItem value="psychiatrist">{t.profPsychiatrist || "פסיכיאטר/ית"}</SelectItem>
            <SelectItem value="psychotherapist">{t.profPsychotherapist || "פסיכותרפיסט/ית"}</SelectItem>
            <SelectItem value="social_worker">{t.profSocialWorker || "עו\"ס קליני"}</SelectItem>
            <SelectItem value="counselor">{t.profCounselor || "יועץ/ת"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">{t.city}</Label>
        <Select value={filters.city} onValueChange={v => onChange({ ...filters, city: v })}>
          <SelectTrigger aria-label={t.city || "בחר עיר"} className="h-9 text-sm"><SelectValue placeholder={t.filterAllCities || "כל הערים"} /></SelectTrigger>
          <SelectContent className="max-h-72">
            <SelectItem value="all">{t.filterAllCities || "כל הערים"}</SelectItem>
            {ISRAEL_LOCATIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <CompactGroupedSelect
        label={t.treatment}
        groups={SPECIALIZATION_GROUPS}
        value={filters.specialization || "all"}
        onChange={v => onChange({ ...filters, specialization: v })}
        allLabel={t.all}
      />

      <CompactGroupedSelect
        label={t.treatmentMethod}
        groups={TREATMENT_METHOD_GROUPS}
        value={filters.treatment_method || "all"}
        onChange={v => onChange({ ...filters, treatment_method: v })}
        allLabel={t.all}
      />

      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">{t.format}</Label>
        <Select value={filters.format} onValueChange={v => onChange({ ...filters, format: v })}>
          <SelectTrigger aria-label={t.format || "בחר פורמט"} className="h-9 text-sm"><SelectValue placeholder={t.all} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="in_person">{t.formatInPerson || "פנים אל פנים"}</SelectItem>
            <SelectItem value="zoom">{t.formatZoom || "זום"}</SelectItem>
            <SelectItem value="phone">{t.formatPhone || "טלפון"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">{t.hmo}</Label>
        <Select value={filters.hmo} onValueChange={v => onChange({ ...filters, hmo: v })}>
          <SelectTrigger aria-label={t.hmo || "בחר קופת חולים"} className="h-9 text-sm"><SelectValue placeholder={t.all} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="maccabi">{t.hmoMaccabi || "מכבי"}</SelectItem>
            <SelectItem value="clalit">{t.hmoClalit || "כללית"}</SelectItem>
            <SelectItem value="meuhedet">{t.hmoMeuhedet || "מאוחדת"}</SelectItem>
            <SelectItem value="leumit">{t.hmoLeumit || "לאומית"}</SelectItem>
            <SelectItem value="menora">{t.hmoMenora || "מנורה מבטחים"}</SelectItem>
            <SelectItem value="harel">{t.hmoHarel || "הראל"}</SelectItem>
            <SelectItem value="clal_insurance">{t.hmoClal || "כלל ביטוח"}</SelectItem>
            <SelectItem value="migdal">{t.hmoMigdal || "מגדל"}</SelectItem>
            <SelectItem value="phoenix">{t.hmoPhoenix || "הפניקס"}</SelectItem>
            <SelectItem value="ayalon">{t.hmoAyalon || "איילון"}</SelectItem>
            <SelectItem value="private">{t.hmoPrivate || "פרטי (ללא ביטוח)"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">{t.language}</Label>
        <Select value={filters.language || "all"} onValueChange={v => onChange({ ...filters, language: v })}>
          <SelectTrigger aria-label={t.language || "בחר שפה"} className="h-9 text-sm"><SelectValue placeholder={t.all} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="hebrew">{t.langHebrew || "עברית"}</SelectItem>
            <SelectItem value="english">{t.langEnglish || "אנגלית"}</SelectItem>
            <SelectItem value="arabic">{t.langArabic || "ערבית"}</SelectItem>
            <SelectItem value="russian">{t.langRussian || "רוסית"}</SelectItem>
            <SelectItem value="french">{t.langFrench || "צרפתית"}</SelectItem>
            <SelectItem value="spanish">{t.langSpanish || "ספרדית"}</SelectItem>
            <SelectItem value="amharic">{t.langAmharic || "אמהרית"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-medium text-muted-foreground">{t.gender}</Label>
        <Select value={filters.gender} onValueChange={v => onChange({ ...filters, gender: v })}>
          <SelectTrigger aria-label={t.gender || "בחר מגדר"} className="h-9 text-sm"><SelectValue placeholder={t.all} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="female">{t.genderFemale || "נשית"}</SelectItem>
            <SelectItem value="male">{t.genderMale || "גברית"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          {t.filterMaxBudget || "תקציב מקסימלי"}: ₪{filters.maxPrice}
        </Label>
        <Slider
          min={100}
          max={800}
          step={50}
          value={[filters.maxPrice]}
          onValueChange={([v]) => onChange({ ...filters, maxPrice: v })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>₪100</span>
          <span>₪800+</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{t.immediateAvailability}</Label>
        <Switch
          checked={filters.immediate}
          onCheckedChange={v => onChange({ ...filters, immediate: v })}
        />
      </div>
    </div>
  );
}