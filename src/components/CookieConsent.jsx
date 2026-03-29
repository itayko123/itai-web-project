import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 bg-white border border-border rounded-2xl shadow-xl p-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 mt-0.5">
          <Cookie className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground mb-1">האתר משתמש בעוגיות</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            אנחנו משתמשים בעוגיות חיוניות לתפעול האתר.{" "}
            <Link to="/cookies" className="text-primary underline hover:text-primary/80">
              למדיניות העוגיות
            </Link>
          </p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={accept} className="text-xs h-8 px-4">
              אישור
            </Button>
            <Button size="sm" variant="outline" onClick={decline} className="text-xs h-8 px-4">
              דחייה
            </Button>
          </div>
        </div>
        <button 
          onClick={decline} 
          aria-label="סגור הודעת עוגיות"
          className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}