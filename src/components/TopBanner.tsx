import { useState } from 'react';

const TopBanner = () => {
  const [language, setLanguage] = useState('English');

  const handleLanguageChange = () => {
    setLanguage(prevLang => (prevLang === 'English' ? 'Arabic' : 'English'));
  };

  return (
    <div className=" flex flex-col sm:flex-row justify-between items-center mx-auto w-[95vw] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[76vw] text-primary py-4 sm:py-6  text-[12px] sm:text-[14px] font-poppins">
      {/* Language Switcher - small circle indicators */}
      <div className="mb-4 sm:mb-0">
        <button
          onClick={handleLanguageChange}
          className="flex items-center gap-2 bg-transparent p-0 border-0"
          aria-label={`Switch language to ${language === 'English' ? 'Arabic' : 'English'}`}
          title={language === 'English' ? 'العربية' : 'English'}
        >
          {/* English indicator */}
          <span
            className={`w-3 h-3 rounded-full transition-all duration-200 shadow-sm inline-block ${language === 'English' ? 'bg-[#03045E] ring-2 ring-[#90E0EF]/40 scale-110' : 'bg-[#CBD5E1]/60'}`}
            aria-hidden="true"
            title="English"
          />

          {/* Arabic indicator */}
          <span
            className={`w-3 h-3 rounded-full transition-all duration-200 shadow-sm inline-block ${language === 'Arabic' ? 'bg-[#06B6D4] ring-2 ring-[#90E0EF]/40 scale-110' : 'bg-[#CBD5E1]/60'}`}
            aria-hidden="true"
            title="العربية"
          />
        </button>
      </div>

      {/* Center: Pharmacy Support Hotline */}
      <div className="text-center mb-2 sm:mb-0">
        <span className="text-[#03045E]">HIRSTO Support Hotline: 800-HIRSTO</span>
        <span className="text-[#03045E] mx-2 hidden sm:inline">|</span>
        <span className="text-[#03045E] hidden sm:inline">Available 24/7</span>
      </div>

      {/* Right: Partner Information */}
      <div>
        <span className="text-[#03045E]">Join 500+ Partner Pharmacies</span>
      </div>

    </div>
  );
};

export default TopBanner;