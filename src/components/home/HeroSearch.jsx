// @ts-nocheck
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Sparkles, ChevronDown, ChevronUp, SlidersHorizontal, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { useLanguage } from "@/lib/LanguageContext";
import { SPECIALIZATION_GROUPS, TREATMENT_METHOD_GROUPS } from "@/lib/therapyOptions";
import { ISRAEL_LOCATIONS } from "@/lib/israelLocations";
import { parseSmartSearch } from "@/lib/searchParser"; // הייבוא של ה"מוח" שלנו

export default function HeroSearch() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // State לחיפוש החכם (טקסט חופשי)
  const [smartQuery, setSmartQuery] = useState("");

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

  // הפונקציה המרכזית שמופעלת בלחיצה על "חפש"
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    // קודם כל, מריצים את החיפוש החכם כדי לחלץ נתונים ממה שהמשתמש הקליד
    const parsedData = parseSmartSearch(smartQuery);

    // ממזגים את התוצאות מהחיפוש החכם עם מה שנבחר בתפריטים (החיפוש החכם מנצח אם יש התנגשות)
    const finalCity = parsedData.city || city;
    const finalSpec = parsedData.specialization || specialization;
    const finalTreatment = parsedData.treatment_method || treatment;

    // בונים את ה-URL
    if (profession && profession !== "all") params.set("profession", profession);
    if (finalCity && finalCity !== "all") params.set("city", finalCity);
    if (finalSpec && finalSpec !== "all") params.set("specialization", finalSpec);
    if (hmo && hmo !== "all") params.set("hmo", hmo);
    if (format && format !== "all") params.set("format", format);
    if (language && language !== "all") params.set("language", language);
    if (gender && gender !== "all") params.set("gender", gender);
    if (finalTreatment && finalTreatment !== "all") params.set("treatment_method", finalTreatment);
    if (immediate) params.set("immediate", "true");
    
    // אם המשתמש הקליד משהו שהמערכת לא זיהתה (למשל שם של מטפל), נוסיף אותו כפרמטר שם
    if (parsedData.originalText && !parsedData.city && !parsedData.specialization && !parsedData.treatment_method) {
      params.set("name", parsedData.originalText.trim());
    }

    // הניווט תומך ב-SEO החכם שעשינו מקודם!
    let basePath = "/therapists";
    if (profession && profession !== "all" && finalCity && finalCity !== "all") {
      navigate(`${basePath}/${profession}/${finalCity}?${params.toString()}`);
    } else {
      navigate(`${basePath}?${params.toString()}`);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md p-4 sm:p-6 rounded-3xl shadow-xl border border-white/40 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 🌟 שורת חיפוש חכמה מרכזית - החדשה והמגניבה! 🌟 */}
      <div className="mb-6 relative group">
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
          <Search className="w-6 h-6 text-primary group-focus-within:scale-110 transition-transform" />
        </div>
        <Input 
          value={smartQuery}
          onChange={(e) => setSmartQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="חפשו עיר (תל אביב), שיטה (CBT), תחום (זוגי) או שם מטפל..." 
          className="w-full h-16 pr-14 pl-32 text-lg rounded-2xl shadow-sm border-2 border-primary/20 focus-visible:border-primary focus-visible:ring-primary/20 transition-all placeholder:text-muted-foreground/60"
        />
        <div className="absolute inset-y-2 left-2">
          <Button onClick={handleSearch} className="h-full px-8 rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all">
            חפש
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px bg-border flex-1"></div>
        <span className="text-xs text-muted-foreground font-medium px-2">או סננו לפי קטגוריות</span>
        <div className="h-px bg-border flex-1"></div>
      </div>

      {/* שאר הסינונים הרגילים נשארו כאן למקרה שהמשתמש מעדיף לבחור */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select value={profession} onValueChange={setProfession}>
          <SelectTrigger className="h-12 bg-white/50"><User className="w-4 h-4 mr-2 opacity-50"/><SelectValue placeholder={t.profession} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            <SelectItem value="psychologist">{t.profPsychologist}</SelectItem>
            <SelectItem value="psychiatrist">{t.profPsychiatrist}</SelectItem>
            <SelectItem value="psychotherapist">{t.profPsychotherapist}</SelectItem>
            <SelectItem value="social_worker">{t.profSocialWorker}</SelectItem>
            <SelectItem value="counselor">{t.profCounselor}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={city} onValueChange={setCity}>
          <SelectTrigger className="h-12 bg-white/50"><MapPin className="w-4 h-4 mr-2 opacity-50"/><SelectValue placeholder={t.city} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            {ISRAEL_LOCATIONS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={specialization} onValueChange={setSpecialization}>
          <SelectTrigger className="h-12 bg-white/50"><Sparkles className="w-4 h-4 mr-2 opacity-50"/><SelectValue placeholder={t.specialization} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            {SPECIALIZATION_GROUPS.map(group => (
              <SelectGroup key={group.group}>
                <SelectLabel>{group.group}</SelectLabel>
                {group.items.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>

        <Select value={treatment} onValueChange={setTreatment}>
          <SelectTrigger className="h-12 bg-white/50"><SelectValue placeholder={t.treatmentMethod || "שיטת טיפול"} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.all}</SelectItem>
            {TREATMENT_METHOD_GROUPS.map(group => (
              <SelectGroup key={group.group}>
                <SelectLabel>{group.group}</SelectLabel>
                {group.items.map(item => <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>)}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mt-5">
        {[
          { label: "חרדה", value: "anxiety" },
          { label: "דיכאון", value: "depression" },
          { label: "טראומה", value: "trauma" },
          { label: "זוגיות", value: "couples_therapy" }, // תוקן ל-couples_therapy!
          { label: "ADHD", value: "adhd" },
        ].map(tag => (
          <button
            key={tag.value}
            onClick={() => navigate(`/therapists?specialization=${encodeURIComponent(tag.value)}`)}
            className="text-xs bg-white border border-border hover:border-primary/40 hover:bg-accent px-3 py-1.5 rounded-full transition-colors font-medium shadow-sm"
          >
            {tag.label}
          </button>
        ))}
      </div>
    </div>
  );
}