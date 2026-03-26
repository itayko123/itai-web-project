import { Link } from "react-router-dom";
import { Search, ClipboardList, MessageCircle, ShieldCheck, Star, Zap, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const getContentForLang = (lang) => {
  if (lang === "en") return {
    badge: "Simple, Fast, Free",
    freeTitle: "100% Free for Patients",
    freeDesc: "The platform is funded through fees charged to therapists. Patients pay nothing – no commission, no subscription, nothing. Search, match, and contact – all free.",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      { q: "How long does it take to find a therapist?", a: "Most users find a suitable therapist within 5-10 minutes. The matching quiz takes about 2 minutes and provides immediate recommendations." },
      { q: "Do therapists respond back?", a: "Yes – most therapists respond within 24-48 hours. Therapists marked as 'available now' typically respond faster." },
      { q: "Can I rate and review therapists?", a: "Yes. After a session, you can leave a detailed review and rating. Reviews go through staff approval before publication." },
    ],
    steps: [
      { title: "Free search or matching quiz", desc: "Search for a therapist by city, profession, specialty and price – or fill in our smart matching quiz. The system will find the top 5 most suitable therapists for you.", color: "bg-blue-100 text-blue-700", number: "01" },
      { title: "All therapists are verified", desc: "Every therapist on the platform has had their professional license verified. We check every profile before it is published, so you can trust who is shown to you.", color: "bg-emerald-100 text-emerald-700", number: "02" },
      { title: "Read the profile, reviews and intro videos", desc: "Each therapist has a detailed profile with treatment approach, specializations, methods, price, health funds, ratings and verified reviews from real patients.", color: "bg-purple-100 text-purple-700", number: "03" },
      { title: "Contact directly – completely free", desc: "Send a message, request a phone call, or book an appointment directly through the profile. The service is completely free for patients. No commissions, no hidden payments.", color: "bg-amber-100 text-amber-700", number: "04" },
      { title: "Share your experience", desc: "After the first session, we'd love if you'd share a review. Reviews help other patients make informed decisions and allow therapists to improve.", color: "bg-pink-100 text-pink-700", number: "05" },
    ],
    cta: "Find a Therapist Now – Free",
    ctaQuiz: "Smart Matching Quiz",
  };

  if (lang === "ru") return {
    badge: "Просто, быстро, бесплатно",
    freeTitle: "100% бесплатно для пациентов",
    freeDesc: "Платформа финансируется за счёт комиссий от терапевтов. Пациенты ничего не платят – никаких комиссий, подписок, ничего. Поиск, подбор и контакт – всё бесплатно.",
    faqTitle: "Часто задаваемые вопросы",
    faqs: [
      { q: "Сколько времени занимает поиск терапевта?", a: "Большинство пользователей находят подходящего терапевта за 5-10 минут. Тест подбора занимает около 2 минут и даёт мгновенные рекомендации." },
      { q: "Отвечают ли терапевты?", a: "Да – большинство терапевтов отвечают в течение 24-48 часов. Терапевты, отмеченные как 'доступны сейчас', как правило, отвечают быстрее." },
    ],
    steps: [
      { title: "Свободный поиск или тест подбора", desc: "Ищите терапевта по городу, профессии, специализации и цене – или пройдите наш умный тест подбора. Система найдёт для вас 5 наиболее подходящих терапевтов.", color: "bg-blue-100 text-blue-700", number: "01" },
      { title: "Все терапевты проверены", desc: "Каждый терапевт на платформе прошёл проверку профессиональной лицензии. Мы проверяем каждый профиль перед его публикацией.", color: "bg-emerald-100 text-emerald-700", number: "02" },
      { title: "Читайте профиль, отзывы и вводные видео", desc: "У каждого терапевта есть подробный профиль с описанием подхода к лечению, специализациями, методами, ценой и проверенными отзывами.", color: "bg-purple-100 text-purple-700", number: "03" },
      { title: "Свяжитесь напрямую – совершенно бесплатно", desc: "Отправьте сообщение, запросите телефонный звонок или запишитесь на приём прямо через профиль. Услуга полностью бесплатна для пациентов.", color: "bg-amber-100 text-amber-700", number: "04" },
      { title: "Поделитесь своим опытом", desc: "После первого сеанса мы будем рады, если вы оставите отзыв. Отзывы помогают другим пациентам принимать обоснованные решения.", color: "bg-pink-100 text-pink-700", number: "05" },
    ],
    cta: "Найти терапевта сейчас – бесплатно",
    ctaQuiz: "Умный тест подбора",
  };

  return {
    badge: "פשוט, מהיר, חינמי",
    freeTitle: "100% חינמי למטופלים",
    freeDesc: "הפלטפורמה מממנת את עצמה דרך עמלה שגובה ממטפלים. המטופל אינו משלם דבר – לא עמלה, לא דמי מנוי, לא כלום. החיפוש, ההתאמה, ויצירת הקשר – הכל בחינם.",
    faqTitle: "שאלות נפוצות",
    faqs: [
      { q: "כמה זמן לוקח למצוא מטפל?", a: "רוב המשתמשים מוצאים מטפל מתאים תוך 5-10 דקות. שאלון ההתאמה לוקח כ-2 דקות ומספק המלצות מיידיות." },
      { q: "האם המטפלים יוצרים קשר בחזרה?", a: "כן – רוב המטפלים מגיבים בתוך 24-48 שעות. מטפלים שמסומנים כ'זמינים עכשיו' מגיבים בדרך כלל מהר יותר." },
      { q: "האם ניתן לדרג ולבקר מטפלים?", a: "כן. לאחר פגישה, ניתן להשאיר ביקורת מפורטת ודירוג. ביקורות עוברות אישור צוות לפני פרסום." },
    ],
    steps: [
      { title: "חיפוש חופשי או שאלון התאמה", desc: "חפש/י מטפל לפי עיר, מקצוע, התמחות ומחיר – או מלא/י את שאלון ההתאמה החכם שלנו. המערכת תמצא לך את 5 המטפלים המתאימים ביותר עבורך.", color: "bg-blue-100 text-blue-700", number: "01" },
      { title: "כל המטפלים מאומתים", desc: "כל מטפל/ת שמופיע/ה בפלטפורמה עבר/ה אימות רישיון מקצועי. אנחנו בודקים כל פרופיל לפני שהוא מתפרסם, כדי שתוכל/י לסמוך על מי שמוצג לך.", color: "bg-emerald-100 text-emerald-700", number: "02" },
      { title: "קרא/י את הפרופיל, ביקורות וסרטוני היכרות", desc: "לכל מטפל יש פרופיל מפורט עם תיאור גישת הטיפול, התמחויות, שיטות, מחיר, קופות חולים, דירוגים וביקורות מאומתות ממטופלים אמיתיים.", color: "bg-purple-100 text-purple-700", number: "03" },
      { title: "פנה/י ישירות – בחינם לחלוטין", desc: "שלח/י הודעה, בקש/י שיחת טלפון, או קבע/י פגישה ישירות דרך הפרופיל. השירות חינמי לחלוטין עבור מטופלים. אין עמלות, אין תשלומים נסתרים.", color: "bg-amber-100 text-amber-700", number: "04" },
      { title: "שתף/י את החוויה שלך", desc: "לאחר הפגישה הראשונה, נשמח אם תשתף/י ביקורת. ביקורות עוזרות למטופלים אחרים לקבל החלטות מושכלות ומאפשרות למטפלים להשתפר.", color: "bg-pink-100 text-pink-700", number: "05" },
    ],
    cta: "מצא מטפל עכשיו – חינם",
    ctaQuiz: "שאלון התאמה חכם",
  };
};

