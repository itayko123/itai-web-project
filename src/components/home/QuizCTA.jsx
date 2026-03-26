import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function QuizCTA() {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-primary/10 via-accent to-sky-100 rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(172,40%,40%) 1px, transparent 0)', backgroundSize: '24px 24px'}} />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white shadow-sm mb-5">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-black mb-3">{t.quizCtaTitle || "לא יודעים מאיפה להתחיל?"}</h2>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto text-sm leading-relaxed">
              {t.quizCtaDesc || "שאלון ההתאמה שלנו יעזור לכם למצוא את המטפל המתאים בדיוק בתוך 2 דקות."}
            </p>
            <Link
              to="/quiz"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              {t.quizCtaBtn || "התחל בשאלון"}
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <p className="text-xs text-muted-foreground mt-4">
              {t.quizInfoDisclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}