import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Clock, User, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const categoryColors = {
  anxiety: "bg-blue-100 text-blue-700", depression: "bg-purple-100 text-purple-700",
  relationships: "bg-pink-100 text-pink-700", parenting: "bg-amber-100 text-amber-700",
  trauma: "bg-red-100 text-red-700", mindfulness: "bg-emerald-100 text-emerald-700",
  general: "bg-gray-100 text-gray-700"
};

const categoryLabelsHe = {
  anxiety: "חרדה", depression: "דיכאון", relationships: "זוגיות",
  parenting: "הורות", trauma: "טראומה", mindfulness: "מיינדפולנס", general: "כללי"
};

export default function ArticlesSection() {
  const { t } = useLanguage();
  const { data: articles = [] } = useQuery({
    queryKey: ["home-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Article")
        .select("*")
        .eq("status", "published")
        .order("created_date", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data ?? [];
    },
  });

  // הבטחה שתמיד יש מערך לפני שעושים פעולות
  const safeArticles = articles || [];

  if (safeArticles.length === 0) return null;

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black">{t.articlesSectionTitle || "מאמרים מקצועיים"}</h2>
            <p className="text-muted-foreground text-sm mt-1">{t.articlesSectionSubtitle || "ידע ותובנות מאת מטפלים מוסמכים"}</p>
          </div>
          <Link to="/articles" className="flex items-center gap-1 text-sm text-primary hover:underline font-medium">
            {t.articlesSectionViewAll || "לכל המאמרים"} <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {safeArticles?.map(article => (
            <Link key={article.id} to={`/articles/${article.id}`} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-300 block">
              {article.cover_image_url && (
                <div className="h-40 overflow-hidden">
                  <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-block mb-2 ${categoryColors[article.category] || categoryColors.general}`}>
                  {categoryLabelsHe[article.category] || "כללי"}
                </span>
                <h3 className="font-bold text-sm mb-1 line-clamp-2">{article.title}</h3>
                {article.excerpt && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{article.excerpt}</p>}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {article.therapist_name && <span className="flex items-center gap-1"><User className="w-3 h-3" />{article.therapist_name}</span>}
                  {article.read_time_minutes && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.read_time_minutes} {t.articlesReadTime}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}