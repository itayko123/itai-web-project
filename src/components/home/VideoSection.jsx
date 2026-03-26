import { Play, Pause, Volume2, VolumeX, Maximize2, RefreshCw } from "lucide-react";
import { useState, useRef } from "react";

const STEPS = [
  { num: "01", title: "מלא/י שאלון קצר", desc: "ספר/י לנו מה אתה מחפש – בלי להתחייב" },
  { num: "02", title: "קבל/י התאמה אישית", desc: "המערכת מתאימה לך מטפלים מתאימים" },
  { num: "03", title: "צור/י קשר ישיר", desc: "פנה/י למטפל שבחרת ותאם/י פגישה" },
];

export default function VideoSection() {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ended, setEnded] = useState(false);
  const videoRef = useRef(null);

  const toggle = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
      setEnded(false);
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
  };

  const handleEnded = () => {
    setPlaying(false);
    setEnded(true);
  };

  const replay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setPlaying(true);
    setEnded(false);
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary/5 via-accent/20 to-background">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-4">
            איך זה עובד?
          </span>
          <h2 className="text-2xl md:text-3xl font-black mb-3">מצאו את המטפל המתאים לכם – בדקות</h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: '#374151' }}>
            צפו בהדגמה קצרה של הפלטפורמה וגלו כמה פשוט למצוא עזרה מקצועית
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 items-start">
          {/* Video Player */}
          <div className="md:col-span-3">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 group" style={{ aspectRatio: "16/9" }}>
              {/* Video Element — replace src with your screen recording */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                muted
                playsInline
                onEnded={handleEnded}
                title="הדגמת פלטפורמת מצא לי מטפל"
                poster="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1200&q=85"
              >
                {/* Replace this with your actual video file */}
                <source src="/demo-video.mp4" type="video/mp4" />
              </video>

              {/* Overlay when paused / not started */}
              {!playing && !ended && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/35 cursor-pointer"
                  onClick={toggle}
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-primary fill-primary mr-[-3px]" />
                  </div>
                  <div className="absolute bottom-5 right-5 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg font-medium">
                    ▶ הדגמת הפלטפורמה
                  </div>
                </div>
              )}

              {/* Ended overlay */}
              {ended && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 cursor-pointer" onClick={replay}>
                  <div className="text-center text-white">
                    <RefreshCw className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-sm font-semibold">צפה שוב</p>
                  </div>
                </div>
              )}

              {/* Controls bar */}
              <div className={`absolute bottom-0 left-0 right-0 flex items-center gap-2 px-4 py-3 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300 ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-0"}`}>
                <button onClick={toggle} className="text-white hover:text-primary transition-colors">
                  {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button onClick={toggleMute} className="text-white hover:text-primary transition-colors">
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="flex-1" />
                <button onClick={handleFullscreen} className="text-white hover:text-primary transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Caption */}
            <p className="text-center text-xs mt-3" style={{ color: '#374151' }}>
              סרטון הדגמה שקט • משך: כ-90 שניות
            </p>
          </div>

          {/* Steps */}
          <div className="md:col-span-2 space-y-5 pt-2">
            {STEPS.map((s, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary font-black text-sm flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                  {s.num}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{s.title}</h3>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#374151' }}>{s.desc}</p>
                </div>
              </div>
            ))}

            <div className="mt-6 p-4 bg-card border border-border rounded-2xl">
              <p className="text-xs text-center mb-3 font-medium" style={{ color: '#374151' }}>בחינם לחלוטין למטופלים</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { v: "500+", l: "מטפלים" },
                  { v: "2 דק'", l: "לשאלון" },
                  { v: "100%", l: "חינמי" },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-lg font-black text-primary">{s.v}</div>
                    <div className="text-xs" style={{ color: '#374151' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}