import { motion } from 'framer-motion';
import { Check, Crown, Zap, X } from 'lucide-react';

const PharmacyPackages = () => {
  const packages = [
    {
      title: "Accredited Pharmacy",
      subtitle: "Any pharmacy",
      icon: <Zap className="w-8 h-8" />,
      price: "7% commission",
      description: "Perfect for getting started with digital sales",
      features: [
        "Guaranteed Sales Channel",
        "E-commerce & Logistics Platform",
        "Basic order management tablet",
        "Customer support"
      ],
      notIncluded: [
        "Priority Search Placement",
        "Stock & Demand Analytics",
        "Joint Marketing Campaigns"
      ],
      buttonText: "Get Started",
      isPopular: false,
      bgColor: "bg-white",
      borderColor: "border-[#90E0EF]/30"
    },
    {
      title: "Partner Pharmacy",
      subtitle: "Large/small chains",
      icon: <Zap className="w-8 h-8" />,
      price: "Monthly fee + 5% commission",
      description: "Enhanced features for growing pharmacy businesses",
      features: [
        "Everything in Accredited",
        "Priority Search Placement",
        "Stock & Demand Analytics",
        "Joint Marketing Campaigns",
        "Advanced reporting dashboard"
      ],
      notIncluded: [
        "API Stock Integration",
        "Physical Health Hub"
      ],
  buttonText: "Become a Partner",
  isPopular: false,
  bgColor: "bg-white",
  borderColor: "border-[#90E0EF]/30"
    },
  {
      title: "Health Hub",
      subtitle: "Strategic exclusive partners",
      icon: <Crown className="w-8 h-8" />,
      price: "Annual fee + revenue share",
      description: "Complete digital transformation with exclusive benefits",
      features: [
        "Everything in Partner",
        "API Stock Integration",
        "Physical Health Hub setup",
        "Clinical Trial Participation",
        "Biometric kiosks",
        "Exclusive territory rights"
      ],
      notIncluded: [],
  buttonText: "Apply for Health Hub",
  isPopular: false,
  bgColor: "bg-white",
  borderColor: "border-[#90E0EF]/30"
    }
  ];

  return (
    <div id="packages" className="py-16 lg:py-24 bg-[#F9F9F9]">
      <div className="w-[95vw] sm:w-[90vw] max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#03045E] mb-6">
            Flexible Plans for 
            <span className="block text-[#90E0EF] mt-2">Every Pharmacy Size</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#03045E]/70 max-w-3xl mx-auto">
            Choose the Right Plan for Your Pharmacy
          </p>
        </motion.div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`${pkg.bgColor} ${pkg.borderColor} border-2 rounded-2xl p-6 relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col`}
            >
              {/* Popular badge removed - cards are identical */}

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#90E0EF]/10 rounded-xl flex items-center justify-center text-[#03045E] mx-auto mb-4">
                  {pkg.icon}
                </div>
                <h3 className="text-xl font-bold text-[#03045E] mb-2">{pkg.title}</h3>
                <p className="text-[#03045E]/60 text-sm mb-4">{pkg.subtitle}</p>
                <div className="text-2xl font-bold text-[#03045E] mb-2">{pkg.price}</div>
                <p className="text-[#03045E]/70 text-sm">{pkg.description}</p>
              </div>

              {/* Features */}
              <div className="flex-grow mb-6">
                <div className="space-y-3">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-[#90E0EF] mt-0.5 flex-shrink-0" />
                      <span className="text-[#03045E]/80 text-sm">{feature}</span>
                    </div>
                  ))}
                  {pkg.notIncluded.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3 opacity-50">
                      <X className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-500 text-sm line-through">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 bg-[#90E0EF]/10 text-[#03045E] hover:bg-[#90E0EF]/20 border border-[#90E0EF]/30`}>
                {pkg.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-[#90E0EF]/20">
            <h3 className="text-2xl font-bold text-[#03045E] mb-4">
              Not Sure Which Plan Is Right for You?
            </h3>
            <p className="text-[#03045E]/70 mb-6 max-w-2xl mx-auto">
              Our team can help you choose the perfect plan based on your pharmacy size, customer base, and growth goals.
            </p>
            <button className="bg-[#90E0EF] hover:bg-[#90E0EF]/90 text-[#03045E] px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
              Schedule a Consultation
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PharmacyPackages;
