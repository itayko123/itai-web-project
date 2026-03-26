import { useLanguage } from "@/lib/LanguageContext";
import { Globe } from "lucide-react";

const FLAGS = { he: "🇮🇱", en: "🇺🇸", ru: "🇷🇺" };
const LABELS = { he: "עב", en: "EN", ru: "RU" };

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
      {Object.keys(FLAGS).map(l => (
        <button
          key={l}
          onClick={() => setLang(l)}
          aria-label={`שנה שפה ל-${LABELS[l]}`}
          aria-pressed={lang === l}
          className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold transition-all ${
            lang === l ? "bg-white shadow" : ""
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