import { useEffect } from 'react';
import PharmacyNavbar from '../components/PharmacyNavbar';
import PharmacyHero from '../sections/PharmacyHero';
import PharmacyProblem from '../sections/PharmacyProblem';
import PharmacySolution from '../sections/PharmacySolution';
import PharmacyFeatures from '../sections/PharmacyFeatures';
import PharmacyHowItWorks from '../sections/PharmacyHowItWorks';
import PharmacyCaseStudy from '../sections/PharmacyCaseStudy';
import PharmacyPackages from '../sections/PharmacyPackages';
import PharmacyCTA from '../sections/PharmacyCTA';
import Footer from '../components/Footer';

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
      
      {/* Hero Section */}
      <PharmacyHero />

      {/* Problem Section */}
      <PharmacyProblem />

      {/* Solution Section */}
      <PharmacySolution />

      {/* Features Section */}
      <PharmacyFeatures />

      {/* How It Works Section */}
      <PharmacyHowItWorks />

      {/* Case Study Section */}
      <PharmacyCaseStudy />

      {/* Packages Section */}
      <PharmacyPackages />

      {/* CTA Section */}
      <PharmacyCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
