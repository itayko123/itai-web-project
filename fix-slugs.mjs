import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://gkywscsnhpfmspwittqm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdreXdzY3NuaHBmbXNwd2l0dHFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDU0ODg2OCwiZXhwIjoyMDkwMTI0ODY4fQ.DwK5pESd0yYU-DSnVXNhgcvxIk6-f7WnsUbTDV8yfCs'
);

const hebrewToEnglish = {
  'א':'a','ב':'b','ג':'g','ד':'d','ה':'h','ו':'v','ז':'z',
  'ח':'ch','ט':'t','י':'y','כ':'k','ך':'k','ל':'l','מ':'m',
  'ם':'m','נ':'n','ן':'n','ס':'s','ע':'','פ':'p','ף':'f',
  'צ':'tz','ץ':'tz','ק':'k','ר':'r','ש':'sh','ת':'t','״':'-','׳':'',
};

const nameMap = {
  'ד״ר':'dr','דר':'dr','פרופ':'prof','פרופסור':'professor',
  'ישראל':'israel','משה':'moshe','דוד':'david','יוסף':'yosef','יוסי':'yossi',
  'אברהם':'abraham','יצחק':'yitzhak','יעקב':'yaakov','שמואל':'shmuel',
  'אליהו':'eliyahu','מנחם':'menachem','בנימין':'binyamin','גבריאל':'gabriel',
  'רפאל':'rafael','מיכאל':'michael','דניאל':'daniel','אדם':'adam','נתן':'natan',
  'נדב':'nadav','אביב':'aviv','שחר':'shachar','איתי':'itai','עומר':'omer',
  'אמיר':'amir','ירון':'yaron','גיל':'gil','אלון':'alon','רם':'ram',
  'ניר':'nir','עמית':'amit','יובל':'yuval','איל':'eyal','ברק':'barak',
  'אריאל':'ariel','גולן':'golan','דרור':'dror','רועי':'roi','אבי':'avi',
  'אור':'or','בן':'ben','גל':'gal','טל':'tal','ליאור':'lior','לירון':'liron',
  'צבי':'tzvi','שלום':'shalom','דן':'dan','חיים':'chaim','נחום':'nachum',
  'פנחס':'pinchas','זאב':'zeev','אורי':'uri','רן':'ran','שי':'shai',
  'עידו':'ido','תום':'tom','יניב':'yaniv','אסף':'asaf','בועז':'boaz',
  'עוז':'oz','ארז':'erez','שמעון':'shimon','רוני':'roni','אלי':'eli',
  'מוטי':'moti','גדי':'gadi','יגאל':'yigal','אלעד':'elad','רז':'raz',
  'גיא':'guy','עמוס':'amos','יואב':'yoav','אוהד':'ohad','חן':'chen',
  'נועם':'noam','רותם':'rotem','יהודה':'yehuda','שלמה':'shlomo','ראובן':'reuven',
  'גרשון':'gershon','נחמן':'nachman','מישל':'mishel','יוחאי':'yochai',
  'יוחנן':'yochanan','יואל':'yoel','יונתן':'yonatan','יונה':'yona','יורם':'yoram',
  'יחיאל':'yechiel','יחזקאל':'yechezkel','שמחה':'simcha','מרדכי':'mordechai',
  'שרה':'sarah','רחל':'rachel','מרים':'miriam','אסתר':'esther','רבקה':'rivka',
  'לאה':'leah','דינה':'dina','נועה':'noa','מיכל':'michal','רונית':'ronit',
  'אורית':'orit','תמר':'tamar','שירה':'shira','מאיה':'maya','דנה':'dana',
  'הילה':'hila','ענת':'anat','מיה':'mia','רינת':'rinat','אפרת':'efrat',
  'נעמי':'naomi','ריקי':'riki','חנה':'chana','קרן':'karen','שני':'shani',
  'גלי':'gali','ליבי':'libi','שושנה':'shoshana','אביגיל':'abigail','יעל':'yael',
  'נילי':'nili','רות':'ruth','עינת':'einat','גילה':'gila','נורית':'nurit',
  'טלי':'tali','ורד':'vered','דפנה':'dafna','אורה':'ora','פנינה':'penina',
  'זהבה':'zahava','יפה':'yafa','ברכה':'bracha','חגית':'hagit','טובה':'tova',
  'לימור':'limor','ליאת':'liat','נטע':'neta','שקד':'shaked','אביטל':'avital',
  'שלומית':'shlomit','אדוה':'adva','נגה':'noga','רוית':'ravit','אתי':'eti',
  'חיה':'chaya','דבורה':'devora','מרגלית':'margalit','סיגל':'sigal','מעין':'maayan',
  'כהן':'cohen','לוי':'levi','מזרחי':'mizrachi','פרץ':'peretz','ביטון':'biton',
  'דהן':'dahan','כץ':'katz','שפירא':'shapira','גולדברג':'goldberg',
  'פרידמן':'friedman','וייס':'weiss','רוזן':'rosen','ברגר':'berger',
  'שטיין':'stein','גרין':'green','שוורץ':'schwartz','גולד':'gold',
  'לנדאו':'landau','אזולאי':'azulay','חדד':'hadad','בר':'bar','גבאי':'gabai',
  'אוחיון':'ouchion','מלול':'malul','אמסלם':'amsalem','סויסה':'suissa',
  'מור':'mor','אלבז':'elbaz','ששון':'sasson','נסים':'nissim','שמש':'shemesh',
  'שגב':'segev','עמר':'amar','שרעבי':'sharabi','זוהר':'zohar',
  'גולדשטיין':'goldstein','זילברמן':'silverman','רוזנברג':'rosenberg',
  'גרינברג':'greenberg','שטיינברג':'steinberg','ויינברג':'weinberg',
  'ברונשטיין':'bronstein','פלדמן':'feldman','קאופמן':'kaufman','הופמן':'hoffman',
  'ברנשטיין':'bernstein','אייזנמן':'eisenman','פרלמן':'perlman',
  'קוהן':'kohn','לוינסון':'levinson','מנדלסון':'mendelson',
  'אפלבאום':'applebaum','גולדמן':'goldman','זוסמן':'sussman',
  'הירשפלד':'hirschfeld','בלומנפלד':'blumenfeld','טננבאום':'tannenbaum',
  'פרנקל':'frankel','מוסקוביץ':'moskowitz','רבינוביץ':'rabinowitz',
  'הורוביץ':'horowitz','ליבוביץ':'leibowitz','ויסמן':'wiseman',
  'אוסטרובסקי':'ostrovsky','קמינסקי':'kaminsky','ברודסקי':'brodsky',
  'גלזמן':'glazman','בוימן':'bauman','לנדסמן':'landsman','זיידמן':'zeidman',
  'קרנר':'karner','שלזינגר':'schlesinger','לוונטל':'lowenthal','ריכטר':'richter',
  'פישר':'fisher','מילר':'miller','שרייבר':'schreiber','טאובר':'tauber',
  'קרויס':'kraus','האן':'hahn','נוישטט':'neustadt','פלוטקין':'plotkin',
  'גוטליב':'gottlieb','בלוך':'bloch','רוט':'roth','שטרן':'stern',
  'קלר':'keller','גלוקמן':'gluckman','ברמן':'berman','קנטור':'kantor',
  'גולדפרב':'goldfarb','שניצר':'schnitzer','ספקטור':'spector',
  'לוין':'levin','ויינשטיין':'weinstein','גרוסמן':'grossman',
  'קליין':'klein','זילבר':'zilber','גורן':'goren','שמיר':'shamir',
  'שרון':'sharon','פלד':'peled','נבון':'navon','שפיר':'shapir',
  'גבע':'geva','ארבל':'arbel','דרומי':'dromi','גוטמן':'gutman',
  'שטייניץ':'steinitz','שטיינר':'steiner','שטיינמן':'steinman',
  'ויינטראוב':'weintraub','רוטשילד':'rothschild','אוירבך':'auerbach',
  'ויצמן':'weizman','גלבוע':'gilboa','שניאור':'shneor','פיינברג':'feinberg',
  'לייבוביץ':'leibovitz','צייטלין':'zeitlin','גינזבורג':'ginzburg',
};

