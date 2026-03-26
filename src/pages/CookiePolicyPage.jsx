export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-3xl font-black mb-2">מדיניות עוגיות (Cookies)</h1>
      <p className="text-muted-foreground text-sm mb-8">עדכון אחרון: מרץ 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-foreground">

        <section>
          <h2 className="text-lg font-bold mb-2">מהן עוגיות?</h2>
          <p>
            עוגיות (Cookies) הן קבצי טקסט קטנים הנשמרים בדפדפן שלך כאשר אתה מבקר באתר. הן מאפשרות לאתר לזכור
            מידע על הביקור שלך, כגון שפה מועדפת ופרטי התחברות, מה שמסייע לשפר את חוויית השימוש שלך.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">אילו עוגיות אנו משתמשים בהן?</h2>
          <div className="space-y-4">

            <div className="bg-muted/40 rounded-xl p-4 border border-border">
              <h3 className="font-semibold mb-1">1. עוגיות חיוניות (Essential Cookies)</h3>
              <p className="text-muted-foreground">
                עוגיות אלו נדרשות לתפעול הבסיסי של האתר. הן מאפשרות לך לנווט באתר ולהשתמש בתכונותיו,
                כגון גישה לאזורים מאובטחים. ללא עוגיות אלו, שירותים שביקשת אינם יכולים להינתן.
              </p>
              <ul className="mt-2 list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>session_token</strong> – שמירת מצב ההתחברות שלך</li>
                <li><strong>cookie_consent</strong> – שמירת העדפת הסכמתך לעוגיות</li>
              </ul>
            </div>

            <div className="bg-muted/40 rounded-xl p-4 border border-border">
              <h3 className="font-semibold mb-1">2. עוגיות העדפות (Preference Cookies)</h3>
              <p className="text-muted-foreground">
                עוגיות אלו מאפשרות לאתר לזכור בחירות שביצעת (כגון שפת ממשק) ולספק תכונות משופשות ואישיות יותר.
              </p>
              <ul className="mt-2 list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>language</strong> – שמירת העדפת השפה שבחרת</li>
              </ul>
            </div>

            <div className="bg-muted/40 rounded-xl p-4 border border-border">
              <h3 className="font-semibold mb-1">3. עוגיות פלטפורמה (Platform Cookies)</h3>
              <p className="text-muted-foreground">
                האתר בנוי על גבי פלטפורמת Base44. פלטפורמה זו עשויה להשתמש בעוגיות נוספות לצורך ניהול
                סשנים, אבטחה ותפעול השירות.
              </p>
            </div>

          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">כיצד לשלוט בעוגיות?</h2>
          <p>
            ניתן לשלוט בעוגיות ולמחוק אותן דרך הגדרות הדפדפן שלך. שים/י לב שחסימת עוגיות חיוניות עלולה
            לפגוע בתפקוד האתר. רוב הדפדפנים מציעים:
          </p>
          <ul className="mt-2 list-disc list-inside text-muted-foreground space-y-1">
            <li>אפשרות לצפות בעוגיות המאוחסנות ולמחוק אותן</li>
            <li>חסימת עוגיות צד שלישי</li>
            <li>קבלת התראה לפני שמירת עוגיה</li>
          </ul>
          <p className="mt-2">
            למידע נוסף בקר/י ב-{" "}
            <a href="https://www.allaboutcookies.org" target="_blank" rel="noreferrer" className="text-primary underline">
              allaboutcookies.org
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">שינויים במדיניות זו</h2>
          <p>
            אנו עשויים לעדכן מדיניות עוגיות זו מעת לעת. שינויים מהותיים יפורסמו באתר. המשך השימוש באתר לאחר
            פרסום השינויים מהווה הסכמה למדיניות המעודכנת.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">יצירת קשר</h2>
          <p>
            לשאלות בנוגע למדיניות העוגיות שלנו, ניתן לפנות אלינו דרך{" "}
            <a href="/contact" className="text-primary underline">דף יצירת הקשר</a>.
          </p>
        </section>

      </div>
    </div>
  );
}