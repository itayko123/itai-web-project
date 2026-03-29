export default function CookiePolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12" dir="rtl">
      <h1 className="text-3xl font-black mb-2">מדיניות עוגיות (Cookies)</h1>
      <p className="text-muted-foreground text-sm mb-8">עדכון אחרון: מרץ 2026</p>

      <div className="space-y-8 text-sm leading-relaxed text-foreground">

        <section>
          <h2 className="text-lg font-bold mb-2">מהן עוגיות?</h2>
          <p>
            עוגיות (Cookies) ואחסון מקומי (Local Storage) הם קבצי טקסט קטנים הנשמרים בדפדפן שלך כאשר אתה מבקר באתר. 
            הן מאפשרות לאתר לזכור מידע על הביקור שלך, כגון שפה מועדפת ופרטי התחברות, מה שמסייע לשפר את חוויית השימוש שלך.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">אילו עוגיות אנו משתמשים בהן?</h2>
          <p className="mb-4 text-muted-foreground">
            האתר שלנו משתמש <strong>אך ורק בעוגיות חיוניות (Strictly Necessary) ובקובצי העדפות פונקציונליים</strong>. 
            איננו משתמשים בעוגיות מעקב (Tracking) או פרסום צד שלישי, ולכן על פי חוקי הפרטיות, שימוש באתר מהווה הסכמה לעוגיות טכניות אלו.
          </p>
          <div className="space-y-4">

            <div className="bg-muted/40 rounded-xl p-4 border border-border">
              <h3 className="font-semibold mb-1">1. עוגיות חיוניות והעדפות</h3>
              <p className="text-muted-foreground">
                נדרשות לתפעול הבסיסי של האתר ולשמירת הבחירות שלך, כדי שלא תצטרך להגדיר אותן מחדש בכל ביקור.
              </p>
              <ul className="mt-2 list-disc list-inside text-muted-foreground space-y-1">
                <li><strong>language</strong> – שמירת העדפת שפת הממשק שבחרת (נשמר באחסון המקומי).</li>
                <li><strong>session_token</strong> – שמירת מצב ההתחברות שלך (אם אתה מחובר למערכת).</li>
              </ul>
            </div>

            <div className="bg-muted/40 rounded-xl p-4 border border-border">
              <h3 className="font-semibold mb-1">2. עוגיות פלטפורמה (Platform Cookies)</h3>
              <p className="text-muted-foreground">
                האתר בנוי על גבי תשתית Supabase. התשתית עשויה להשתמש בעוגיות נוספות לצורך ניהול
                סשנים, אבטחת מידע ותפעול תקין של השירות.
              </p>
            </div>

          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold mb-2">כיצד לשלוט בעוגיות?</h2>
          <p>
            ניתן לשלוט בעוגיות ולמחוק אותן דרך הגדרות הדפדפן שלך. שים/י לב שחסימת עוגיות חיוניות עלולה
            לפגוע בתפקוד האתר (למשל, האתר לא יזכור את השפה שבחרת).
          </p>
          <p className="mt-2">
            למידע נוסף בקר/י ב-{" "}
            <a href="https://www.allaboutcookies.org" target="_blank" rel="noreferrer" className="text-primary underline">
              allaboutcookies.org
            </a>.
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