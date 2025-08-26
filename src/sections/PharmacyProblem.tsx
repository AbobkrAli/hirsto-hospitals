import { motion } from 'framer-motion';
import { TrendingDown, Users, Smartphone, ShoppingCart } from 'lucide-react';

const PharmacyProblem = () => {
  return (
    <div id="problem" className="py-16 lg:py-24 bg-white">
      <div className="w-[95vw] sm:w-[90vw] max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#03045E] mb-6">
            Why Traditional Pharmacies 
            <span className="block text-[#90E0EF] mt-2">Struggle in 2025</span>
          </h2>
          <p className="text-lg sm:text-xl text-[#03045E]/70 max-w-3xl mx-auto">
            The Pharmacy Landscape Has Changed — Here's the Challenge
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Problem Description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <p className="text-lg text-[#03045E]/80 leading-relaxed">
                Pharmacies today face fierce competition from:
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: <ShoppingCart className="w-6 h-6" />,
                    title: "Large retail chains",
                    description: "with massive buying power"
                  },
                  {
                    icon: <Smartphone className="w-6 h-6" />,
                    title: "Instant delivery apps",
                    description: "dominating local markets"
                  },
                  {
                    icon: <Users className="w-6 h-6" />,
                    title: "Specialized online platforms",
                    description: "with loyalty programs"
                  }
                ].map((challenge, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4 p-4 rounded-2xl bg-[#90E0EF]/5 border border-[#90E0EF]/20"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-[#03045E]/10 rounded-xl flex items-center justify-center text-[#03045E]">
                      {challenge.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#03045E] text-lg mb-1">
                        {challenge.title}
                      </h4>
                      <p className="text-[#03045E]/70">
                        {challenge.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-[#03045E]/5 p-6 rounded-2xl border-l-4 border-[#90E0EF]">
                <p className="text-[#03045E]/80 leading-relaxed">
                  Customers expect seamless digital ordering, instant payments, and home delivery. 
                  Meanwhile, managing stock across thousands of medicines is harder than ever. 
                  Many independent and small-chain pharmacies are losing customers — not because 
                  they're bad at service, but because they can't match the digital convenience competitors offer.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right - Visual Impact */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-[#03045E]/5 to-[#90E0EF]/10 p-8 rounded-3xl">
              {/* Traditional vs Modern Comparison */}
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-[#03045E] mb-4">The Reality Check</h3>
                </div>

                {/* Stats showing the problem */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-white rounded-2xl shadow-sm border border-[#90E0EF]/20">
                    <div className="flex items-center justify-center mb-3">
                      <TrendingDown className="w-8 h-8 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-red-500 mb-1">-30%</div>
                    <div className="text-sm text-[#03045E]/70">Walk-in Customers</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white rounded-2xl shadow-sm border border-[#90E0EF]/20">
                    <div className="flex items-center justify-center mb-3">
                      <Users className="w-8 h-8 text-[#03045E]" />
                    </div>
                    <div className="text-2xl font-bold text-[#03045E] mb-1">75%</div>
                    <div className="text-sm text-[#03045E]/70">Expect Digital Service</div>
                  </div>
                </div>

                {/* Problem illustration */}
                <div className="relative">
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#90E0EF]/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm font-semibold text-[#03045E]">Traditional Pharmacy</div>
                      <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded-full">Struggling</div>
                    </div>
                    <div className="space-y-3 text-sm text-[#03045E]/70">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span>Limited to walk-in customers</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span>Manual inventory management</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span>No online presence</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                        <span>Cash-only or limited payment options</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyProblem;
