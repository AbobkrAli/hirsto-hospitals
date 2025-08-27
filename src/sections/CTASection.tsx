import { ArrowRight, Rocket, Calendar, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-secondary-500 via-secondary-600 to-primary-600 text-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            <span>Ready to Transform</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Let's Build Your Hospital's{' '}
            <span className="text-primary-200">Digital Future</span>
          </h2>
          <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Partnering with HIRSTO is an investment in the next decade of healthcare delivery. 
            Together, we'll turn your hospital into a connected, data-driven, patient-focused organization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">What happens next?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Discovery & Assessment</h4>
                    <p className="text-white/80">We analyze your current systems and identify transformation opportunities</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Custom Solution Design</h4>
                    <p className="text-white/80">Tailored HIRSTO implementation plan specific to your hospital's needs</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Seamless Implementation</h4>
                    <p className="text-white/80">Complete deployment with training and ongoing support</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/10 p-6 rounded-xl">
              <h4 className="font-semibold mb-4">Get in touch directly</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-4 w-4" />
                  <span>hospital@hirsto.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4" />
                  <span>Schedule a call within 24 hours</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right CTA */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-white p-8 lg:p-12 rounded-2xl shadow-2xl"
          >
            <div className="text-center text-secondary-500 mb-8">
              <h3 className="text-2xl font-bold mb-4">Start Your Digital Transformation</h3>
              <p className="text-gray-600">
                Ready to revolutionize your hospital operations? Let's discuss your vision.
              </p>
            </div>

            <div className="space-y-4">
              <button className="w-full bg-primary-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-primary-600 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                <span>Request a Demo</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button className="w-full border-2 border-secondary-500 text-secondary-500 py-4 px-6 rounded-xl font-semibold hover:bg-secondary-500 hover:text-white transition-all duration-200 flex items-center justify-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Speak to a Transformation Specialist</span>
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>No commitment required • Free consultation • Expert guidance</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-primary-200 mb-2">24h</div>
            <div className="text-white/80">Response Time</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-200 mb-2">90 days</div>
            <div className="text-white/80">Average Implementation</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-200 mb-2">24/7</div>
            <div className="text-white/80">Support Available</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary-200 mb-2">100%</div>
            <div className="text-white/80">ROI Guarantee</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
