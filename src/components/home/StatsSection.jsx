import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

function CountUp({ target, suffix, duration = 1800 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function StatsSection() {
  const { t } = useLanguage();

  const stats = [
    { target: 500, suffix: "+", label: t.statsVerified || "מטפלים מאומתים" },
    { target: 98, suffix: "%", label: t.statsSatisfaction || "שביעות רצון" },
    { target: 12000, suffix: "+", label: t.statsConnected || "מטופלים חוברו" },
    { target: 48, suffix: t.statsHoursSuffix || " שעות", label: t.statsWait || "ממוצע המתנה לפגישה ראשונה" },
  ];

  return (
    <section className="bg-primary py-14 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats?.map((s, i) => (
          <div key={i}>
            <p className="text-3xl md:text-4xl font-black text-primary-foreground">
              <CountUp target={s.target} suffix={s.suffix} duration={1800} />
            </p>
            <p className="text-sm mt-1" style={{ color: '#ffffff', fontWeight: '700', opacity: 1 }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}