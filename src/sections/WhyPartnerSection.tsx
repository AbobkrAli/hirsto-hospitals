import { Zap, Award, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const WhyPartnerSection = () => {
  const benefits = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Higher Efficiency",
      description: "Eliminate administrative overload so medical teams focus on care.",
      stat: "65% reduction in admin tasks"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Better Care Quality",
      description: "Standardized, proactive, and evidence-based treatment.",
      stat: "40% improvement in outcomes"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Superior Patient Experience",
      description: "A seamless digital journey from booking to follow-up.",
      stat: "95% patient satisfaction"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Sustainable Growth",
      description: "Attract and retain patients through innovation and network visibility.",
      stat: "30% increase in patient volume"
    }
  ];

  return (
    <section className="section-padding bg-gray-50" id="why-partner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="h-4 w-4" />
            <span>Strategic Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-500 mb-6">
            The Strategic Advantage for{' '}
            <span className="text-[#90E0EF]">Your Hospital</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Partner with HIRSTO to transform your hospital into a modern, efficient, 
            and patient-focused healthcare organization that leads the market.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary-500 rounded-xl flex items-center justify-center text-white">
                    {benefit.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-secondary-500 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {benefit.description}
                  </p>
                  <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                    <TrendingUp className="h-4 w-4" />
                    <span>{benefit.stat}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 bg-white p-8 lg:p-12 rounded-2xl shadow-lg"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-secondary-500 mb-4">
              Proven Results from Healthcare Leaders
            </h3>
            <p className="text-lg text-gray-600">
              Join hospitals worldwide that have transformed their operations with HIRSTO
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary-600">500+</div>
              <div className="text-gray-700 font-medium">Hospitals Transformed</div>
              <div className="text-sm text-gray-500">Across 25+ countries</div>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary-600">2M+</div>
              <div className="text-gray-700 font-medium">Patients Served</div>
              <div className="text-sm text-gray-500">Monthly through our platform</div>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-primary-600">99.9%</div>
              <div className="text-gray-700 font-medium">Uptime Guarantee</div>
              <div className="text-sm text-gray-500">24/7 reliable service</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyPartnerSection;
