import { motion } from 'framer-motion';
import { Search, Settings, GraduationCap, BarChart3, ArrowRight } from 'lucide-react';

const PharmacyHowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: <Search className="w-8 h-8" />,
      title: "Discovery & Partnership",
      description: "We reach out or you contact us. You'll see exactly how Hirsto works, including how we can increase your sales by up to 20% in confirmed prescriptions.",
      timeline: "Day 1-3"
    },
    {
      number: "02",
      icon: <Settings className="w-8 h-8" />,
      title: "Setup & Integration",
      description: "We provide your pharmacy with a preconfigured tablet running Hirsto's Order Management System. For advanced plans, we integrate with your stock management system via API for real-time availability.",
      timeline: "Week 1-2"
    },
    {
      number: "03",
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Training & Activation",
      description: "We train your staff to handle digital orders — from receiving paid prescriptions to processing orders and assisting customers.",
      timeline: "Week 2-3"
    },
    {
      number: "04",
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Continuous Partnership",
      description: "Your dedicated Partner Success Manager reviews monthly performance with you, shares sales insights, and helps you capture new opportunities.",
      timeline: "Ongoing"
    }
  ];

  return (
    <div id="how-it-works" className="py-16 lg:py-24 bg-white">
      <div className="w-[95vw] sm:w-[90vw] max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#03045E] mb-6">
            From Sign-Up to First Order
            <span className="block text-[#90E0EF] mt-2">
              in 3 Weeks
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-[#03045E]/70 max-w-3xl mx-auto">
            Our streamlined onboarding process makes it easy to get started with minimal disruption to your daily operations.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#90E0EF]/30 transform -translate-y-1/2 z-0"></div>
          
          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative h-full"
              >
                {/* Step Card */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#90E0EF]/20 hover:shadow-xl transition-all duration-300 relative h-full flex flex-col min-h-[400px]">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-6">
                    <div className="w-12 h-12 bg-[#03045E] text-white rounded-xl flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mt-8 mb-6">
                    <div className="w-16 h-16 bg-[#90E0EF]/10 rounded-xl flex items-center justify-center text-[#03045E] mx-auto">
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center flex-grow flex flex-col">
                    <div className="inline-block bg-[#90E0EF]/20 text-[#03045E] px-3 py-1 rounded-full text-sm font-medium mb-3 mx-auto">
                      {step.timeline}
                    </div>
                    <h3 className="text-xl font-bold text-[#03045E] mb-4">{step.title}</h3>
                    <p className="text-[#03045E]/70 leading-relaxed text-sm flex-grow">{step.description}</p>
                  </div>

                  {/* Arrow - Desktop only */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-[#90E0EF]" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-[#90E0EF]/5 p-8 rounded-3xl border border-[#90E0EF]/20">
            <h3 className="text-2xl font-bold text-[#03045E] mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-[#03045E]/70 mb-6 max-w-2xl mx-auto">
              Join hundreds of pharmacies already benefiting from Hirsto's digital transformation platform.
            </p>
            <button 
              onClick={() => {
                const element = document.getElementById('packages');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-[#03045E] hover:bg-[#03045E]/90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              Choose Your Plan
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PharmacyHowItWorks;
