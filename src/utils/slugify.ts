const hebrewToEnglish: Record<string, string> = {
  א:'a', ב:'b', ג:'g', ד:'d', ה:'h', ו:'v', ז:'z', ח:'ch', ט:'t',
  י:'y', כ:'k', ך:'k', ל:'l', מ:'m', ם:'m', נ:'n', ן:'n', ס:'s',
  ע:'a', פ:'p', ף:'f', צ:'ts', ץ:'ts', ק:'k', ר:'r', ש:'sh', ת:'t',
};

const professionSlugs: Record<string, string> = {
  psychologist: 'psychologist',
  psychiatrist: 'psychiatrist',
  psychotherapist: 'psychotherapist',
  social_worker: 'social-worker',
  counselor: 'counselor',
};

function transliterate(text: string): string {
  return text
    .split('')
    .map(char => hebrewToEnglish[char] ?? char)
    .join('');
}

export function generateTherapistSlug(
  fullName: string,
  profession: string,
  city: string
): string {
  const namePart = transliterate(fullName);
  const profPart = professionSlugs[profession] ?? profession;
  const cityPart = transliterate(city ?? '');

  return [namePart, profPart, cityPart]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-') // remove special chars
    .replace(/-+/g, '-')          // collapse multiple dashes
    .replace(/^-|-$/g, '');       // trim leading/trailing dashes
}
