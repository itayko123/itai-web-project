// @ts-nocheck
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

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-2">מאמרים אחרונים</h2>
            <p className="text-muted-foreground text-sm md:text-base">קראו מאמרים מקצועיים שנכתבו על ידי המטפלים שלנו</p>
          </div>
          <Link to="/articles" className="hidden md:flex items-center gap-1 text-primary hover:underline font-medium">
            לכל המאמרים <ArrowLeft className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map(article => {
            // הנה התיקון! השורה הזו עכשיו נמצאת *בתוך* הלולאה, ולכן article קיים פה:
            const slug = article.title ? article.title.replace(/\s+/g, '-').replace(/[^\w\u0590-\u05FF-]/g, '') : '';
            
            return (
              <Link key={article.id} to={`/articles/${article.id}/${slug}`} className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-300 block">
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
                    {article.read_time_minutes && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{article.read_time_minutes} {t.articlesReadTime || "דק' קריאה"}</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link to="/articles" className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
             לכל המאמרים <ArrowLeft className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}