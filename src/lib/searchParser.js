import { ALL_SPECIALIZATIONS, ALL_TREATMENT_METHODS } from "./therapyOptions";
import { ISRAEL_LOCATIONS } from "./israelLocations";

// מילון המילים הנרדפות שלנו
const synonyms = {
  cities: {
    "תא": "תל אביב-יפו", "ת\"א": "תל אביב-יפו", "תל אביב יפו": "תל אביב-יפו", "תל-אביב": "תל אביב-יפו",
    "י-ם": "ירושלים", "ירושלים והסביבה": "ירושלים",
    "פת": "פתח תקווה", "פ\"ת": "פתח תקווה", "פתח-תקווה": "פתח תקווה",
    "ראשלצ": "ראשון לציון", "ראשל\"צ": "ראשון לציון", "ראשון": "ראשון לציון",
    "בש": "באר שבע", "ב\"ש": "באר שבע",
    "כס": "כפר סבא", "כ\"ס": "כפר סבא",
    "רמת-גן": "רמת גן", "רמג": "רמת גן"
  },
  treatments: {
    "סיביטי": "CBT", "cbt": "CBT", "קוגניטיבי": "CBT", "התנהגותי": "CBT",
    "אי אמ די אר": "EMDR", "emdr": "EMDR", "טראומה בעיניים": "EMDR",
    "דינמי": "טיפול דינמי", "פסיכודינמי": "טיפול דינמי",
    "נלפ": "NLP", "nlp": "NLP",
    "מיינדפולנס": "mindfulness"
  },
  specializations: {
    "זוגי": "couples_therapy", "זוגיות": "couples_therapy", "ייעוץ זוגי": "couples_therapy", "טיפול זוגי": "couples_therapy",
    "משפחתי": "family_therapy", "משפחה": "family_therapy", "טיפול משפחתי": "family_therapy",
    "חרדה": "anxiety", "חרדות": "anxiety", "פחדים": "anxiety",
    "דיכאון": "depression", "דכאון": "depression", "עצבות": "depression",
    "טראומה": "trauma", "פוסט טראומה": "trauma", "ptsd": "trauma",
    "קשב וריכוז": "adhd", "adhd": "adhd", "add": "adhd",
    "ילדים": "children", "נוער": "adolescents", "מתבגרים": "adolescents",
    "אכילה": "eating_disorders", "אנורקסיה": "eating_disorders", "בולמיה": "eating_disorders"
  }
};

// פונקציה שמקבלת משפט מוקלד ומחלצת ממנו את הסינונים
export function parseSmartSearch(query) {
  if (!query) return {};
  const lowerQuery = query.toLowerCase();
  
  let foundCity = null;
  let foundTreatment = null;
  let foundSpecialization = null;

  // 1. חיפוש ערים (בודק גם את הרשימה הרשמית וגם את המילים הנרדפות)
  for (const loc of ISRAEL_LOCATIONS) {
    if (lowerQuery.includes(loc.toLowerCase())) foundCity = loc;
  }
  for (const [syn, realVal] of Object.entries(synonyms.cities)) {
    if (lowerQuery.includes(syn)) foundCity = realVal;
  }

  // 2. חיפוש שיטות טיפול
  for (const item of ALL_TREATMENT_METHODS) {
    if (lowerQuery.includes(item.label.toLowerCase()) || lowerQuery.includes(item.value.toLowerCase())) foundTreatment = item.value;
  }
  for (const [syn, realVal] of Object.entries(synonyms.treatments)) {
    if (lowerQuery.includes(syn)) foundTreatment = realVal;
  }

  // 3. חיפוש תחומי טיפול
  for (const item of ALL_SPECIALIZATIONS) {
    if (lowerQuery.includes(item.label.toLowerCase()) || lowerQuery.includes(item.value.toLowerCase())) foundSpecialization = item.value;
  }
  for (const [syn, realVal] of Object.entries(synonyms.specializations)) {
    if (lowerQuery.includes(syn)) foundSpecialization = realVal;
  }

  return {
    city: foundCity,
    treatment_method: foundTreatment,
    specialization: foundSpecialization,
    originalText: query
  };
}