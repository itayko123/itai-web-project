import { Link, useLocation } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const links = [
    { to: "/", label: t.navHome },
    { to: "/therapists", label: t.navSearch },
    { to: "/quiz", label: t.navQuiz },
    { to: "/articles", label: t.arcarticles}, // השורה החדשה שנוספה
    { to: "/faq", label: t.navFaq },
    { to: "/contact", label: t.navContact },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary" aria-label="מצא לי מטפל - דף הבית">
          <Heart className="w-5 h-5 fill-primary" aria-hidden="true" />
          <span>מצא לי מטפל</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === l.to
                  ? "bg-accent text-accent-foreground"
                  : "hover:text-foreground hover:bg-muted"
              }`}
              style={location.pathname !== l.to ? { color: '#111827' } : {}}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <LanguageSwitcher />
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setOpen(!open)}
          aria-label={open ? "סגור תפריט" : "פתח תפריט"}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          {open ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="md:hidden border-t border-border bg-white px-4 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted"
            >
              {l.label}
            </Link>
          ))}
          <div className="px-4 py-2.5">
            <LanguageSwitcher />
          </div>
        </div>
      )}
    </header>
  );
}