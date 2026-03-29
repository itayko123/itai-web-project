import { useLanguage } from "@/lib/LanguageContext";
import { Globe } from "lucide-react";

const FLAGS = { he: "🇮🇱", en: "🇺🇸", ru: "🇷🇺" };
const LABELS = { he: "עב", en: "EN", ru: "RU" };

export default function LanguageSwitcher() {
  // תיקון: משכנו את השמות הנכונים מהקונטקסט
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
      {Object.keys(FLAGS).map(l => (
        <button
          key={l}
          // תיקון: הפעלת הפונקציה הנכונה
          onClick={() => changeLanguage(l)}
          aria-label={`שנה שפה ל-${LABELS[l]}`}
          // תיקון: שימוש במשתנה הנכון
          aria-pressed={language === l}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all ${
            language === l ? "bg-white shadow" : ""
          }`}
          style={{ color: '#111827' }}
        >
          <span aria-hidden="true">{FLAGS[l]}</span>
          <span>{LABELS[l]}</span>
        </button>
      ))}
    </div>
  );
}