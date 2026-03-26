import { useState, useEffect } from "react";
import {
  Accessibility, ZoomIn, ZoomOut, RotateCcw,
  Eye, Type, Link as LinkIcon, MousePointer2,
  Brain, Zap, BookOpen, Keyboard, Focus
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

const DEFAULT_STATE = {
  fontSize: 100,
  highContrast: false,
  invertColors: false,
  grayscale: false,
  readableFont: false,
  highlightLinks: false,
  largeCursor: false,
  stopAnimations: false,
  focusHighlight: false,
  lineSpacing: false,
  seizureSafe: false,
  adhdFriendly: false,
};

const PROFILES = {
  seizureSafe: { seizureSafe: true, stopAnimations: true, invertColors: false, highContrast: false },
  visionImpaired: { highContrast: true, fontSize: 130, readableFont: true, focusHighlight: true },
  cognitive: { readableFont: true, lineSpacing: true, adhdFriendly: true, focusHighlight: true, fontSize: 110 },
  adhd: { adhdFriendly: true, focusHighlight: true, stopAnimations: true, lineSpacing: true },
  keyboard: { focusHighlight: true },
};

export default function AccessibilityMenu() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(DEFAULT_STATE);

  const apply = (next) => {
    document.documentElement.style.fontSize = `${next.fontSize}%`;
    const cl = document.documentElement.classList;
    cl.toggle("a11y-high-contrast", next.highContrast);
    cl.toggle("a11y-invert", next.invertColors);
    cl.toggle("a11y-grayscale", next.grayscale);
    cl.toggle("a11y-readable-font", next.readableFont);
    cl.toggle("underline-links", next.highlightLinks);
    cl.toggle("a11y-large-cursor", next.largeCursor);
    cl.toggle("a11y-stop-animations", next.stopAnimations);
    cl.toggle("a11y-focus-highlight", next.focusHighlight);
    cl.toggle("a11y-line-spacing", next.lineSpacing);
    cl.toggle("a11y-seizure-safe", next.seizureSafe);
    cl.toggle("a11y-adhd", next.adhdFriendly);
  };

  const update = (patch) => {
    setState(prev => {
      const next = { ...prev, ...patch };
      apply(next);
      return next;
    });
  };

  const applyProfile = (profileKey) => {
    const next = { ...DEFAULT_STATE, ...PROFILES[profileKey] };
    apply(next);
    setState(next);
  };

  const resetAll = () => {
    apply(DEFAULT_STATE);
    setState(DEFAULT_STATE);
    document.documentElement.style.fontSize = "";
  };

  useEffect(() => {
    if (document.getElementById("a11y-styles")) return;
    const style = document.createElement("style");
    style.id = "a11y-styles";
    style.innerHTML = `
      .a11y-high-contrast { filter: contrast(1.8) brightness(1.1); }
      .a11y-invert { filter: invert(1) hue-rotate(180deg); }
      .a11y-grayscale { filter: grayscale(1); }
      .a11y-high-contrast.a11y-grayscale { filter: contrast(1.8) brightness(1.1) grayscale(1); }
      .a11y-readable-font * { font-family: Arial, Helvetica, sans-serif !important; letter-spacing: 0.05em !important; word-spacing: 0.1em !important; }
      .a11y-line-spacing * { line-height: 1.9 !important; }
      .a11y-large-cursor, .a11y-large-cursor * { cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M8 4 L8 34 L16 26 L20 36 L25 34 L21 24 L31 24 Z' fill='black' stroke='white' stroke-width='2'/%3E%3C/svg%3E") 4 4, auto !important; }
      .a11y-stop-animations *, .a11y-stop-animations *::before, .a11y-stop-animations *::after { animation: none !important; transition: none !important; }
      .a11y-seizure-safe * { animation: none !important; transition: none !important; }
      .a11y-seizure-safe video, .a11y-seizure-safe iframe { filter: grayscale(0.5); }
      .a11y-focus-highlight *:focus { outline: 4px solid #2563eb !important; outline-offset: 3px !important; box-shadow: 0 0 0 6px rgba(37,99,235,0.3) !important; }
      .a11y-adhd { background-color: #fffef7 !important; }
      .a11y-adhd p, .a11y-adhd li { max-width: 70ch; }
      .underline-links a { text-decoration: underline !important; text-decoration-thickness: 2px !important; }
    `;
    document.head.appendChild(style);
  }, []);

  const Toggle = ({ active, onClick, icon: IconComp, label }) => (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-sm"
          : "border-border text-foreground hover:bg-muted"
      }`}
    >
      <IconComp className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1 text-right text-xs">{label}</span>
      <span className={`text-xs px-1.5 py-0.5 rounded-md flex-shrink-0 ${active ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>
        {active ? t.a11yOn : t.a11yOff}
      </span>
    </button>
  );

  const ProfileBtn = ({ label, profileKey, icon: IconComp }) => (
    <button
      onClick={() => applyProfile(profileKey)}
      className="flex flex-col items-center gap-1 p-2 rounded-xl border border-border hover:border-primary hover:bg-accent text-xs text-center transition-all"
    >
      <IconComp className="w-4 h-4 text-primary" />
      <span className="text-xs leading-tight">{label}</span>
    </button>
  );

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label={t.a11yAriaLabel}
        aria-expanded={open}
        title={t.a11yAriaLabel}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-200"
      >
        <Accessibility className="w-6 h-6" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.a11yAriaDialog}
          className="fixed bottom-24 left-6 z-50 bg-white border border-border rounded-2xl shadow-2xl w-80 max-h-[80vh] overflow-y-auto overscroll-contain"
        >
          {/* Header */}
          <div className="bg-primary px-4 py-3 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <Accessibility className="w-4 h-4 text-primary-foreground" />
              <h2 className="font-bold text-sm text-primary-foreground">{t.a11yMenuTitle}</h2>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label={t.a11yClose}
              className="text-primary-foreground/70 hover:text-primary-foreground text-lg leading-none"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Quick Profiles */}
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-2">{t.a11yQuickProfiles}</p>
              <div className="grid grid-cols-3 gap-1.5">
                <ProfileBtn label={t.a11ySeizureSafe} profileKey="seizureSafe" icon={Zap} />
                <ProfileBtn label={t.a11yVisionImpaired} profileKey="visionImpaired" icon={Eye} />
                <ProfileBtn label={t.a11yCognitive} profileKey="cognitive" icon={Brain} />
                <ProfileBtn label={t.a11yAdhd} profileKey="adhd" icon={Focus} />
                <ProfileBtn label={t.a11yKeyboard} profileKey="keyboard" icon={Keyboard} />
                <button
                  onClick={resetAll}
                  className="flex flex-col items-center gap-1 p-2 rounded-xl border border-border hover:border-destructive hover:bg-red-50 text-xs text-center transition-all"
                >
                  <RotateCcw className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs">{t.a11yReset}</span>
                </button>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Font Size */}
            <div className="bg-muted/50 rounded-xl p-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">{t.a11yFontSize} ({state.fontSize}%)</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => update({ fontSize: Math.max(80, state.fontSize - 10) })}
                  disabled={state.fontSize <= 80}
                  aria-label={t.a11yDecreaseLabel}
                  className="flex-1 flex items-center justify-center gap-1 border border-border bg-white rounded-lg py-2 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-40"
                >
                  <ZoomOut className="w-3.5 h-3.5" /> {t.a11yDecrease}
                </button>
                <div className="text-sm font-black text-primary w-12 text-center">{state.fontSize}%</div>
                <button
                  onClick={() => update({ fontSize: Math.min(200, state.fontSize + 10) })}
                  disabled={state.fontSize >= 200}
                  aria-label={t.a11yIncreaseLabel}
                  className="flex-1 flex items-center justify-center gap-1 border border-border bg-white rounded-lg py-2 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-40"
                >
                  <ZoomIn className="w-3.5 h-3.5" /> {t.a11yIncrease}
                </button>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Visual */}
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-2">{t.a11yDisplay}</p>
              <div className="space-y-1.5">
                <Toggle active={state.highContrast} onClick={() => update({ highContrast: !state.highContrast })} icon={Eye} label={t.a11yHighContrast} />
                <Toggle active={state.invertColors} onClick={() => update({ invertColors: !state.invertColors })} icon={Eye} label={t.a11yInvertColors} />
                <Toggle active={state.grayscale} onClick={() => update({ grayscale: !state.grayscale })} icon={Eye} label={t.a11yGrayscale} />
                <Toggle active={state.seizureSafe} onClick={() => update({ seizureSafe: !state.seizureSafe })} icon={Zap} label={t.a11ySeizureSafeMode} />
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Reading */}
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-2">{t.a11yReading}</p>
              <div className="space-y-1.5">
                <Toggle active={state.readableFont} onClick={() => update({ readableFont: !state.readableFont })} icon={Type} label={t.a11yReadableFont} />
                <Toggle active={state.lineSpacing} onClick={() => update({ lineSpacing: !state.lineSpacing })} icon={BookOpen} label={t.a11yLineSpacing} />
                <Toggle active={state.highlightLinks} onClick={() => update({ highlightLinks: !state.highlightLinks })} icon={LinkIcon} label={t.a11yHighlightLinks} />
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Navigation & Motor */}
            <div>
              <p className="text-xs font-bold text-muted-foreground mb-2">{t.a11yNavMotor}</p>
              <div className="space-y-1.5">
                <Toggle active={state.largeCursor} onClick={() => update({ largeCursor: !state.largeCursor })} icon={MousePointer2} label={t.a11yLargeCursor} />
                <Toggle active={state.focusHighlight} onClick={() => update({ focusHighlight: !state.focusHighlight })} icon={Keyboard} label={t.a11yFocusHighlight} />
                <Toggle active={state.stopAnimations} onClick={() => update({ stopAnimations: !state.stopAnimations })} icon={Zap} label={t.a11yStopAnimations} />
                <Toggle active={state.adhdFriendly} onClick={() => update({ adhdFriendly: !state.adhdFriendly })} icon={Brain} label={t.a11yAdhdFriendly} />
              </div>
            </div>

            <button
              onClick={resetAll}
              className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground border border-border rounded-xl py-2.5 transition-colors hover:bg-muted"
            >
              <RotateCcw className="w-3.5 h-3.5" /> {t.a11yResetAll}
            </button>
          </div>

          <div className="px-4 pb-3 text-center">
            <p className="text-xs text-muted-foreground">{t.a11yWcag}</p>
          </div>
        </div>
      )}
    </>
  );
}