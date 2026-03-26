import { Shield, BadgeCheck, Heart, Sparkles } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/lib/LanguageContext";

export default function WhyChooseUs() {
  const ref = useScrollAnimation();
  const { t } = useLanguage();

  const features = [
    { icon: BadgeCheck, title: t.whyVerifiedTitle || "מטפלים מאומתים", desc: t.whyVerifiedDesc || "כל המטפלים בפלטפורמה עוברים תהליך אימות רישיון ומקצועיות." },
    { icon: Sparkles, title: t.whySmartTitle || "התאמה חכמה", desc: t.whySmartDesc || "שאלון AI מתקדם שמוצא את המטפל המתאים ביותר לצרכים שלך." },
    { icon: Shield, title: t.whyPrivacyTitle || "פרטיות מלאה", desc: t.whyPrivacyDesc || "החיפוש שלך פרטי ומאובטח. אנחנו לא שומרים מידע רפואי." },
    { icon: Heart, title: t.whyTransparentTitle || "שקיפות מלאה", desc: t.whyTransparentDesc || "מחירים ברורים, ביקורות אמיתיות וכל המידע לפני שתפנו." },
  ];

  return (
    <section className="py-16 px-4">
      <div ref={ref} className="max-w-5xl mx-auto animate-on-scroll">
        <h2 className="text-2xl font-bold text-center mb-2">{t.whyTitle || "למה מצא לי מטפל?"}</h2>
        <p className="text-muted-foreground text-center text-sm mb-10">{t.whySubtitle || "הדרך הבטוחה למצוא את המטפל שמתאים בדיוק לך"}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 text-center hover:shadow-md hover:border-primary/20 hover:-translate-y-1 transition-all duration-200 group">
              <div className="mx-auto w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-sm mb-1.5">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}