import { Lightbulb, Heart, Brain, Wind, Sun, Moon } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/lib/LanguageContext";

const tipsData = [
  { icon: Brain, colorClass: "text-blue-600 bg-blue-50", titleKey: "tipCbtTitle", descKey: "tipCbtDesc", titleFb: "CBT – שינוי דפוסי חשיבה", descFb: "טיפול קוגניטיבי-התנהגותי מוכח מחקרית לחרדה ודיכאון. עובד על זיהוי ושינוי מחשבות אוטומטיות שליליות." },
  { icon: Heart, colorClass: "text-pink-600 bg-pink-50", titleKey: "tipWhenTitle", descKey: "tipWhenDesc", titleFb: "מתי לפנות לעזרה?", descFb: "אם תחושות של עצב, חרדה, או לחץ נמשכות מעל שבועיים ומשפיעות על חיי היומיום – זה הזמן הנכון לפנות." },
  { icon: Wind, colorClass: "text-emerald-600 bg-emerald-50", titleKey: "tipBreathTitle", descKey: "tipBreathDesc", titleFb: "נשימה עמוקה לחרדה", descFb: "שאפי 4 שניות, החזיקי 4 שניות, נשפי 6 שניות. טכניקה זו מפעילה את מערכת העצבים הפאראסימפטטית ומרגיעה." },
  { icon: Sun, colorClass: "text-amber-600 bg-amber-50", titleKey: "tipMorningTitle", descKey: "tipMorningDesc", titleFb: "שגרת בוקר בריאה", descFb: "שגרת בוקר קבועה – שינה מספקת, פעילות גופנית קלה, וארוחת בוקר – משפרת מצב רוח ומפחיתה חרדה." },
  { icon: Moon, colorClass: "text-indigo-600 bg-indigo-50", titleKey: "tipSleepTitle", descKey: "tipSleepDesc", titleFb: "היגיינת שינה", descFb: "מסכים כחצי שעה לפני שינה, שעת שינה קבועה, וחדר קריר ואפל – שלוש ההמלצות הבסיסיות לשינה טובה." },
  { icon: Lightbulb, colorClass: "text-teal-600 bg-teal-50", titleKey: "tipMindTitle", descKey: "tipMindDesc", titleFb: "מיינדפולנס – 5 דקות ביום", descFb: "5 דקות של נוכחות מודעת ביום – מיקוד בנשימה, בתחושות הגוף – מפחיתות לחץ ומגבירות ריכוז לאורך זמן." },
];

export default function TipsSection() {
  const ref = useScrollAnimation();
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div ref={ref} className="max-w-5xl mx-auto animate-on-scroll">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black mb-2">{t.tipsTitle || "טיפים לבריאות הנפש"}</h2>
          <p className="text-muted-foreground text-sm">{t.tipsSubtitle || "ידע מעשי שאפשר ליישם כבר היום"}</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {tipsData?.map((tip, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-border hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tip.colorClass}`}>
                <tip.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm mb-2">{t[tip.titleKey] || tip.titleFb}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{t[tip.descKey] || tip.descFb}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}