// @ts-nocheck
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Clock, BookOpen, Loader2, Search, ChevronLeft, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ArticleCard from "@/components/articles/ArticleCard";
import { useLanguage } from "@/lib/LanguageContext";
import { Helmet } from "react-helmet-async";

const categoryLabels = {
  anxiety: "חרדה", depression: "דיכאון", relationships: "זוגיות",
  parenting: "הורות", trauma: "טראומה", mindfulness: "מיינדפולנס", general: "כללי"
};
const categoryColors = {
  anxiety: "bg-blue-100 text-blue-700 border-blue-200",
  depression: "bg-purple-100 text-purple-700 border-purple-200",
  relationships: "bg-pink-100 text-pink-700 border-pink-200",
  parenting: "bg-amber-100 text-amber-700 border-amber-200",
  trauma: "bg-red-100 text-red-700 border-red-200",
  mindfulness: "bg-emerald-100 text-emerald-700 border-emerald-200",
  general: "bg-gray-100 text-gray-700 border-gray-200"
};

const CATEGORIES = ["all", "anxiety", "depression", "relationships", "parenting", "trauma", "mindfulness", "general"];

const categoryMeta = {
  all:          { title: "מאמרים בנושאי בריאות נפש | מצא לי מטפל",                   description: "מאמרים מקצועיים בנושאי פסיכולוגיה, חרדה, דיכאון, זוגיות וטיפול נפשי — נכתבו על ידי מטפלים מוסמכים." },
  anxiety:      { title: "מאמרים על חרדה | מצא לי מטפל",                              description: "מאמרים מקצועיים על חרדה, התקפי פאניקה ו-OCD. נכתבו על ידי פסיכולוגים מוסמכים." },
  depression:   { title: "מאמרים על דיכאון | מצא לי מטפל",                            description: "מאמרים מקצועיים על דיכאון, עצב ואובדן מוטיבציה. מידע מהמומחים." },
  relationships:{ title: "מאמרים על זוגיות ומערכות יחסים | מצא לי מטפל",             description: "מאמרים על זוגיות, קשרים בינאישיים, גירושין ותקשורת בריאה." },
  parenting:    { title: "מאמרים על הורות | מצא לי מטפל",                             description: "מאמרים מקצועיים על הורות, גידול ילדים ומתבגרים." },
  trauma:       { title: "מאמרים על טראומה ו-PTSD | מצא לי מטפל",                    description: "מאמרים על טראומה, PTSD והחלמה מאירועים קשים." },
  mindfulness:  { title: "מאמרים על מיינדפולנס ומדיטציה | מצא לי מטפל",              description: "מאמרים על מיינדפולנס, מדיטציה ונוכחות ברגע הנוכחי." },
  general:      { title: "מאמרים כלליים על בריאות הנפש | מצא לי מטפל",               description: "מאמרים כלליים על בריאות הנפש, פסיכולוגיה ורווחה רגשית." },
};

// Use slug if available, fallback to id
function articleUrl(article) {
  return article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`;
}

export default function ArticlesPage() {
  const { t } = useLanguage();
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["published-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Article")
        .select("*")
        .eq("status", "published")
        .order("created_date", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = articles.filter(a => {
    const cat = (a.category || "").trim().toLowerCase();
    const sel = selectedCat.trim().toLowerCase();
    const matchCat = sel === "all" || cat === sel;
    const q = search.trim().toLowerCase();
    const matchSearch = !q ||
      (a.title || "").toLowerCase().includes(q) ||
      (a.excerpt || "").toLowerCase().includes(q) ||
      (a.content || "").toLowerCase().includes(q) ||
      (a.therapist_name || "").toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const meta = categoryMeta[selectedCat] || categoryMeta.all;

  return (
    <>
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <link rel="canonical" href={`https://itai-web-project.vercel.app/articles`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <section className="bg-gradient-to-br from-teal-50 via-sky-50 to-background border-b border-border py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <BookOpen className="w-3.5 h-3.5" />
              {t.articlesBadge}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight">
              {selectedCat === "all" ? t.articlesTitle : `מאמרים על ${categoryLabels[selectedCat]}`}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
              {t.articlesSubtitle}
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.articlesSearch} className="pr-10 h-11 rounded-xl bg-white" />
            </div>
          </div>
        </section>

        {/* Category filter */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-border">
          <div className="max-w-5xl mx-auto px-4 flex gap-2 overflow-x-auto py-3 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCat(cat)}
                className={`flex-shrink-0 text-xs font-semibold px-4 py-1.5 rounded-full border transition-all ${selectedCat === cat ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                {cat === "all" ? t.articlesAll : categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10">
          {isLoading && <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              {search || selectedCat !== "all"
                ? <p className="text-muted-foreground">{t.articlesNoResults}</p>
                : <><p className="text-muted-foreground font-medium">{t.articlesSoon}</p><p className="text-sm text-muted-foreground mt-2">{t.articlesJoinText} <Link to="/register-therapist" className="text-primary hover:underline">{t.articlesJoin}</Link></p></>
              }
            </div>
          )}

          {/* Featured article */}
          {featured && !search && selectedCat === "all" && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-primary" />
                <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide">{t.articlesFeatured}</h2>
              </div>
              <Link to={articleUrl(featured)} className="group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                <div className="md:flex">
                  {featured.cover_image_url
                    ? <div className="md:w-2/5 h-56 md:h-auto overflow-hidden flex-shrink-0"><img src={featured.cover_image_url} alt={featured.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /></div>
                    : <div className="md:w-2/5 h-56 md:h-auto bg-gradient-to-br from-accent to-primary/10 flex items-center justify-center flex-shrink-0"><BookOpen className="w-16 h-16 text-primary/30" /></div>
                  }
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${categoryColors[featured.category] || categoryColors.general}`}>{categoryLabels[featured.category] || "כללי"}</span>
                        {featured.is_premium && <Badge className="bg-amber-100 text-amber-700 text-xs">פרמיום</Badge>}
                      </div>
                      <h2 className="text-xl md:text-2xl font-black text-foreground group-hover:text-primary transition-colors mb-3 leading-snug">{featured.title}</h2>
                      {featured.excerpt && <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">{featured.excerpt}</p>}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {featured.therapist_name && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{featured.therapist_name.charAt(0)}</div>
                          <span className="font-medium text-foreground">{featured.therapist_name}</span>
                        </div>
                      )}
                      {featured.read_time_minutes && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{featured.read_time_minutes} {t.articlesReadTime}</span>}
                      <span className="mr-auto flex items-center gap-1 text-primary font-semibold">{t.articlesReadMore} <ChevronLeft className="w-3.5 h-3.5" /></span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Article grid */}
          {filtered.length > 0 && (
            <div>
              {!search && selectedCat === "all" && <h2 className="font-bold text-sm text-muted-foreground uppercase tracking-wide mb-4">{t.articlesAll2}</h2>}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(search || selectedCat !== "all" ? filtered : rest).map(article => (
                  <ArticleCard key={article.id} article={article} articleUrl={articleUrl(article)} categoryLabels={categoryLabels} categoryColors={categoryColors} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}