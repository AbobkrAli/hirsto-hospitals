import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import logoImage from '../../assets/logo.svg';

const footerLinks = [
  {
    title: 'Healthcare Platform',
    links: [
      { name: 'AI Diagnostics', href: '#' },
      { name: 'Patient Portal', href: '#' },
      { name: 'Telemedicine', href: '#' },
      { name: 'Medical Records', href: '#' },
      { name: 'Appointment System', href: '#' },
      { name: 'Health Analytics', href: '#' },
    ],
  },
  {
    title: 'Medical Resources',
    links: [
      { name: 'Clinical Studies', href: '#' },
      { name: 'Health Articles', href: '#' },
      { name: 'Medical Guidelines', href: '#' },
      { name: 'API Documentation', href: '#' },
      { name: 'Research Papers', href: '#' },
      { name: 'Training Materials', href: '#' },
    ],
  },
  {
    title: 'Healthcare Solutions',
    links: [
      { name: 'For Hospitals', href: '#' },
      { name: 'For Clinics', href: '#' },
      { name: 'For Specialists', href: '#' },
      { name: 'For Patients', href: '#' },
      { name: 'Enterprise Solutions', href: '#' },
      { name: 'Integration Services', href: '#' },
    ],
  },
];

const socialLinks = [
  { icon: 'twitter', href: '#', color: 'hover:bg-blue-400' },
  { icon: 'linkedin', href: '#', color: 'hover:bg-blue-600' },
  { icon: 'youtube', href: '#', color: 'hover:bg-red-500' },
  { icon: 'github', href: '#', color: 'hover:bg-gray-800' },
];

