import { Link } from "react-router-dom";
import { Heart, Shield, Phone, Users, Eye, Lock } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const getContent = (lang) => {
  if (lang === "en") return {
    title: "User Support Declaration",
    subtitle: "We are committed to providing you with a safe, respectful and trustworthy experience. Here are our commitments to you.",
    commitments: [
      { icon: Heart, title: "We Are With You", desc: "We believe every person deserves accessible, respectful and reliable mental health help. We are here to ease your journey." },
      { icon: Shield, title: "We Protect Your Privacy", desc: "Every inquiry you make is kept in strict confidence. We do not share your details with external parties without your explicit consent." },
      { icon: Eye, title: "We Are Transparent", desc: "We display prices, treatment methods, and verified reviews – so you can make an informed decision, without surprises." },
      { icon: Users, title: "Everyone Is Welcome", desc: "The platform is open to everyone, regardless of age, gender, sexual orientation, origin, or economic background. We care about accessibility and equality." },
      { icon: Lock, title: "We Verify", desc: "Every therapist undergoes professional license verification before appearing on the platform. We do not publish unverified therapists." },
      { icon: Phone, title: "Always Here to Listen", desc: "Have a question? Concern? Feedback? We respond to every inquiry within 48 hours." },
    ],
    importantTitle: "⚠️ Important Declaration",
    importantBody: [
      'The "Find My Therapist" platform is a directory and referral service only. We connect patients with professionals, but do not provide medical advice, diagnosis, or treatment.',
      'The platform is not responsible for the quality of treatment, the therapeutic process, treatment results, or any matter related to the therapeutic relationship between the therapist and patient.',
      'Therapists are independent and responsible for their treatment in accordance with law and professional ethics.',
    ],
    emergencyTitle: "Mental Health Emergency?",
    emergencyDesc: "If you or someone you know is in an acute mental health crisis – don't hesitate to reach out immediately:",
    emergencyBtn: "1201 – Mental Health First Aid",
    contactText: "Questions and inquiries:",
    contactLink: "Contact Us",
  };

  if (lang === "ru") return {
    title: "Декларация поддержки пользователей",
    subtitle: "Мы обязуемся предоставить вам безопасный, уважительный и надёжный опыт. Вот наши обязательства перед вами.",
    commitments: [
      { icon: Heart, title: "Мы рядом с вами", desc: "Мы верим, что каждый человек заслуживает доступной, уважительной и надёжной психологической помощи. Мы здесь, чтобы облегчить ваш путь." },
      { icon: Shield, title: "Мы защищаем вашу конфиденциальность", desc: "Каждое ваше обращение хранится в строгой конфиденциальности. Мы не передаём ваши данные внешним сторонам без вашего явного согласия." },
      { icon: Eye, title: "Мы прозрачны", desc: "Мы отображаем цены, методы лечения и проверенные отзывы – чтобы вы могли принять обоснованное решение без сюрпризов." },
      { icon: Users, title: "Добро пожаловать всем", desc: "Платформа открыта для всех, независимо от возраста, пола, сексуальной ориентации, происхождения или экономического положения." },
      { icon: Lock, title: "Мы проверяем", desc: "Каждый терапевт проходит проверку профессиональной лицензии перед появлением на платформе. Непроверенные терапевты не публикуются." },
      { icon: Phone, title: "Всегда здесь, чтобы слушать", desc: "Есть вопрос? Беспокойство? Отзыв? Мы отвечаем на каждый запрос в течение 48 часов." },
    ],
    importantTitle: "⚠️ Важное заявление",
    importantBody: [
      'Платформа "Find My Therapist" является только справочно-направляющим сервисом. Мы соединяем пациентов со специалистами, но не предоставляем медицинских советов, диагнозов или лечения.',
      'Платформа не несёт ответственности за качество лечения, терапевтический процесс или любые вопросы, связанные с терапевтическими отношениями.',
      'Терапевты являются независимыми специалистами и несут ответственность за своё лечение в соответствии с законом и профессиональной этикой.',
    ],
    emergencyTitle: "Психическая помощь срочно?",
    emergencyDesc: "Если вы или кто-то из ваших знакомых находится в остром психическом кризисе – не стесняйтесь обратиться немедленно:",
    emergencyBtn: "1201 – Первая психологическая помощь",
    contactText: "Вопросы и обращения:",
    contactLink: "Связаться с нами",
  };

  return {
    title: "הצהרת תמיכה בגולשים",
    subtitle: "אנחנו מתחייבים לספק לך חוויה בטוחה, מכבדת ואמינה. הנה ההתחייבויות שלנו אליך.",
    commitments: [
      { icon: Heart, title: "אנחנו לצדך", desc: "אנחנו מאמינים שכל אדם זכאי לקבל עזרה נפשית נגישה, מכבדת ואמינה. אנחנו כאן כדי להקל על המסע שלך." },
      { icon: Shield, title: "אנחנו שומרים על הפרטיות שלך", desc: "כל פנייה שלך נשמרת בסודיות מלאה. אנחנו לא חולקים את פרטיך עם גורמים חיצוניים ללא הסכמתך המפורשת." },
      { icon: Eye, title: "אנחנו שקופים", desc: "אנחנו מציגים מחירים, שיטות טיפול, וביקורות מאומתות – כדי שתוכל/י לקבל החלטה מושכלת, בלי הפתעות." },
      { icon: Users, title: "כולם מוזמנים", desc: "הפלטפורמה פתוחה לכולם, ללא קשר לגיל, מגדר, נטייה מינית, מוצא או רקע כלכלי. אנחנו דואגים לנגישות ולשוויון." },
      { icon: Lock, title: "אנחנו מאמתים", desc: "כל מטפל עובר אימות רישיון מקצועי לפני שמופיע בפלטפורמה. אנחנו לא מפרסמים מטפלים לא מאומתים." },
      { icon: Phone, title: "תמיד כאן לשמוע", desc: "יש לך שאלה? דאגה? משוב? אנחנו מגיבים לכל פנייה בתוך 48 שעות." },
    ],
    importantTitle: "⚠️ הצהרה חשובה",
    importantBody: [
      'פלטפורמת "מצא לי מטפל" היא שירות ספריה והפניה בלבד. אנחנו מחברים בין מטופלים לאנשי מקצוע, אך אינו מספקים ייעוץ רפואי, אבחון, או טיפול.',
      'הפלטפורמה אינה אחראית לאיכות הטיפול, לתהליך הטיפולי, לתוצאות הטיפול, או לכל עניין הקשור לקשר הטיפולי בין המטפל למטופל.',
      'המטפלים הם עצמאיים ואחראים לטיפולם בהתאם לחוק ולאתיקה המקצועית.',
    ],
    emergencyTitle: "במצב חירום נפשי?",
    emergencyDesc: "אם אתה/את או מישהו שאתה/את מכיר/ה נמצאים במשבר נפשי חריף – אל תהסס/י לפנות מיד:",
    emergencyBtn: "1201 – עזרה נפשית ראשונה",
    contactText: "לשאלות ופניות:",
    contactLink: "צור קשר",
  };
};

