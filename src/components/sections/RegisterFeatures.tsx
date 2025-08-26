import { motion } from 'framer-motion';
import { Heart, Shield, Users, Zap } from 'lucide-react';
import logoImage from '../../assets/logo.svg';

const RegisterFeatures: React.FC = () => {
  const features = [
    { icon: Heart, title: "Patient-Centered Care", desc: "Advanced monitoring and personalized treatment plans" },
    { icon: Shield, title: "Enterprise Security", desc: "HIPAA compliant with end-to-end encryption" },
    { icon: Users, title: "Seamless Collaboration", desc: "Connect with colleagues and specialists instantly" },
    { icon: Zap, title: "AI-Powered Insights", desc: "Smart analytics for better diagnostic decisions" }
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <motion.div
      className="lg:col-span-5 hidden lg:flex flex-col justify-center lg:mt-[150px] space-y-6"
      variants={itemVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="text-left mb-8"
        variants={itemVariants}
      >
        <motion.div
          className="flex gap-4 mb-6"
        >
          <div>
            <img src={logoImage} alt="HEARSTO" className="w-62 " />
            <p className="text-sm text-left font-medium text-[#0077B6]/80 tracking-wider">
              EARLY DETECTION BETTER TOMORROW
            </p>
          </div>
        </motion.div>

        <h2 className="text-2xl lg:text-3xl font-bold font-headlines text-[#1E3E72] mb-2">
          Join Our Medical Network
        </h2>
        <p className="text-[#0077B6]/80 font-subtitles text-base lg:text-lg max-w-2xl mx-auto">
          Create your professional profile and start providing exceptional healthcare with our advanced platform
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-headlines text-[#1E3E72] mb-4">
          Why Choose HEARSTO?
        </h3>
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#90E0EF]/30 hover:bg-white/80 transition-all duration-300"
            whileHover={{ scale: 1.02, x: 5 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { delay: 0.5 + index * 0.1 }
            }}
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br !bg-[#03045E] rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold font-subtitles text-[#1E3E72] text-sm mb-1">
                  {feature.title}
                </h4>
                <p className="text-xs text-[#0077B6]/70 font-paragraphs leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust Indicators */}
      <motion.div
        className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border border-[#90E0EF]/30"
        variants={itemVariants}
      >
        <h4 className="font-semibold font-subtitles text-[#1E3E72] mb-4 text-center">
          Trusted by Healthcare Professionals
        </h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold font-headlines text-[#1E3E72]">50K+</div>
            <div className="text-xs font-subtitles text-[#0077B6]/70">Providers</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-headlines text-[#1E3E72]">99.9%</div>
            <div className="text-xs font-subtitles text-[#0077B6]/70">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-headlines text-[#1E3E72]">24/7</div>
            <div className="text-xs font-subtitles text-[#0077B6]/70">Support</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RegisterFeatures; 