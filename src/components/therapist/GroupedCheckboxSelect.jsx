/**
 * Reusable grouped checkbox selector for specializations / treatment methods.
 * Renders collapsible category groups with toggle-chip items.
 */
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function GroupedCheckboxSelect({ label, groups, selected, onChange, lang = "he" }) {
  const [openGroups, setOpenGroups] = useState({});

  const toggle = (value) =>
    onChange(selected.includes(value) ? selected.filter(x => x !== value) : [...selected, value]);

  const toggleGroup = (grp) =>
    setOpenGroups(prev => ({ ...prev, [grp]: !prev[grp] }));

  const getGroupLabel = (g) =>
    lang === "en" ? g.groupEn : lang === "ru" ? g.groupRu : g.group;

  const getItemLabel = (item) =>
    lang === "en" ? item.labelEn : lang === "ru" ? item.labelRu : item.label;

  const selectedCount = selected.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        {selectedCount > 0 && (
          <span className="text-xs text-primary font-semibold bg-accent px-2 py-0.5 rounded-full">
            {selectedCount} נבחרו
          </span>
        )}
      </div>

      <div className="border border-border rounded-xl overflow-hidden divide-y divide-border">
        {groups.map(g => {
          const groupKey = g.group;
          const isOpen = openGroups[groupKey] ?? false;
          const groupSelectedCount = g.items.filter(i => selected.includes(i.value)).length;

          return (
            <div key={groupKey}>
              <button
                type="button"
                onClick={() => toggleGroup(groupKey)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-muted/30 hover:bg-muted/50 transition-colors text-sm font-medium"
              >
                <span className="text-right">{getGroupLabel(g)}</span>
                <div className="flex items-center gap-2">
                  {groupSelectedCount > 0 && (
                    <span className="text-xs text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded-full">
                      {groupSelectedCount}
                    </span>
                  )}
                  {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-3 py-2.5 flex flex-wrap gap-1.5 bg-card">
                  {g.items.map(item => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => toggle(item.value)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        selected.includes(item.value)
                          ? "border-primary bg-accent text-foreground font-semibold"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {getItemLabel(item)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}