function SocialIcon({ icon }: { icon: string }) {
  if (icon === 'twitter')
    return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.7c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 0 1 2 19.54c-.32 0-.63-.02-.94-.06A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 24 4.59a8.36 8.36 0 0 1-2.54.7z" /></svg>;
  if (icon === 'linkedin')
    return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.88v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z" /></svg>;
  if (icon === 'youtube')
    return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>;
  if (icon === 'github')
    return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>;
  return null;
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
                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={logoImage}
                      alt="HEARSTO Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="text-4xl font-black bg-gradient-to-r from-[#1e3a8a] via-[#06b6d4] to-[#1e3a8a] bg-clip-text text-transparent">
                      HEARSTO
                    </div>
                    <div className="text-[#06b6d4] font-semibold text-sm">Early detection better tomorrow</div>
                  </div>
                </div>

                <p className="text-gray-600 max-w-2xl text-lg leading-relaxed mb-8">
                  Revolutionizing healthcare through AI-powered diagnostics, seamless patient management,
                  and cutting-edge medical technology. Trusted by healthcare professionals worldwide.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 max-w-md">
                  {[
                    { number: '1M+', label: 'Patients' },
                    { number: '5000+', label: 'Doctors' },
                    { number: '99.9%', label: 'Uptime' }
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl font-black bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] bg-clip-text text-transparent">
                        {stat.number}
                      </div>
                      <div className="text-gray-500 text-sm font-semibold">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* App Downloads */}
              <div className="flex flex-col gap-4 items-start lg:items-end">
                <div className="uppercase text-xs tracking-widest text-[#06b6d4] mb-4 font-bold">Download Our App</div>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      name: 'App Store',
                      icon: '🍎',
                      subtitle: 'Download on the'
                    },
                    {
                      name: 'Google Play',
                      icon: '🤖',
                      subtitle: 'Get it on'
                    }
                  ].map((app) => (
                    <a
                      key={app.name}
                      href="#"
                      className="group bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 flex items-center gap-4 hover:bg-[#06b6d4]/5 hover:border-[#06b6d4]/30 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      <div className="text-3xl">{app.icon}</div>
                      <div>
                        <div className="text-gray-500 text-xs">{app.subtitle}</div>
                        <div className="text-gray-900 font-bold">{app.name}</div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-[#06b6d4]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
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
                    <div className="w-2 h-2 bg-[#06b6d4] rounded-full" />
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-gray-600 hover:text-[#06b6d4] transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
                        >
                          <div className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#06b6d4] transition-colors duration-300" />
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
                  <div className="w-2 h-2 bg-[#06b6d4] rounded-full" />
                  Stay Connected
                </h4>
                <div className="text-xl font-bold mb-4 bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] bg-clip-text text-transparent">
                  Get Healthcare Updates
                </div>
                <form className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all duration-300"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#06b6d4] to-[#1e3a8a] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Subscribe Now
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </span>
                  </button>
                </form>
              </div>
            </div>

            {/* Additional Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pt-8 border-t border-gray-200">
              {[
                {
                  title: 'Legal & Compliance',
                  links: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Cookie Policy']
                },
                {
                  title: 'Support & Help',
                  links: ['Help Center', 'Live Chat Support', '24/7 Emergency', 'Training Resources']
                },
                {
                  title: 'Healthcare Network',
                  links: ['Hospital Partners', 'Medical Specialists', 'Research Institutes', 'Healthcare Providers']
                }
              ].map((section) => (
                <div key={section.title}>
                  <h5 className="text-[#1e3a8a] font-bold mb-4 text-sm">{section.title}</h5>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-gray-500 hover:text-[#06b6d4] transition-colors text-xs font-medium"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Partners/Clients Section */}
            <div className="mb-16 pt-8 border-t border-gray-200">
              <h4 className="text-center text-gray-500 text-sm font-semibold mb-8">
                Trusted by Leading Healthcare Organizations
              </h4>
              <div className="flex flex-wrap items-center justify-center gap-12">
                {[
                  { name: 'Mayo Clinic', icon: '🏥' },
                  { name: 'Johns Hopkins', icon: '🔬' },
                  { name: 'Cleveland Clinic', icon: '❤️' },
                  { name: 'Kaiser Permanente', icon: '🩺' },
                  { name: 'Mount Sinai', icon: '🧬' },
                  { name: 'Mass General', icon: '💊' }
                ].map((partner) => (
                  <div
                    key={partner.name}
                    className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300"
                  >
                    <div className="text-2xl">{partner.icon}</div>
                    <div className="text-gray-700 font-semibold text-sm">{partner.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pt-8 border-t border-gray-200">
              {/* Copyright */}
              <div className="text-gray-500 text-sm">
                © {new Date().getFullYear()} HEARSTO. All rights reserved. | Built with ❤️ for better healthcare.
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.icon}
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
        {/* Animated Healthcare Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.5, 1, 0.5],
              // rotate: [0, 180, 360],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 10,
            }}
          >
            <div className="text-[#06b6d4]/20 text-xl">
              {['🏥', '💊', '🩺', '❤️', '🧬', '🔬'][Math.floor(Math.random() * 6)]}
            </div>
          </motion.div>
        ))}

        {/* Gradient Blobs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-[#06b6d4]/5 to-[#1e3a8a]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: 360,
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-80 h-80 bg-gradient-to-r from-[#1e3a8a]/5 to-[#06b6d4]/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: -360,
            opacity: [0.4, 0.2, 0.4],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto pt-20 pb-12 px-6">

          {/* Top Section - Company Info */}
          <motion.div
            className="mb-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex-1">
              <motion.div
                className="flex items-center gap-4 mb-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl overflow-hidden shadow-lg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <img
                    src={logoImage}
                    alt="HEARSTO Logo"
                    className="w-full h-full object-contain"
                  />
                </motion.div>
                <div>
                  <motion.div
                    className="text-4xl font-black bg-gradient-to-r from-[#1e3a8a] via-[#06b6d4] to-[#1e3a8a] bg-clip-text text-transparent"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  >
                    HEARSTO
                  </motion.div>
                  <div className="text-[#06b6d4] font-semibold text-sm">Early detection better tomorrow</div>
                </div>
              </motion.div>

              <motion.p
                className="text-gray-600 max-w-2xl text-lg leading-relaxed mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Revolutionizing healthcare through AI-powered diagnostics, seamless patient management,
                and cutting-edge medical technology. Trusted by healthcare professionals worldwide.
              </motion.p>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-8 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
              >
                {[
                  { number: '1M+', label: 'Patients' },
                  { number: '5000+', label: 'Doctors' },
                  { number: '99.9%', label: 'Uptime' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="text-2xl font-black bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] bg-clip-text text-transparent"
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear",
                        delay: index * 0.5
                      }}
                    >
                      {stat.number}
                    </motion.div>
                    <div className="text-gray-500 text-sm font-semibold">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* App Downloads with Animation */}
            <motion.div
              className="flex flex-col gap-4 items-start lg:items-end"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="uppercase text-xs tracking-widest text-[#06b6d4] mb-4 font-bold">Download Our App</div>
              <div className="flex flex-col gap-3">
                {[
                  {
                    name: 'App Store',
                    icon: '🍎',
                    subtitle: 'Download on the'
                  },
                  {
                    name: 'Google Play',
                    icon: '🤖',
                    subtitle: 'Get it on'
                  }
                ].map((app, index) => (
                  <motion.a
                    key={app.name}
                    href="#"
                    className="group bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 flex items-center gap-4 hover:bg-[#06b6d4]/5 hover:border-[#06b6d4]/30 transition-all duration-300 shadow-md hover:shadow-lg"
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="text-3xl">{app.icon}</div>
                    <div>
                      <div className="text-gray-500 text-xs">{app.subtitle}</div>
                      <div className="text-gray-900 font-bold">{app.name}</div>
                    </div>
                    <motion.svg
                      className="w-5 h-5 text-gray-400 group-hover:text-[#06b6d4]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </motion.svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Links Section */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {footerLinks.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: sectionIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.h4
                  className="uppercase text-xs tracking-widest text-[#1e3a8a] mb-6 font-bold flex items-center gap-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    className="w-2 h-2 bg-[#06b6d4] rounded-full"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  {section.title}
                </motion.h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <motion.li
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: linkIndex * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <motion.a
                        href={link.href}
                        className="text-gray-600 hover:text-[#06b6d4] transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-[#06b6d4] transition-colors duration-300"
                          whileHover={{ scale: 1.5 }}
                        />
                        {link.name}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}

            {/* Newsletter Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.h4
                className="uppercase text-xs tracking-widest text-[#1e3a8a] mb-6 font-bold flex items-center gap-2"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-2 h-2 bg-[#06b6d4] rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Stay Connected
              </motion.h4>
              <motion.div
                className="text-xl font-bold mb-4 bg-gradient-to-r from-[#1e3a8a] to-[#06b6d4] bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Get Healthcare Updates
              </motion.div>
              <motion.form
                className="space-y-4"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <motion.input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#06b6d4] focus:border-[#06b6d4] transition-all duration-300"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#06b6d4] to-[#1e3a8a] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Subscribe Now
                    <motion.svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <path d="M9 18l6-6-6-6" />
                    </motion.svg>
                  </span>
                </motion.button>
              </motion.form>
            </motion.div>
          </motion.div>

          {/* Additional Links */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 pt-8 border-t border-gray-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            {[
              {
                title: 'Legal & Compliance',
                links: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Cookie Policy']
              },
              {
                title: 'Support & Help',
                links: ['Help Center', 'Live Chat Support', '24/7 Emergency', 'Training Resources']
              },
              {
                title: 'Healthcare Network',
                links: ['Hospital Partners', 'Medical Specialists', 'Research Institutes', 'Healthcare Providers']
              }
            ].map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h5 className="text-[#1e3a8a] font-bold mb-4 text-sm">{section.title}</h5>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <motion.a
                        href="#"
                        className="text-gray-500 hover:text-[#06b6d4] transition-colors text-xs font-medium"
                        whileHover={{ x: 3 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Partners/Clients Section */}
          <motion.div
            className="mb-16 pt-8 border-t border-gray-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.h4
              className="text-center text-gray-500 text-sm font-semibold mb-8"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Trusted by Leading Healthcare Organizations
            </motion.h4>
            <div className="flex flex-wrap items-center justify-center gap-12">
              {[
                { name: 'Mayo Clinic', icon: '🏥' },
                { name: 'Johns Hopkins', icon: '🔬' },
                { name: 'Cleveland Clinic', icon: '❤️' },
                { name: 'Kaiser Permanente', icon: '🩺' },
                { name: 'Mount Sinai', icon: '🧬' },
                { name: 'Mass General', icon: '💊' }
              ].map((partner, index) => (
                <motion.div
                  key={partner.name}
                  className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    y: [0, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="text-2xl">{partner.icon}</div>
                  <div className="text-gray-700 font-semibold text-sm">{partner.name}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Section */}
          <motion.div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 pt-8 border-t border-gray-200"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {/* Copyright */}
            <motion.div
              className="text-gray-500 text-sm"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              © {new Date().getFullYear()} HEARSTO. All rights reserved. | Built with ❤️ for better healthcare.
            </motion.div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.icon}
                  href={social.href}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg ${social.color}`}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <SocialIcon icon={social.icon} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
} 