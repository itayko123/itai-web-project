// @ts-nocheck
import { useState, useEffect } from "react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import TherapistCard from "@/components/therapist/TherapistCard";
import FilterPanel from "@/components/therapist/FilterPanel";
import { SlidersHorizontal, Loader2, ChevronRight, ChevronLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const defaultFilters = { profession: "all", city: "all", format: "all", hmo: "all", gender: "all", maxPrice: 800, immediate: false, specialization: "all", treatment_method: "all", language: "all" };
const PAGE_SIZE = 12;

export default function TherapistSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const [filters, setFilters] = useState({
    ...defaultFilters,
    profession: urlParams.get("profession") || "all",
    city: urlParams.get("city") || "all",
    specialization: urlParams.get("specialization") || "all",
    language: urlParams.get("language") || "all",
    gender: urlParams.get("gender") || "all",
    hmo: urlParams.get("hmo") || "all",
    format: urlParams.get("format") || "all",
    treatment_method: urlParams.get("treatment_method") || "all",
    immediate: urlParams.get("immediate") === "true",
  });

  // הנה הסטייט של החיפוש לפי שם שחזר! הוא גם מושך מידע מה-URL אם הגענו מדף הבית
  const [nameSearch, setNameSearch] = useState(urlParams.get("name") || "");
  const [page, setPage] = useState(1);

  const { data: therapists = [], isLoading } = useQuery({
    queryKey: ["therapists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Therapist")
        .select("*")
        .eq("status", "approved")
        .order("average_rating", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(() => therapists.filter(t => {
    if (filters.profession !== "all" && t.profession !== filters.profession) return false;
    if (filters.city !== "all" && t.city !== filters.city) return false;
    if (filters.format !== "all" && !t.formats?.includes(filters.format)) return false;
    if (filters.hmo !== "all" && !t.hmo_affiliation?.includes(filters.hmo)) return false;
    if (filters.gender !== "all" && t.gender !== filters.gender) return false;
    if (filters.maxPrice < 800 && t.price_per_session && t.price_per_session > filters.maxPrice) return false;
    if (filters.immediate && !t.immediate_availability) return false;
    if (filters.specialization !== "all" && !t.specializations?.includes(filters.specialization)) return false;
    if (filters.treatment_method !== "all" && !t.treatment_types?.includes(filters.treatment_method)) return false;
    if (filters.language !== "all" && !t.languages?.includes(filters.language)) return false;
    
    // הנה הסינון לפי שם שחזר לעבוד!
    if (nameSearch.trim()) {
      const q = nameSearch.trim().toLowerCase();
      if (!(t.full_name || "").toLowerCase().includes(q)) return false;
    }
    
    return true;
  }), [therapists, filters, nameSearch]); // חשוב: הוספנו את nameSearch לתלויות כאן

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold">מצא מטפל</h1>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">✅ חינמי למטופלים</span>
        </div>
        
        {/* הנה שורת החיפוש שהוספנו חזרה מעל כמות התוצאות */}
        <div className="relative mt-3 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            value={nameSearch}
            onChange={e => { setNameSearch(e.target.value); setPage(1); }}
            placeholder="חיפוש לפי שם מטפל..."
            className="pr-9 h-10 text-sm"
          />
        </div>
        
        <p className="text-sm text-muted-foreground mt-2">{filtered.length} מטפלים נמצאו</p>
      </div>

      <div className="flex gap-6">
        {/* Desktop filter sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0" aria-label="פילטרים">
          <FilterPanel filters={filters} onChange={handleFilterChange} onReset={() => { setFilters(defaultFilters); setPage(1); setNameSearch(""); }} />
        </aside>

        <div className="flex-1 min-w-0">
          {/* Mobile filter button */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" aria-label="פתח פאנל סינון">
                  <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                  סינון
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 overflow-y-auto" dir="rtl">
                <div className="pt-6 pb-10">
                  <FilterPanel filters={filters} onChange={handleFilterChange} onReset={() => { setFilters(defaultFilters); setPage(1); setNameSearch(""); }} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-primary" aria-label="טוען מטפלים..." />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg font-medium mb-2">לא נמצאו מטפלים</p>
              <p className="text-sm">נסה לשנות את הסינון או החיפוש</p>
            </div>
          ) : (
            <>
              <section aria-label="רשימת מטפלים">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginated.map((t, i) => (
                    <TherapistCard key={t.id} therapist={t} priority={i < 4} />
                  ))}
                </div>
              </section>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="flex items-center justify-center gap-2 mt-8" aria-label="דפים">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={page === 1}
                    aria-label="עמוד קודם"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <Button
                      key={p}
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      aria-label={`עמוד ${p}`}
                      aria-current={p === page ? "page" : undefined}
                      className="w-9"
                    >
                      {p}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    disabled={page === totalPages}
                    aria-label="עמוד הבא"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}