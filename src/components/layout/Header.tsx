import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/logo.svg';

export default function Header() {
  const [platformMenuOpen, setPlatformMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Simplified Background Blur */}
      <div
        className={`fixed top-0 left-0 w-full h-24 bg-[#F9F9F9] backdrop-blur-xl border-b border-white/20 z-30 transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-95'
          }`}
      />

      {/* Main Header - Simplified animations */}
      <header className="w-full fixed top-0 left-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 relative">
          {/* Updated Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform duration-200">
            {/* Logo Image */}
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <img
                src={logoImage}
                alt="HEARSTO Logo"
                className="w-full  h-full object-contain"
              />
            </div>

            {/* Updated Brand Text */}
            <div className="flex flex-col">
              <span className="font-black text-xl sm:text-2xl bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] bg-clip-text text-transparent tracking-tight select-none">
                HEARSTO
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wider -mt-1 hidden sm:block">
                EARLY DETECTION BETTER TOMORROW
              </span>
            </div>
          </Link>

          {/* Simplified Navigation - Desktop Only */}
          <nav className="hidden lg:flex gap-1 bg-white/70 backdrop-blur-xl rounded-2xl p-2 border border-white/30 shadow-xl relative z-40">
            {/* Platform Dropdown */}
            <div
              className="relative flex items-center group"
              onMouseEnter={() => setPlatformMenuOpen(true)}
              onMouseLeave={() => setPlatformMenuOpen(false)}
            >
              <a
                href="#"
                className="relative px-6 py-3 rounded-xl text-[#1e3a8a] font-semibold hover:bg-white/80 hover:text-cyan-700 transition-all duration-300 flex items-center gap-2 group hover:scale-105 hover:-translate-y-1"
              >
                Platform
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${platformMenuOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>

              {/* Simplified Mega Menu */}
              <AnimatePresence>
                {platformMenuOpen && (
                  <motion.div
                    key="mega-menu"
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[800px] bg-white/95 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 border border-white/30 z-50"
                    onMouseEnter={() => setPlatformMenuOpen(true)}
                    onMouseLeave={() => setPlatformMenuOpen(false)}
                  >
                    <div className="relative z-10">
                      {/* Menu Header */}
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] bg-clip-text text-transparent mb-2">
                          Platform Features
                        </h3>
                        <p className="text-gray-600">Discover our comprehensive suite of tools</p>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        {/* Left Column */}
                        <div className="space-y-2">
                          {[
                            { name: 'Hospitals', icon: '🏥', desc: 'Healthcare management' },
                            { name: 'Pharmacies', icon: '💊', desc: 'Medication tracking' },
                            { name: 'Doctors', icon: '👨‍⚕️', desc: 'Professional portal' }
                          ].map((item) => (
                            <a
                              key={item.name}
                              href="#"
                              className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 transition-all duration-300 hover:translate-x-1"
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-lg">{item.icon}</span>
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-[#1e3a8a] group-hover:text-cyan-700 transition-colors">
                                  {item.name}
                                </div>
                                <div className="text-sm text-gray-500">{item.desc}</div>
                              </div>
                            </a>
                          ))}
                        </div>

                        {/* Middle Column */}
                        <div className="space-y-2">
                          {[
                            { name: 'Students', icon: '👩‍🎓', desc: 'Learning platform' },
                            { name: 'Insurance', icon: '🛡️', desc: 'Coverage management' },
                            { name: 'Nurses', icon: '👩‍⚕️', desc: 'Care coordination' }
                          ].map((item) => (
                            <a
                              key={item.name}
                              href="#"
                              className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white/60 transition-all duration-300 hover:translate-x-1"
                            >
                              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                <span className="text-lg">{item.icon}</span>
                              </div>
                              <div className="flex-1">
                                <div className="font-bold text-[#1e3a8a] group-hover:text-cyan-700 transition-colors">
                                  {item.name}
                                </div>
                                <div className="text-sm text-gray-500">{item.desc}</div>
                              </div>
                            </a>
                          ))}
                        </div>

                        {/* Right Column - Call to Action */}
                        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
                          <div className="text-center mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg mx-auto mb-3">
                              🚀
                            </div>
                            <h4 className="font-bold text-[#1e3a8a] mb-2">Get Started Today</h4>
                            <p className="text-sm text-gray-600 mb-4">Join thousands of healthcare professionals</p>
                          </div>
                          <button className="w-full bg-gradient-to-r from-[#06b6d4] to-[#1e3a8a] text-white py-3 px-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                            Start Free Trial
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Auth Buttons - Desktop Only */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="px-6 py-3 text-[#1e3a8a] font-semibold hover:text-[#06b6d4] transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-gradient-to-r from-[#06b6d4] to-[#1e3a8a] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-3 rounded-xl bg-white/80 backdrop-blur-xl border border-white/30 shadow-lg transition-transform duration-200 hover:scale-105"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className={`transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}>
              {mobileMenuOpen ? (
                <svg className="w-6 h-6 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-[#1e3a8a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay - Simplified animations */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-2xl shadow-2xl z-50 border-l border-white/30"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                <Link to="/" className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={logoImage}
                      alt="HEARSTO Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-lg bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] bg-clip-text text-transparent tracking-tight">
                      HEARSTO
                    </span>
                    <span className="text-xs text-gray-500 font-medium tracking-wider -mt-1">
                      EARLY DETECTION
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:text-[#06b6d4] transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Content - Mega menu content integrated */}
              <div className="p-6 space-y-6 h-full overflow-y-auto">
                {/* Auth Buttons - Mobile */}
                <div className="space-y-3 border-b border-gray-200/50 pb-6">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-6 py-3 border-2 border-[#06b6d4] text-[#06b6d4] font-semibold rounded-xl hover:bg-[#06b6d4] hover:text-white transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#06b6d4] to-[#1e3a8a] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>

                {/* Platform Features Section */}
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] bg-clip-text text-transparent mb-4">
                    Platform Features
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Hospitals', icon: '🏥', desc: 'Healthcare management' },
                      { name: 'Pharmacies', icon: '💊', desc: 'Medication tracking' },
                      { name: 'Doctors', icon: '👨‍⚕️', desc: 'Professional portal' },
                      { name: 'Students', icon: '👩‍🎓', desc: 'Learning platform' },
                      { name: 'Insurance', icon: '🛡️', desc: 'Coverage management' },
                      { name: 'Nurses', icon: '👩‍⚕️', desc: 'Care coordination' }
                    ].map((item) => (
                      <a
                        key={item.name}
                        href="#"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-300 group"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
                          <span className="text-sm">{item.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-[#1e3a8a] group-hover:text-cyan-700 transition-colors text-sm">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500">{item.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Download App Section */}
                <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-lg shadow-lg">
                      📱
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1e3a8a] text-sm">Download Our App</h4>
                      <p className="text-xs text-gray-600">Get HEARSTO on your mobile device</p>
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-[#06b6d4] to-[#1e3a8a] text-white py-2 px-4 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300">
                    Download Now
                  </button>
                </div>

                {/* Footer */}
                <div className="pt-6 text-center text-sm text-gray-500 border-t border-gray-200/50">
                  <p>© 2024 HEARSTO</p>
                  <p className="mt-1">Early detection better tomorrow</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}