export default function SupportDeclarationPage() {
  const { lang } = useLanguage();
  const c = getContent(lang);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-teal-50 to-sky-50 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 rounded-2xl mb-6">
            <Heart className="w-7 h-7 text-primary fill-primary/20" />
          </div>
          <h1 className="text-4xl font-black mb-4">{c.title}</h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">{c.subtitle}</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {c.commitments.map((com, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 flex gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <com.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold mb-1">{com.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{com.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-amber-50 border-y border-amber-200 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-black mb-4 text-amber-900">{c.importantTitle}</h2>
          <div className="space-y-3 text-sm text-amber-800 leading-relaxed">
            {c.importantBody.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />)}
          </div>
        </div>
      </section>

      <section className="py-12 px-4 text-center max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <h3 className="font-bold text-red-900 mb-2">{c.emergencyTitle}</h3>
          <p className="text-sm text-red-700 mb-4">{c.emergencyDesc}</p>
          <a href="tel:1201" className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors">
            <Phone className="w-4 h-4" /> {c.emergencyBtn}
          </a>
        </div>
        <p className="text-sm text-muted-foreground mt-6">
          {c.contactText} <Link to="/contact" className="text-primary hover:underline">{c.contactLink}</Link>
        </p>
      </section>
    </div>
  );
}