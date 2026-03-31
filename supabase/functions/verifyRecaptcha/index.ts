// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// מגדירים כותרות CORS כדי שה-React יוכל לדבר עם הפונקציה
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // טיפול בבקשות Preflight של הדפדפן
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. קבלת ה-Token מהצד הקדמי (React)
    const { token } = await req.json()

    if (!token) {
      throw new Error("לא התקבל אסימון אימות (Token)")
    }

    // שליפת המפתח הסודי מהגדרות הסביבה של סופאבייס
    const secretKey = Deno.env.get('RECAPTCHA_SECRET_KEY')

    // 2. שליחת ה-Token ל-API של גוגל יחד עם המפתח הסודי
    const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    
    const recaptchaRes = await fetch(googleVerifyUrl, {
      method: 'POST',
    })
    
    const recaptchaData = await recaptchaRes.json()

    // 3. בדיקת הציון (Score)
    const isHuman = recaptchaData.success && recaptchaData.score >= 0.5;

    if (!isHuman) {
      return new Response(
        JSON.stringify({ success: false, message: "הפעולה זוהתה כבוט", score: recaptchaData.score }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // אם הכל תקין והציון גבוה מ-0.5, מאשרים את הפעולה
    return new Response(
      JSON.stringify({ success: true, score: recaptchaData.score }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})