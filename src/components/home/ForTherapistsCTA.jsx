import { Link } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Users, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function ForTherapistsCTA() {
  const { t } = useLanguage();

  const perks = [
    { icon: BadgeCheck, text: t.forTherapistsPerk1 || "תג אימות רישיון מקצועי" },
    { icon: Users, text: t.forTherapistsPerk2 || "גישה לאלפי מטופלים פוטנציאליים" },
    { icon: TrendingUp, text: t.forTherapistsPerk3 || "ניהול פרופיל ועמוד אישי" },
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-primary/10 to-ocean/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-3 block">{t.footerForTherapists || "למטפלים"}</span>
            <h2 className="text-2xl md:text-3xl font-black mb-4 leading-tight">
              {t.forTherapistsTitle || "הצטרף/י לרשת המטפלים שלנו"}
            </h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {t.forTherapistsDesc || "הגע/י למטופלים חדשים ובנה/י נוכחות דיגיטלית מקצועית. הצטרפות חינמית — אנו מאמתים ומקדמים את הפרופיל שלך."}
            </p>
            <div className="flex flex-col gap-2.5 mb-6">
              {perks?.map((perk, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <perk.icon className="w-4 h-4 text-primary" />
                  <span>{perk.text}</span>
                </div>
              ))}
            </div>
            <Link
              to="/register-therapist"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              {t.navJoin}
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="hidden md:block w-64 h-64 bg-primary/10 rounded-2xl overflow-hidden flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=400&h=400&fit=crop"
              alt="therapist"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}