import { Search, Sparkles, Phone } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Search,
      title: t.howStep1Title || "חפש/י מטפל",
      desc: t.howStep1Desc || "השתמש/י בחיפוש המתקדם כדי לסנן לפי מיקום, התמחות, מחיר ועוד."
    },
    {
      icon: Sparkles,
      title: t.howStep2Title || "קבל/י המלצות AI",
      desc: t.howStep2Desc || "מלא/י את שאלון ההתאמה הקצר וקבל/י 5 מטפלים שנבחרו במיוחד עבורך."
    },
    {
      icon: Phone,
      title: t.howStep3Title || "פנה/י למטפל",
      desc: t.howStep3Desc || "שלח/י הודעה ישירות למטפל שבחרת ותאם/י פגישת היכרות."
    }
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black mb-3">{t.howTitle}</h2>
          <p className="max-w-md mx-auto text-sm" style={{ color: '#374151' }}>
            {t.howStepsSubtitle || "שלושה שלבים פשוטים לקביעת פגישה ראשונה עם המטפל שלך"}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-10 right-[calc(33%+24px)] left-[calc(33%+24px)] h-0.5 bg-border" />
          {steps.map((s, i) => (
            <div key={i} className="text-center relative">
              <div className="relative inline-flex">
                <div className="w-20 h-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-4">
                  <s.icon className="w-8 h-8 text-primary" />
                </div>
                <span className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-primary-foreground text-xs font-black rounded-full flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-bold text-base mb-2">{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}