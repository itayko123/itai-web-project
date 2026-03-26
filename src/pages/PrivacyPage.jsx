import { useLanguage } from "@/lib/LanguageContext";
import { Link } from "react-router-dom";

const content = {
  he: {
    title: "מדיניות פרטיות",
    lastUpdate: "עדכון אחרון: מרץ 2026",
    sections: [
      { h: "1. מבוא", body: 'פלטפורמת "מצא לי מטפל" מחויבת לשמירה על פרטיות המשתמשים שלה. מדיניות זו מסבירה אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם ומה הזכויות שלך.' },
      { h: "2. המידע שאנו אוספים", items: ["פרטים שסיפקת בעת יצירת חשבון (שם, כתובת אימייל)", "נתוני חיפוש ושאלון ההתאמה (מאוחסנים בצורה אנונימית)", "פרטי פנייה למטפלים (שם, טלפון, הודעה)", "נתוני גלישה בסיסיים (IP, סוג דפדפן) למטרות אבטחה בלבד"] },
      { h: "3. כיצד אנו משתמשים במידע", items: ["לצורך חיבור בין מטופלים למטפלים", "לשיפור שירות ההתאמה האישית", "לאבטחת המערכת ומניעת שימוש לרעה", "לא נמכור ולא נשתף מידע אישי עם צדדים שלישיים ללא הסכמה מפורשת"] },
      { h: "4. אחסון ואבטחת מידע", body: "המידע מאוחסן בשרתים מאובטחים בתוך האיחוד האירופי. אנו משתמשים בהצפנת SSL ובאמצעי אבטחה מתקדמים. במקרה של פרצת אבטחה, נדווח לך בהתאם לדרישות החוק." },
      { h: "5. זכויותיך", items: ["זכות עיון במידע שנאסף עליך", "זכות לתיקון מידע שגוי", 'זכות למחיקת מידע ("הזכות להישכח")', "זכות להתנגד לעיבוד מידע"], footer: { text: "לממש את זכויותיך:", link: "/contact", linkText: "צור קשר" } },
      { h: "6. עוגיות (Cookies)", body: "אנו משתמשים בעוגיות חיוניות בלבד לתפעול התקין של האתר ולשמירת ההעדפות שלך. לא נשתמש בעוגיות פרסומיות ללא אישורך." },
      { h: "7. יצירת קשר", body: null, email: "privacy@findmytherapist.co.il", emailPrefix: "לשאלות בנוגע למדיניות הפרטיות:" },
    ]
  },
  en: {
    title: "Privacy Policy",
    lastUpdate: "Last updated: March 2026",
    sections: [
      { h: "1. Introduction", body: '"Find My Therapist" platform is committed to protecting the privacy of its users. This policy explains what data we collect, how we use it and what your rights are.' },
      { h: "2. Information We Collect", items: ["Details you provided when creating an account (name, email address)", "Search data and matching quiz data (stored anonymously)", "Contact details for therapists (name, phone, message)", "Basic browsing data (IP, browser type) for security purposes only"] },
      { h: "3. How We Use Information", items: ["To connect patients with therapists", "To improve the personalized matching service", "To secure the system and prevent abuse", "We will not sell or share personal information with third parties without explicit consent"] },
      { h: "4. Storage & Data Security", body: "Data is stored on secure servers within the European Union. We use SSL encryption and advanced security measures. In case of a security breach, we will notify you as required by law." },
      { h: "5. Your Rights", items: ["Right to access information collected about you", "Right to correct inaccurate information", 'Right to delete information ("Right to be Forgotten")', "Right to object to data processing"], footer: { text: "To exercise your rights:", link: "/contact", linkText: "Contact Us" } },
      { h: "6. Cookies", body: "We use only essential cookies for the proper operation of the site and to save your preferences. We will not use advertising cookies without your consent." },
      { h: "7. Contact", body: null, email: "privacy@findmytherapist.co.il", emailPrefix: "For questions about the Privacy Policy:" },
    ]
  },
  ru: {
    title: "Политика конфиденциальности",
    lastUpdate: "Последнее обновление: март 2026",
    sections: [
      { h: "1. Введение", body: 'Платформа "Find My Therapist" обязуется защищать конфиденциальность своих пользователей. Эта политика объясняет, какие данные мы собираем, как мы их используем и каковы ваши права.' },
      { h: "2. Информация, которую мы собираем", items: ["Данные, предоставленные при создании аккаунта (имя, адрес электронной почты)", "Данные поиска и теста подбора (хранятся анонимно)", "Контактные данные для терапевтов (имя, телефон, сообщение)", "Основные данные просмотра (IP, тип браузера) только в целях безопасности"] },
      { h: "3. Как мы используем информацию", items: ["Для связи пациентов с терапевтами", "Для улучшения персонализированного сервиса подбора", "Для защиты системы и предотвращения злоупотреблений", "Мы не будем продавать или передавать личные данные третьим лицам без явного согласия"] },
      { h: "4. Хранение и безопасность данных", body: "Данные хранятся на защищённых серверах в Европейском союзе. Мы используем шифрование SSL и передовые меры безопасности." },
      { h: "5. Ваши права", items: ["Право на доступ к собранной о вас информации", "Право на исправление неточной информации", 'Право на удаление информации ("Право быть забытым")', "Право возразить против обработки данных"], footer: { text: "Для осуществления своих прав:", link: "/contact", linkText: "Связаться с нами" } },
      { h: "6. Файлы cookie", body: "Мы используем только необходимые файлы cookie для правильной работы сайта и сохранения ваших предпочтений." },
      { h: "7. Контакты", body: null, email: "privacy@findmytherapist.co.il", emailPrefix: "По вопросам о политике конфиденциальности:" },
    ]
  },
};

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const c = content[lang] || content.he;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black mb-2">{c.title}</h1>
      <p className="text-muted-foreground text-sm mb-8">{c.lastUpdate}</p>
      <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
        {c.sections.map((sec, i) => (
          <section key={i}>
            <h2 className="font-bold text-base text-foreground mb-2">{sec.h}</h2>
            {sec.body && <p>{sec.body}</p>}
            {sec.items && (
              <ul className="list-disc list-inside space-y-1 mr-4">
                {sec.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            )}
            {sec.footer && (
              <p className="mt-2">{sec.footer.text} <Link to={sec.footer.link} className="text-primary hover:underline">{sec.footer.linkText}</Link></p>
            )}
            {sec.emailPrefix && (
              <p>{sec.emailPrefix} <a href={`mailto:${sec.email}`} className="text-primary hover:underline">{sec.email}</a></p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}