import { motion } from 'framer-motion';
import { Shield, Smartphone, TrendingUp, Users, BarChart3, CheckCircle, ArrowRight } from 'lucide-react';

const PharmacySolution = () => {
  const mainFeatures = [
    "Confirmed, paid prescriptions directly to your system",
    "Ready-to-use order management tablet",
    "Complete delivery logistics with no extra staff",
    "Stock & demand insights to prevent shortages",
    "Joint marketing campaigns to grow your brand"
  ];

  const benefitCards = [
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Tech-Free Setup",
      description: "We handle all technology",
      stat: "100%"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Guaranteed Growth",
      description: "Sales increase confirmed",
      stat: "20%"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expand Reach",
      description: "Beyond physical location",
      stat: "∞"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Smart Analytics",
      description: "Data-driven decisions",
      stat: "24/7"
    }
  ];

  return (
    <div id="solution" className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#03045E] mb-6">
            Hirsto: Your 
            <span className="block text-[#90E0EF] mt-2">
              Digital Lifeline
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-[#03045E]/70 max-w-3xl mx-auto mb-8">
            More Than a Delivery App — We're Your Sales Channel, Tech Partner, and Growth Engine
          </p>
        </motion.div>

        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left Side - Features List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-[#03045E] rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-[#03045E]">Complete Digital Transformation</h3>
                  <p className="text-[#03045E]/70">Everything you need in one platform</p>
                </div>
              </div>

              {mainFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-[#90E0EF]/5 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-[#90E0EF] rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-5 h-5 text-[#03045E]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-[#03045E] font-medium group-hover:text-[#03045E] transition-colors duration-300">
                      {feature}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Benefit Cards Grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="grid grid-cols-2 gap-4">
              {benefitCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="group bg-white p-6 rounded-2xl border-2 border-[#90E0EF]/20 hover:border-[#90E0EF] hover:shadow-lg transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 bg-[#90E0EF]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#90E0EF] group-hover:scale-110 transition-all duration-300">
                    <div className="text-[#03045E] group-hover:text-white transition-colors duration-300">
                      {card.icon}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#03045E] mb-1">{card.stat}</div>
                  <div className="text-sm font-semibold text-[#03045E] mb-1">{card.title}</div>
                  <div className="text-xs text-[#03045E]/70">{card.description}</div>
                </motion.div>
              ))}
            </div>

            {/* Additional Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-6 p-6 bg-[#03045E] rounded-2xl text-white text-center"
            >
              <h4 className="text-lg font-bold mb-2">Join 500+ Partner Pharmacies</h4>
              <p className="text-white/80 text-sm mb-4">Growing their business with Hirsto</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm font-medium">Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="bg-[#90E0EF]/10 p-8 lg:p-12 rounded-3xl border border-[#90E0EF]/30">
            <h3 className="text-3xl sm:text-4xl font-bold text-[#03045E] mb-4">
              Ready to Transform Your Pharmacy?
            </h3>
            <p className="text-lg text-[#03045E]/70 mb-8 max-w-2xl mx-auto">
              Join hundreds of pharmacies already growing with Hirsto's complete digital platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#03045E] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#03045E]/90 hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                <span>Get Started Today</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white text-[#03045E] px-8 py-4 rounded-xl font-semibold text-lg border-2 border-[#90E0EF] hover:bg-[#90E0EF]/10 transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PharmacySolution;
