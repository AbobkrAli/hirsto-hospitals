import { AlertTriangle, DollarSign, Clock, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const ChallengeSection = () => {
  const challenges = [
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Cost Pressure",
      description: "Chronic conditions are driving up long-term care expenses."
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Operational Bottlenecks", 
      description: "Manual patient triage, scheduling, and follow-up waste critical staff time."
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Data Gaps",
      description: "Fragmented systems mean missed opportunities for preventive care and efficiency gains."
    }
  ];

  return (
    <section className="section-padding bg-gray-50" id="challenges">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="h-4 w-4" />
            <span>Critical Issues</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-500 mb-6">
            Why Traditional Hospital Management No Longer Works
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Hospitals are under increasing pressure to deliver high-quality care while battling rising costs 
            and intense competition. Traditional systems are slow, disconnected, and fail to support modern, 
            patient-centric workflows.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 card-hover"
            >
              <div className="text-red-500 mb-6">
                {challenge.icon}
              </div>
              <h3 className="text-xl font-bold text-secondary-500 mb-4">
                {challenge.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {challenge.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 bg-white p-8 rounded-2xl shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-red-500 mb-2">67%</div>
              <p className="text-gray-600">of hospitals report operational inefficiencies</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500 mb-2">42 min</div>
              <p className="text-gray-600">average patient wait time</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-500 mb-2">15%</div>
              <p className="text-gray-600">annual increase in operational costs</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ChallengeSection;
