import { motion } from 'framer-motion';
import { ArrowRight, Phone, Calendar, MessageCircle } from 'lucide-react';

const PharmacyCTA = () => {
  const ctaOptions = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Book a Demo",
      description: "See Hirsto in action with a personalized demo",
      buttonText: "Schedule Demo",
      buttonStyle: "bg-[#90E0EF] text-[#03045E] hover:bg-[#90E0EF]/80 border-2 border-[#90E0EF]"
    },
    {
      icon: <ArrowRight className="w-6 h-6" />,
      title: "Become a Partner",
      description: "Start your digital transformation today",
      buttonText: "Join Hirsto Network",
      buttonStyle: "bg-[#03045E] text-white hover:bg-[#03045E]/90 border-2 border-[#03045E]"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Speak to Expert",
      description: "Get personalized advice for your pharmacy",
      buttonText: "Call Now",
      buttonStyle: "bg-white text-[#03045E] border-2 border-[#03045E] hover:bg-[#03045E]/5"
    }
  ];

  const urgencyPoints = [
    "Your competitors are already going digital",
    "Customer expectations are changing rapidly",
    "Every day of delay means lost opportunities",
    "Early partners get exclusive territory benefits"
  ];

  return (
    <div id="cta" className="py-16 lg:py-24 bg-gray-50">
      <div className="w-[95vw] sm:w-[90vw] max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#03045E] mb-6">
            Let's Grow Your Pharmacy
            <span className="block text-[#90E0EF] mt-2">Together</span>
          </h2>
          <p className="text-xl lg:text-2xl text-[#03045E]/80 max-w-3xl mx-auto mb-8">
            Your Next Customer Could Already Be Ordering — Don't Miss Out
          </p>
          <p className="text-lg text-[#03045E]/70 max-w-4xl mx-auto leading-relaxed">
            Join the growing network of pharmacies thriving with Hirsto. We'll handle the technology and delivery — you focus on what you do best: caring for your customers.
          </p>
        </motion.div>

        {/* Main CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {ctaOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 text-center border-2 border-[#90E0EF]/20 hover:border-[#90E0EF]/40 hover:shadow-xl transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#90E0EF]/10 rounded-2xl mb-6 text-[#03045E]">
                {option.icon}
              </div>
              <h3 className="text-xl font-bold text-[#03045E] mb-3">{option.title}</h3>
              <p className="text-[#03045E]/70 mb-6">{option.description}</p>
              <button className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg ${option.buttonStyle}`}>
                {option.buttonText}
              </button>
            </div>
          ))}
        </motion.div>

        {/* Urgency Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-[#90E0EF]/5 rounded-3xl p-8 lg:p-12 border-2 border-[#90E0EF]/20"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-[#03045E] mb-6">
                Why Act Now?
              </h3>
              <div className="space-y-4">
                {urgencyPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#90E0EF] rounded-full mt-3 flex-shrink-0"></div>
                    <span className="text-[#03045E]/80">{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center lg:text-left">
              <div className="bg-white rounded-2xl p-6 mb-6 border border-[#90E0EF]/20 shadow-sm">
                <div className="text-4xl font-bold text-[#03045E] mb-2">500+</div>
                <div className="text-[#03045E]/70">Pharmacies already partnered</div>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-[#90E0EF]/20 shadow-sm">
                <div className="text-4xl font-bold text-[#03045E] mb-2">2-3 weeks</div>
                <div className="text-[#03045E]/70">Average setup time</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-[#03045E]/70 mb-6">
            Have questions? Our pharmacy partnership team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-[#90E0EF]" />
              <span className="text-[#03045E]">+1 (555) 123-Hirsto</span>
            </div>
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-5 h-5 text-[#90E0EF]" />
              <span className="text-[#03045E]">contant@pharmacies.hirsto.com</span>
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="group bg-[#03045E] text-white px-12 py-6 rounded-2xl font-bold text-xl hover:bg-[#03045E]/90 hover:shadow-xl transition-all duration-300 flex items-center space-x-3 mx-auto">
            <span>Start Your Digital Transformation</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PharmacyCTA;