const stepIcons = [Search, ShieldCheck, ClipboardList, MessageCircle, Star];

export default function HowItWorksPage() {
  const { t, lang } = useLanguage();
  const content = getContentForLang(lang);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-teal-50 via-background to-sky-50 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            {content.badge}
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">{t.howTitle}</h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">{t.howSubtitle}</p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="space-y-8">
          {content.steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={i} className="flex gap-6 items-start group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${step.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{step.number}</span>
                    <h3 className="font-bold text-lg">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-emerald-50 border-y border-emerald-200 py-12 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-2xl font-black mb-3 text-emerald-900">{content.freeTitle}</h2>
          <p className="text-emerald-800 text-sm leading-relaxed max-w-lg mx-auto">{content.freeDesc}</p>
        </div>
      </section>

      <section className="py-16 px-4 max-w-3xl mx-auto">
        <h2 className="text-2xl font-black mb-8 text-center">{content.faqTitle}</h2>
        <div className="space-y-4">
          {content.faqs.map((f, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5">
              <p className="font-semibold text-sm mb-2">{f.q}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/therapists" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            <Search className="w-4 h-4" /> {content.cta}
          </Link>
          <Link to="/quiz" className="inline-flex items-center justify-center gap-2 border border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-accent transition-colors">
            {content.ctaQuiz}
          </Link>
        </div>
      </section>
    </div>
  );
}