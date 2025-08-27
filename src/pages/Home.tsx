import { useEffect } from 'react';
import PharmacyNavbar from '../components/PharmacyNavbar';


import Footer from '../components/Footer';
import HeroSection from '../sections/HeroSection';
import ChallengeSection from '../sections/ChallengeSection';
import IntroductionSection from '../sections/IntroductionSection';
import FeaturesSection from '../sections/FeaturesSection';
import PackagesSection from '../sections/PackagesSection';
import WhyPartnerSection from '../sections/WhyPartnerSection';
import CTASection from '../sections/CTASection';

const Home = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      {/* Navbar */}
      <PharmacyNavbar />

      <HeroSection />
      <ChallengeSection />
      <IntroductionSection />
      <FeaturesSection />
      <PackagesSection />
      <WhyPartnerSection />
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
