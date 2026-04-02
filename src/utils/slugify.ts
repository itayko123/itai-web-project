const hebrewToEnglish: Record<string, string> = {
  'א':'a',  'ב':'b',  'ג':'g',  'ד':'d',  'ה':'h',
  'ו':'v',  'ז':'z',  'ח':'ch', 'ט':'t',  'י':'y',
  'כ':'k',  'ך':'k',  'ל':'l',  'מ':'m',  'ם':'m',
  'נ':'n',  'ן':'n',  'ס':'s',  'ע':'',   'פ':'p',
  'ף':'f',  'צ':'tz', 'ץ':'tz', 'ק':'k',  'ר':'r',
  'ש':'sh', 'ת':'t',  '״':'-',  '׳':'',
};

const nameMap: Record<string, string> = {
  'משה':'moshe',      'לוי':'levi',       'כהן':'cohen',
  'מיכל':'michal',    'דן':'dan',         'נועה':'noa',
  'אמיר':'amir',      'יוסי':'yossi',     'רונית':'ronit',
  'אברהם':'abraham',  'שפירא':'shapira',  'גולדברג':'goldberg',
  'שלום':'shalom',    'חדד':'hadad',      'אורית':'orit',
  'דוד':'david',      'שרה':'sarah',      'רחל':'rachel',
  'יעקב':'yaakov',    'מרים':'miriam',    'אסתר':'esther',
  'חיים':'chaim',     'רבקה':'rivka',     'ליאור':'lior',
  'תמר':'tamar',      'איתי':'itai',      'גל':'gal',
  'רועי':'roi',       'שני':'shani',      'אבי':'avi',
  'עומר':'omer',      'ענת':'anat',       'טל':'tal',
  'הילה':'hila',      'עדי':'adi',        'מיה':'mia',
  'ירון':'yaron',     'גיל':'gil',        'אלון':'alon',
  'נדב':'nadav',      'אור':'or',         'בן':'ben',
  'רם':'ram',         'ניר':'nir',        'עמית':'amit',
  'שירה':'shira',     'מאיה':'maya',      'דנה':'dana',
  'יובל':'yuval',     'איל':'eyal',       'גלי':'gali',
  'רינת':'rinat',     'אפרת':'efrat',     'ורד':'vered',
  'ליבי':'libi',      'לירון':'liron',    'נעמי':'naomi',
  'ריקי':'riki',      'צבי':'tzvi',       'חנה':'chana',
  'קרן':'karen',      'ברק':'barak',      'אריאל':'ariel',
  'שמואל':'shmuel',   'אליהו':'eliyahu',  'יצחק':'yitzhak',
  'מנחם':'menachem',  'אביב':'aviv',      'שחר':'shachar',
  'רוני':'roni',      'גולן':'golan',     'דרור':'dror',
  'ד״ר':'dr',         'דר':'dr',          'פרופ':'prof',
  'יהודה':'yehuda',   'שושנה':'shoshana', 'אביגיל':'abigail',
  'בנימין':'binyamin', 'גבריאל':'gabriel', 'רפאל':'rafael',
  'נתן':'natan',      'אדם':'adam',       'אלי':'eli',
  'מוחמד':'muhammad', 'אחמד':'ahmad',     'פאטמה':'fatma',
  'ג׳ורג':'george',   'מייקל':'michael',  'דניאל':'daniel',
  'ג׳ני':'jenny',     'סמית':'smith',     'לוין':'levin',
  'פרידמן':'friedman','וייס':'weiss',     'רוזן':'rosen',
  'ברגר':'berger',    'שטיין':'stein',    'גרין':'green',
  'שוורץ':'schwartz', 'קץ':'katz',        'גולד':'gold',
  'לנדאו':'landau',   'פרץ':'peretz',     'אזולאי':'azulay',
  'בן דוד':'ben-david','בן לוי':'ben-levi','בר':'bar',
};

const cityMap: Record<string, string> = {
  'תל אביב':'tel-aviv',         'ירושלים':'jerusalem',
  'חיפה':'haifa',               'ראשון לציון':'rishon-lezion',
  'פתח תקווה':'petah-tikva',    'אשדוד':'ashdod',
  'נתניה':'netanya',            'באר שבע':'beer-sheva',
  'הרצליה':'herzliya',          'רמת גן':'ramat-gan',
  'רעננה':'raanana',            'כפר סבא':'kfar-saba',
  'הוד השרון':'hod-hasharon',   'מודיעין':'modiin',
  'אשקלון':'ashkelon',          'רחובות':'rehovot',
  'לוד':'lod',                  'רמלה':'ramla',
  'בני ברק':'bnei-brak',        'גבעתיים':'givatayim',
  'חולון':'holon',              'בת ים':'bat-yam',
  'טבריה':'tiberias',           'נצרת':'nazareth',
  'עפולה':'afula',              'קריית גת':'kiryat-gat',
  'אילת':'eilat',               'כרמיאל':'karmiel',
  'נהריה':'nahariya',           'עכו':'acre',
  'צפת':'safed',                'יהוד':'yehud',
  'אור יהודה':'or-yehuda',      'גדרה':'gedera',
  'קריית אונו':'kiryat-ono',    'מזכרת בתיה':'mazkeret-batya',
  'ראש העין':'rosh-haayin',     'יבנה':'yavne',
  'קריית שמונה':'kiryat-shmona','מעלה אדומים':'maale-adumim',
  'אלעד':'elad',                'בית שמש':'beit-shemesh',
  'טירת כרמל':'tirat-carmel',   'דימונה':'dimona',
  'קריית ביאליק':'kiryat-bialik','קריית ים':'kiryat-yam',
  'קריית מוצקין':'kiryat-motzkin','נס ציונה':'nes-ziona',
  'רמת השרון':'ramat-hasharon', 'הראל':'harel',
  'גן יבנה':'gan-yavne',        'יקנעם':'yokneam',
  'זכרון יעקב':'zichron-yaakov','עמק יזרעאל':'jezreel-valley',
};

function transliterateName(text: string): string {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  return words.map(word => nameMap[word] ?? word.split('').map(c => hebrewToEnglish[c] ?? c).join('')).join('-');
}

function getCity(city: string): string {
  if (!city?.trim()) return '';
  return cityMap[city.trim()] ?? transliterateName(city);
}

const professionSlugs: Record<string, string> = {
  psychologist: 'psychologist',
  psychiatrist: 'psychiatrist',
  psychotherapist: 'psychotherapist',
  social_worker: 'social-worker',
  counselor: 'counselor',
};

export function generateTherapistSlug(
  fullName: string,
  profession: string,
  city: string,
  id: string
): string {
  const name = transliterateName(fullName) || 'therapist';
  const prof = professionSlugs[profession] ?? profession ?? 'therapy';
  const cit = getCity(city);

  return [name, prof, cit]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}