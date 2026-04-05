// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";

/**
 * SearchableGroupSelect — searchable dropdown for grouped options
 *
 * Props:
 *   groups       — array of { group, items: [{ value, label }] }
 *   value        — current selected value
 *   onChange     — called with selected value
 *   placeholder  — placeholder text
 *   allLabel     — label for "all" option (default: "הכל")
 *   className    — extra wrapper classes
 */
export default function SearchableGroupSelect({
  groups = [],
  value,
  onChange,
  placeholder = "חיפוש...",
  allLabel = "הכל",
  className = "",
}) {
  const allItems = groups.flatMap(g => g.items);
  const selectedLabel = allItems.find(i => i.value === value)?.label || "";

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Filter groups by query
  const filteredGroups = query.trim()
    ? groups.map(g => ({
        ...g,
        items: g.items.filter(item =>
          item.label.includes(query.trim()) ||
          (item.labelEn || "").toLowerCase().includes(query.trim().toLowerCase()) ||
          item.value.toLowerCase().includes(query.trim().toLowerCase())
        ),
      })).filter(g => g.items.length > 0)
    : groups;

  function handleSelect(val) {
    onChange(val);
    setOpen(false);
    setQuery("");
  }

  function handleClear(e) {
    e.stopPropagation();
    onChange("all");
    setQuery("");
    inputRef.current?.focus();
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setTimeout(() => inputRef.current?.focus(), 50); }}
        className="w-full h-12 flex items-center justify-between px-3 rounded-xl border-0 bg-transparent text-sm hover:bg-muted/20 transition-colors"
      >
        <span className={selectedLabel ? "text-foreground truncate" : "text-muted-foreground"}>
          {selectedLabel || placeholder}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {value && value !== "all" && (
            <span
              onClick={handleClear}
              className="p-0.5 text-muted-foreground hover:text-foreground rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 right-0 w-72 bg-white border border-border rounded-2xl shadow-xl overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="חיפוש..."
                dir="rtl"
                className="w-full h-8 pr-8 pl-3 rounded-lg border border-input bg-muted/30 text-sm focus:outline-none focus:ring-1 focus:ring-primary/30"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {/* All option */}
            <button
              type="button"
              onMouseDown={e => { e.preventDefault(); handleSelect("all"); }}
              className={`w-full text-right px-4 py-2 text-sm hover:bg-accent transition-colors ${!value || value === "all" ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              {allLabel}
            </button>

            {filteredGroups.length === 0 && (
              <p className="px-4 py-3 text-sm text-muted-foreground">לא נמצאו תוצאות</p>
            )}

            {filteredGroups.map(g => (
              <div key={g.group}>
                <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-muted/30 border-t border-border sticky top-0">
                  {g.group}
                </div>
                {g.items.map(item => (
                  <button
                    key={item.value}
                    type="button"
                    onMouseDown={e => { e.preventDefault(); handleSelect(item.value); }}
                    className={`w-full text-right px-4 py-1.5 text-xs hover:bg-accent transition-colors ${value === item.value ? "text-primary font-semibold bg-primary/5" : "text-foreground"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}