// @ts-nocheck
import { Link } from "react-router-dom";
import { Clock, ChevronLeft, BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Use slug if available, fallback to id only — never Hebrew in URL
function articleUrl(article) {
  return article.slug ? `/articles/${article.slug}` : `/articles/${article.id}`;
}

export default function ArticleCard({ article, categoryLabels, categoryColors }) {
  return (
    <Link
      to={articleUrl(article)}
      className="group block bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300"
    >
      {article.cover_image_url ? (
        <div className="h-44 overflow-hidden">
          <img
            src={article.cover_image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-accent/60 to-primary/10 flex items-center justify-center">
          <span className="text-4xl font-black text-primary/20">{article.title?.charAt(0)}</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border ${categoryColors[article.category] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
            {categoryLabels[article.category] || "כללי"}
          </span>
          {article.is_premium && <Badge className="bg-amber-100 text-amber-700 text-xs">פרמיום</Badge>}
        </div>

        <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1.5 leading-snug">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {article.therapist_name && (
              <span className="flex items-center gap-1 font-medium text-foreground">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {article.therapist_name.charAt(0)}
                </div>
                {article.therapist_name}
              </span>
            )}
            {article.read_time_minutes && (
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" />{article.read_time_minutes} דק׳
              </span>
            )}
          </div>
          <ChevronLeft className="w-3.5 h-3.5 text-primary" />
        </div>
      </div>
    </Link>
  );
}