import { Link } from "react-router-dom";
import { Heart, Phone, Shield } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-foreground text-background mt-20">
      {/* Free service banner */}
      <div className="bg-emerald-700 py-4 px-4 text-center">
        <p className="text-white font-bold text-sm md:text-base">
          {t.free}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-3">
              <Heart className="w-4 h-4 fill-current" aria-hidden="true" />
              <span>מצא לי מטפל</span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#ffffff' }}>
              {t.footerDesc || "פלטפורמה בטוחה ומאומתת לחיבור עם אנשי מקצוע בתחום בריאות הנפש בישראל."}
            </p>
            <div className="bg-white/10 rounded-xl p-3 text-xs leading-relaxed" style={{ color: '#ffffff' }}>
              <Shield className="w-4 h-4 inline-block ml-1" aria-hidden="true" />
              {t.footerVerified || "כל המטפלים עוברים אימות רישיון לפני פרסום הפרופיל."}
            </div>
          </div>

          {/* Quick links - patients */}
          <div>
            <div className="font-semibold mb-3 text-sm">{t.footerForPatients || "למטופלים"}</div>
            <ul className="space-y-2 text-sm" style={{ color: '#ffffff' }}>
              <li><Link to="/therapists" className="hover:text-emerald-300 transition-colors">{t.navSearch}</Link></li>
              <li><Link to="/quiz" className="hover:text-emerald-300 transition-colors">{t.navQuiz}</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-300 transition-colors">{t.navHowItWorks}</Link></li>
              <li><Link to="/articles" className="hover:text-emerald-300 transition-colors">{t.navArticles}</Link></li>
              <li><Link to="/faq" className="hover:text-emerald-300 transition-colors">{t.navFaq}</Link></li>
            </ul>
          </div>

          {/* Therapist links */}
          <div>
            <div className="font-semibold mb-3 text-sm">{t.footerForTherapists || "למטפלים"}</div>
            <ul className="space-y-2 text-sm" style={{ color: '#ffffff' }}>
              <li><Link to="/register-therapist" className="hover:text-emerald-300 transition-colors">{t.navJoin}</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-300 transition-colors">{t.navContact}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <div className="font-semibold mb-3 text-sm">{t.footerLegal || "מידע משפטי"}</div>
            <ul className="space-y-2 text-sm" style={{ color: '#ffffff' }}>
              <li><Link to="/contact" className="hover:text-emerald-300 transition-colors">{t.navContact}</Link></li>
              <li><Link to="/faq" className="hover:text-emerald-300 transition-colors">{t.navFaq}</Link></li>
              <li><Link to="/privacy" className="hover:text-emerald-300 transition-colors">{t.privacyTitle}</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-300 transition-colors">{t.termsTitle}</Link></li>
              <li><Link to="/support-declaration" className="hover:text-emerald-300 transition-colors">{t.supportTitle}</Link></li>
              <li><Link to="/accessibility" className="hover:text-emerald-300 transition-colors">{t.accessibilityTitle}</Link></li>
              <li><Link to="/cookies" className="hover:text-emerald-300 transition-colors">מדיניות עוגיות</Link></li>
            </ul>
          </div>
        </div>

        {/* Emergency + copyright */}
        <div className="border-t border-white/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs" style={{ color: '#ffffff' }}>{t.footerCopyright || "© 2026 מצא לי מטפל. כל הזכויות שמורות."}</p>
            <p className="text-xs mt-1" style={{ color: '#e5e7eb' }}>{t.footerDisclaimer || "הפלטפורמה אינה מספקת ייעוץ רפואי. לעזרה דחופה התקשר/י ל-1201."}</p>
          </div>
          <a
            href="tel:1201"
            aria-label={t.footerEmergency || "עזרה נפשית ראשונה – 1201"}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>{t.footerEmergency || "עזרה נפשית ראשונה – 1201"}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}