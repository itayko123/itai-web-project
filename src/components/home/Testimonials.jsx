  // @ts-nocheck
import { Star } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const testimonials = [
  { text: "מצאתי מטפלת מדהימה תוך יום אחד! השאלון הנחה אותי בדיוק למה שחיפשתי. מאוד ממליצה.", name: "מ.כ., 34", location: "תל אביב-יפו", rating: 5 },
  { text: "סוף סוף פלטפורמה שמסבירה בבירור מה כל מטפל מציע. לא הייתי צריך לנחש — הכל שקוף.", name: "ד.ל., 28", location: "ירושלים", rating: 5 },
  { text: "קיבלתי תשובה מהמטפל תוך שעות. התהליך היה פשוט ומכבד. מודה על הפלטפורמה הזו.", name: "ש.א., 45", location: "חיפה", rating: 5 },
];

export default function Testimonials() {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-teal-50 to-sky-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black mb-3">{t.testimonialsTitle || "מה אומרים המשתמשים שלנו"}</h2>
          <p className="text-sm" style={{ color: '#374151' }}>{t.testimonialsSubtitle || "חוויות אמיתיות מאנשים שמצאו עזרה דרכנו"}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials?.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-border flex flex-col gap-4">
              <div className="flex gap-0.5">
                {[...Array(item.rating)]?.map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed flex-1" style={{ color: '#374151' }}>"{item.text}"</p>
              <div>
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs" style={{ color: '#374151' }}>{item.location}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-6" style={{ color: '#374151' }}>{t.testimonialsDisclaimer || "* שמות משתמשים ופרטים מוצגים בקיצור לשמירה על פרטיות"}</p>
      </div>
    </section>
  );
}