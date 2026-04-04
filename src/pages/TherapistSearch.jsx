// @ts-nocheck
import { useState, useMemo } from "react";
import { useParams } from "react-router-dom"; // נוסף כדי לקרוא את הכתובת
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

// מילון תרגום מאנגלית לעברית (כדי שנדע לסנן את תל אביב אם כתוב tel-aviv)
const citySlugToHebrew = {
  'tel-aviv': 'תל אביב', 'jerusalem': 'ירושלים', 'haifa': 'חיפה', 
  'rishon-lezion': 'ראשון לציון', 'petah-tikva': 'פתח תקווה', 'ashdod': 'אשדוד', 
  'netanya': 'נתניה', 'beer-sheva': 'באר שבע', 'holon': 'חולון', 
  'bnei-brak': 'בני ברק', 'ramat-gan': 'רמת גן', 'rehovot': 'רחובות', 
  'bat-yam': 'בת ים', 'ashkelon': 'אשקלון', 'kfar-saba': 'כפר סבא', 
  'herzliya': 'הרצליה', 'hadera': 'חדרה', 'modiin': 'מודיעין', 
  'raanana': 'רעננה', 'hod-hasharon': 'הוד השרון'
};

export default function TherapistSearch() {
  const { citySlug } = useParams(); // מזהה את העיר מהכתובת!
  const urlParams = new URLSearchParams(window.location.search);
  
  // אם יש עיר בכתובת (SEO), נשתמש בה. אם לא - נבדוק את חיפוש ה-URL, ואם לא נשים 'all'
  const initialCity = citySlug && citySlugToHebrew[citySlug] 
    ? citySlugToHebrew[citySlug] 
    : urlParams.get("city") || "all";

  const [filters, setFilters] = useState({
    ...defaultFilters,
    profession: urlParams.get("profession") || "all",
    city: initialCity,
    specialization: urlParams.get("specialization") || "all",
    language: urlParams.get("language") || "all",
    gender: urlParams.get("gender") || "all",
    hmo: urlParams.get("hmo") || "all",
    format: urlParams.get("format") || "all",
    treatment_method: urlParams.get("treatment_method") || "all",
    immediate: urlParams.get("immediate") === "true",
  });

  const [nameSearch, setNameSearch] = useState(urlParams.get("name") || "");
  const [page, setPage] = useState(1);

  const { data: therapists = [], isLoading } = useQuery({
    queryKey: ["therapists"],
    queryFn: async () => {
      const { data, error } = await supabase.from("Therapist").select("*").limit(200);
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
    
    if (nameSearch.trim()) {
      const q = nameSearch.trim().toLowerCase();
      if (!(t.full_name || "").toLowerCase().includes(q)) return false;
    }
    
    return true;
  }), [therapists, filters, nameSearch]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // --- הכנת נתוני SEO חכמים לפי העיר והמקצוע ---
  const seoProfessionLabels = {
    all: "מטפלים ופסיכולוגים", psychologist: "פסיכולוגים", psychiatrist: "פסיכיאטרים",
    psychotherapist: "פסיכותרפיסטים", social_worker: 'עובדים סוציאליים', counselor: "יועצים"
  };

  const currentProfession = seoProfessionLabels[filters.profession] || "מטפלים";
  const currentCityText = filters.city !== "all" ? ` ב${filters.city}` : "";
  const seoTitle = `${currentProfession}${currentCityText} מומלצים | מצא לי מטפל`;
  const seoDescription = `מחפשים ${currentProfession}${currentCityText}? היכנסו למאגר המקיף של מצא לי מטפל, סננו לפי מחיר, סוג טיפול וזמינות, וצרו קשר ישירות ללא עמלות.`;

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 py-8" dir="rtl">
        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            {/* כותרת H1 משתנה אוטומטית! */}
            <h1 className="text-2xl md:text-3xl font-black text-foreground">
              {currentProfession}{currentCityText}
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">✅ חינמי למטופלים</span>
          </div>
          
          <div className="relative mt-4 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input value={nameSearch} onChange={e => { setNameSearch(e.target.value); setPage(1); }} placeholder="חיפוש לפי שם מטפל..." className="pr-9 h-10 text-sm" />
          </div>
          
          <p className="text-sm text-muted-foreground mt-3">{filtered.length} מטפלים נמצאו</p>
        </div>

        <div className="flex gap-6">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel filters={filters} onChange={handleFilterChange} onReset={() => { setFilters(defaultFilters); setPage(1); setNameSearch(""); }} />
          </aside>

          <div className="flex-1 min-w-0">
            <div className="lg:hidden mb-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    סינון
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 overflow-y-auto">
                  <div className="pt-6 pb-10">
                    <FilterPanel filters={filters} onChange={handleFilterChange} onReset={() => { setFilters(defaultFilters); setPage(1); setNameSearch(""); }} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">טוען מטפלים...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
                <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">לא נמצאו מטפלים</h3>
                <p className="text-muted-foreground mb-6">נסו להסיר חלק מהמסננים או לשנות את החיפוש</p>
                <Button onClick={() => { setFilters(defaultFilters); setNameSearch(""); }} variant="outline">אפס את כל המסננים</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paginated.map((t, i) => (
                    <TherapistCard key={t.id} therapist={t} priority={i < 4} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav className="flex items-center justify-center gap-2 mt-8">
                    <Button variant="outline" size="sm" onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={page === 1}><ChevronRight className="w-4 h-4" /></Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <Button key={p} variant={p === page ? "default" : "outline"} size="sm" onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="w-9">{p}</Button>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={page === totalPages}><ChevronLeft className="w-4 h-4" /></Button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}