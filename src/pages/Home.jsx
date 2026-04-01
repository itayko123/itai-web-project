import HeroSearch from "@/components/home/HeroSearch";
import UnderConstructionBanner from "@/components/home/UnderConstructionBanner";
import StatsSection from "@/components/home/StatsSection";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedTherapists from "@/components/home/FeaturedTherapists";
import Testimonials from "@/components/home/Testimonials";
import QuizCTA from "@/components/home/QuizCTA";
import ForTherapistsCTA from "@/components/home/ForTherapistsCTA";
import TipsSection from "@/components/home/TipsSection";
import ArticlesSection from "@/components/home/ArticlesSection";
import ImagesStrip from "@/components/home/ImagesStrip";
import { Helmet } from "react-helmet-async";

export default function Home() {
  return (
    <>
      <Helmet>
        {/* כותרת מנצחת לגוגל - כוללת את מילות המפתח המרכזיות */}
        <title>מצא לי מטפל | אינדקס הפסיכולוגים והמטפלים המומלצים בישראל</title>
        
        {/* תיאור שיווקי שמופיע מתחת ללינק בגוגל (Meta Description) */}
        <meta 
          name="description" 
          content="הפלטפורמה החכמה והחינמית למציאת פסיכולוגים, פסיכותרפיסטים ומטפלים מומלצים. סננו לפי אזור, מחיר, והתמחות, וצרו קשר ישירות עם המטפל ללא עמלות תיווך." 
        />
        
        {/* תגיות לשיתוף ברשתות החברתיות (Open Graph) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="מצא לי מטפל | מאגר המטפלים המומלצים" />
        <meta property="og:description" content="הפלטפורמה החכמה והחינמית למציאת פסיכולוגים, פסיכותרפיסטים ומטפלים מומלצים. צרו קשר ישירות ללא עמלות." />
        <meta property="og:url" content="https://www.findmytherapist.co.il/" />
      </Helmet>

      <div>
        <UnderConstructionBanner />
        <HeroSearch />
        <StatsSection />
        <ImagesStrip />
        <HowItWorks />
        <WhyChooseUs />
        <FeaturedTherapists />
        <TipsSection />
        <ArticlesSection />
        <Testimonials />
        <QuizCTA />
        <ForTherapistsCTA />
      </div>
    </>
  );
}