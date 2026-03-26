import { Link } from "react-router-dom";
import { Accessibility, Mail } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const content = {
  he: {
    title: "הצהרת נגישות",
    lastUpdate: "עדכון אחרון: מרץ 2026",
    sections: [
      { h: "מחויבות לנגישות", body: 'פלטפורמת "מצא לי מטפל" מחויבת להנגיש את שירותיה לכלל הציבור, לרבות אנשים עם מוגבלות, בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע"ג-2013 ותקן ישראלי 5568 בהתאם להנחיות WCAG 2.1 ברמה AA.' },
      { h: "רמת הנגישות הקיימת", items: ["האתר תומך בקריאה מימין לשמאל (RTL)", "שימוש בפונט ברור ובגדלים נגישים", "ניגודיות צבעים תואמת לתקן WCAG AA", "תמיכה בניווט מקלדת בכל הדפים", "טקסט אלטרנטיבי לתמונות", "מבנה HTML סמנטי לקוראי מסך", "תמיכה בהגדלת טקסט עד 200% ללא אובדן פונקציונליות"] },
      { h: "מה לא נגיש עדיין", body: "אנחנו עובדים באופן שוטף לשיפור הנגישות. ייתכן שחלק מהתכנים החיצוניים (כגון סרטוני יוטיוב) אינם נגישים במלואם. אנחנו ממשיכים לשפר." },
      { h: "פנייה בנושא נגישות", body: "אם נתקלת/ה בבעיית נגישות באתר, פנה/י אלינו ואנחנו נטפל בכך בהקדם:", email: "accessibility@findmytherapist.co.il", contactLink: "/contact", contactText: "ניתן גם ליצור קשר דרך הטופס" },
      { h: "עדכון אחרון", body: "הצהרה זו עודכנה לאחרונה בחודש מרץ 2026. אנחנו בוחנים ומעדכנים אותה אחת לשנה לפחות." },
    ]
  },
  en: {
    title: "Accessibility Statement",
    lastUpdate: "Last updated: March 2026",
    sections: [
      { h: "Commitment to Accessibility", body: 'The "Find My Therapist" platform is committed to making its services accessible to all, including people with disabilities, in accordance with WCAG 2.1 Level AA guidelines.' },
      { h: "Current Level of Accessibility", items: ["Site supports right-to-left (RTL) reading", "Clear fonts and accessible text sizes", "Color contrast meets WCAG AA standard", "Keyboard navigation support on all pages", "Alternative text for images", "Semantic HTML structure for screen readers", "Support for text enlargement up to 200% without loss of functionality"] },
      { h: "What Is Not Yet Accessible", body: "We are continuously working to improve accessibility. Some external content (such as YouTube videos) may not be fully accessible. We continue to improve." },
      { h: "Contact for Accessibility Issues", body: "If you encounter an accessibility issue on the site, contact us and we will address it promptly:", email: "accessibility@findmytherapist.co.il", contactLink: "/contact", contactText: "You can also contact us through the form" },
      { h: "Last Update", body: "This statement was last updated in March 2026. We review and update it at least once a year." },
    ]
  },
  ru: {
    title: "Декларация доступности",
    lastUpdate: "Последнее обновление: март 2026",
    sections: [
      { h: "Приверженность доступности", body: 'Платформа "Find My Therapist" обязуется обеспечить доступность своих услуг для всех, включая людей с ограниченными возможностями, в соответствии с руководством WCAG 2.1 уровня AA.' },
      { h: "Текущий уровень доступности", items: ["Сайт поддерживает чтение справа налево (RTL)", "Чёткие шрифты и доступные размеры текста", "Цветовой контраст соответствует стандарту WCAG AA", "Навигация с клавиатуры на всех страницах", "Альтернативный текст для изображений", "Семантическая HTML-структура для программ чтения с экрана", "Поддержка увеличения текста до 200% без потери функциональности"] },
      { h: "Что ещё не доступно", body: "Мы постоянно работаем над улучшением доступности. Некоторый внешний контент (например, видео YouTube) может быть не полностью доступен." },
      { h: "Обратная связь по доступности", body: "Если вы столкнулись с проблемой доступности на сайте, свяжитесь с нами:", email: "accessibility@findmytherapist.co.il", contactLink: "/contact", contactText: "Вы также можете связаться с нами через форму" },
      { h: "Последнее обновление", body: "Это заявление было последний раз обновлено в марте 2026 года." },
    ]
  },
};

export default function AccessibilityPage() {
  const { lang } = useLanguage();
  const c = content[lang] || content.he;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Accessibility className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-3xl font-black">{c.title}</h1>
      </div>
      <p className="text-muted-foreground text-sm mb-8">{c.lastUpdate}</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
        {c.sections.map((sec, i) => (
          <section key={i}>
            <h2 className="font-bold text-base text-foreground mb-2">{sec.h}</h2>
            {sec.body && <p>{sec.body}</p>}
            {sec.items && (
              <ul className="list-disc list-inside space-y-1 mr-4">
                {sec.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            )}
            {sec.email && (
              <a href={`mailto:${sec.email}`} className="flex items-center gap-2 mt-3 text-primary hover:underline">
                <Mail className="w-4 h-4" />
                {sec.email}
              </a>
            )}
            {sec.contactLink && (
              <p className="mt-3">{sec.contactText} <Link to={sec.contactLink} className="text-primary hover:underline">.</Link></p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}