import { Zap, Heart, TrendingUp, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const IntroductionSection = () => {
  const goals = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Increase Operational Efficiency",
      description: "Free up doctors and staff from repetitive admin work."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Improve Patient Outcomes",
      description: "Deliver proactive, data-driven care."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Boost Revenue",
      description: "Grow patient loyalty and attract new patients through innovation."
    }
  ];

  return (
    <section className="section-padding bg-white" id="introduction">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <CheckCircle className="h-4 w-4" />
                <span>Complete Solution</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-500 mb-6">
                Your All-in-One Operating System for{' '}
                <span className="text-[#90E0EF]">Hospital Excellence</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                HIRSTO is not "just another hospital software." It's a complete operating system 
                for healthcare delivery, designed to integrate seamlessly into your hospital's 
                workflows and give your teams supercharged efficiency.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-secondary-500 mb-4">Core Strategic Goals:</h3>
              {goals.map((goal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center text-white">
                    {goal.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-secondary-500 mb-2">
                      {goal.title}
                    </h4>
                    <p className="text-gray-600">
                      {goal.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl transform rotate-3"></div>
              
              {/* Main Card */}
              <div className="relative bg-white p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary-500 mb-2">HIRSTO Hospital OS</h3>
                  <p className="text-gray-600">Complete Healthcare Operating System</p>
                </div>

                {/* Feature List */}
                <div className="space-y-4">
                  {[
                    'AI-Powered Clinical Support',
                    'Automated Patient Workflows',
                    'Real-time Analytics Dashboard',
                    'Integrated Telemedicine',
                    'Smart Resource Management'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary-600">500+</div>
                      <div className="text-sm text-gray-600">Hospitals Served</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary-600">99.9%</div>
                      <div className="text-sm text-gray-600">Uptime</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default IntroductionSection;
