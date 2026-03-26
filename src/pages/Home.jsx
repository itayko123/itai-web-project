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

export default function Home() {
  return (
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
  );
}