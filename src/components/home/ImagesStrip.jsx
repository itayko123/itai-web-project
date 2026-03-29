const images = [
{
  // 1. הורדתי את ה-w ל-400 (מתאים בדיוק למובייל וחוסך המון משקל)
  src: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee8?w=400&q=75&fm=webp",
  alt: "שיחה אישית",
  // 2. תיקון תחביר: באובייקט משתמשים בנקודתיים (:) ולא בסימן שווה (=)
  // וב-React כותבים ב-CamelCase (P גדולה)
  fetchPriority: "high", 
  caption: "סביבה בטוחה ומכבדת",
  tag: "פנים אל פנים"
},
  {
    src: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=75&fm=webp",
    alt: "טיפול מרחוק",
    caption: "טיפול נוח מהבית",
    tag: "זום / טלפון"
  },
  {
    src: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&q=75&fm=webp",
    alt: "מטפל מוסמך",
    caption: "מטפלים מאומתים ומוסמכים",
    tag: "אימות מקצועי"
  },
  {
    src: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=75&fm=webp",
    alt: "בריאות הנפש",
    caption: "הדרך לחיים טובים יותר",
    tag: "בריאות הנפש"
  },
];

export default function ImagesStrip() {
  return (
    <section className="py-10 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
        {images?.map((img, i) => (
          <div key={i} className="relative rounded-2xl overflow-hidden group cursor-pointer" style={{ aspectRatio: "4/5" }}>
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
              style={{ transition: "transform 0.5s ease" }}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            {/* Tag */}
            <div className="absolute top-3 right-3 bg-white/90 text-foreground text-xs font-semibold px-2.5 py-1 rounded-full shadow">
              {img.tag}
            </div>
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-sm font-semibold leading-tight">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}