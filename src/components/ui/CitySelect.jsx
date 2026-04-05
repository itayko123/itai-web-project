// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown, X } from "lucide-react";
import { ISRAEL_LOCATIONS } from "@/lib/israelLocations";

/**
 * CitySelect — searchable dropdown for Israeli cities
 *
 * Props:
 *   value        — current city value (Hebrew string)
 *   onChange     — called with the selected city string
 *   placeholder  — placeholder text
 *   className    — extra classes for the wrapper
 */
export default function CitySelect({ value, onChange, placeholder = "חיפוש עיר...", className = "" }) {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Sync external value changes
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        // If user typed something that doesn't exactly match, revert to last valid value
        if (!ISRAEL_LOCATIONS.includes(query)) setQuery(value || "");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [query, value]);

  const filtered = query.trim()
    ? ISRAEL_LOCATIONS.filter(c => c.includes(query.trim()))
    : ISRAEL_LOCATIONS;

  function handleSelect(city) {
    setQuery(city);
    setOpen(false);
    onChange(city);
  }

  function handleClear(e) {
    e.stopPropagation();
    setQuery("");
    onChange("");
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="relative flex items-center">
        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          dir="rtl"
          className="w-full h-10 pr-9 pl-8 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          autoComplete="off"
        />
        {query ? (
          <button onClick={handleClear} className="absolute left-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <ChevronDown className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        )}
      </div>

      {open && filtered.length > 0 && (
        <div className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-lg max-h-56 overflow-y-auto">
          {filtered.slice(0, 50).map(city => (
            <button
              key={city}
              type="button"
              onMouseDown={e => { e.preventDefault(); handleSelect(city); }}
              className={`w-full text-right px-4 py-2 text-sm hover:bg-accent transition-colors ${city === value ? "text-primary font-semibold" : "text-foreground"}`}
            >
              {city}
            </button>
          ))}
          {filtered.length > 50 && (
            <p className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
              הצג {filtered.length - 50} תוצאות נוספות — המשך להקליד לסינון
            </p>
          )}
        </div>
      )}

      {open && filtered.length === 0 && query.trim() && (
        <div className="absolute z-50 top-full mt-1 w-full bg-card border border-border rounded-xl shadow-lg">
          <p className="px-4 py-3 text-sm text-muted-foreground">לא נמצאה עיר — בדוק את האיות</p>
        </div>
      )}
    </div>
  );
}