import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import TherapistCard from "@/components/therapist/TherapistCard";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function FeaturedTherapists() {
  const { t } = useLanguage();
  const { data: therapists = [] } = useQuery({
    queryKey: ["featured-therapists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Therapist")
        .select("*")
        .eq("status", "approved")
        .order("average_rating", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data ?? [];
    },
  });

  // הבטחה שתמיד יש מערך לפני שעושים פעולות
  const safeTherapists = therapists || [];

  if (safeTherapists.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-muted/40">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-1">{t.featuredTitle || "מטפלים מובילים"}</h2>
            <p className="text-sm text-muted-foreground">{t.featuredSubtitle || "מאומתים, מדורגים ומומלצים"}</p>
          </div>
          <Link to="/therapists" className="flex items-center gap-1 text-sm text-primary font-medium hover:underline" aria-label={t.featuredViewAll || "צפה בכולם"}>
            {t.featuredViewAll || "צפה בכולם"}
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeTherapists?.map((t, i) => (
            <TherapistCard key={t.id} therapist={t} priority={i < 3} />
          ))}
        </div>
      </div>
    </section>
  );
}