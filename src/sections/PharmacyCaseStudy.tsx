import { motion } from 'framer-motion';
import { TrendingUp, Clock, DollarSign, Users } from 'lucide-react';

const PharmacyCaseStudy = () => {
  const stats = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "150+",
      label: "Extra Paid Prescriptions",
      description: "Monthly increase in confirmed orders"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      value: "$55",
      label: "Average Order Value",
      description: "Per prescription value"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      value: "2 Months",
      label: "Time to Results",
      description: "From onboarding to impact"
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: "25%",
      label: "Customer Growth",
      description: "New customer acquisition"
    }
  ];

  const timeline = [
    {
      phase: "Before Hirsto",
      title: "Declining Walk-in Sales",
      description: "Al-Shifa Pharmacy was losing customers to a big chain's delivery app and facing decreased foot traffic.",
      challenges: [
        "30% decrease in daily customers",
        "No online presence or delivery service",
        "Losing market share to competitors",
        "Inventory management challenges"
      ],
      bgColor: "bg-red-50",
      iconBg: "bg-red-100",
      textColor: "text-red-600"
    },
    {
      phase: "After Hirsto",
      title: "Digital Transformation Success",
      description: "Within 2 months, Al-Shifa became a thriving digital pharmacy with consistent growth.",
      benefits: [
        "150+ guaranteed paid prescriptions monthly",
        "Predictive analytics preventing shortages",
        "Expanded customer base beyond local area",
        "Streamlined operations with digital tools"
      ],
      bgColor: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-600"
    }
  ];

  return (
    <div id="case-study" className="py-16 lg:py-24 bg-white">
      <div className="w-[95vw] sm:w-[90vw] max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#03045E] mb-6">
            Real-Life Impact:
            <span className="block text-[#90E0EF] mt-2">See the Difference</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#03045E]/70 max-w-3xl mx-auto">
            How Al-Shifa Pharmacy transformed their business with Hirsto
          </p>
        </motion.div>

        {/* Before/After Timeline */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {timeline.map((period, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`${period.bgColor} rounded-3xl p-8 border border-opacity-20`}
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${period.iconBg} rounded-2xl mb-6`}>
                {index === 0 ? (
                  <TrendingUp className={`w-8 h-8 ${period.textColor} rotate-180`} />
                ) : (
                  <TrendingUp className={`w-8 h-8 ${period.textColor}`} />
                )}
              </div>
              
              <div className={`text-sm font-semibold ${period.textColor} mb-2`}>
                {period.phase}
              </div>
              
              <h3 className="text-2xl font-bold text-[#03045E] mb-4">
                {period.title}
              </h3>
              
              <p className="text-[#03045E]/70 mb-6">
                {period.description}
              </p>
              
              <div className="space-y-3">
                {(period.challenges || period.benefits).map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      index === 0 ? 'bg-red-400' : 'bg-green-400'
                    }`}></div>
                    <span className="text-sm text-[#03045E]/80">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-[#90E0EF]/10 rounded-2xl p-8 lg:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold text-[#03045E] mb-4">
              The Numbers Speak for Themselves
            </h3>
            <p className="text-[#03045E]/70">
              Al-Shifa Pharmacy's transformation metrics after partnering with Hirsto
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#03045E] rounded-xl mb-4 text-white">
                  {stat.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-[#03045E] mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-[#03045E] mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-[#03045E]/70">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

  {/* Customer testimonial removed as requested */}
      </div>
    </div>
  );
};

export default PharmacyCaseStudy;
