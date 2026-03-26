import { Link } from "react-router-dom";
import { Star, MapPin, Video, Users, BadgeCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const professionLabels = {
  psychologist: "פסיכולוג/ית",
  psychiatrist: "פסיכיאטר/ית",
  psychotherapist: "פסיכותרפיסט/ית",
  social_worker: "עו\"ס קליני",
  counselor: "יועץ/ת",
};

const formatLabels = {
  in_person: "פנים אל פנים",
  zoom: "זום",
  phone: "טלפון",
};

export default function TherapistCard({ therapist, priority = false }) {
  const stars = Math.round(therapist.average_rating || 0);

  return (
    <Link to={`/therapist/${therapist.id}`} className="block group" aria-label={`פרופיל של ${therapist.full_name}`}>
      <article className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
        <div className="flex gap-4 p-5">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-accent">
              {therapist.photo_url ? (
                <img
                  src={therapist.photo_url}
                  alt={`תמונת פרופיל של ${therapist.full_name}`}
                  className="w-full h-full object-cover"
                  loading={priority ? "eager" : "lazy"}
                  decoding="async"
                  width={80}
                  height={80}
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary/40"
                  aria-label={`אות ראשונה של ${therapist.full_name}`}
                >
                  {therapist.full_name?.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {therapist.full_name}
                  </h3>
                  {therapist.license_verified && (
                    <BadgeCheck className="w-4 h-4 text-primary flex-shrink-0" role="img" aria-label="רישיון מאומת" />
                  )}
                </div>
                <p className="text-sm text-gray-900">{professionLabels[therapist.profession]}</p>
              </div>
              {therapist.immediate_availability && (
                <Badge className="bg-emerald-100 text-emerald-700 text-xs flex-shrink-0">
                  <Clock className="w-3 h-3 ml-1" aria-hidden="true" />
                  זמין עכשיו
                </Badge>
              )}
            </div>

            {/* Rating */}
            {therapist.review_count > 0 && (
              <div className="flex items-center gap-1 mt-1.5" role="img" aria-label={`דירוג ${therapist.average_rating} מתוך 5, ${therapist.review_count} ביקורות`}>
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i <= stars ? 'fill-amber-400 text-amber-400' : 'text-border'}`} aria-hidden="true" />
                ))}
                <span className="text-xs text-gray-900 mr-1">({therapist.review_count})</span>
              </div>
            )}

            {/* Location & Format */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {therapist.city && (
                <span className="flex items-center gap-1 text-xs text-gray-900">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  {therapist.city}
                </span>
              )}
              {therapist.formats?.map(f => (
                <span key={f} className="flex items-center gap-1 text-xs text-gray-900">
                  <Video className="w-3 h-3" aria-hidden="true" />
                  {formatLabels[f]}
                </span>
              ))}
            </div>

            {/* Price */}
            {therapist.price_per_session && (
              <div className="mt-2">
                <span className="text-sm font-semibold text-foreground">₪{therapist.price_per_session}</span>
                <span className="text-xs text-gray-900"> לפגישה</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}