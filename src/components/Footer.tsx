import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Youtube, Github, ArrowRight, Download } from 'lucide-react';
import logo from '../assets/logo.svg';
import googlePlay from '../assets/google.png';
import appleImage from '../assets/app-store.png';

const footerLinks = [
  {
    title: 'For Pharmacies',
    links: [
      { name: 'How HIERSTO Works', href: '#' },
      { name: 'Digital Transformation', href: '#' },
      { name: 'Partnership Program', href: '#' },
      { name: 'Online Prescription Management', href: '#' },
      { name: 'Inventory Solutions', href: '#' },
      { name: 'Pricing for Pharmacies', href: '#' },
    ],
  },
  {
    title: 'Services',
    links: [
      { name: 'Prescription Processing', href: '#' },
      { name: 'Inventory Management', href: '#' },
      { name: 'Patient Consultation', href: '#' },
      { name: 'Medicine Delivery', href: '#' },
      { name: 'Digital Health Records', href: '#' },
      { name: 'Analytics & Reports', href: '#' },
    ],
  },
  {
    title: 'HIERSTO',
    links: [
      { name: 'About Us', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Media Center', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: Twitter, href: '#', color: 'hover:bg-blue-400' },
  { icon: Linkedin, href: '#', color: 'hover:bg-blue-600' },
  { icon: Youtube, href: '#', color: 'hover:bg-red-500' },
  { icon: Github, href: '#', color: 'hover:bg-gray-800' },
];

function SocialIcon({ icon: Icon }: { icon: React.ComponentType<{ className?: string }> }) {
  return <Icon className="w-5 h-5" />;
}

export default function Footer() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  if (isMobile) {
    return (
      <footer className="relative w-full bg-white text-gray-900 overflow-hidden">
        <div className="relative z-10">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto pt-20 pb-12 px-6">

            {/* Top Section - Company Info */}
            <div className="mb-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-6">

                  <div>
                    <div className="text-4xl font-black bg-[#90E0EF] bg-clip-text text-transparent">
                      <img
                        src={logo}
                        alt="HIERSTO Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 max-w-2xl text-lg leading-relaxed mb-8">
                  Transform your pharmacy with HIERSTO's comprehensive digital solutions. Join our network of 500+ partner pharmacies and revolutionize your patient care with cutting-edge technology and seamless integrations.
                </p>

                {/* Stats removed as requested */}
              </div>

              {/* App Downloads */}
              <div className="flex flex-col gap-4 items-start lg:items-end">
                              <div className="mb-2 group cursor-pointer">
                <div className="flex items-center gap-3 lg:justify-end">
                  <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                    <Download className="w-5 h-5 text-blue-900 group-hover:text-blue-700 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors duration-300">
                    Download Our App
                  </h3>
                </div>
              </div>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      name: 'App Store',
                      icon: appleImage,
                      subtitle: 'Download on the'
                    },
                    {
                      name: 'Google Play',
                      icon: googlePlay,
                      subtitle: 'Get it on'
                    }
                  ].map((app) => (
                    <a
                      key={app.name}
                      href="#"
                      className="group bg-black border border-gray-800 rounded-2xl px-6 py-4 flex items-center gap-4 hover:bg-gray-900 hover:border-gray-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 hover:-translate-y-1"
                    >
                      <img src={app.icon} alt={app.name} className="w-8 h-8 object-contain" />
                      <div>
                        <div className="text-gray-300 text-xs">{app.subtitle}</div>
                        <div className="text-white font-bold">{app.name}</div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              {footerLinks.map((section) => (
                <div key={section.title}>
                  <h4 className="uppercase text-xs tracking-widest text-[#1e3a8a] mb-6 font-bold flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#90E0EF] rounded-full" />
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-gray-600 hover:text-[#90E0EF] transition-all duration-300 text-sm font-medium flex items-center gap-2 group hover:translate-x-2 hover:scale-105"
                        >
                          <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#90E0EF] group-hover:scale-150 transition-all duration-300" />
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Newsletter Section */}
              <div>
                <h4 className="uppercase text-xs tracking-widest text-[#1e3a8a] mb-6 font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#90E0EF] rounded-full" />
                  Stay Connected
                </h4>
                <div className="text-xl font-bold mb-4 bg-[#90E0EF] bg-clip-text text-transparent">
                  Get Partnership Updates
                </div>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#90E0EF] focus:border-[#90E0EF] transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#1e3a8a] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Subscribe Now
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </form>
              </div>
            </div>



            {/* Bottom Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pt-8 border-t border-gray-200">
              {/* Copyright */}
              <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()} HIERSTO. All rights reserved. | Built with ❤️ for better healthcare.
              </div>

              {/* Legal Links */}
              <div className="flex flex-wrap gap-6 text-sm">
                <Link
                  to="/privacy-policy"
                  className="text-gray-500 hover:text-[#90E0EF] transition-colors duration-300 font-medium"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/privacy-policy"
                  className="text-gray-500 hover:text-[#90E0EF] transition-colors duration-300 font-medium"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/privacy-policy"
                  className="text-gray-500 hover:text-[#90E0EF] transition-colors duration-300 font-medium"
                >
                  Partnership Agreement
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.icon.name}
                    href={social.href}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg ${social.color}`}
                  >
                    <SocialIcon icon={social.icon} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative w-full bg-white text-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 hidden lg:block">
        {/* Gradient Blobs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-[#90E0EF]/5 to-[#1e3a8a]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-r from-[#1e3a8a]/5 to-[#90E0EF]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto pt-20 pb-12 px-6">

          {/* Top Section - Company Info */}
          <div className="mb-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <div className="text-4xl font-black bg-[#90E0EF] bg-clip-text text-transparent">
                    <img
                      src={logo}
                      alt="HIERSTO Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <p className="text-gray-600 max-w-2xl text-lg leading-relaxed mb-8">
                Transform your pharmacy with HIERSTO's comprehensive digital solutions. Join our network of 500+ partner pharmacies and revolutionize your patient care with cutting-edge technology and seamless integrations.
              </p>

              {/* Stats removed as requested */}
            </div>

            {/* App Downloads */}
            <div className="flex flex-col gap-4 items-start lg:items-end">
                            <div className="mb-2 group cursor-pointer">
                <div className="flex items-center gap-3 lg:justify-end">
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors duration-300">
                    Download 
                  </h3>
                  <div className="p-2 rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors duration-300">
                    <Download className="w-5 h-5 text-blue-900 group-hover:text-blue-700 transition-colors duration-300" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  {
                    name: 'App Store',
                    icon: appleImage,
                    subtitle: 'Download on the'
                  },
                  {
                    name: 'Google Play',
                    icon: googlePlay,
                    subtitle: 'Get it on'
                  }
                ].map((app) => (
                  <a
                    key={app.name}
                    href="#"
                    className="group bg-black border border-gray-800 rounded-2xl px-6 py-4 flex items-center gap-4 hover:bg-gray-900 hover:border-gray-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <img src={app.icon} alt={app.name} className="w-8 h-8 object-contain" />
                    <div>
                      <div className="text-gray-300 text-xs">{app.subtitle}</div>
                      <div className="text-white font-bold">{app.name}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h4 className="uppercase text-xs tracking-widest text-[#1e3a8a] mb-6 font-bold flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#90E0EF] rounded-full" />
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-gray-600 hover:text-[#90E0EF] transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
                      >
                        <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#90E0EF] transition-colors duration-300" />
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Newsletter Section */}
            <div>
              <h4 className="uppercase text-xs tracking-widest text-[#1e3a8a] mb-6 font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-[#90E0EF] rounded-full" />
                Support
              </h4>
              <ul className="space-y-3">
                {[
                  { name: 'Help Center', href: '#' },
                  { name: 'FAQ', href: '/faq' }
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-[#90E0EF] transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
                    >
                      <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#90E0EF] transition-colors duration-300" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Large Logo Section */}
          <div className="mb-16 pt-8 border-t border-gray-200 flex justify-center">
            <div className="w-[80vw] max-w-6xl">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div className="w-[60vw] h-full font-black bg-[#90E0EF] bg-clip-text text-transparent">
                    <img
                      src={logo}
                      alt="HIERSTO Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pt-8 border-t border-gray-200">
            {/* Copyright */}
            <div className="text-gray-500 text-sm">
              © {new Date().getFullYear()} HIERSTO. All rights reserved. | Built with love for better healthcare.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-gray-500 hover:text-[#90E0EF] transition-colors duration-300 font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                to="/privacy-policy"
                className="text-gray-500 hover:text-[#90E0EF] transition-colors duration-300 font-medium"
              >
                Terms of Service
              </Link>
              <Link
                to="/privacy-policy"
                className="text-gray-500 hover:text-[#90E0EF] transition-colors duration-300 font-medium"
              >
                Partnership Agreement
              </Link>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.icon.name}
                  href={social.href}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 hover:-translate-y-1 ${social.color}`}
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
