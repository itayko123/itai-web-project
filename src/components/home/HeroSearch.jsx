import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Sparkles, ChevronDown, ChevronUp, SlidersHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/LanguageContext";
import { SPECIALIZATION_GROUPS, TREATMENT_METHOD_GROUPS } from "@/lib/therapyOptions";
import { ISRAEL_LOCATIONS } from "@/lib/israelLocations";

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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (profession) params.set("profession", profession);
    if (city) params.set("city", city);
    if (specialization) params.set("specialization", specialization);
    if (hmo) params.set("hmo", hmo);
    if (format) params.set("format", format);
    if (language) params.set("language", language);
    if (gender) params.set("gender", gender);
    if (treatment) params.set("treatment_method", treatment);
    if (immediate) params.set("immediate", "true");
    if (nameSearch.trim()) params.set("name", nameSearch.trim());
    navigate(`/therapists?${params.toString()}`);
  };

  const safeSearchTitle = t.searchTitle || "מצא את המטפל המתאים לך";
  const titleWords = safeSearchTitle.split(" ");
  const titlePart1 = titleWords.slice(0, 3).join(" ");
  const titlePart2 = titleWords.slice(3).join(" ");

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-background to-sky-50 pt-16 pb-20 px-4">
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

        <div className="relative max-w-sm mx-auto w-full mb-3">
          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            value={nameSearch}
            onChange={e => setNameSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="חיפוש לפי שם מטפל..."
            className="pr-9 h-11 rounded-xl bg-white text-sm border-border"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-border p-2 flex flex-col md:flex-row gap-2">
          <Select onValueChange={setProfession}>
            <SelectTrigger aria-label={t.therapistType || "סוג מטפל"} className="flex-1 h-12 border-0 shadow-none text-sm bg-transparent">
              <SelectValue placeholder={t.therapistType || "סוג מטפל"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="psychologist">פסיכולוג/ית</SelectItem>
              <SelectItem value="psychiatrist">פסיכיאטר/ית</SelectItem>
              <SelectItem value="psychotherapist">פסיכותרפיסט/ית</SelectItem>
              <SelectItem value="social_worker">עו"ס קליני</SelectItem>
              <SelectItem value="counselor">יועץ/ת</SelectItem>
            </SelectContent>
          </Select>

          <div className="hidden md:block w-px bg-border self-stretch my-1" />

          <Select onValueChange={setCity}>
            <SelectTrigger aria-label={t.city || "עיר"} className="flex-1 h-12 border-0 shadow-none text-sm bg-transparent">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" aria-hidden="true" />
                <SelectValue placeholder={t.city || "עיר"} />
              </div>
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {ISRAEL_LOCATIONS?.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <div className="hidden md:block w-px bg-border self-stretch my-1" />

          <Select onValueChange={setSpecialization}>
            <SelectTrigger aria-label={t.treatment || "תחום טיפול"} className="flex-1 h-12 border-0 shadow-none text-sm bg-transparent">
              <SelectValue placeholder={t.treatment || "תחום טיפול"} />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {SPECIALIZATION_GROUPS?.map(g => (
                <div key={g.group}>
                  <div className="px-2 py-1.5 text-xs font-semibold text-gray-700 bg-muted/30">{g.group}</div>
                  {g.items?.map(item => (
                    <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                  ))}
                </div>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleSearch} className="h-12 px-6 rounded-xl font-semibold text-sm">
            <Search className="w-4 h-4 ml-2" aria-hidden="true" />
            {t.searchBtn || "חיפוש"}
          </Button>
        </div>

        <button
          onClick={() => setShowAllFilters(!showAllFilters)}
          className="mt-3 flex items-center gap-1.5 mx-auto text-xs text-primary font-medium hover:underline"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
          {showAllFilters ? "הסתר פילטרים" : "כל הפילטרים"}
          {showAllFilters ? <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" /> : <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />}
        </button>

        {showAllFilters && (
          <div className="mt-3 bg-white rounded-2xl shadow border border-border p-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-right">
            <Select onValueChange={setHmo}>
              <SelectTrigger aria-label="קופת חולים או ביטוח" className="h-10 text-sm">
                <SelectValue placeholder="קופת חולים / ביטוח" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1 text-xs font-semibold text-gray-700 bg-muted/30">קופות חולים</div>
                <SelectItem value="maccabi">מכבי</SelectItem>
                <SelectItem value="clalit">כללית</SelectItem>
                <SelectItem value="meuhedet">מאוחדת</SelectItem>
                <SelectItem value="leumit">לאומית</SelectItem>
                <div className="px-2 py-1 text-xs font-semibold text-gray-700 bg-muted/30">חברות ביטוח</div>
                <SelectItem value="menora">מנורה מבטחים</SelectItem>
                <SelectItem value="harel">הראל</SelectItem>
                <SelectItem value="clal_insurance">כלל ביטוח</SelectItem>
                <SelectItem value="migdal">מגדל</SelectItem>
                <SelectItem value="phoenix">הפניקס</SelectItem>
                <SelectItem value="ayalon">איילון</SelectItem>
                <SelectItem value="private">פרטי</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={setFormat}>
              <SelectTrigger aria-label={t.format || "אופן טיפול"} className="h-10 text-sm">
                <SelectValue placeholder={t.format || "אופן טיפול"} />
              </SelectTrigger>
              <SelectContent>
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
                <SelectItem value={null}>כלשהו</SelectItem>
                <SelectItem value="female">מטפלת (נשית)</SelectItem>
                <SelectItem value="male">מטפל (גברית)</SelectItem>
              </SelectContent>
            </Select>

            <div className="col-span-2 md:col-span-3">
              <p className="text-xs font-semibold text-gray-700 mb-1.5">שיטת טיפול</p>
              <Select onValueChange={setTreatment}>
                <SelectTrigger aria-label="שיטת טיפול" className="h-10 text-sm w-full">
                  <SelectValue placeholder="כל השיטות" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value={null}>כל השיטות</SelectItem>
                  {TREATMENT_METHOD_GROUPS?.map(g => (
                    <div key={g.group}>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-700 bg-muted/30">{g.group}</div>
                      {g.items?.map(item => (
                        <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
                      ))}
                    </div>
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

        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {["חרדה", "דיכאון", "טראומה", "זוגיות", "ADHD", "שחיקה"]?.map(tag => (
            <button
              key={tag}
              onClick={() => navigate(`/therapists?concern=${encodeURIComponent(tag)}`)}
              className="text-xs bg-white border border-border hover:border-primary/40 hover:bg-accent px-3 py-1.5 rounded-full transition-all"
              style={{ color: '#111827' }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}