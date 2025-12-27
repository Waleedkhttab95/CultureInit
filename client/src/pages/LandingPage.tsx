import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TracksSection from "@/components/TracksSection";
import AudienceSection from "@/components/AudienceSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <SEO />
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <TracksSection />
        <AudienceSection />
      </main>
      <Footer />
    </div>
  );
}