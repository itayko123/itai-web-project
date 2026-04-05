/**
 * Master list of all therapy specializations and treatment methods.
 * Grouped into logical categories for easy UI navigation.
 * Each item: { value: string (slug), label: string (Hebrew), labelEn: string, labelRu: string }
 */

// ── SPECIALIZATIONS (תחומי טיפול) ──────────────────────────────────────────
// @ts-nocheck

export const SPECIALIZATION_GROUPS = [
  {
    group: "הפרעות נפשיות ורגשיות",
    groupEn: "Mental & Emotional Disorders",
    groupRu: "Психические и эмоциональные расстройства",
    items: [
      { value: "anxiety", label: "חרדה", labelEn: "Anxiety", labelRu: "Тревожность" },
      { value: "depression", label: "דיכאון", labelEn: "Depression", labelRu: "Депрессия" },
      { value: "postpartum_depression", label: "דיכאון אחרי לידה", labelEn: "Postpartum Depression", labelRu: "Послеродовая депрессия" },
      { value: "bipolar", label: "מאניה דיפרסיה (דו-קוטבית)", labelEn: "Bipolar Disorder", labelRu: "Биполярное расстройство" },
      { value: "ocd", label: "OCD – הפרעה טורדנית כפייתית", labelEn: "OCD", labelRu: "ОКР" },
      { value: "schizophrenia", label: "סכיזופרניה", labelEn: "Schizophrenia", labelRu: "Шизофрения" },
      { value: "bpd", label: "הפרעת אישיות גבולית – BPD", labelEn: "Borderline Personality Disorder", labelRu: "Пограничное расстройство личности" },
      { value: "phobias", label: "פוביות", labelEn: "Phobias", labelRu: "Фобии" },
      { value: "panic", label: "התקפי פאניקה", labelEn: "Panic Attacks", labelRu: "Панические атаки" },
      { value: "ptsd", label: "פוסט-טראומה (PTSD)", labelEn: "PTSD / Post-Trauma", labelRu: "ПТСР / Посттравматический стресс" },
      { value: "trauma", label: "טראומה", labelEn: "Trauma", labelRu: "Травма" },
      { value: "dissociation", label: "דיסוציאציה", labelEn: "Dissociation", labelRu: "Диссоциация" },
      { value: "psychosomatic", label: "פסיכוסומטיקה", labelEn: "Psychosomatic Disorders", labelRu: "Психосоматика" },
      { value: "sleep_disorders", label: "הפרעות שינה", labelEn: "Sleep Disorders", labelRu: "Нарушения сна" },
      { value: "grief", label: "אבל ושכול", labelEn: "Grief & Bereavement", labelRu: "Горе и утрата" },
    ],
  },
  {
    group: "הפרעות קשב, למידה והתפתחות",
    groupEn: "ADHD, Learning & Developmental Disorders",
    groupRu: "СДВГ, обучение и развитие",
    items: [
      { value: "adhd", label: "הפרעות קשב וריכוז – ADHD", labelEn: "ADHD", labelRu: "СДВГ" },
      { value: "add", label: "ADD – קשב ללא היפראקטיביות", labelEn: "ADD", labelRu: "СДВ (без гиперактивности)" },
      { value: "learning_disabilities", label: "לקויות למידה", labelEn: "Learning Disabilities", labelRu: "Нарушения обучения" },
      { value: "dyslexia", label: "דיסלקציה", labelEn: "Dyslexia", labelRu: "Дислексия" },
      { value: "autism", label: "אוטיזם", labelEn: "Autism Spectrum", labelRu: "Аутизм" },
      { value: "asperger", label: "אספרגר – אוטיזם בתפקוד גבוה", labelEn: "Asperger / High-Functioning Autism", labelRu: "Синдром Аспергера" },
      { value: "pdd", label: "הפרעות קשר – PDD", labelEn: "PDD – Pervasive Developmental Disorder", labelRu: "PDD – Первазивные нарушения развития" },
      { value: "intellectual_disability", label: "מוגבלות שכלית התפתחותית", labelEn: "Intellectual Disability", labelRu: "Интеллектуальная недееспособность" },
      { value: "developmental_delay", label: "עיכוב התפתחותי", labelEn: "Developmental Delay", labelRu: "Задержка развития" },
    ],
  },
  {
    group: "הפרעות אכילה ומיניות",
    groupEn: "Eating & Sexual Disorders",
    groupRu: "Пищевые и сексуальные расстройства",
    items: [
      { value: "eating_disorders", label: "הפרעות אכילה", labelEn: "Eating Disorders", labelRu: "Расстройства пищевого поведения" },
      { value: "anorexia", label: "אנורקסיה", labelEn: "Anorexia", labelRu: "Анорексия" },
      { value: "bulimia", label: "בולמיה", labelEn: "Bulimia", labelRu: "Булимия" },
      { value: "sexual_therapy", label: "טיפול מיני", labelEn: "Sexual Therapy", labelRu: "Сексуальная терапия" },
      { value: "sexuality", label: "מיניות", labelEn: "Sexuality", labelRu: "Сексуальность" },
      { value: "paraphilia", label: "פראפיליה", labelEn: "Paraphilia", labelRu: "Парафилия" },
      { value: "enuresis", label: "הרטבה", labelEn: "Enuresis (Bedwetting)", labelRu: "Энурез" },
    ],
  },
  {
    group: "זוגיות, משפחה וקשרים",
    groupEn: "Relationships, Couples & Family",
    groupRu: "Отношения, пары и семья",
    items: [
      { value: "relationships", label: "זוגיות ומשפחה", labelEn: "Relationships & Family", labelRu: "Отношения и семья" },
      { value: "couples", label: "טיפול זוגי", labelEn: "Couples Therapy", labelRu: "Терапия для пар" },
      { value: "family", label: "טיפול משפחתי", labelEn: "Family Therapy", labelRu: "Семейная терапия" },
      { value: "divorce", label: "גירושין ופרידה", labelEn: "Divorce & Separation", labelRu: "Развод и расставание" },
      { value: "parental_guidance", label: "הדרכת הורים", labelEn: "Parent Guidance", labelRu: "Родительское консультирование" },
      { value: "parental_coordination", label: "תיאום הורי", labelEn: "Parental Coordination", labelRu: "Родительская координация" },
      { value: "fertility_support", label: "תמיכה בטיפולי פוריות", labelEn: "Fertility Treatment Support", labelRu: "Поддержка при лечении бесплодия" },
    ],
  },
  {
    group: "ילדים, נוער ומבוגרים",
    groupEn: "Children, Teens & Adults",
    groupRu: "Дети, подростки и взрослые",
    items: [
      { value: "children", label: "ילדים", labelEn: "Children", labelRu: "Дети" },
      { value: "teens", label: "מתבגרים", labelEn: "Teenagers", labelRu: "Подростки" },
      { value: "adults", label: "מבוגרים", labelEn: "Adults", labelRu: "Взрослые" },
      { value: "elderly", label: "קשישים / גיל השלישי", labelEn: "Elderly", labelRu: "Пожилые люди" },
      { value: "child_emotional", label: "טיפול רגשי לילדים", labelEn: "Emotional Therapy for Children", labelRu: "Эмоциональная терапия для детей" },
      { value: "teen_therapy", label: "טיפול במתבגרים", labelEn: "Adolescent Therapy", labelRu: "Терапия для подростков" },
    ],
  },
  {
    group: "קהילות ספציפיות",
    groupEn: "Specific Communities",
    groupRu: "Специфические сообщества",
    items: [
      { value: "lgbtq", label: "קהילת LGBTQ+", labelEn: "LGBTQ+ Community", labelRu: "ЛГБТК+-сообщество" },
      { value: "transgender", label: "קהילת הטרנסג'נדר", labelEn: "Transgender Community", labelRu: "Трансгендерное сообщество" },
      { value: "violence_survivors", label: "נפגעי אלימות", labelEn: "Violence Survivors", labelRu: "Пережившие насилие" },
      { value: "sexual_abuse", label: "פגיעה מינית", labelEn: "Sexual Abuse Survivors", labelRu: "Пережившие сексуальное насилие" },
      { value: "tbi", label: "נפגעי ראש (TBI)", labelEn: "Traumatic Brain Injury", labelRu: "Черепно-мозговая травма" },
      { value: "chronic_illness", label: "התמודדות נפשית עם מחלה", labelEn: "Coping with Chronic Illness", labelRu: "Психологическая помощь при болезни" },
      { value: "oncology", label: "פסיכו-אונקולוגיה", labelEn: "Psycho-oncology", labelRu: "Психоонкология" },
    ],
  },
  {
    group: "עבודה, קריירה ופיתוח אישי",
    groupEn: "Work, Career & Personal Growth",
    groupRu: "Работа, карьера и личностный рост",
    items: [
      { value: "work_stress", label: "לחץ בעבודה", labelEn: "Work Stress", labelRu: "Стресс на работе" },
      { value: "burnout", label: "שחיקה", labelEn: "Burnout", labelRu: "Выгорание" },
      { value: "self_empowerment", label: "העצמה אישית", labelEn: "Personal Empowerment", labelRu: "Личностный рост" },
      { value: "career_counseling", label: "ייעוץ קריירה", labelEn: "Career Counseling", labelRu: "Карьерное консультирование" },
      { value: "career_change", label: "הסבת מקצוע", labelEn: "Career Change", labelRu: "Смена профессии" },
      { value: "study_guidance", label: "הכוונה ללימודים", labelEn: "Study Guidance", labelRu: "Помощь в выборе учёбы" },
      { value: "retirement_prep", label: "הכנה לפרישה", labelEn: "Retirement Preparation", labelRu: "Подготовка к выходу на пенсию" },
      { value: "interview_prep", label: "הכנה לראיון עבודה", labelEn: "Job Interview Preparation", labelRu: "Подготовка к собеседованию" },
      { value: "leadership", label: "פיתוח מנהלים", labelEn: "Leadership Development", labelRu: "Развитие лидерства" },
      { value: "org_consulting", label: "ייעוץ ארגוני", labelEn: "Organizational Consulting", labelRu: "Организационное консультирование" },
    ],
  },
  {
    group: "אבחונים",
    groupEn: "Diagnostics & Assessments",
    groupRu: "Диагностика и оценки",
    items: [
      { value: "diag_autism", label: "אבחון אוטיזם", labelEn: "Autism Diagnosis", labelRu: "Диагностика аутизма" },
      { value: "diag_adhd", label: "אבחון הפרעות קשב וריכוז", labelEn: "ADHD Diagnosis", labelRu: "Диагностика СДВГ" },
      { value: "diag_learning", label: "אבחון לקויות למידה", labelEn: "Learning Disability Assessment", labelRu: "Диагностика нарушений обучения" },
      { value: "diag_didactic", label: "אבחון דידקטי / פסיכודידקטי", labelEn: "Didactic / Psycho-Didactic Assessment", labelRu: "Дидактическая диагностика" },
      { value: "diag_developmental", label: "אבחון התפתחותי", labelEn: "Developmental Assessment", labelRu: "Оценка развития" },
      { value: "diag_neuropsych", label: "אבחון נוירופסיכולוגי", labelEn: "Neuropsychological Assessment", labelRu: "Нейропсихологическая диагностика" },
      { value: "diag_psychodiag", label: "אבחון פסיכודיאגנוסטי", labelEn: "Psychodiagnostic Assessment", labelRu: "Психодиагностика" },
      { value: "diag_psychological", label: "אבחון פסיכולוגי", labelEn: "Psychological Assessment", labelRu: "Психологическая оценка" },
      { value: "diag_vocational", label: "אבחון תעסוקתי", labelEn: "Vocational Assessment", labelRu: "Профессиональная диагностика" },
      { value: "risk_assessment", label: "הערכת מסוכנות", labelEn: "Risk Assessment", labelRu: "Оценка риска" },
      { value: "triage", label: "מיון והערכה", labelEn: "Triage & Evaluation", labelRu: "Сортировка и оценка" },
    ],
  },
  {
    group: "שיקום וטיפול מיוחד",
    groupEn: "Rehabilitation & Specialized Care",
    groupRu: "Реабилитация и специализированная помощь",
    items: [
      { value: "addiction", label: "התמכרויות", labelEn: "Addiction", labelRu: "Зависимости" },
      { value: "mental_rehab", label: "שיקום נפגעי נפש", labelEn: "Psychiatric Rehabilitation", labelRu: "Психиатрическая реабилитация" },
      { value: "criminal_rehab", label: "שיקום עבריינים", labelEn: "Offender Rehabilitation", labelRu: "Реабилитация правонарушителей" },
      { value: "crisis_intervention", label: "טיפול במצבי משבר", labelEn: "Crisis Intervention", labelRu: "Кризисная интервенция" },
      { value: "geropsychiatry", label: "פסיכוגריאטריה", labelEn: "Geropsychiatry", labelRu: "Гериатрическая психиатрия" },
      { value: "sport_psychology", label: "פסיכולוגיה של הספורט", labelEn: "Sport Psychology", labelRu: "Спортивная психология" },
    ],
  },
];

