const hebrewToEnglish: Record<string, string> = {
  'א':'a',  'ב':'b',  'ג':'g',  'ד':'d',  'ה':'h',
  'ו':'v',  'ז':'z',  'ח':'ch', 'ט':'t',  'י':'y',
  'כ':'k',  'ך':'k',  'ל':'l',  'מ':'m',  'ם':'m',
  'נ':'n',  'ן':'n',  'ס':'s',  'ע':'',   'פ':'p',
  'ף':'f',  'צ':'tz', 'ץ':'tz', 'ק':'k',  'ר':'r',
  'ש':'sh', 'ת':'t',  '״':'-',  '׳':'',
};

const nameMap: Record<string, string> = {
  // תארים
  'ד״ר':'dr', 'דר':'dr', 'פרופ':'prof', 'פרופסור':'professor',

  // שמות גבריים נפוצים
  'ישראל':'israel',   'משה':'moshe',      'דוד':'david',
  'יוסף':'yosef',     'יוסי':'yossi',     'אברהם':'abraham',
  'יצחק':'yitzhak',   'יעקב':'yaakov',    'שמואל':'shmuel',
  'אליהו':'eliyahu',  'מנחם':'menachem',  'בנימין':'binyamin',
  'גבריאל':'gabriel', 'רפאל':'rafael',    'מיכאל':'michael',
  'דניאל':'daniel',   'אדם':'adam',       'נתן':'natan',
  'נדב':'nadav',      'אביב':'aviv',      'שחר':'shachar',
  'איתי':'itai',      'עומר':'omer',      'אמיר':'amir',
  'ירון':'yaron',     'גיל':'gil',        'אלון':'alon',
  'רם':'ram',         'ניר':'nir',        'עמית':'amit',
  'יובל':'yuval',     'איל':'eyal',       'ברק':'barak',
  'אריאל':'ariel',    'גולן':'golan',     'דרור':'dror',
  'רועי':'roi',       'אבי':'avi',        'אור':'or',
  'בן':'ben',         'גל':'gal',         'טל':'tal',
  'ליאור':'lior',     'לירון':'liron',    'צבי':'tzvi',
  'שלום':'shalom',    'דן':'dan',         'חיים':'chaim',
  'נחום':'nachum',    'פנחס':'pinchas',   'זאב':'zeev',
  'אורי':'uri',       'רן':'ran',         'שי':'shai',
  'עידו':'ido',       'תום':'tom',        'יניב':'yaniv',
  'אסף':'asaf',       'בועז':'boaz',      'עוז':'oz',
  'ארז':'erez',       'שמעון':'shimon',   'לוי':'levi',
  'רוני':'roni',      'אלי':'eli',        'מוטי':'moti',
  'גדי':'gadi',       'עדי':'adi',        'יגאל':'yigal',
  'אייל':'eyal',      'אלעד':'elad',      'רז':'raz',
  'שי':'shai',        'גיא':'guy',        'עמוס':'amos',
  'יואב':'yoav',      'אוהד':'ohad',      'ורד':'vered',
  'חן':'chen',        'נועם':'noam',      'רותם':'rotem',
  'יהודה':'yehuda',   'שלמה':'shlomo',    'ראובן':'reuven',
  'גרשון':'gershon',  'נחמן':'nachman',   'מישל':'mishel',
  'אבי':'avi'

  // שמות נשיים נפוצים
  'שרה':'sarah',      'רחל':'rachel',     'מרים':'miriam',
  'אסתר':'esther',    'רבקה':'rivka',     'לאה':'leah',
  'דינה':'dina',      'נועה':'noa',       'מיכל':'michal',
  'רונית':'ronit',    'אורית':'orit',     'תמר':'tamar',
  'שירה':'shira',     'מאיה':'maya',      'דנה':'dana',
  'הילה':'hila',      'ענת':'anat',       'מיה':'mia',
  'רינת':'rinat',     'אפרת':'efrat',     'נעמי':'naomi',
  'ריקי':'riki',      'חנה':'chana',      'קרן':'karen',
  'שני':'shani',      'גלי':'gali',       'ליבי':'libi',
  'שושנה':'shoshana', 'אביגיל':'abigail', 'יעל':'yael',
  'נילי':'nili',      'רות':'ruth',       'עינת':'einat',
  'גילה':'gila',      'נורית':'nurit',    'טלי':'tali',
  'ורד':'vered',      'דפנה':'dafna',     'אורה':'ora',
  'פנינה':'penina',   'זהבה':'zahava',    'יפה':'yafa',
  'ברכה':'bracha',    'ציפורה':'tzipora', 'מזל':'mazal',
  'שפרה':'shifra',    'בתיה':'batya',     'חגית':'hagit',
  'טובה':'tova',      'לימור':'limor',    'ליאת':'liat',
  'אילת':'eilat',     'נטע':'neta',       'שקד':'shaked',
  'ים':'yam',         'אביטל':'avital',   'שלומית':'shlomit',
  'אדוה':'adva',      'גאולה':'geula',    'נגה':'noga',
  'רוית':'ravit',     'אתי':'eti',        'חיה':'chaya',
  'דבורה':'devora',   'מרגלית':'margalit','פריידה':'freida',
  'אינה':'ina',       'סיגל':'sigal',     'מעין':'maayan',
  'רוחמה':'ruchama',  'ליזה':'liza',      'רמה':'rama',

  // שמות משפחה נפוצים
  'כהן':'cohen',      'לוי':'levi',       'מזרחי':'mizrachi',
  'פרץ':'peretz',     'ביטון':'biton',    'אברהם':'abraham',
  'דהן':'dahan',      'כץ':'katz',        'שפירא':'shapira',
  'גולדברג':'goldberg','פרידמן':'friedman','וייס':'weiss',
  'רוזן':'rosen',     'ברגר':'berger',    'שטיין':'stein',
  'גרין':'green',     'שוורץ':'schwartz', 'גולד':'gold',
  'לנדאו':'landau',   'אזולאי':'azulay',  'חדד':'hadad',
  'בן דוד':'ben-david','בר':'bar',        'גבאי':'gabai',
  'אוחיון':'ouchion', 'בוסקילה':'buskila','מלול':'malul',
  'אמסלם':'amsalem',  'בן שמעון':'ben-shimon','חיון':'chiyon',
  'סויסה':'suissa',   'מור':'mor',        'שם טוב':'shem-tov',
  'אלבז':'elbaz',     'בן חמו':'ben-hamo','זוהר':'zohar',
  'ששון':'sasson',    'חורי':'khouri',    'נסים':'nissim',
  'טביב':'taviv',     'יהיא':'yahya',     'חיימוב':'chaimov',
  'שמש':'shemesh',    'שגב':'segev',      'בן עמי':'ben-ami',
  'קדוש':'kadosh',    'אלון':'alon',      'נחמיאס':'nachmias',
  'גוטמן':'gutman',   'כנעני':'cnaani',   'רז':'raz',
  'עמר':'amar',       'יוסף':'yosef',     'שרעבי':'sharabi',

  // שמות משפחה אשכנזיים
'גולדשטיין':'goldstein',   'זילברמן':'silverman',    'רוזנברג':'rosenberg',
'גרינברג':'greenberg',     'שטיינברג':'steinberg',   'ויינברג':'weinberg',
'ברונשטיין':'bronstein',   'פלדמן':'feldman',         'האוזמן':'hausman',
'קאופמן':'kaufman',        'הופמן':'hoffman',         'קלינמן':'kleinman',
'ברנשטיין':'bernstein',    'אייזנמן':'eisenman',      'פרלמן':'perlman',
'קוהן':'kohn',             'לוינסון':'levinson',      'מנדלסון':'mendelson',
'אפלבאום':'applebaum',     'גולדמן':'goldman',        'זוסמן':'sussman',
'הירשפלד':'hirschfeld',    'בלומנפלד':'blumenfeld',   'טננבאום':'tannenbaum',
'פרנקל':'frankel',         'שפירשטיין':'shapirstein', 'ביאליסטוק':'bialystok',
'ורשבסקי':'varshavsky',    'מוסקוביץ':'moskowitz',    'רבינוביץ':'rabinowitz',
'הורוביץ':'horowitz',      'ליבוביץ':'leibowitz',     'ויסמן':'wiseman',
'אוסטרובסקי':'ostrovsky',  'קמינסקי':'kaminsky',      'יאנובסקי':'yanovsky',
'ברודסקי':'brodsky',       'ויגודסקי':'vigodsky',     'פוטשניק':'potchnik',
'גלזמן':'glazman',         'בוימן':'bauman',          'לנדסמן':'landsman',
'זיידמן':'zeidman',        'קרנר':'karner',            'שלזינגר':'schlesinger',
'לוונטל':'lowenthal',      'אייכנבאום':'eichenbaum',  'ריכטר':'richter',
'פישר':'fisher',           'מילר':'miller',            'שרייבר':'schreiber',
'טאובר':'tauber',          'קרויס':'kraus',            'האן':'hahn',
'נוישטט':'neustadt',       'ליכטנשטיין':'lichtenstein','פלוטקין':'plotkin',
'גוטליב':'gottlieb',       'בלוך':'bloch',             'רוט':'roth',
'שטרן':'stern',            'קלר':'keller',             'פרייברג':'freiberg',
'גלוקמן':'gluckman',       'קלצקין':'klatzkn',        'ברמן':'berman',
'זלמנוביץ':'zalmanowitz',  'אורנשטיין':'ornstein',    'אפרתי':'efrati',
'קנטור':'kantor',          'בורשטיין':'burshtein',    'גולדפרב':'goldfarb',
'שניצר':'schnitzer',       'אייזנשטט':'eisenstadt',   'ספקטור':'spector',
'לוי':'levy',              'לוין':'levin',             'לוינה':'levine',
'ויינשטיין':'weinstein',   'אפלר':'apler',            'גרוסמן':'grossman',
'קליין':'klein',           'שוורץ':'schwartz',        'זילבר':'zilber',
'רוזן':'rosen',            'קרן':'keren',              'גורן':'goren',
'שמיר':'shamir',           'שגב':'segev',              'שרון':'sharon',
'ברק':'barak',             'פלד':'peled',              'אלון':'alon',
'נבון':'navon',            'שפיר':'shapir',            'גבע':'geva',
'דרומי':'dromi',           'עמית':'amit',              'ארבל':'arbel',
};

