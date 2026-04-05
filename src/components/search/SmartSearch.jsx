// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { Search, MapPin, Brain, Zap, User, X } from "lucide-react";
import { SPECIALIZATION_GROUPS, TREATMENT_METHOD_GROUPS } from "@/lib/therapyOptions";
import { ISRAEL_LOCATIONS } from "@/lib/israelLocations";

// ─── Fuzzy / partial match helper ───────────────────────────────────────────
// Returns true if query matches text (partial, case-insensitive, ignores spaces)
function fuzzyMatch(text, query) {
  if (!query || !text) return false;
  const t = text.toLowerCase().replace(/[\s-]/g, "");
  const q = query.toLowerCase().replace(/[\s-]/g, "");
  return t.includes(q);
}

// Common typo / alias map (English → Hebrew, English short → full)
const ALIASES = {
  // Cities
  "tel aviv": "תל אביב", "telaviv": "תל אביב", "tel abib": "תל אביב",
  "jerusalem": "ירושלים", "jeruzalem": "ירושלים",
  "haifa": "חיפה", "hayfa": "חיפה",
  "netanya": "נתניה", "nathanya": "נתניה",
  "beer sheva": "באר שבע", "beersheva": "באר שבע", "beer sheba": "באר שבע",
  "rishon": "ראשון לציון", "rishon lezion": "ראשון לציון",
  "petah tikva": "פתח תקווה", "petach tikva": "פתח תקווה",
  "herzliya": "הרצליה", "herzeliya": "הרצליה",
  "ramat gan": "רמת גן", "raanana": "רעננה", "kfar saba": "כפר סבא",
  "holon": "חולון", "bat yam": "בת ים", "bnei brak": "בני ברק",
  "rehovot": "רחובות", "ashkelon": "אשקלון", "ashdod": "אשדוד",
  "modiin": "מודיעין", "eilat": "אילת", "hadera": "חדרה",
  "nazareth": "נצרת", "tiberias": "טבריה", "safed": "צפת",
  "nahariya": "נהריה", "acre": "עכו", "afula": "עפולה",
  // Specializations
  "anxiety": "חרדה", "depression": "דיכאון", "trauma": "טראומה",
  "ptsd": "פוסט-טראומה", "adhd": "הפרעות קשב",
  "couples": "טיפול זוגי", "family": "טיפול משפחתי",
  "children": "ילדים", "teens": "מתבגרים", "ocd": "OCD",
  "eating": "הפרעות אכילה", "burnout": "שחיקה", "grief": "אבל",
  "lgbtq": "קהילת LGBTQ+", "autism": "אוטיזם",
  "addiction": "התמכרויות", "sleep": "הפרעות שינה",
  // Treatment methods
  "cbt": "טיפול קוגניטיבי-התנהגותי",
  "dbt": "טיפול התנהגותי דיאלקטי",
  "emdr": "EMDR",
  "psychodynamic": "טיפול פסיכודינמי",
  "psychoanalysis": "פסיכואנליזה",
  "gestalt": "טיפול גשטאלט",
  "act": "טיפול בקבלה ומחויבות",
  "nlp": "NLP",
  "hypnosis": "היפנוזה",
  "mindfulness": "מיינדפולנס",
  "schema": "סכמה תרפיה",
  "art therapy": "טיפול באמנות",
  "music therapy": "טיפול במוזיקה",
  "coaching": "Coaching",
  "group therapy": "טיפול קבוצתי",
};

// Build flat searchable lists
const ALL_CITIES = ISRAEL_LOCATIONS.map(c => ({ type: "city", label: c, value: c }));

const ALL_SPECS = SPECIALIZATION_GROUPS.flatMap(g =>
  g.items.map(item => ({ type: "specialization", label: item.label, labelEn: item.labelEn, value: item.value }))
);

const ALL_METHODS = TREATMENT_METHOD_GROUPS.flatMap(g =>
  g.items.map(item => ({ type: "treatment_method", label: item.label, labelEn: item.labelEn, value: item.value }))
);

function search(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase().trim();

  // Check alias map first
  const aliasHit = ALIASES[q] || ALIASES[q.replace(/\s+/g, " ")];

  const results = [];

  // Cities
  const cities = ALL_CITIES.filter(c =>
    fuzzyMatch(c.label, q) || (aliasHit && fuzzyMatch(c.label, aliasHit))
  ).slice(0, 4);
  results.push(...cities);

  // Specializations
  const specs = ALL_SPECS.filter(s =>
    fuzzyMatch(s.label, q) ||
    fuzzyMatch(s.labelEn || "", q) ||
    (aliasHit && fuzzyMatch(s.label, aliasHit))
  ).slice(0, 5);
  results.push(...specs);

  // Treatment methods
  const methods = ALL_METHODS.filter(m =>
    fuzzyMatch(m.label, q) ||
    fuzzyMatch(m.labelEn || "", q) ||
    (aliasHit && fuzzyMatch(m.label, aliasHit))
  ).slice(0, 4);
  results.push(...methods);

  return results.slice(0, 10);
}

