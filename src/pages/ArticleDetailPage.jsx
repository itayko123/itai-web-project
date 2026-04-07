// @ts-nocheck
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Clock, ArrowRight, BookOpen, ExternalLink, BadgeCheck, MapPin, Phone, Calendar } from "lucide-react";
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

const profLabels = {
  psychologist: "פסיכולוג/ית", psychiatrist: "פסיכיאטר/ית",
  psychotherapist: "פסיכותרפיסט/ית", social_worker: 'עו"ס קליני', counselor: "יועץ/ת"
};

const SITE_URL = "https://itai-web-project.vercel.app";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const identifier = id;
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", identifier],
    enabled: !!identifier,
    queryFn: async () => {
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
      const { data, error } = await supabase
        .from("Article")
        .select("*")
        .eq(isUUID ? "id" : "slug", identifier)
        .single();
      if (error) throw error;
      if (data) {
        supabase.from("Article")
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq("id", data.id)
          .then(() => {}).catch(() => {});
      }
      return data;
    },
  });

  const { data: therapistList = [] } = useQuery({
    queryKey: ["article-author", article?.therapist_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Therapist").select("*").eq("id", article.therapist_id).limit(1);
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
      <p className="text-muted-foreground">מאמר לא נמצא</p>
      <Button variant="outline" className="mt-4" onClick={() => navigate("/articles")}>{t.articleBackBtn}</Button>
    </div>
  );

  const canonicalUrl = article.slug
    ? `${SITE_URL}/articles/${article.slug}`
    : `${SITE_URL}/articles/${article.id}`;

  const metaTitle = `${article.title} | מצא לי מטפל`;
  const metaDescription = article.excerpt || (article.content?.substring(0, 155) ?? "");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": metaDescription,
    "url": canonicalUrl,
    "datePublished": article.created_date,
    "publisher": { "@type": "Organization", "name": "מצא לי מטפל", "url": SITE_URL },
    ...(article.therapist_name ? { "author": { "@type": "Person", "name": article.therapist_name } } : {}),
    ...(article.cover_image_url ? { "image": article.cover_image_url } : {}),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        {article.cover_image_url && <meta property="og:image" content={article.cover_image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {article.cover_image_url && <meta name="twitter:image" content={article.cover_image_url} />}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Cover image */}
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

        {/* Category + read time */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {article.category && (
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${categoryColors[article.category] || categoryColors.general}`}>
              {categoryLabels[article.category] || "כללי"}
            </span>
          )}
          {article.is_premium && <Badge className="bg-amber-100 text-amber-700 text-xs">{t.articlesPremium}</Badge>}
          {article.read_time_minutes && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Clock className="w-3.5 h-3.5" />{article.read_time_minutes} {t.articlesReadTime}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight mb-8">
          {article.title}
        </h1>

        {/* ─── Author card — prominent and inviting ──────────────────────── */}
        {article.therapist_name && (
          <div className="relative mb-10 rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-l from-primary/5 to-accent/40 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
              {/* Photo */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary/10 ring-2 ring-primary/20">
                  {therapist?.photo_url
                    ? <img src={therapist.photo_url} alt={article.therapist_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl font-black text-primary/40">
                        {article.therapist_name.charAt(0)}
                      </div>
                  }
                </div>
                {therapist?.license_verified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <BadgeCheck className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-black text-base text-foreground">{article.therapist_name}</span>
                  {therapist?.license_verified && (
                    <span className="text-xs text-primary font-semibold bg-primary/10 px-2 py-0.5 rounded-full">
                      ✓ רישיון מאומת
                    </span>
                  )}
                </div>
                {therapist && (
                  <p className="text-sm text-muted-foreground">
                    {profLabels[therapist.profession] || "מטפל/ת"}
                    {therapist.years_experience ? ` · ${therapist.years_experience} שנות ניסיון` : ""}
                    {therapist.city ? ` · ${therapist.city}` : ""}
                  </p>
                )}
                {therapist?.about && (
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
                    {therapist.about}
                  </p>
                )}
              </div>

              {/* CTA to profile */}
              {therapist?.slug && (
                <Link
                  to={`/therapist/${therapist.slug}`}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
                >
                  לפרופיל המטפל
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

            {/* Bottom strip with quick details */}
            {therapist && (therapist.immediate_availability || therapist.price_per_session || therapist.formats?.length > 0) && (
              <div className="border-t border-primary/10 px-5 py-3 flex flex-wrap gap-4 text-xs text-muted-foreground bg-white/40">
                {therapist.immediate_availability && (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    פתוח/ה למטופלים חדשים
                  </span>
                )}
                {therapist.price_per_session && (
                  <span className="flex items-center gap-1">
                    ₪{therapist.price_per_session} לפגישה
                  </span>
                )}
                {therapist.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{therapist.city}
                  </span>
                )}
              </div>
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
          prose-strong:text-foreground prose-li:text-muted-foreground
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          <ReactMarkdown>{article.content}</ReactMarkdown>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-800">
          {t.articleDisclaimer}
        </div>

        {/* Author card again at bottom — inviting to contact */}
        {therapist?.slug && (
          <div className="mt-10 p-6 bg-gradient-to-l from-primary/5 to-accent/30 border border-primary/20 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-primary/10 flex-shrink-0 mx-auto sm:mx-0">
              {therapist.photo_url
                ? <img src={therapist.photo_url} alt={article.therapist_name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-xl font-black text-primary/40">{article.therapist_name?.charAt(0)}</div>
              }
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-foreground">
                המאמר נכתב על ידי {article.therapist_name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {profLabels[therapist.profession] || "מטפל/ת"}{therapist.city ? ` · ${therapist.city}` : ""}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                מעוניינ/ת לקבל עזרה מקצועית? צרו קשר ישירות
              </p>
            </div>
            <Link
              to={`/therapist/${therapist.slug}`}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors shadow flex-shrink-0"
            >
              לפרופיל המלא
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}