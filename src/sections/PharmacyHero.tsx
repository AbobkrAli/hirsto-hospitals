import { motion } from 'framer-motion';
import { ArrowRight, Check, Pill } from 'lucide-react';

const PharmacyHero = () => {
  const supportingPoints = [
    "Receive guaranteed, paid prescriptions from certified doctors",
    "No tech headaches — we set up everything for you",
    "Serve a wider customer base without hiring more staff",
    "Data insights to manage stock and increase profits"
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-white py-20 lg:pb-32 lg:pt-16 overflow-hidden">
      {/* Simple Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#90E0EF]/8 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-[#03045E]/5 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-block mb-6"
              >
                <div className="bg-[#90E0EF]/10 border border-[#90E0EF]/20 rounded-full px-5 py-2">
                  <span className="text-[#03045E] font-medium text-sm">
                    Transform Your Pharmacy into a Digital Powerhouse
                  </span>
                </div>
              </motion.div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#03045E] leading-tight mb-6">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="block"
                >
                  Join the Future of
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="block text-[#90E0EF]"
                >
                  Pharmacy
                </motion.span>
              </h1>

              {/* Subheadline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-xl sm:text-2xl lg:text-3xl text-[#03045E]/80 font-semibold mb-6 leading-relaxed"
              >
                Grow Your Sales, Streamline Operations, and Win More Customers with Hirsto
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg text-[#03045E]/70 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0"
              >
                Hirsto is your complete digital sales and logistics solution for pharmacies. We connect you directly with confirmed, paid prescriptions, manage deliveries, and give you the tools to compete in the modern marketplace.
              </motion.p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mb-10"
            >
              <button
                onClick={() => scrollToSection('packages')}
                className="group bg-[#03045E] hover:bg-[#03045E]/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-3 mx-auto lg:mx-0"
              >
                <span>Partner with Hirsto Today</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </motion.div>

            {/* Supporting Points */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {supportingPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                  className="flex items-start space-x-3 group"
                >
                  <div className="flex-shrink-0 w-6 h-6 bg-[#90E0EF] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Check className="w-4 h-4 text-[#03045E]" />
                  </div>
                  <span className="text-base text-[#03045E]/80 leading-relaxed">{point}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Simple Visual */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Main card */}
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#90E0EF]/20">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#03045E] rounded-xl flex items-center justify-center">
                      <Pill className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#03045E]">Hirsto Dashboard</h3>
                      <p className="text-sm text-[#03045E]/70">Real-time Analytics</p>
                    </div>
                  </div>
                  <div className="w-3 h-3 bg-[#90E0EF] rounded-full animate-pulse"></div>
                </div>

                {/* Simple metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-[#90E0EF]/5 rounded-xl">
                    <div className="text-2xl font-bold text-[#03045E]">+32%</div>
                    <div className="text-sm text-[#03045E]/70">Revenue Growth</div>
                  </div>
                  <div className="text-center p-4 bg-[#90E0EF]/5 rounded-xl">
                    <div className="text-2xl font-bold text-[#03045E]">247</div>
                    <div className="text-sm text-[#03045E]/70">Active Orders</div>
                  </div>
                </div>

                {/* Simple activity */}
                <div className="space-y-3">
                  <div className="text-[#03045E] font-semibold text-sm mb-3">Recent Activity</div>
                  {[
                    { text: "New prescription order", time: "Just now" },
                    { text: "Delivery completed", time: "2 min ago" },
                    { text: "Inventory updated", time: "5 min ago" }
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-[#90E0EF]/5 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-[#90E0EF] rounded-full"></div>
                        <span className="text-[#03045E] text-sm">{activity.text}</span>
                      </div>
                      <span className="text-[#03045E]/60 text-xs">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simple floating badge */}
              <motion.div
                animate={{ y: [-3, 3, -3] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-3 -right-3 bg-[#90E0EF] text-[#03045E] px-3 py-1 rounded-lg shadow-lg text-sm font-semibold"
              >
                Live
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyHero;