const cityMap = {
  // ── Tel Aviv variants (most important fix) ──────────────────────────────
  'תל אביב':'tel-aviv',
  'תל אביב-יפו':'tel-aviv',
  'תל-אביב-יפו':'tel-aviv',
  'תל אביב יפו':'tel-aviv',
  'תל-אביב':'tel-aviv',
  'ת"א':'tel-aviv',
  'תא':'tel-aviv',

  // ── Other compound/variant city names ───────────────────────────────────
  'ירושלים':'jerusalem',
  'חיפה':'haifa',
  'ראשון לציון':'rishon-lezion',
  'פתח תקווה':'petah-tikva',
  'פתח-תקווה':'petah-tikva',
  'אשדוד':'ashdod',
  'נתניה':'netanya',
  'באר שבע':'beer-sheva',
  'בני ברק':'bnei-brak',
  'חולון':'holon',
  'בת ים':'bat-yam',
  'רמת גן':'ramat-gan',
  'רמת-גן':'ramat-gan',
  'אשקלון':'ashkelon',
  'רחובות':'rehovot',
  'הרצליה':'herzliya',
  'כפר סבא':'kfar-saba',
  'הוד השרון':'hod-hasharon',
  'רעננה':'raanana',
  'מודיעין':'modiin',
  'מודיעין-מכבים-רעות':'modiin',
  'מודיעין מכבים רעות':'modiin',
  'גבעתיים':'givatayim',
  'לוד':'lod',
  'רמלה':'ramla',
  'נהריה':'nahariya',
  'עכו':'acre',
  'כרמיאל':'karmiel',
  'נצרת':'nazareth',
  'נצרת עילית':'nof-hagalil',
  'נוף הגליל':'nof-hagalil',
  'עפולה':'afula',
  'טבריה':'tiberias',
  'צפת':'safed',
  'קריית שמונה':'kiryat-shmona',
  'קרית שמונה':'kiryat-shmona',
  'קריית ביאליק':'kiryat-bialik',
  'קרית ביאליק':'kiryat-bialik',
  'קריית ים':'kiryat-yam',
  'קרית ים':'kiryat-yam',
  'קריית מוצקין':'kiryat-motzkin',
  'קרית מוצקין':'kiryat-motzkin',
  'קריית אתא':'kiryat-ata',
  'קרית אתא':'kiryat-ata',
  'נשר':'nesher',
  'טירת כרמל':'tirat-carmel',
  'זכרון יעקב':'zichron-yaakov',
  'יוקנעם':'yokneam',
  'מגדל העמק':'migdal-haemek',
  'חדרה':'hadera',
  'ראש העין':'rosh-haayin',
  'אלעד':'elad',
  'יהוד':'yehud',
  'יהוד-מונוסון':'yehud',
  'יהוד מונוסון':'yehud',
  'אור יהודה':'or-yehuda',
  'קריית אונו':'kiryat-ono',
  'קרית אונו':'kiryat-ono',
  'נס ציונה':'nes-ziona',
  'יבנה':'yavne',
  'גן יבנה':'gan-yavne',
  'גדרה':'gedera',
  'רמת השרון':'ramat-hasharon',
  'פרדס חנה-כרכור':'pardes-hana',
  'פרדס חנה כרכור':'pardes-hana',
  'פרדס חנה':'pardes-hana',
  'קדימה-צורן':'kadima',
  'קדימה צורן':'kadima',
  'מזכרת בתיה':'mazkeret-batya',
  'מעלה אדומים':'maale-adumim',
  'בית שמש':'beit-shemesh',
  'מודיעין עילית':'modiin-ilit',
  'ביתר עילית':'beitar-ilit',
  'מבשרת ציון':'mevasseret-zion',
  'אפרת':'efrat',
  'קריית גת':'kiryat-gat',
  'קרית גת':'kiryat-gat',
  'אילת':'eilat',
  'דימונה':'dimona',
  'נתיבות':'netivot',
  'שדרות':'sderot',
  'אופקים':'ofakim',
  'ערד':'arad',
  'יפו':'jaffa',
  'נווה צדק':'neve-tzedek',
  'בית שאן':'beit-shean',
  'באר יעקב':'beer-yaakov',
  'גני תקווה':'ganei-tikva',
  'סביון':'savyon',
  'כפר יונה':'kfar-yona',
  'קריית מלאכי':'kiryat-malachi',
  'קרית מלאכי':'kiryat-malachi',
  'מצפה רמון':'mitzpe-ramon',
  'גבעת זאב':'givat-zeev',
  'אבו גוש':'abu-ghosh',
};

