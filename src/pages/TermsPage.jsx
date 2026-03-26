import { useLanguage } from "@/lib/LanguageContext";

const content = {
  he: {
    title: "תנאי שימוש",
    lastUpdate: "עדכון אחרון: מרץ 2026",
    disclaimer: { title: "הצהרה חשובה", body: 'פלטפורמת "מצא לי מטפל" היא שירות ספריה והפניה בלבד. הפלטפורמה אינה מספקת ייעוץ רפואי, אבחון, או טיפול נפשי. הפלטפורמה אינה אחראית לתהליך הטיפולי, לאיכות הטיפול, או לכל נזק שעלול להיגרם כתוצאה מהטיפול. בפנייתך למטפל דרך הפלטפורמה, הינך מאשר/ת שאתה/את מבין/ה הצהרה זו.' },
    sections: [
      { h: "1. מהות השירות", body: '"מצא לי מטפל" מפעילה פלטפורמה דיגיטלית המאפשרת לאנשים לחפש ולמצוא אנשי מקצוע בתחום בריאות הנפש בישראל. הפלטפורמה משמשת כמנוע חיפוש ודירקטוריה בלבד ואינה צד לכל הסכם שייחתם בין המשתמש לבין המטפל.' },
      { h: "2. אחריות המשתמש", body: "המשתמש מתחייב לספק מידע מדויק ואמיתי. כל שימוש בפלטפורמה הוא על אחריות המשתמש בלבד. הפלטפורמה אינה ממליצה על מטפל ספציפי ואינה אחראית לתוצאות הטיפול." },
      { h: "3. אחריות המטפל", body: "המטפל המפרסם את שירותיו מצהיר כי הוא בעל רישיון תקף, עומד בכל דרישות החוק הרלוונטיות, ומתחייב לעדכן את פרטיו ולשמור על סטנדרטים מקצועיים." },
      { h: "4. פרטיות", body: "אנו לוקחים את פרטיות המשתמשים ברצינות רבה. לא נמכור ולא נעביר מידע אישי לצדדים שלישיים ללא הסכמה מפורשת, למעט כנדרש על פי חוק." },
      { h: "5. עזרה נפשית דחופה", body: "אם אתה/את או מישהו שאתה/את מכיר/ה נמצאים במשבר נפשי חריף, פנה/י מיד לקו החירום הנפשי:", emergencyBtn: "📞 1201 – קו חירום נפשי" },
    ]
  },
  en: {
    title: "Terms of Use",
    lastUpdate: "Last updated: March 2026",
    disclaimer: { title: "Important Declaration", body: '"Find My Therapist" is a directory and referral service only. The platform does not provide medical advice, diagnosis, or mental health treatment. The platform is not responsible for the therapeutic process, quality of treatment, or any harm that may result. By contacting a therapist through the platform, you acknowledge that you understand this declaration.' },
    sections: [
      { h: "1. Nature of Service", body: '"Find My Therapist" operates a digital platform that allows people to search for and find mental health professionals in Israel. The platform serves as a search engine and directory only and is not a party to any agreement concluded between the user and the therapist.' },
      { h: "2. User Responsibility", body: "The user undertakes to provide accurate and true information. All use of the platform is at the user's sole responsibility. The platform does not recommend a specific therapist and is not responsible for treatment results." },
      { h: "3. Therapist Responsibility", body: "The therapist publishing their services declares that they hold a valid license, comply with all relevant legal requirements, and commit to updating their details and maintaining professional standards." },
      { h: "4. Privacy", body: "We take user privacy very seriously. We will not sell or transfer personal information to third parties without explicit consent, except as required by law." },
      { h: "5. Urgent Mental Health Help", body: "If you or someone you know is in an acute mental health crisis, contact the mental health hotline immediately:", emergencyBtn: "📞 1201 – Mental Health Hotline" },
    ]
  },
  ru: {
    title: "Условия использования",
    lastUpdate: "Последнее обновление: март 2026",
    disclaimer: { title: "Важное заявление", body: '"Find My Therapist" является только справочно-направляющим сервисом. Платформа не предоставляет медицинских советов, диагнозов или лечения. Платформа не несёт ответственности за терапевтический процесс, качество лечения или любой причинённый вред.' },
    sections: [
      { h: "1. Суть услуги", body: '"Find My Therapist" управляет цифровой платформой, которая позволяет людям искать специалистов в области психического здоровья в Израиле. Платформа служит только поисковиком и справочником.' },
      { h: "2. Ответственность пользователя", body: "Пользователь обязуется предоставлять точную и достоверную информацию. Использование платформы является исключительной ответственностью пользователя." },
      { h: "3. Ответственность терапевта", body: "Терапевт, публикующий свои услуги, заявляет, что имеет действующую лицензию и соответствует всем соответствующим правовым требованиям." },
      { h: "4. Конфиденциальность", body: "Мы серьёзно относимся к конфиденциальности пользователей. Мы не будем продавать или передавать личные данные третьим лицам без явного согласия." },
      { h: "5. Экстренная психологическая помощь", body: "Если вы или кто-то из ваших знакомых находится в остром психическом кризисе, немедленно позвоните на линию экстренной психологической помощи:", emergencyBtn: "📞 1201 – Линия экстренной психологической помощи" },
    ]
  },
};

export default function TermsPage() {
  const { lang } = useLanguage();
  const c = content[lang] || content.he;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2">{c.title}</h1>
      <p className="text-muted-foreground text-sm mb-8">{c.lastUpdate}</p>
      <div className="prose prose-sm max-w-none space-y-6 text-foreground">
        <section className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h2 className="font-bold text-base mb-2 text-amber-900">{c.disclaimer.title}</h2>
          <p className="text-amber-800 text-sm leading-relaxed">{c.disclaimer.body}</p>
        </section>
        {c.sections.map((sec, i) => (
          <section key={i}>
            <h2 className="font-bold text-lg mb-2">{sec.h}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{sec.body}</p>
            {sec.emergencyBtn && (
              <a href="tel:1201" className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm mt-2 hover:bg-red-700 transition-colors">
                {sec.emergencyBtn}
              </a>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}