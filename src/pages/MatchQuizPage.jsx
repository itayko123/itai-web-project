import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TherapistCard from "@/components/therapist/TherapistCard";
import { Sparkles, ArrowRight, Loader2, Heart, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const steps = [
  {
    key: "age_group",
    question: "עבור מי מחפשים טיפול?",
    subtitle: "נעזור לך למצוא מטפל המתמחה בקבוצת הגיל המתאימה",
    options: [
      { value: "child", label: "ילד/ה (עד גיל 12)", icon: "🧒" },
      { value: "teen", label: "מתבגר/ת (13–18)", icon: "🎒" },
      { value: "adult", label: "מבוגר/ת (19–65)", icon: "🧑" },
      { value: "elderly", label: "קשיש/ה (65+)", icon: "👴" },
    ],
  },
  {
    key: "concern",
    question: "מה מביא אותך לפנות לטיפול?",
    subtitle: "בחר/י את הנושא העיקרי – תוכל/י לפרט לאחר מכן",
    multi: true,
    options: [
      { value: "anxiety", label: "חרדה ולחץ", icon: "😰" },
      { value: "depression", label: "עצב ודיכאון", icon: "😔" },
      { value: "trauma", label: "טראומה / PTSD", icon: "🩹" },
      { value: "relationships", label: "קשיים בזוגיות", icon: "💔" },
      { value: "family", label: "קשיי משפחה / הורות", icon: "👨‍👩‍👧" },
      { value: "work_stress", label: "שחיקה בעבודה", icon: "💼" },
      { value: "adhd", label: "ADHD / קשיי ריכוז", icon: "🧠" },
      { value: "eating_disorder", label: "הפרעות אכילה", icon: "🥗" },
      { value: "grief", label: "אבל ואובדן", icon: "🕯️" },
      { value: "ocd", label: "OCD / מחשבות טורדניות", icon: "🔄" },
      { value: "phobia", label: "פוביות ופחדים", icon: "😱" },
      { value: "other", label: "נושא אחר", icon: "💬" },
    ],
  },
  {
    key: "severity",
    question: "באיזו עוצמה אתה/את חווה את הקושי?",
    subtitle: "זה עוזר לנו להבין את רמת הדחיפות",
    options: [
      { value: "mild", label: "קל – מפריע לתפקוד לעיתים", icon: "🌤️" },
      { value: "moderate", label: "בינוני – משפיע על היומיום", icon: "⛅" },
      { value: "severe", label: "חמור – משבש את תפקודי", icon: "🌧️" },
      { value: "crisis", label: "משבר – זקוק/ה לעזרה דחופה", icon: "🆘" },
    ],
  },
  {
    key: "previous_therapy",
    question: "האם היית בטיפול בעבר?",
    subtitle: "מידע זה עוזר לנו להתאים לך מטפל מתאים",
    options: [
      { value: "never", label: "מעולם לא הייתי בטיפול", icon: "🌱" },
      { value: "yes_positive", label: "כן, ובאופן חיובי", icon: "✅" },
      { value: "yes_mixed", label: "כן, עם תוצאות מעורבות", icon: "🤔" },
      { value: "yes_negative", label: "כן, ולא יצא טוב", icon: "❌" },
    ],
  },
  {
    key: "profession_preference",
    question: "איזה סוג מטפל/ת אתה/את מחפש/ת?",
    subtitle: "כל המקצועות הם מוסמכים ומאומתים בפלטפורמה",
    options: [
      { value: "psychologist", label: "פסיכולוג/ית", icon: "🎓" },
      { value: "psychiatrist", label: "פסיכיאטר/ית", icon: "💊" },
      { value: "psychotherapist", label: "פסיכותרפיסט/ית", icon: "🛋️" },
      { value: "social_worker", label: 'עו"ס קליני', icon: "🤝" },
      { value: "counselor", label: "יועץ/ת", icon: "💡" },
      { value: "no_preference", label: "לא משנה לי", icon: "🎯" },
    ],
  },
  {
    key: "treatment_approach",
    question: "האם יש גישה טיפולית שמעניינת אותך?",
    subtitle: "אם אינך בטוח/ה, בחר/י 'לא משנה'",
    options: [
      { value: "cbt", label: "CBT – קוגניטיבי-התנהגותי", icon: "🧩" },
      { value: "psychodynamic", label: "פסיכודינמי / פסיכואנליטי", icon: "🌊" },
      { value: "dbt", label: "DBT – רגשי דיאלקטי", icon: "⚖️" },
      { value: "somatic", label: "גופ-נפש / סומטי", icon: "🌿" },
      { value: "mindfulness_therapy", label: "מיינדפולנס ומדיטציה", icon: "🧘" },
      { value: "no_preference", label: "לא משנה לי", icon: "✨" },
    ],
  },
  {
    key: "preferred_gender",
    question: "האם יש העדפה למגדר המטפל?",
    options: [
      { value: "female", label: "מטפלת", icon: "👩" },
      { value: "male", label: "מטפל", icon: "👨" },
      { value: "no_preference", label: "אין העדפה", icon: "🤷" },
    ],
  },
  {
    key: "preferred_format",
    question: "איזה פורמט טיפול מתאים לך?",
    options: [
      { value: "in_person", label: "פנים אל פנים", icon: "🏥" },
      { value: "zoom", label: "מקוון (זום / וידאו)", icon: "💻" },
      { value: "phone", label: "שיחת טלפון", icon: "📞" },
      { value: "no_preference", label: "לא משנה לי", icon: "🎯" },
    ],
  },
  {
    key: "hmo",
    question: "מה קופת החולים / ביטוח שלך?",
    subtitle: "נחפש מטפלים שעובדים עם הקופה/ביטוח שלך",
    options: [
      { value: "maccabi", label: "מכבי", icon: "🏥" },
      { value: "clalit", label: "כללית", icon: "🏥" },
      { value: "meuhedet", label: "מאוחדת", icon: "🏥" },
      { value: "leumit", label: "לאומית", icon: "🏥" },
      { value: "insurance", label: "ביטוח פרטי", icon: "📋" },
      { value: "private", label: "עצמאי / לא משנה", icon: "💰" },
    ],
  },
  {
    key: "budget",
    question: "מהו התקציב שלך לפגישה?",
    subtitle: "המחירים הממוצעים בישראל הם ₪300–₪500",
    options: [
      { value: "200", label: "עד ₪200", icon: "💚" },
      { value: "350", label: "עד ₪350", icon: "💛" },
      { value: "500", label: "עד ₪500", icon: "🟠" },
      { value: "800", label: "עד ₪800 ומעלה", icon: "🔵" },
    ],
  },
  {
    key: "urgency",
    question: "מתי תרצה/י להתחיל?",
    options: [
      { value: "immediate", label: "בהקדם האפשרי – זקוק/ה לעזרה עכשיו", icon: "🚨" },
      { value: "within_week", label: "תוך שבוע", icon: "📅" },
      { value: "within_month", label: "תוך חודש", icon: "🗓️" },
      { value: "flexible", label: "גמיש/ה", icon: "☺️" },
    ],
  },
  {
    key: "city",
    question: "באיזו עיר אתה/את מחפש/ת?",
    subtitle: "רלוונטי לטיפול פנים אל פנים",
    freeText: true,
    placeholder: "הקלד/י שם עיר...",
    skipLabel: "לא רלוונטי / מקוון בלבד",
  },
];

export default function MatchQuizPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [multiSelected, setMultiSelected] = useState([]);
  const [textValue, setTextValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const currentStep = steps[step];
  const progress = (step / steps.length) * 100;

  const handleSelect = async (value) => {
    if (currentStep.multi) {
      setMultiSelected(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
      return;
    }
    advanceStep({ [currentStep.key]: value });
  };

  const handleMultiNext = () => {
    if (multiSelected.length === 0) return;
    advanceStep({ [currentStep.key]: multiSelected.join(",") });
    setMultiSelected([]);
  };

  const handleTextNext = (val) => {
    advanceStep({ [currentStep.key]: val || "not_specified" });
    setTextValue("");
  };

  const advanceStep = async (patch) => {
    const newAnswers = { ...answers, ...patch };
    setAnswers(newAnswers);
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      await findMatches(newAnswers);
    }
  };

  const findMatches = async (ans) => {
    setLoading(true);
    const { data: allTherapists, error: therapistsError } = await supabase
      .from("Therapist")
      .select("*")
      .eq("status", "approved")
      .order("average_rating", { ascending: false })
      .limit(100);
    if (therapistsError) throw therapistsError;

    const budget = parseInt(ans.budget) || 800;
    const concern = ans.concern ? ans.concern.split(",") : [];

    let scored = (allTherapists || []).map(t => {
      let score = 0;
      if (ans.preferred_gender !== "no_preference" && t.gender === ans.preferred_gender) score += 3;
      if (ans.preferred_format !== "no_preference" && t.formats?.includes(ans.preferred_format)) score += 2;
      if (ans.hmo !== "private" && ans.hmo !== "insurance" && t.hmo_affiliation?.includes(ans.hmo)) score += 2;
      if (ans.urgency === "immediate" && t.immediate_availability) score += 4;
      if (ans.profession_preference !== "no_preference" && t.profession === ans.profession_preference) score += 3;
      concern.forEach(c => { if (t.specializations?.includes(c)) score += 4; });
      if (t.treatment_types?.includes(ans.treatment_approach)) score += 2;
      if (t.license_verified) score += 1;
      if (t.price_per_session && t.price_per_session <= budget) score += 1;
      else if (t.price_per_session && t.price_per_session > budget) score -= 2;
      if (ans.city && t.city === ans.city) score += 2;
      if (ans.urgency === "immediate" && !t.immediate_availability) score -= 3;
      if (ans.age_group === "child" && t.specializations?.some(s => ["children", "child_therapy", "developmental"].includes(s))) score += 3;
      if (ans.severity === "crisis" && t.immediate_availability) score += 3;
      score += (t.average_rating || 0) * 0.5;
      return { ...t, _score: score };
    });

    scored.sort((a, b) => b._score - a._score);
    const top = scored.slice(0, 5);

    const { error: quizError } = await supabase.from("MatchQuiz").insert({
      concern: ans.concern,
      preferred_gender: ans.preferred_gender,
      preferred_format: ans.preferred_format,
      budget: parseInt(ans.budget) || 0,
      city: ans.city,
      hmo: ans.hmo,
      urgency: ans.urgency,
      age_group: ans.age_group,
      recommended_therapist_ids: (top || []).map(t => t.id),
    });
    if (quizError) throw quizError;

    setResults(top);
    setLoading(false);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-primary" />
      </div>
      <div className="text-center">
        <p className="font-bold text-lg text-foreground">{t.quizLoading}</p>
        <p className="text-muted-foreground text-sm mt-1">{t.quizLoadingSubtitle}</p>
      </div>
    </div>
  );

  if (results) return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-black mb-2">{t.quizResults}</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">{t.quizResultsSubtitle}</p>
        <div className="flex gap-2 justify-center flex-wrap mt-3">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
            {t.quizFreeService}
          </div>
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-full">
            {t.quizInfoDisclaimer}
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {(results || []).map((t, i) => (
          <div key={t.id} className="relative">
            {i === 0 && (
              <div className="absolute -top-2 -right-2 z-10 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {t.quizBestMatch}
              </div>
            )}
            <TherapistCard therapist={t} />
          </div>
        ))}
      </div>
      <div className="text-center mt-8 space-y-3">
        <Button variant="outline" onClick={() => { setStep(0); setAnswers({}); setResults(null); setMultiSelected([]); }}>
          {t.quizRestart}
        </Button>
        <div>
          <Button asChild variant="ghost" className="text-sm text-muted-foreground">
            <a href="/therapists">{t.quizViewAll}</a>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
          <Heart className="w-3.5 h-3.5 text-primary" />
          {t.quizTitle}
        </div>
        <p className="text-xs text-muted-foreground">{steps.length} {t.quizSubtitle}</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>{t.quizProgress.replace("{current}", step + 1).replace("{total}", steps.length)}</span>
          <span className="font-semibold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
        >
          <h2 className="text-xl font-black mb-1 text-center">{currentStep.question}</h2>
          {currentStep.subtitle && (
            <p className="text-sm text-muted-foreground text-center mb-5">{currentStep.subtitle}</p>
          )}
          {!currentStep.subtitle && <div className="mb-5" />}

          {/* Free text input */}
          {currentStep.freeText ? (
            <div className="space-y-3">
              <Input
                value={textValue}
                onChange={e => setTextValue(e.target.value)}
                placeholder={currentStep.placeholder}
                className="h-12 text-center"
                onKeyDown={e => { if (e.key === "Enter" && textValue.trim()) handleTextNext(textValue.trim()); }}
              />
              <Button onClick={() => handleTextNext(textValue.trim())} disabled={!textValue.trim()} className="w-full h-12 font-semibold">
                {t.quizNext}
              </Button>
              <button onClick={() => handleTextNext("")} className="w-full text-sm text-muted-foreground hover:text-foreground py-2">
                {currentStep.skipLabel || t.quizSkip}
              </button>
            </div>
          ) : (
            /* Options grid */
            <div className="grid grid-cols-2 gap-2.5">
              {currentStep.options.map(opt => {
                const isSelected = currentStep.multi ? multiSelected.includes(opt.value) : false;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`text-right px-4 py-3.5 rounded-xl border transition-all font-medium text-sm flex items-center gap-2 ${
                      isSelected
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                        : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{opt.icon}</span>
                    <span className="flex-1 text-xs leading-snug">{opt.label}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* Multi-select next button */}
          {currentStep.multi && multiSelected.length > 0 && (
            <Button onClick={handleMultiNext} className="w-full mt-4 font-semibold h-12">
              {t.quizNext} ({multiSelected.length} {t.selected})
            </Button>
          )}
        </motion.div>
      </AnimatePresence>

      {step > 0 && (
        <button
          onClick={() => { setStep(step - 1); setMultiSelected([]); }}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mt-6 mx-auto"
        >
          <ArrowRight className="w-4 h-4" />
          {t.quizBack}
        </button>
      )}
    </div>
  );
}