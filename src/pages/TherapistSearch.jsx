// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import TherapistCard from "@/components/therapist/TherapistCard";
import FilterPanel from "@/components/therapist/FilterPanel";
import { SlidersHorizontal, Loader2, ChevronRight, ChevronLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Helmet } from "react-helmet-async";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["therapists", filters, page, searchTerm],
    queryFn: async () => {
      let query = supabase
        .from("Therapist")
        .select("*", { count: "exact" });

      if (filters.profession !== "all") query = query.eq("profession", filters.profession);
      if (filters.city !== "all") query = query.eq("city", filters.city);
      if (filters.gender !== "all") query = query.eq("gender", filters.gender);
      if (filters.immediate) query = query.eq("immediate_availability", true);
      if (filters.maxPrice < 800) query = query.lte("price_per_session", filters.maxPrice);
      if (filters.format !== "all") query = query.contains("formats", [filters.format]);
      if (filters.hmo !== "all") query = query.contains("hmo_affiliation", [filters.hmo]);
      if (filters.specialization !== "all") query = query.contains("specializations", [filters.specialization]);
      if (filters.treatment_method !== "all") query = query.contains("treatment_types", [filters.treatment_method]);
      if (filters.language !== "all") query = query.contains("languages", [filters.language]);

      if (searchTerm) {
        query = query.ilike("full_name", `%${searchTerm}%`);
      }

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error, count } = await query
        .order("immediate_availability", { ascending: false })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { therapists: data, total: count };
    },
  });

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 0;

  // --- הכנת נתוני SEO חכמים לפי הפילטרים ---
  const seoProfessionLabels = {
    all: "מטפלים ופסיכולוגים",
    psychologist: "פסיכולוגים",
    psychiatrist: "פסיכיאטרים",
    psychotherapist: "פסיכותרפיסטים",
    social_worker: 'עובדים סוציאליים קליניים',
    counselor: "יועצים טיפוליים"
  };

  const currentProfession = seoProfessionLabels[filters.profession] || "מטפלים";
  const currentCity = filters.city !== "all" ? ` ב${filters.city}` : "";
  const seoTitle = `${currentProfession}${currentCity} מומלצים | מצא לי מטפל`;
  const seoDescription = `מחפשים ${currentProfession}${currentCity}? היכנסו למאגר המקיף של מצא לי מטפל, סננו לפי מחיר, סוג טיפול וזמינות, וצרו קשר ישירות ללא עמלות.`;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
      </Helmet>

      <div className="bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-2">מצאו את המטפל/ת המתאים לכם</h1>
              <p className="text-muted-foreground">
                {data?.total ? `${data.total} מטפלים נמצאו עבורכם` : "מחפשים מטפלים..."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="חיפוש לפי שם..."
                  className="pr-9"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    מסננים
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="py-4">
                    <FilterPanel
                      filters={filters}
                      setFilters={(f) => {
                        setFilters(f);
                        setPage(1);
                      }}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground animate-pulse">טוען מטפלים מומלצים...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="hidden lg:block lg:col-span-1">
                  <div className="sticky top-24">
                    <FilterPanel
                      filters={filters}
                      setFilters={(f) => {
                        setFilters(f);
                        setPage(1);
                      }}
                    />
                  </div>
                </aside>

                <main className="lg:col-span-3">
                  {data?.therapists.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
                      <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Search className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">לא נמצאו מטפלים</h3>
                      <p className="text-muted-foreground mb-6">נסו להסיר חלק מהמסננים כדי לראות תוצאות רלוונטיות</p>
                      <Button onClick={() => setFilters(defaultFilters)} variant="outline">אפס את כל המסננים</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {data?.therapists.map((therapist) => (
                        <TherapistCard key={therapist.id} therapist={therapist} />
                      ))}
                    </div>
                  )}
                </main>
              </div>

              {totalPages > 1 && (
                <nav className="flex justify-center items-center gap-2 mt-12 pb-8" aria-label="ניווט עמודים">
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
    </>
  );
}