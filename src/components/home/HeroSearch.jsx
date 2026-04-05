// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Sparkles, ChevronDown, ChevronUp, SlidersHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { useLanguage } from "@/lib/LanguageContext";
import { SPECIALIZATION_GROUPS, TREATMENT_METHOD_GROUPS } from "@/lib/therapyOptions";
import { ISRAEL_LOCATIONS } from "@/lib/israelLocations";
import SmartSearch from "@/components/search/SmartSearch";

export default function HeroSearch() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [profession, setProfession] = useState("");
  const [city, setCity] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [hmo, setHmo] = useState("");
  const [format, setFormat] = useState("");
  const [language, setLanguage] = useState("");
  const [gender, setGender] = useState("");
  const [treatment, setTreatment] = useState("");
  const [immediate, setImmediate] = useState(false);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [nameSearch, setNameSearch] = useState("");

  // SmartSearch sets filters based on what the user selected
  function handleSmartSelect(type, value, label) {
    if (type === "city")             setCity(value);
    if (type === "specialization")   setSpecialization(value);
    if (type === "treatment_method") setTreatment(value);
    if (type === "clear") {
      setCity("");
      setSpecialization("");
      setTreatment("");
      setNameSearch("");
    }
  }

  function handleSmartNameSearch(name) {
    setNameSearch(name);
  }

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (profession && profession !== "all") params.set("profession", profession);
    if (city && city !== "all") params.set("city", city);
    if (specialization && specialization !== "all") params.set("specialization", specialization);
    if (hmo && hmo !== "all") params.set("hmo", hmo);
    if (format && format !== "all") params.set("format", format);
    if (language && language !== "all") params.set("language", language);
    if (gender && gender !== "all") params.set("gender", gender);
    if (treatment && treatment !== "all") params.set("treatment_method", treatment);
    if (immediate) params.set("immediate", "true");
    if (nameSearch.trim()) params.set("name", nameSearch.trim());
    navigate(`/therapists?${params.toString()}`);
  };

  const safeSearchTitle = t.searchTitle || "מצא את המטפל המתאים לך";
  const titleWords = safeSearchTitle.split(" ");
  const titlePart1 = titleWords.slice(0, 3).join(" ");
  const titlePart2 = titleWords.slice(3).join(" ");

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-teal-50 via-background to-background pt-8 pb-16 md:pt-10 md:pb-20 px-4 min-h-[400px]">
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-ocean/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          יותר מ-500 מטפלים מאומתים
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-4" id="hero-heading">
          {titlePart1}
          {titlePart2 && <br />}
          <span className="text-primary">{titlePart2}</span>
        </h1>

        <p className="text-lg mb-4 max-w-xl mx-auto" style={{ color: '#374151' }}>{t.searchSubtitle}</p>
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-sm font-bold px-4 py-2 rounded-full mb-8">
          {t.free}
        </div>

        {/* ─── Smart Search Bar ──────────────────────────────────────────── */}
        <div className="relative max-w-2xl mx-auto w-full mb-3">
          <SmartSearch
            placeholder="חפש לפי עיר, תחום טיפול, שיטת טיפול, שם מטפל..."
            onSelect={handleSmartSelect}
            onNameSearch={handleSmartNameSearch}
          />
          {/* Active filter pills */}
          {(city || specialization || treatment || nameSearch) && (
            <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
              {city && (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                  📍 {city}
                  <button onClick={() => setCity("")} className="hover:text-blue-900">×</button>
                </span>
              )}
              {specialization && (
                <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">
                  🧠 {SPECIALIZATION_GROUPS.flatMap(g => g.items).find(i => i.value === specialization)?.label || specialization}
                  <button onClick={() => setSpecialization("")} className="hover:text-purple-900">×</button>
                </span>
              )}
              {treatment && (
                <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
                  ⚡ {TREATMENT_METHOD_GROUPS.flatMap(g => g.items).find(i => i.value === treatment)?.label || treatment}
                  <button onClick={() => setTreatment("")} className="hover:text-emerald-900">×</button>
                </span>
              )}
              {nameSearch && (
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                  👤 {nameSearch}
                  <button onClick={() => setNameSearch("")} className="hover:text-gray-900">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ─── Main filter row ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-lg border border-border p-2 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
          <Select onValueChange={setProfession}>
            <SelectTrigger aria-label={t.therapistType || "סוג מטפל"} className="flex-1 h-12 border-0 shadow-none text-sm bg-transparent">
              <SelectValue placeholder={t.therapistType || "סוג מטפל"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל הסוגים</SelectItem>
              <SelectItem value="psychologist">פסיכולוג/ית</SelectItem>
              <SelectItem value="psychiatrist">פסיכיאטר/ית</SelectItem>
              <SelectItem value="psychotherapist">פסיכותרפיסט/ית</SelectItem>
              <SelectItem value="social_worker">עו"ס קליני</SelectItem>
              <SelectItem value="counselor">יועץ/ת</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden md:block w-px bg-border self-stretch my-1" />

          <Select value={city || "all"} onValueChange={v => setCity(v === "all" ? "" : v)}>
            <SelectTrigger aria-label={t.city || "עיר"} className="flex-1 h-12 border-0 shadow-none text-sm bg-transparent">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" aria-hidden="true" />
                <SelectValue placeholder={t.city || "עיר"} />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-72">
              <SelectItem value="all">כל הארץ</SelectItem>
              {ISRAEL_LOCATIONS?.map(c => <SelectItem key={c} value={String(c)}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <div className="hidden md:block w-px bg-border self-stretch my-1" />

          <Select value={specialization || "all"} onValueChange={v => setSpecialization(v === "all" ? "" : v)}>
            <SelectTrigger aria-label={t.treatment || "תחום טיפול"} className="flex-1 h-12 border-0 shadow-none text-sm bg-transparent">
              <SelectValue placeholder={t.treatment || "תחום טיפול"} />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectItem value="all">כל התחומים</SelectItem>
              {SPECIALIZATION_GROUPS?.map(g => (
                <SelectGroup key={g.group}>
                  <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-gray-700 bg-muted/30">{g.group}</SelectLabel>
                  {g.items?.map(item => (
                    <SelectItem key={item.value} value={String(item.value)}>{item.label}</SelectItem>
                  ))}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} className="h-12 px-6 rounded-xl font-semibold text-sm">
            <Search className="w-4 h-4 ml-2" aria-hidden="true" />
            {t.searchBtn || "חיפוש"}
          </Button>
        </div>

        {/* ─── More filters toggle ─────────────────────────────────────────── */}
        <button
          onClick={() => setShowAllFilters(!showAllFilters)}
          className="mt-3 flex items-center gap-1.5 mx-auto text-xs text-primary font-medium hover:underline"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          {showAllFilters ? "הסתר פילטרים" : "כל הפילטרים"}
          {showAllFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showAllFilters && (
          <div className="mt-3 bg-white rounded-2xl shadow border border-border p-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-right max-w-2xl mx-auto">
            <Select onValueChange={setHmo}>
              <SelectTrigger aria-label="קופת חולים או ביטוח" className="h-10 text-sm">
                <SelectValue placeholder="קופת חולים / ביטוח" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ללא סינון</SelectItem>
                <SelectGroup>
                  <SelectLabel className="px-2 py-1 text-xs font-semibold text-gray-700 bg-muted/30">קופות חולים</SelectLabel>
                  <SelectItem value="maccabi">מכבי</SelectItem>
                  <SelectItem value="clalit">כללית</SelectItem>
                  <SelectItem value="meuhedet">מאוחדת</SelectItem>
                  <SelectItem value="leumit">לאומית</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel className="px-2 py-1 text-xs font-semibold text-gray-700 bg-muted/30">חברות ביטוח</SelectLabel>
                  <SelectItem value="menora">מנורה מבטחים</SelectItem>
                  <SelectItem value="harel">הראל</SelectItem>
                  <SelectItem value="clal_insurance">כלל ביטוח</SelectItem>
                  <SelectItem value="migdal">מגדל</SelectItem>
                  <SelectItem value="phoenix">הפניקס</SelectItem>
                  <SelectItem value="ayalon">איילון</SelectItem>
                  <SelectItem value="private">פרטי</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Select onValueChange={setFormat}>
              <SelectTrigger aria-label={t.format || "אופן טיפול"} className="h-10 text-sm">
                <SelectValue placeholder={t.format || "אופן טיפול"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל האופנים</SelectItem>
                <SelectItem value="in_person">פנים אל פנים</SelectItem>
                <SelectItem value="zoom">זום</SelectItem>
                <SelectItem value="phone">טלפון</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setLanguage}>
              <SelectTrigger aria-label={t.language || "שפה"} className="h-10 text-sm">
                <SelectValue placeholder={t.language || "שפה"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל השפות</SelectItem>
                <SelectItem value="hebrew">עברית</SelectItem>
                <SelectItem value="english">אנגלית</SelectItem>
                <SelectItem value="arabic">ערבית</SelectItem>
                <SelectItem value="russian">רוסית</SelectItem>
                <SelectItem value="french">צרפתית</SelectItem>
                <SelectItem value="spanish">ספרדית</SelectItem>
                <SelectItem value="amharic">אמהרית</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setGender}>
              <SelectTrigger aria-label="מגדר מטפל" className="h-10 text-sm">
                <SelectValue placeholder="מגדר מטפל" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כלשהו</SelectItem>
                <SelectItem value="female">מטפלת (נשית)</SelectItem>
                <SelectItem value="male">מטפל (גברית)</SelectItem>
              </SelectContent>
            </Select>

            <div className="col-span-2 md:col-span-3">
              <p className="text-xs font-semibold text-gray-700 mb-1.5">שיטת טיפול</p>
              <Select value={treatment || "all"} onValueChange={v => setTreatment(v === "all" ? "" : v)}>
                <SelectTrigger aria-label="שיטת טיפול" className="h-10 text-sm w-full">
                  <SelectValue placeholder="כל השיטות" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="all">כל השיטות</SelectItem>
                  {TREATMENT_METHOD_GROUPS?.map(g => (
                    <SelectGroup key={g.group}>
                      <SelectLabel className="px-2 py-1 text-xs font-semibold text-gray-700 bg-muted/30">{g.group}</SelectLabel>
                      {g.items?.map(item => (
                        <SelectItem key={item.value} value={String(item.value)}>{item.label}</SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 md:col-span-3 flex items-center justify-between bg-muted/30 rounded-xl px-4 py-2.5">
              <span className="text-sm font-medium">זמינות מיידית בלבד</span>
              <button
                onClick={() => setImmediate(!immediate)}
                className={`relative w-10 h-5 rounded-full transition-colors ${immediate ? "bg-primary" : "bg-muted-foreground/30"}`}
                aria-label={immediate ? "בטל זמינות מיידית" : "הפעל זמינות מיידית בלבד"}
                aria-pressed={immediate}
                role="switch"
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${immediate ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        )}

        {/* Quick tags */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {[
            { label: "חרדה", value: "anxiety" },
            { label: "דיכאון", value: "depression" },
            { label: "טראומה", value: "trauma" },
            { label: "זוגיות", value: "couples" },
            { label: "ADHD", value: "adhd" },
            { label: "שחיקה", value: "burnout" },
          ].map(tag => (
            <button
              key={tag.value}
              onClick={() => navigate(`/therapists?specialization=${encodeURIComponent(tag.value)}`)}
              className="text-xs bg-white border border-border hover:border-primary/40 hover:bg-accent px-3 py-1.5 rounded-full transition-all"
              style={{ color: '#111827' }}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}