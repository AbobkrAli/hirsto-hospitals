import { Check, Star, Building2, Building, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const PackagesSection = () => {
  const packages = [
    {
      name: "HIRSTO Clinic",
      description: "For small clinics (1-5 doctors)",
      price: "AED 10,000",
      period: "/month",
      icon: <Building2 className="h-8 w-8" />,
      features: [
        "Smart booking (in-person & telehealth)",
        "Telemedicine platform",
        "Simple electronic patient records",
        "Listing in HIRSTO network"
      ],
      popular: false,
      color: "border-gray-200"
    },
    {
      name: "HIRSTO Medical Center",
      description: "For mid-sized centers and multi-specialty clinics",
      price: "AED 30,000",
      period: "/month",
      icon: <Building className="h-8 w-8" />,
      features: [
        "All Clinic features",
        "Automated pre-triage with doctor summaries",
        "AI clinical decision support",
        "Efficiency analytics dashboard",
        "Basic EMR integration"
      ],
      popular: true,
      color: "border-primary-500"
    },
    {
      name: "HIRSTO Hospital OS",
      description: "For large hospitals seeking strategic digital transformation",
      price: "AED 60,000",
      period: "/month",
      icon: <Zap className="h-8 w-8" />,
      features: [
        "All Medical Center features",
        "Automated Clinical Pathways design & implementation",
        "Deep integration with HIS/EMR",
        "Population health analytics",
        "Custom AI model training on your hospital data"
      ],
      popular: false,
      color: "border-secondary-500",
      note: "+ setup fees for integration & pathway design"
    }
  ];

  return (
    <section className="section-padding bg-white" id="packages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4" />
            <span>Partnership Packages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-500 mb-6">
            Choose the Right Fit for{' '}
            <span className="text-[#90E0EF]">Your Institution</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Scalable solutions designed to grow with your healthcare organization, 
            from small clinics to large hospital systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white border-2 ${pkg.color} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 card-hover flex flex-col h-full ${
                pkg.popular ? 'transform scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${
                  pkg.popular ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  {pkg.icon}
                </div>
                <h3 className="text-2xl font-bold text-secondary-500 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-6">{pkg.description}</p>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-sm text-gray-500">From</span>
                    <span className="text-4xl font-bold text-secondary-500">{pkg.price}</span>
                    <span className="text-gray-500">{pkg.period}</span>
                  </div>
                  {pkg.note && (
                    <p className="text-sm text-gray-500">{pkg.note}</p>
                  )}
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {pkg.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 ${
                  pkg.popular 
                    ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-lg hover:shadow-xl'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600'
                }`}>
                  Get Started
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-600 mb-6">
            Need a custom solution? Let's discuss your specific requirements.
          </p>
          <button className="bg-secondary-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary-600 transition-all duration-200 shadow-lg hover:shadow-xl">
            Contact Sales Team
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PackagesSection;