// ── TREATMENT METHODS (שיטות טיפול) ────────────────────────────────────────

export const TREATMENT_METHOD_GROUPS = [
  {
    group: "גישות קוגניטיביות-התנהגותיות",
    groupEn: "Cognitive-Behavioral Approaches",
    groupRu: "Когнитивно-поведенческие подходы",
    items: [
      { value: "cbt", label: "טיפול קוגניטיבי-התנהגותי (CBT)", labelEn: "CBT – Cognitive Behavioral Therapy", labelRu: "КПТ – Когнитивно-поведенческая терапия" },
      { value: "dbt", label: "טיפול התנהגותי דיאלקטי (DBT)", labelEn: "DBT – Dialectical Behavior Therapy", labelRu: "ДПТ – Диалектическая поведенческая терапия" },
      { value: "act", label: "טיפול בקבלה ומחויבות (ACT)", labelEn: "ACT – Acceptance & Commitment Therapy", labelRu: "ACT – Терапия принятия и ответственности" },
      { value: "rebt", label: "טיפול רציונלי-אמוטיבי (REBT)", labelEn: "REBT – Rational Emotive Behavior Therapy", labelRu: "РЭПТ – Рационально-эмотивная поведенческая терапия" },
      { value: "sfbt", label: "טיפול ממוקד-פתרון (SFBT)", labelEn: "SFBT – Solution-Focused Brief Therapy", labelRu: "Краткосрочная терапия, ориентированная на решение" },
      { value: "schema", label: "סכמה תרפיה", labelEn: "Schema Therapy", labelRu: "Схема-терапия" },
      { value: "mbsr_mbct", label: "טיפול מבוסס מיינדפולנס (MBSR/MBCT)", labelEn: "Mindfulness-Based Therapy (MBSR/MBCT)", labelRu: "Терапия на основе осознанности (MBSR/MBCT)" },
      { value: "reality_therapy", label: "טיפול במציאות (Reality Therapy)", labelEn: "Reality Therapy", labelRu: "Терапия реальностью" },
    ],
  },
  {
    group: "גישות דינמיות ופסיכואנליטיות",
    groupEn: "Psychodynamic & Psychoanalytic",
    groupRu: "Психодинамические и психоаналитические подходы",
    items: [
      { value: "psychodynamic", label: "טיפול פסיכודינמי", labelEn: "Psychodynamic Therapy", labelRu: "Психодинамическая терапия" },
      { value: "psychoanalysis", label: "פסיכואנליזה", labelEn: "Psychoanalysis", labelRu: "Психоанализ" },
      { value: "jungian", label: "פסיכואנליזה יונגיאנית", labelEn: "Jungian Psychoanalysis", labelRu: "Юнгианский психоанализ" },
      { value: "lacanian", label: "פסיכואנליזה לאקאניאנית", labelEn: "Lacanian Psychoanalysis", labelRu: "Лакановский психоанализ" },
      { value: "dynamic_focused", label: "טיפול דינמי ממוקד", labelEn: "Focused Dynamic Therapy", labelRu: "Фокусированная динамическая терапия" },
      { value: "ipt", label: "פסיכותרפיה בין-אישית (IPT)", labelEn: "IPT – Interpersonal Therapy", labelRu: "МЛТ – Межличностная терапия" },
      { value: "dream_analysis", label: "פירוש חלומות", labelEn: "Dream Analysis", labelRu: "Анализ сновидений" },
    ],
  },
  {
    group: "גישות הומניסטיות ואקזיסטנציאליות",
    groupEn: "Humanistic & Existential",
    groupRu: "Гуманистические и экзистенциальные подходы",
    items: [
      { value: "humanistic", label: "טיפול בגישה הומניסטית", labelEn: "Humanistic Therapy", labelRu: "Гуманистическая терапия" },
      { value: "existential", label: "טיפול בגישה אקזיסטנציאליסטית", labelEn: "Existential Therapy", labelRu: "Экзистенциальная терапия" },
      { value: "gestalt", label: "טיפול גשטאלט (Gestalt)", labelEn: "Gestalt Therapy", labelRu: "Гештальт-терапия" },
      { value: "logotherapy", label: "לוגותרפיה", labelEn: "Logotherapy", labelRu: "Логотерапия" },
      { value: "buddhist_psychotherapy", label: "פסיכותרפיה בודהיסטית", labelEn: "Buddhist Psychotherapy", labelRu: "Буддийская психотерапия" },
      { value: "philosophical_counseling", label: "ייעוץ פילוסופי", labelEn: "Philosophical Counseling", labelRu: "Философское консультирование" },
    ],
  },
  {
    group: "גישות גוף-נפש וסומטיות",
    groupEn: "Somatic & Body-Mind",
    groupRu: "Соматические и телесно-ориентированные подходы",
    items: [
      { value: "emdr", label: "EMDR", labelEn: "EMDR", labelRu: "EMDR" },
      { value: "se_somatic", label: "חוויה סומטית (Somatic Experiencing – SE)", labelEn: "Somatic Experiencing (SE)", labelRu: "Соматическое переживание (SE)" },
      { value: "sensorimotor", label: "פסיכותרפיה סנסורית-מוטורית", labelEn: "Sensorimotor Psychotherapy", labelRu: "Сенсомоторная психотерапия" },
      { value: "somatic_psychotherapy", label: "פסיכותרפיה גופנית", labelEn: "Body-Oriented Psychotherapy", labelRu: "Телесно-ориентированная терапия" },
      { value: "movement_dance", label: "טיפול בתנועה ומחול", labelEn: "Dance & Movement Therapy", labelRu: "Танцевально-двигательная терапия" },
      { value: "movement_therapy", label: "טיפול בתנועה", labelEn: "Movement Therapy", labelRu: "Двигательная терапия" },
      { value: "biofeedback", label: "ביופידבק", labelEn: "Biofeedback", labelRu: "Биофидбэк" },
      { value: "neurofeedback", label: "נוירופידבק (Neurofeedback)", labelEn: "Neurofeedback", labelRu: "Нейрофидбэк" },
    ],
  },
  {
    group: "טיפולים יצירתיים ובעלי חיים",
    groupEn: "Creative & Animal-Assisted Therapies",
    groupRu: "Творческие и зоотерапия",
    items: [
      { value: "art_therapy", label: "טיפול באמנות חזותית", labelEn: "Art Therapy", labelRu: "Арт-терапия" },
      { value: "music_therapy", label: "טיפול במוזיקה", labelEn: "Music Therapy", labelRu: "Музыкальная терапия" },
      { value: "drama_therapy", label: "טיפול בדרמה", labelEn: "Drama Therapy", labelRu: "Драматерапия" },
      { value: "psychodrama", label: "פסיכודרמה", labelEn: "Psychodrama", labelRu: "Психодрама" },
      { value: "play_therapy", label: "טיפול במשחק (Play Therapy)", labelEn: "Play Therapy", labelRu: "Игровая терапия" },
      { value: "animal_assisted", label: "טיפול רגשי בעזרת בעלי חיים", labelEn: "Animal-Assisted Therapy", labelRu: "Анималотерапия" },
      { value: "equine_therapy", label: "רכיבה טיפולית", labelEn: "Equine Therapy", labelRu: "Иппотерапия" },
      { value: "bibliotherapy", label: "ביבליותרפיה", labelEn: "Bibliotherapy", labelRu: "Библиотерапия" },
    ],
  },
  {
    group: "היפנוזה, NLP ואימון",
    groupEn: "Hypnosis, NLP & Coaching",
    groupRu: "Гипноз, НЛП и коучинг",
    items: [
      { value: "hypnosis", label: "היפנוזה / היפנותרפיה רפואית", labelEn: "Hypnotherapy / Medical Hypnosis", labelRu: "Гипнотерапия" },
      { value: "nlp", label: "NLP – תכנות נוירו-לשוני", labelEn: "NLP – Neuro-Linguistic Programming", labelRu: "НЛП – Нейролингвистическое программирование" },
      { value: "guided_imagery", label: "דמיון מודרך", labelEn: "Guided Imagery", labelRu: "Управляемые образы" },
      { value: "coaching", label: "Coaching – אימון אישי", labelEn: "Personal Coaching", labelRu: "Личностный коучинг" },
      { value: "couples_coaching", label: "אימון זוגי", labelEn: "Couples Coaching", labelRu: "Коучинг для пар" },
      { value: "children_coaching", label: "אימון ילדים", labelEn: "Children's Coaching", labelRu: "Коучинг для детей" },
      { value: "adhd_coaching", label: "אימון לבעלי הפרעות קשב", labelEn: "ADHD Coaching", labelRu: "Коучинг при СДВГ" },
      { value: "teen_coaching", label: "אימון למתבגרים", labelEn: "Teen Coaching", labelRu: "Коучинг для подростков" },
      { value: "family_coaching", label: "אימון משפחתי", labelEn: "Family Coaching", labelRu: "Семейный коучинг" },
      { value: "business_coaching", label: "אימון עסקי", labelEn: "Business Coaching", labelRu: "Бизнес-коучинг" },
    ],
  },
  {
    group: "פסיכיאטריה וטיפול תרופתי",
    groupEn: "Psychiatry & Medical Treatments",
    groupRu: "Психиатрия и медикаментозное лечение",
    items: [
      { value: "psychiatric", label: "טיפול פסיכיאטרי / ייעוץ פסיכיאטרי", labelEn: "Psychiatric Treatment & Consultation", labelRu: "Психиатрическое лечение и консультирование" },
      { value: "pharmacotherapy", label: "טיפול תרופתי (פסיכופרמקולוגיה)", labelEn: "Pharmacotherapy (Psychopharmacology)", labelRu: "Фармакотерапия (психофармакология)" },
      { value: "ect", label: "טיפול בנזעי חשמל (ECT)", labelEn: "ECT – Electroconvulsive Therapy", labelRu: "ЭСТ – Электросудорожная терапия" },
      { value: "tms", label: "גירוי מגנטי מוחי (TMS/dTMS)", labelEn: "TMS / dTMS – Transcranial Magnetic Stimulation", labelRu: "ТМС / дТМС – Транскраниальная магнитная стимуляция" },
      { value: "psychedelic_therapy", label: "טיפול פסיכדלי (קטמין/אסקטמין)", labelEn: "Psychedelic Therapy (Ketamine/Esketamine)", labelRu: "Психоделическая терапия (кетамин/эскетамин)" },
      { value: "child_adolescent_psychiatry", label: "פסיכיאטריה של ילד ומתבגר", labelEn: "Child & Adolescent Psychiatry", labelRu: "Детская и подростковая психиатрия" },
    ],
  },
  {
    group: "גישות שונות נוספות",
    groupEn: "Other Approaches",
    groupRu: "Другие подходы",
    items: [
      { value: "eft", label: "טיפול ממוקד אמוציות (EFT)", labelEn: "EFT – Emotionally Focused Therapy", labelRu: "ЭФТ – Эмоционально-фокусированная терапия" },
      { value: "integrative", label: "טיפול אינטגרטיבי", labelEn: "Integrative Therapy", labelRu: "Интегративная терапия" },
      { value: "brief_therapy", label: "טיפול קצר מועד", labelEn: "Brief Therapy", labelRu: "Краткосрочная терапия" },
      { value: "dyadic", label: "טיפול דיאדי", labelEn: "Dyadic Therapy", labelRu: "Диадная терапия" },
      { value: "group_therapy", label: "טיפול קבוצתי", labelEn: "Group Therapy", labelRu: "Групповая терапия" },
      { value: "group_facilitation", label: "הנחיית קבוצות", labelEn: "Group Facilitation", labelRu: "Фасилитация групп" },
      { value: "online_therapy", label: "טיפול / ייעוץ אונליין", labelEn: "Online Therapy", labelRu: "Онлайн-терапия" },
      { value: "mindfulness", label: "מיינדפולנס", labelEn: "Mindfulness", labelRu: "Майндфулнес / Осознанность" },
      { value: "psychoeducation", label: "פסיכואדיוקציה", labelEn: "Psychoeducation", labelRu: "Психообразование" },
      { value: "mediation", label: "גישור", labelEn: "Mediation", labelRu: "Медиация" },
      { value: "social_skills", label: "מיומנויות חברתיות", labelEn: "Social Skills Training", labelRu: "Тренинг социальных навыков" },
      { value: "occupational_therapy", label: "ריפוי בעיסוק", labelEn: "Occupational Therapy", labelRu: "Трудотерапия" },
      { value: "neuropsychology", label: "נוירופסיכולוגיה", labelEn: "Neuropsychology", labelRu: "Нейропсихология" },
      { value: "individual_therapy", label: "טיפול פרטני", labelEn: "Individual Therapy", labelRu: "Индивидуальная терапия" },
    ],
  },
];

// Flat arrays for quick lookup
export const ALL_SPECIALIZATIONS = SPECIALIZATION_GROUPS.flatMap(g => g.items);
export const ALL_TREATMENT_METHODS = TREATMENT_METHOD_GROUPS.flatMap(g => g.items);

// Build label maps: value → label (Hebrew by default, or by lang)
export const buildLabelMap = (groups, lang = "he") =>
  Object.fromEntries(
    groups.flatMap(g => g.items).map(item => [
      item.value,
      lang === "en" ? item.labelEn : lang === "ru" ? item.labelRu : item.label,
    ])
  );

export const SPEC_LABELS_HE = buildLabelMap(SPECIALIZATION_GROUPS, "he");
export const METHOD_LABELS_HE = buildLabelMap(TREATMENT_METHOD_GROUPS, "he");