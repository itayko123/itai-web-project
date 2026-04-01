// @ts-nocheck
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, ArrowRight, User, BookOpen, ExternalLink, BadgeCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLanguage } from "@/lib/LanguageContext";
import { Helmet } from "react-helmet-async";

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
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Article")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Loader2 className="w-6 h-6 animate-spin text-primary" />
    </div>
  );

  if (!article) return (
    <div className="text-center py-20">
      <h2 className="text-xl font-bold mb-4">המאמר לא נמצא</h2>
      <Button onClick={() => navigate("/articles")}>חזרה לבלוג</Button>
    </div>
  );

  // --- הכנת נתוני SEO למאמר ---
  const metaTitle = `${article.title} | מצא לי מטפל`;
  const metaDescription = article.excerpt || `קראו את המאמר המלא בנושא ${categoryLabels[article.category] || "טיפול"}.`;

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        
        {/* תגיות OG ספציפיות למאמרים */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 group"
        >
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          {t.articleBack}
        </button>

        {/* Article Header */}
        <header className="mb-10 text-center md:text-right">
          <Badge className={`${categoryColors[article.category] || categoryColors.general} mb-4 text-xs px-3 py-1`}>
            {categoryLabels[article.category] || article.category}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
            {article.therapist_name && (
              <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                <User className="w-4 h-4 text-primary" />
                <span className="font-medium text-foreground">{article.therapist_name}</span>
                {article.therapist_id && (
                   <Link to={`/therapist/${article.therapist_id}`} className="text-primary hover:underline flex items-center gap-0.5">
                     <BadgeCheck className="w-3.5 h-3.5" />
                     {t.viewProfile}
                   </Link>
                )}
              </div>
            )}
            {article.read_time_minutes && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{article.read_time_minutes} {t.articlesReadTime}</span>
              </div>
            )}
          </div>
        </header>

        {/* Featured Image */}
        {article.image_url && (
          <div className="aspect-video rounded-3xl overflow-hidden mb-10 shadow-lg border border-border">
            <img 
              src={article.image_url} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
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
            <Button asChild>
              <Link to="/therapists">{t.searchTherapists}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/quiz">{t.startQuiz}</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}