const cityMap : Record<string, string> =  {
  // ערים גדולות
  'תל אביב':'tel-aviv',           'ירושלים':'jerusalem',
  'חיפה':'haifa',                 'ראשון לציון':'rishon-lezion',
  'פתח תקווה':'petah-tikva',      'אשדוד':'ashdod',
  'נתניה':'netanya',              'באר שבע':'beer-sheva',
  'בני ברק':'bnei-brak',          'חולון':'holon',
  'בת ים':'bat-yam',              'רמת גן':'ramat-gan',
  'אשקלון':'ashkelon',            'רחובות':'rehovot',
  'הרצליה':'herzliya',            'כפר סבא':'kfar-saba',
  'הוד השרון':'hod-hasharon',     'רעננה':'raanana',
  'מודיעין':'modiin',             'גבעתיים':'givatayim',
  'לוד':'lod',                    'רמלה':'ramla',

  // ערים בצפון
  'נהריה':'nahariya',             'עכו':'acre',
  'כרמיאל':'karmiel',             'נצרת':'nazareth',
  'עפולה':'afula',                'טבריה':'tiberias',
  'צפת':'safed',                  'קריית שמונה':'kiryat-shmona',
  'קריית ביאליק':'kiryat-bialik', 'קריית ים':'kiryat-yam',
  'קריית מוצקין':'kiryat-motzkin','קריית אתא':'kiryat-ata',
  'נשר':'nesher',                 'טירת כרמל':'tirat-carmel',
  'זכרון יעקב':'zichron-yaakov',  'יוקנעם':'yokneam',
  'מגדל העמק':'migdal-haemek',    'שפרעם':'shfaram',
  'סחנין':'sakhnin',              'טמרה':'tamra',
  'בית שאן':'beit-shean',         'אום אל פחם':'umm-al-fahm',
  'אור עקיבא':'or-akiva',         'פרדס חנה':'pardes-hana',
  'חדרה':'hadera',                'זכרון':'zichron',

  // ערים במרכז
  'ראש העין':'rosh-haayin',       'אלעד':'elad',
  'יהוד':'yehud',                 'אור יהודה':'or-yehuda',
  'קריית אונו':'kiryat-ono',      'גני תקווה':'ganei-tikva',
  'סביון':'savyon',               'מזכרת בתיה':'mazkeret-batya',
  'נס ציונה':'nes-ziona',         'יבנה':'yavne',
  'גן יבנה':'gan-yavne',          'גדרה':'gedera',
  'רמת השרון':'ramat-hasharon',   'הרצלייה':'herzliya',
  'כפר יונה':'kfar-yona',         'טייבה':'taibe',
  'קלנסווה':'kalansua',           'רהט':'rahat',
  'תל מונד':'tel-mond',           'עמק חפר':'emek-hefer',
  'נתיבות':'netivot',             'שדרות':'sderot',
  'אופקים':'ofakim',              'ערד':'arad',

  // ערים בדרום
  'אשקלון':'ashkelon',            'קריית גת':'kiryat-gat',
  'אילת':'eilat',                 'דימונה':'dimona',
  'מצפה רמון':'mitzpe-ramon',     'ירוחם':'yeruham',
  'ניצן':'nitzan',                'קריית מלאכי':'kiryat-malachi',

  // ערים בירושלים והסביבה
  'מעלה אדומים':'maale-adumim',   'בית שמש':'beit-shemesh',
  'גבעת זאב':'givat-zeev',        'מודיעין עילית':'modiin-ilit',
  'ביתר עילית':'beitar-ilit',     'אבו גוש':'abu-ghosh',
  'מבשרת ציון':'mevasseret-zion', 'נס הרים':'nes-harim',
  'אפרת':'efrat',                 'בית אל':'beit-el',

  // שכונות תל אביב (שימושיות לSEO)
  'יפו':'jaffa',                  'נווה צדק':'neve-tzedek',
  'פלורנטין':'florentin',         'לב תל אביב':'tel-aviv-center',
  'צפון תל אביב':'north-tel-aviv','דרום תל אביב':'south-tel-aviv',
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