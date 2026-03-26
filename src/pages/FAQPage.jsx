import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/LanguageContext";

const getCategoriesForLang = (lang) => {
  if (lang === "en") return [
    {
      title: "General – Service & Pricing",
      faqs: [
        { q: "Is the service free for patients?", a: "Yes, completely. The Find My Therapist platform is entirely free for patients. We only charge therapists a fee. You won't pay a single shekel to search, get recommendations, or contact a therapist." },
        { q: "How much does a therapy session cost?", a: "The price varies by therapist and typically ranges from ₪200 to ₪600 per session. Some therapists work with health funds that may cover part of the cost. You can filter by price on the search page." },
        { q: "Can I pay through the platform?", a: "No. The platform does not process payments. All financial transactions are handled directly between you and the therapist. We only connect you." },
        { q: "Are there subscription fees?", a: "No. No subscription fees, no commissions, no hidden costs. The service is completely free for patients." },
      ]
    },
    {
      title: "Finding a Therapist",
      faqs: [
        { q: "How are therapists verified on the platform?", a: "Every therapist is required to provide a professional license number and approval document. Our admin team reviews each application and verifies the license before the profile goes live. Verified therapists are marked with a blue badge." },
        { q: "What's the difference between a psychologist and a psychiatrist?", a: "A psychologist provides psychological therapy and cannot prescribe medication. A psychiatrist is a specialist physician who can diagnose mental disorders and prescribe medication. Often collaboration between both is needed." },
        { q: "How do I take the matching quiz?", a: "Go to the quiz page, answer a few short questions about your needs, and we'll show you the top matching therapists based on a smart scoring system. Takes about 2 minutes." },
        { q: "Can I search for a therapist in a language other than Hebrew?", a: "Yes! You can filter therapists by treatment language: Arabic, English, Russian, French, Spanish, Amharic, and more." },
        { q: "Can I filter by health fund?", a: "Yes, you can filter therapists by your health fund (Maccabi, Clalit, Meuhedet, Leumit) to find who works with your insurance." },
      ]
    },
    {
      title: "Therapy & Sessions",
      faqs: [
        { q: "Can I get therapy via Zoom?", a: "Yes! Many of our therapists offer online therapy (Zoom) or phone sessions. Filter by format on the search page." },
        { q: "How many sessions are typically needed?", a: "It depends greatly on the reason for seeking therapy and the treatment approach. Average CBT is 12-20 sessions. Dynamic therapy may be longer. Discuss this with your therapist in the first session." },
        { q: "What if I don't feel a connection with the therapist?", a: "Therapeutic alliance is critical to treatment success. If you don't feel comfortable, it's legitimate to look for another therapist. You can always return to the platform to find an alternative." },
      ]
    },
    {
      title: "Privacy & Security",
      faqs: [
        { q: "Can I leave a review anonymously?", a: "Yes. We allow anonymous reviews. Reviews from verified patients are marked with a special badge, but you can always keep your identity private." },
        { q: "Is my inquiry to a therapist confidential?", a: "Yes. Your inquiry details are sent directly to the therapist and are not visible to the public. The site team does not read your correspondence." },
        { q: "Does the platform provide medical advice?", a: "No. We are a referral service only. The platform does not provide medical advice, diagnosis, or treatment recommendations." },
      ]
    },
    {
      title: "For Therapists",
      faqs: [
        { q: "How do I join as a therapist?", a: "Go to the 'Register as Therapist' page, fill in your details, upload a professional license document, and we'll verify your details within 2-3 business days." },
        { q: "Can therapists publish articles?", a: "Yes! Approved therapists can publish professional articles through the Therapist Portal. Articles go through admin approval before publication." },
      ]
    },
    {
      title: "Urgent Help",
      faqs: [
        { q: "What to do in a mental health emergency?", a: "If you or someone you know is in an acute mental health crisis – call the mental health hotline immediately: ☎️ 1201. Service available 24/7." },
        { q: "Is there 24/7 support service?", a: "We don't have 24/7 support. For urgent mental health issues, use line 1201. For platform questions, we'll respond within 48 hours." },
      ]
    }
  ];

  if (lang === "ru") return [
    {
      title: "Общее – Услуги и цены",
      faqs: [
        { q: "Является ли сервис бесплатным для пациентов?", a: "Да, полностью. Платформа Find My Therapist абсолютно бесплатна для пациентов. Мы взимаем плату только с терапевтов. Вы не заплатите ни шекеля за поиск, рекомендации или контакт с терапевтом." },
        { q: "Сколько стоит сеанс терапии?", a: "Цена варьируется в зависимости от терапевта и обычно составляет от ₪200 до ₪600 за сеанс. Некоторые терапевты работают с больничными кассами, которые могут покрыть часть расходов." },
        { q: "Можно ли оплатить через платформу?", a: "Нет. Платформа не обрабатывает платежи. Все финансовые операции проводятся напрямую между вами и терапевтом. Мы только соединяем вас." },
        { q: "Есть ли плата за подписку?", a: "Нет. Никаких сборов, комиссий, скрытых платежей. Сервис полностью бесплатен для пациентов." },
      ]
    },
    {
      title: "Поиск терапевта",
      faqs: [
        { q: "Как проверяются терапевты на платформе?", a: "Каждый терапевт обязан предоставить номер профессиональной лицензии и документ об одобрении. Наша команда проверяет каждую заявку перед публикацией профиля." },
        { q: "Как пройти тест подбора?", a: "Перейдите на страницу теста, ответьте на несколько коротких вопросов о ваших потребностях, и мы покажем вам лучших подходящих терапевтов. Занимает около 2 минут." },
        { q: "Можно ли искать терапевта, говорящего по-русски?", a: "Да! Вы можете фильтровать терапевтов по языку терапии: арабский, английский, русский, французский, испанский, амхарский и др." },
      ]
    },
    {
      title: "Терапия и сеансы",
      faqs: [
        { q: "Можно ли проходить терапию через Zoom?", a: "Да! Многие наши терапевты предлагают онлайн-терапию (Zoom) или телефонные сеансы. Фильтруйте по формату на странице поиска." },
        { q: "Что делать, если нет связи с терапевтом?", a: "Терапевтический альянс критически важен для успеха лечения. Если вы чувствуете дискомфорт, законно искать другого терапевта. Вы всегда можете вернуться на платформу." },
      ]
    },
    {
      title: "Конфиденциальность",
      faqs: [
        { q: "Конфиденциально ли моё обращение к терапевту?", a: "Да. Детали вашего обращения отправляются напрямую терапевту и не видны публично. Команда сайта не читает вашу переписку." },
        { q: "Предоставляет ли платформа медицинские советы?", a: "Нет. Мы только реферальный сервис. Платформа не предоставляет медицинских советов, диагнозов или рекомендаций по лечению." },
      ]
    },
    {
      title: "Экстренная помощь",
      faqs: [
        { q: "Что делать в ситуации психического кризиса?", a: "Если вы или кто-то из ваших знакомых находится в остром психическом кризисе – немедленно позвоните на линию помощи: ☎️ 1201. Услуга доступна 24/7." },
      ]
    }
  ];

  // Hebrew (default)
  return [
    {
      title: "כללי – שירות ומחירים",
      faqs: [
        { q: "האם השירות בחינם למטופלים?", a: "כן, לחלוטין. פלטפורמת מצא לי מטפל חינמית לחלוטין עבור מטופלים. אנו גובים עמלה מהמטפלים בלבד. לא תשלם/י שקל אחד בשביל לחפש, לקבל המלצות, ליצור קשר עם מטפל." },
        { q: "כמה עולה פגישה עם מטפל?", a: "המחיר משתנה בין מטפל למטפל ונע בדרך כלל בין 200 ל-600 ₪ לפגישה. חלק מהמטפלים עובדים עם קופות חולים שעשויות לכסות חלק מהעלות. ניתן לסנן לפי מחיר בדף החיפוש." },
        { q: "האם ניתן לשלם דרך הפלטפורמה?", a: "לא. הפלטפורמה אינה מעבדת תשלומים. כל עסקה כספית מתנהלת ישירות בינך לבין המטפל. אנחנו רק מחברים ביניכם." },
        { q: "האם יש דמי מנוי?", a: "לא. אין דמי מנוי, אין עמלות, אין עלות נסתרת. השירות חינמי לחלוטין עבור מטופלים." },
      ]
    },
    {
      title: "מציאת מטפל",
      faqs: [
        { q: "כיצד מאומתים המטפלים בפלטפורמה?", a: "כל מטפל נדרש לספק מספר רישיון מקצועי ומסמך אישור. צוות האדמין שלנו בודק כל בקשת הצטרפות ומאמת את הרישיון לפני שהפרופיל מופיע. מטפלים מאומתים מסומנים בתג כחול." },
        { q: "מה ההבדל בין פסיכולוג לפסיכיאטר?", a: "פסיכולוג מספק טיפול פסיכולוגי ואינו יכול לרשום תרופות. פסיכיאטר הוא רופא מומחה שיכול לאבחן הפרעות נפשיות ולרשום תרופות. לעתים קרובות נדרשת עבודה משותפת." },
        { q: "מה ההבדל בין פסיכולוג לפסיכותרפיסט?", a: "פסיכולוג הוא בעל תואר מוכר בפסיכולוגיה עם רישיון ממשרד הבריאות. פסיכותרפיסט יכול לבוא מרקע מגוון ולהיות מוסמך בגישות טיפוליות ספציפיות. שניהם יכולים לספק טיפול איכותי." },
        { q: "כיצד מבצעים את שאלון ההתאמה?", a: "כנסו לדף השאלון, ענו על שאלות קצרות על הצרכים שלכם, ואנו נציג לכם את המטפלים המתאימים ביותר על בסיס ניקוד התאמה חכם. לוקח כ-2 דקות." },
        { q: "האם אוכל לחפש מטפל בשפה שאינה עברית?", a: "כן! ניתן לסנן מטפלים לפי שפת טיפול: ערבית, אנגלית, רוסית, צרפתית, ספרדית, אמהרית ועוד." },
        { q: "האם ניתן לסנן לפי קופת חולים?", a: "כן, ניתן לסנן מטפלים לפי קופת החולים שלכם (מכבי, כללית, מאוחדת, לאומית) ולמצוא מי עובד עם הביטוח שלכם." },
      ]
    },
    {
      title: "טיפול ופגישות",
      faqs: [
        { q: "האם ניתן לקבל טיפול בזום?", a: "כן! רבים מהמטפלים שלנו מציעים טיפול מקוון (זום) או טלפוני. ניתן לסנן לפי פורמט בדף החיפוש." },
        { q: "כמה פגישות בממוצע נדרשות?", a: "זה תלוי מאוד בסיבת הפנייה ובגישת הטיפול. טיפול CBT ממוצע הוא 12-20 פגישות. טיפול דינמי עשוי להיות ארוך יותר. מומלץ לדון בכך עם המטפל בפגישה הראשונה." },
        { q: "מה קורה אם לא מרגישים חיבור עם המטפל?", a: "חיבור טיפולי הוא קריטי להצלחת הטיפול. אם לא מרגישים נוח, לגיטימי לחפש מטפל אחר. ניתן תמיד לחזור לפלטפורמה ולמצוא חלופה." },
        { q: "מה ההבדל בין CBT לטיפול דינמי?", a: "CBT ממוקד, מובנה, ומתמקד בשינוי דפוסי חשיבה והתנהגות בהווה. טיפול דינמי מתמקד בדפוסים לא מודעים, ביחסים, ובמקורות ילדות." },
      ]
    },
    {
      title: "פרטיות ואבטחה",
      faqs: [
        { q: "האם אני יכול/ה לכתוב ביקורת באופן אנונימי?", a: "כן. אנו מאפשרים ביקורות אנונימיות. ביקורות ממטופלים מאומתים מסומנות בתג מיוחד, אך תמיד ניתן לשמור על הזהות החסויה." },
        { q: "האם הפנייה שלי למטפל נשמרת בסודיות?", a: "כן. פרטי הפנייה שלכם נשלחים ישירות למטפל ואינם גלויים לציבור. צוות האתר אינו קורא את התכתובות שלכם." },
        { q: "האם הפלטפורמה עוסקת בייעוץ רפואי?", a: "לא. אנחנו שירות הפניה בלבד. הפלטפורמה אינה מספקת ייעוץ רפואי, אבחון, או המלצות טיפוליות." },
      ]
    },
    {
      title: "למטפלים",
      faqs: [
        { q: "כיצד מצטרפים כמטפל לפלטפורמה?", a: "כנסו לדף 'הרשמה כמטפל', מלאו את הפרטים, העלו מסמך רישיון מקצועי, ואנחנו נאמת את הפרטים בתוך 2-3 ימי עסקים." },
        { q: "האם מטפלים יכולים לפרסם מאמרים?", a: "כן! מטפלים מאושרים יכולים לפרסם מאמרים מקצועיים דרך פורטל המטפלים. המאמרים עוברים אישור של צוות האדמין לפני פרסום." },
        { q: "כמה זמן לוקח אישור הפרופיל?", a: "בדרך כלל 2-3 ימי עסקים. עם העלאת מסמך רישיון ברור, התהליך יכול להיות מהיר יותר." },
      ]
    },
    {
      title: "עזרה דחופה",
      faqs: [
        { q: "מה לעשות במצב חירום נפשי?", a: "אם אתה/את או מישהו שאתה/את מכיר/ה נמצאים במשבר נפשי חריף – התקשר/י מיד לקו עזרה נפשית ראשונה: ☎️ 1201. שירות זמין 24/7." },
        { q: "האם יש שירות תמיכה 24/7?", a: "אין לנו שירות תמיכה 24/7. לפניות דחופות בנושאי בריאות הנפש, השתמשו בקו 1201. לשאלות על הפלטפורמה, נגיב תוך 48 שעות." },
      ]
    }
  ];
};

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl overflow-hidden transition-all duration-200 hover:border-primary/30">
      <button
        className="w-full text-right px-5 py-4 flex items-center justify-between gap-3 hover:bg-accent/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-semibold text-sm text-right">{q}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3 animate-fade-in">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const { t, lang } = useLanguage();
  const categories = getCategoriesForLang(lang);
  const [activeCategory, setActiveCategory] = useState(null);
  const displayed = activeCategory !== null ? [categories[activeCategory]] : categories;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-black mb-2">{t.faqTitle}</h1>
        <p className="text-muted-foreground">{t.faqSubtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <button
          onClick={() => setActiveCategory(null)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${activeCategory === null ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
        >
          {t.faqAllCategories}
        </button>
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setActiveCategory(activeCategory === i ? null : i)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${activeCategory === i ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {displayed.map((cat, ci) => (
          <div key={ci}>
            <h2 className="font-bold text-base text-foreground mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-primary rounded-full inline-block" />
              {cat.title}
            </h2>
            <div className="space-y-2">
              {cat.faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center bg-accent/40 rounded-2xl p-6">
        <p className="font-semibold mb-2">{t.faqNotFound}</p>
        <p className="text-sm text-muted-foreground mb-4">{t.faqNotFoundSub}</p>
        <a href="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
          {t.faqContact}
        </a>
      </div>
    </div>
  );
}