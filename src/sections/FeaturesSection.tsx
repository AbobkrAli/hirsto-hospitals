import { Bot, Stethoscope, Video, BarChart3, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: "Automated Patient Flow & Smart Pre-Triage",
      description: "Collect patient complaints and history before appointments via an intelligent chatbot, and deliver structured reports to doctors — saving minutes per consultation.",
      color: "bg-blue-500"
    },
    {
      icon: <Stethoscope className="h-8 w-8" />,
      title: "AI-Powered Clinical Decision Support (CDSS)",
      description: "Suggests possible diagnoses, flags drug interactions, and highlights abnormal vital signs in patient history.",
      color: "bg-green-500"
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Integrated Telemedicine Platform",
      description: "Secure video, voice, and text consultations fully connected to your booking and EMR systems.",
      color: "bg-purple-500"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Executive Performance Dashboard",
      description: "Track KPIs like average wait time, patient satisfaction, and doctor productivity for data-driven management decisions.",
      color: "bg-orange-500"
    },
    {
      icon: <GitBranch className="h-8 w-8" />,
      title: "Automated Clinical Pathways (Flagship Feature)",
      description: "Convert complex care protocols (post-surgery follow-ups, chronic disease management) into smart, automated workflows — scheduling appointments, sending educational content, monitoring patient vitals remotely, and alerting staff to risks.",
      color: "bg-red-500"
    }
  ];

  return (
    <section className="section-padding bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Bot className="h-4 w-4" />
            <span>Advanced Features</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-500 mb-6">
            The Tools That Power Your{' '}
            <span className="text-[#90E0EF]">Transformation</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Cutting-edge technology designed to streamline operations, enhance patient care, 
            and drive measurable improvements across your hospital.
          </p>
        </motion.div>

        <div className="space-y-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } flex flex-col lg:flex gap-12 items-center bg-white p-8 lg:p-12 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover`}
            >
              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`${feature.color} p-3 rounded-xl text-white`}>
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Feature {index + 1}
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-secondary-500 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
                <button className="inline-flex items-center space-x-2 text-primary-600 font-semibold hover:text-primary-700 transition-colors duration-200">
                  <span>Learn more</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Visual */}
              <div className="flex-1 relative">
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl">
                  <div className="aspect-video bg-white rounded-xl shadow-lg flex items-center justify-center">
                    <div className={`${feature.color} p-8 rounded-2xl text-white opacity-20`}>
                      {feature.icon}
                    </div>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary-500 rounded-full animate-float opacity-70"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-secondary-500 rounded-full animate-float opacity-70" style={{ animationDelay: '2s' }}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
