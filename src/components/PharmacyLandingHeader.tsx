import { useState } from 'react'
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';

const PharmacyLandingHeader = () => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };



  return (
    <section className="relative overflow-hidden ">
      {/* Transparent Navbar */}
      <div className="relative z-30 w-full">

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeMobileMenu}
            />

            {/* Mobile Menu Panel */}
            <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <Link to="/" onClick={closeMobileMenu}>
                  <img
                    src={Logo}
                    alt="Logo"
                    className="w-[120px] h-[24px] cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  />
                </Link>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Menu Items */}
              <nav className="p-6">
                <div className="space-y-6">
                  {[
                    { name: "Home", href: "/", isLink: true },
                    { name: "Contact", href: "/contact", isLink: true },
                    { name: "FAQ", href: "/faq", isLink: true },
                    { name: "Privacy", href: "/privacy", isLink: true },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-[#152A55] text-lg font-medium hover:text-[#0077B6] transition-colors py-2"
                      onClick={closeMobileMenu}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </nav>

              {/* Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Pharmacy Support Hotline
                  </p>
                  <p className="text-lg font-semibold text-[#152A55]">
                    800-HIRSTO
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Available 24/7
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fully Transparent Floating Navigation Container */}
        <div className="md:mb-18 w-[95vw] sm:w-[92vw] md:w-[90vw] lg:w-[85vw] xl:w-[80vw] mx-auto px-2 sm:px-4 md:px-6 ">
          <div className="bg-transparent backdrop-blur-sm w-full border border-[#90E0EF] rounded-[15px] sm:rounded-[20px] md:rounded-[25px] lg:rounded-[30px] relative py-2 sm:py-3 md:py-4 lg:py-5 xl:py-6 px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Decorative oval elements */}
            <div className="h-[18px] w-[13px] sm:h-[20px] sm:w-[15px] md:h-[22px] md:w-[16px] lg:h-[25px] lg:w-[18px] absolute top-1/2 -translate-y-1/2 left-0 -translate-x-1/2 bg-[#03045E] rounded-full "></div>
            <div className="h-[18px] w-[13px] sm:h-[20px] sm:w-[15px] md:h-[22px] md:w-[16px] lg:h-[25px] lg:w-[18px] absolute top-1/2 -translate-y-1/2 -right-0 translate-x-1/2 bg-[#03045E] rounded-full "></div>

            <div className="flex items-center w-full justify-between">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0">
                <Link to="/">
                  <img
                    src={Logo}
                    alt="Logo"
                    className="w-[100px] h-[20px] xs:w-[120px] xs:h-[24px] sm:w-[130px] sm:h-[26px] md:w-[140px] md:h-[28px] lg:w-[150px] lg:h-[30px] cursor-pointer hover:opacity-80 transition-opacity duration-200"
                  />
                </Link>
              </div>

              {/* Navigation Menu - Pharmacy Links */}
              <div className="hidden sm:flex items-center justify-center flex-1 mx-4">
                <nav className="flex items-center space-x-1 md:space-x-2 lg:space-x-4 xl:space-x-6">
                  {[
                    { name: "Home", href: "/", isLink: true },
                    { name: "Contact", href: "/contact", isLink: true },
                    { name: "FAQ", href: "/faq", isLink: true },
                    { name: "Privacy", href: "/privacy", isLink: true },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="text-[#152A55] text-[10px] sm:text-[11px] md:text-[13px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px] font-medium hover:text-[#0077B6] transition-colors whitespace-nowrap px-1 sm:px-2 py-1 rounded-md hover:bg-white/10"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <button className="text-[#293F6D] cursor-pointer hover:text-[#03045E] font-medium text-sm transition-colors duration-200">
                    SIGN IN
                  </button>
                </Link>
                <Link to={"/register"}>
                  <button className="bg-[#03045E] cursor-pointer text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-[#1e3a8a] transition-all duration-300 hover:scale-[1.02]">
                    SIGN UP
                  </button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <div className="sm:hidden flex-shrink-0">
                <button
                  onClick={toggleMobileMenu}
                  className="text-[#152A55] p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default PharmacyLandingHeader
