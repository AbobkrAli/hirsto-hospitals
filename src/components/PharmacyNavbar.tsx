import TopBanner from './TopBanner';
import Logo from '../assets/logo.svg';
import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';

const PharmacyNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname === path) return true;
    if (path !== '/' && location.pathname.startsWith(path + '/')) return true;
    return false;
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy', href: '/privacy' },
  ];

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      // If not on home page, navigate to home first
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      scrollToSection(href.substring(1));
    } else {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="relative z-30 w-full " ref={navRef}>
      <TopBanner />

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeMobileMenu} />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <Link to="/" onClick={closeMobileMenu}><img src={Logo} alt="Logo" className="w-28" /></Link>
                <button onClick={closeMobileMenu} className="p-2"><X className="w-6 h-6 text-gray-600" /></button>
              </div>
              <nav className="flex-1 p-5 overflow-y-auto">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    item.href.startsWith('#') ? (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.href)}
                        className={`block w-full text-left py-2 text-lg font-medium ${isActive(item.href)
                          ? 'text-[#0077B6] bg-blue-50 px-3 rounded-lg'
                          : 'text-[#152A55]'
                          }`}
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => handleNavClick(item.href)}
                        className={`block py-2 text-lg font-medium ${isActive(item.href)
                          ? 'text-[#0077B6] bg-blue-50 px-3 rounded-lg'
                          : 'text-[#152A55]'
                          }`}
                      >
                        {item.name}
                      </Link>
                    )
                  ))}
                </div>
                <div className="pt-8 mt-8 border-t">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="block w-full py-3 text-center text-lg text-white bg-[#152A55] rounded-lg"
                  >
                    Get Started
                  </Link>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Navbar */}
      <div className="w-[95vw] sm:w-[92vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] mx-auto px-2 sm:px-4 md:px-6 py-3">
        <div className=" w-full border-1 rounded-[20px] lg:rounded-[30px] border-[#90E0EF] py-3 px-4 md:px-8">
          <div className="flex items-center w-full justify-between">
            <Link to="/"><img src={Logo} alt="Logo" className="h-7 lg:h-8" /></Link>

            <nav className="hidden lg:flex items-center justify-center gap-x-4 xl:gap-x-6">
              {navItems.map((item) => (
                item.href.startsWith('#') ? (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`transition-colors ${isActive(item.href)
                      ? 'text-[#0077B6] font-semibold border-b-2 border-[#0077B6] pb-1'
                      : 'text-[#152A55] hover:text-[#0077B6]'
                      }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className={`transition-colors ${isActive(item.href)
                      ? 'text-[#0077B6] font-semibold border-b-2 border-[#0077B6] pb-1'
                      : 'text-[#152A55] hover:text-[#0077B6]'
                      }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-x-4">
              <Link
                to="/login"
                className="bg-[#152A55] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Join Us
              </Link>
            </div>

            <div className="lg:hidden">
              <button onClick={toggleMobileMenu} className="text-[#152A55] p-2"><Menu className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyNavbar;
