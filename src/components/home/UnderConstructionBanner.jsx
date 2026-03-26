import { Construction, X } from "lucide-react";
import { useState } from "react";

export default function UnderConstructionBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="px-4 py-2.5 flex items-center justify-between gap-3 relative z-50" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
      <div className="flex items-center gap-2 flex-1 justify-center text-sm font-semibold">
        <Construction className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span>
          האתר נמצא בתהליכי הקמה ועדיין אינו פועל במלוא כושרו.
          <span className="font-normal mr-1 text-xs hidden sm:inline">חלק מהתכנים ייתכן שאינם מלאים.</span>
        </span>
      </div>
      <button onClick={() => setDismissed(true)} aria-label="סגור" className="flex-shrink-0 hover:opacity-70" style={{ color: '#92400e' }}>
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}