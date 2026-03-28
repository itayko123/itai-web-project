import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, ArrowRight, User, BookOpen, ExternalLink, BadgeCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/lib/LanguageContext";

const categoryLabels = {
  anxiety: "חרדה", depression: "דיכאון", relationships: "זוגיות",
  parenting: "הורות", trauma: "טראומה", mindfulness: "מיינדפולנס", general: "כללי"
};
const categoryColors = {
  anxiety: "bg-blue-100 text-blue-700", depression: "bg-purple-100 text-purple-700",
  relationships: "bg-pink-100 text-pink-700", parenting: "bg-amber-100 text-amber-700",
  trauma: "bg-red-100 text-red-700", mindfulness: "bg-emerald-100 text-emerald-700",
  general: "bg-gray-100 text-gray-700"
};

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", id],
    // חשוב: אנחנו מוודאים שיש id לפני שמריצים את הבקשה
    enabled: !!id, 
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Article")
        .select("*")
        .eq("id", id)
        .single(); // במקום limit וחיפוש מערך, single מביא אובייקט אחד מדויק

      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }
      
      // הוספנו כאן את עדכון הצפיות רק אם המאמר נמצא
      if (data) {
        supabase
          .from("Article")
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq("id", data.id)
          .then(() => console.log("View count updated"))
          .catch((err) => console.error("Error updating view count:", err));
      }

      return data;
    },
  });
  const { data: therapistList = [] } = useQuery({
    queryKey: ["article-author", article?.therapist_id],
    queryFn: async () => {
      const { data, error } = await supabase.from("Therapist").select("*").eq("id", article.therapist_id).limit(1);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!article?.therapist_id,
  });
  const therapist = therapistList[0];

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  if (!article) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground">{t.articleBackBtn}</p>
      <Button variant="outline" className="mt-4" onClick={() => navigate("/articles")}>{t.articleBackBtn}</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero image */}
      {article.cover_image_url && (
        <div className="w-full h-64 md:h-80 overflow-hidden">
          <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Back */}
        <button onClick={() => navigate("/articles")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowRight className="w-4 h-4" />
          {t.articleBackBtn}
        </button>

        {/* Category + meta */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {article.category && (
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${categoryColors[article.category] || categoryColors.general}`}>
              {categoryLabels[article.category] || "כללי"}
            </span>
          )}
          {article.is_premium && <Badge className="bg-amber-100 text-amber-700 text-xs">{t.articlesPremium}</Badge>}
          {article.read_time_minutes && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Clock className="w-3.5 h-3.5" />
              {article.read_time_minutes} {t.articlesReadTime}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight mb-6">{article.title}</h1>

        {/* Author bio */}
        {article.therapist_name && (
          <div className="flex items-center gap-4 p-4 bg-accent/40 rounded-2xl border border-border mb-8">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary/10 flex-shrink-0">
              {therapist?.photo_url ? (
                <img src={therapist.photo_url} alt={article.therapist_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary">
                  {article.therapist_name.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm">{article.therapist_name}</span>
                {therapist?.license_verified && (
                  <div className="flex items-center gap-1 text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                    <BadgeCheck className="w-3 h-3" /> {t.articleVerified}
                  </div>
                )}
              </div>
              {therapist && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {therapist.profession === "psychologist" ? "פסיכולוג/ית" : therapist.profession === "psychiatrist" ? "פסיכיאטר/ית" : therapist.profession === "psychotherapist" ? "פסיכותרפיסט/ית" : therapist.profession === "social_worker" ? 'עו"ס קליני' : "מטפל/ת"}
                  {therapist.years_experience ? ` · ${therapist.years_experience} שנות ניסיון` : ""}
                  {therapist.city ? ` · ${therapist.city}` : ""}
                </p>
              )}
            </div>
            {therapist && (
              <Link to={`/therapist/${therapist.id}`} className="flex-shrink-0 text-xs text-primary hover:underline font-medium flex items-center gap-1">
                {t.viewProfile} <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-lg text-muted-foreground leading-relaxed border-r-4 border-primary/40 pr-4 mb-8 font-medium">
            {article.excerpt}
          </p>
        )}

        {/* Main content */}
        <div className="prose prose-slate max-w-none text-base leading-relaxed
          prose-headings:font-black prose-headings:text-foreground
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-strong:text-foreground
          prose-li:text-muted-foreground
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        {/* Footer disclaimer */}
        <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
          {t.articleDisclaimer}
        </div>

        {/* CTA */}
        <div className="mt-8 p-6 bg-card border border-border rounded-2xl text-center">
          <BookOpen className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-bold text-base mb-2">{t.articleCta}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t.articleCtaDesc}</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button asChild><Link to="/therapists">{t.articleCtaBtn}</Link></Button>
            <Button asChild variant="outline"><Link to="/quiz">{t.articleCtaQuiz}</Link></Button>
          </div>
        </div>
      </div>
    </div>
  );
}