const TYPE_META = {
  city:            { icon: MapPin, color: "text-blue-500",   bg: "bg-blue-50",   label: "עיר" },
  specialization:  { icon: Brain,  color: "text-purple-500", bg: "bg-purple-50", label: "תחום טיפול" },
  treatment_method:{ icon: Zap,    color: "text-emerald-500",bg: "bg-emerald-50",label: "שיטת טיפול" },
};

/**
 * SmartSearch — unified search bar with autocomplete
 *
 * Props:
 *   onSelect(type, value, label) — called when user picks a suggestion
 *   onNameSearch(name)           — called when user submits free-text (name search)
 *   placeholder                  — input placeholder
 *   className                    — wrapper class
 *   initialValue                 — initial text value
 */
export default function SmartSearch({
  onSelect,
  onNameSearch,
  placeholder = "חיפוש לפי שם, עיר, תחום טיפול...",
  className = "",
  initialValue = "",
}) {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    setActiveIdx(-1);
    if (val.trim().length >= 1) {
      setResults(search(val.trim()));
      setOpen(true);
    } else {
      setResults([]);
      setOpen(false);
    }
  }

  function handleSelect(item) {
    setQuery(item.label);
    setOpen(false);
    onSelect?.(item.type, item.value, item.label);
  }

  function handleKeyDown(e) {
    if (!open || results.length === 0) {
      if (e.key === "Enter") {
        onNameSearch?.(query.trim());
        setOpen(false);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) {
        handleSelect(results[activeIdx]);
      } else {
        onNameSearch?.(query.trim());
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleClear() {
    setQuery("");
    setResults([]);
    setOpen(false);
    onSelect?.("clear", "", "");
    inputRef.current?.focus();
  }

  // Group results by type for display
  const grouped = results.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 1 && results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          dir="rtl"
          className="w-full h-11 pr-9 pl-8 rounded-xl border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          autoComplete="off"
        />
        {query && (
          <button onClick={handleClear} className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full">
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute z-50 top-full mt-1.5 w-full bg-white border border-border rounded-2xl shadow-xl overflow-hidden">
          {Object.entries(grouped).map(([type, items]) => {
            const meta = TYPE_META[type];
            const Icon = meta.icon;
            return (
              <div key={type}>
                {/* Category header */}
                <div className={`px-3 py-1.5 flex items-center gap-1.5 text-xs font-semibold ${meta.color} ${meta.bg}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {meta.label}
                </div>
                {items.map((item, idx) => {
                  const globalIdx = results.indexOf(item);
                  return (
                    <button
                      key={item.value}
                      onMouseDown={e => { e.preventDefault(); handleSelect(item); }}
                      className={`w-full text-right px-4 py-2 text-sm flex items-center gap-2 transition-colors ${globalIdx === activeIdx ? "bg-accent text-primary font-medium" : "hover:bg-muted/40 text-foreground"}`}
                    >
                      <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${meta.color}`} />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Free text name search option */}
          {query.trim() && (
            <button
              onMouseDown={e => { e.preventDefault(); onNameSearch?.(query.trim()); setOpen(false); }}
              className="w-full text-right px-4 py-2.5 text-sm flex items-center gap-2 border-t border-border hover:bg-muted/40 text-muted-foreground"
            >
              <User className="w-3.5 h-3.5 flex-shrink-0" />
              חפש מטפל בשם "{query}"
            </button>
          )}
        </div>
      )}

      {/* No results + name search fallback */}
      {open && results.length === 0 && query.trim().length >= 2 && (
        <div className="absolute z-50 top-full mt-1.5 w-full bg-white border border-border rounded-2xl shadow-xl overflow-hidden">
          <button
            onMouseDown={e => { e.preventDefault(); onNameSearch?.(query.trim()); setOpen(false); }}
            className="w-full text-right px-4 py-3 text-sm flex items-center gap-2 hover:bg-muted/40 text-muted-foreground"
          >
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            חפש מטפל בשם "{query}"
          </button>
          <p className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
            לא נמצאו הצעות — נסה שם עיר, תחום טיפול, או שם מטפל
          </p>
        </div>
      )}
    </div>
  );
}