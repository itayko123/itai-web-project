import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// 1. הגדרת כותרי CORS - חובה כדי שהפרונטאנד יוכל לדבר עם הפונקציה!
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 2. תפיסת בקשת ה-Preflight של הדפדפן כדי למנוע קריסות CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 3. חילוץ הטוקן מהבקשה שהפרונטאנד שלך (React) שלח
    const { token } = await req.json()
    
    if (!token) {
      throw new Error("Token is missing from request")
    }

    // 4. שליפת המפתח הסודי מתוך משתני הסביבה של Supabase
    const secretKey = Deno.env.get('RECAPTCHA_SECRET_KEY')
    
    // 5. קריאה לגוגל (שים לב ל-await, הוא מונע EarlyDrop!)
    const googleResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      // חובה להעביר את הנתונים ככה לגוגל, לא כ-JSON
      body: `secret=${secretKey}&response=${token}`,
    })

    const googleData = await googleResponse.json()

    // 6. החזרת התשובה המסודרת לפרונטאנד שלך
    return new Response(
      JSON.stringify({
        success: googleData.success,
        score: googleData.score,
        "error-codes": googleData["error-codes"],
        message: googleData.success ? "Verification successful" : "הפעולה זוהתה כבוט",
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      },
    )
  } catch (error) {
    // 7. אם הייתה קריסה כלשהי, אנחנו תופסים אותה פה ומחזירים מסודר במקום להתרסק
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 400 
      },
    )
  }
})