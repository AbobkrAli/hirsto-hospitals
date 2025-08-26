import { motion } from 'framer-motion';
import { Shield, BarChart3, Megaphone, Zap, Stethoscope, FlaskConical } from 'lucide-react';

const PharmacyFeatures = () => {
  const features = [
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Guaranteed Sales Channel",
      description: "We only send confirmed, prepaid prescriptions from licensed doctors — no time wasted on incomplete orders.",
      highlight: "100% Confirmed Orders"
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "Inventory & Demand Analytics",
      description: "Our dashboard predicts demand so you stock the right medicines at the right time.",
      highlight: "Partner & Health Hub plans",
      planRestricted: true
    },
    {
      icon: <Megaphone className="w-10 h-10" />,
      title: "Marketing Support",
      description: "We run campaigns to attract customers in your area and direct them to your pharmacy.",
      highlight: "Partner & Health Hub plans",
      planRestricted: true
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Deep Technical Integration",
      description: "Real-time stock updates via API keep your availability accurate online.",
      highlight: "Health Hub plan only",
      planRestricted: true
    },
    {
      icon: <Stethoscope className="w-10 h-10" />,
      title: "Physical Health Hub",
      description: "Transform part of your pharmacy into a mini health center with biometric kiosks and instant telemedicine.",
      highlight: "Health Hub plan only",
      planRestricted: true
    },
    {
      icon: <FlaskConical className="w-10 h-10" />,
      title: "Clinical Trial Participation",
      description: "Earn additional revenue by being a local center for pharmaceutical research programs.",
      highlight: "Health Hub plan only",
      planRestricted: true
    }
  ];

  return (
    <div id="features" className="py-16 lg:py-24 bg-[#F9F9F9]">
      <div className="w-[95vw] sm:w-[90vw] max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#03045E] mb-6">
            Key Features & Benefits
          </h2>
          <p className="text-lg sm:text-xl text-[#03045E]/70 max-w-3xl mx-auto mb-8">
            Why Pharmacies Love Hirsto
          </p>
          <div className="text-[#90E0EF] text-lg font-semibold">
            Everything you need to compete and win in the digital marketplace
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-white p-8 rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
                feature.planRestricted ? 'border-[#90E0EF]/40' : 'border-[#90E0EF]/20'
              }`}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#90E0EF]/10 rounded-bl-2xl"></div>
              
              {/* Plan indicator */}
              {feature.planRestricted && (
                <div className="absolute top-4 right-4">
                  <div className="bg-[#90E0EF] text-[#03045E] text-xs px-2 py-1 rounded-full font-medium">
                    Premium
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="relative z-10 mb-6">
                <div className="w-16 h-16 bg-[#90E0EF] rounded-xl flex items-center justify-center text-[#03045E]">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-bold text-[#03045E] mb-4">{feature.title}</h3>
                <p className="text-[#03045E]/70 leading-relaxed mb-4">{feature.description}</p>
                
                {/* Highlight */}
                <div className={`inline-block px-3 py-2 rounded-xl text-sm font-medium ${
                  feature.planRestricted 
                    ? 'bg-[#90E0EF]/20 text-[#03045E]'
                    : 'bg-[#03045E]/10 text-[#03045E]'
                }`}>
                  {feature.highlight}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 bg-white p-8 rounded-3xl shadow-xl border border-[#90E0EF]/20"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#03045E] mb-4">
              Complete Feature Overview
            </h3>
            <p className="text-lg text-[#03045E]/70">
              See what's included in each partnership level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Core Features",
                subtitle: "Available in all plans",
                features: ["Guaranteed Sales Channel", "Order Management System", "24/7 Support"]
              },
              {
                title: "Partner Features",
                subtitle: "Partner & Health Hub plans",
                features: ["Inventory Analytics", "Marketing Support", "Priority Placement", "Performance Insights"]
              },
              {
                title: "Health Hub Features",
                subtitle: "Health Hub plan only",
                features: ["API Integration", "Physical Health Hub", "Clinical Trials", "Advanced Analytics"]
              }
            ].map((category, index) => (
              <div key={index} className="bg-[#90E0EF]/5 p-6 rounded-2xl border border-[#90E0EF]/20">
                <h4 className="text-lg font-bold text-[#03045E] mb-2">{category.title}</h4>
                <p className="text-sm text-[#03045E]/60 mb-4">{category.subtitle}</p>
                <ul className="space-y-2">
                  {category.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2 text-sm text-[#03045E]/70">
                      <div className="w-1.5 h-1.5 bg-[#90E0EF] rounded-full flex-shrink-0"></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PharmacyFeatures;