const professionSlugs = {
  psychologist:'psychologist', psychiatrist:'psychiatrist',
  psychotherapist:'psychotherapist', social_worker:'social-worker',
  counselor:'counselor',
};

function transliterateName(text) {
  if (!text) return '';
  const words = text.trim().split(/\s+/);
  return words.map(word => nameMap[word] ?? word.split('').map(c => hebrewToEnglish[c] ?? c).join('')).join('-');
}

function getCity(city) {
  if (!city?.trim()) return '';
  // Try exact match first
  if (cityMap[city.trim()]) return cityMap[city.trim()];
  // Try without trailing hyphens/spaces
  const cleaned = city.trim().replace(/[-\s]+/g, ' ');
  if (cityMap[cleaned]) return cityMap[cleaned];
  // Fallback to transliteration
  return transliterateName(city);
}

function generateSlug(fullName, profession, city) {
  const name = transliterateName(fullName) || 'therapist';
  const prof = professionSlugs[profession] || profession || 'therapy';
  const cit = getCity(city);
  return [name, prof, cit]
    .filter(Boolean)
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const { data: therapists } = await supabase.from('Therapist').select('id, full_name, profession, city');

for (const t of therapists) {
  const slug = generateSlug(t.full_name, t.profession, t.city);
  await supabase.from('Therapist').update({ slug }).eq('id', t.id);
  console.log(`✅ ${t.full_name} → /therapist/${slug}`);
}

console.log('Done!');
