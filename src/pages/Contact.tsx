import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Logo from '../assets/logo.svg';
// import PageTransition from '../components/standaloneComponents/PageTransition';
import Footer from '../components/Footer';
import PharmacyNavbar from '../components/PharmacyNavbar';

const Contact = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    // <PageTransition>
    <div className="min-h-screen bg-white">

      <div
        className='relative'
        style={{
          background: 'linear-gradient(to bottom left, rgba(144, 224, 239, 0.6) 0%, rgba(230, 247, 255, 0.5) 30%, rgba(255, 255, 255, 1) 70%, rgba(255, 255, 255, 1) 100%)'
        }}
      >
        <PharmacyNavbar />


        {/* Enhanced Hero Section */}
        <section className="relative  py-20 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0">
            {/* Floating Medical Icons */}
            <motion.div
              className="absolute top-20 left-10 w-20 h-20 bg-[#03045E]/20 rounded-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                rotate: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
              }}
            >
              <Mail className="w-8 h-8 text-[#03045E]" />
            </motion.div>

            <motion.div
              className="absolute top-32 right-20 w-16 h-16 bg-[#03045E]/10 rounded-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, 15, 0],
                rotate: [0, -5, 0]
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.2 },
                scale: { duration: 0.5, delay: 0.2 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
            >
              <Phone className="w-6 h-6 text-[#03045E]" />
            </motion.div>

            <motion.div
              className="absolute bottom-20 left-1/4 w-12 h-12 bg-[#03045E]/30 rounded-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -8, 0],
                x: [0, 5, 0]
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.4 },
                scale: { duration: 0.5, delay: 0.4 },
                y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 },
                x: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }
              }}
            >
              <MapPin className="w-5 h-5 text-[#03045E]" />
            </motion.div>

            {/* Geometric Shapes */}
            <motion.div
              className="absolute top-1/4 right-1/4 w-24 h-24 border-2 border-[#03045E]/30 rounded-xl"
              initial={{ opacity: 0, rotate: 0 }}
              animate={{
                opacity: 1,
                rotate: 360
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.6 },
                rotate: { duration: 20, repeat: Infinity, ease: "linear", delay: 0.6 }
              }}
            />

            <motion.div
              className="absolute bottom-1/3 right-10 w-8 h-8 bg-[#03045E]/20 rounded-full"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                scale: [1, 1.2, 1]
              }}
              transition={{
                opacity: { duration: 0.5, delay: 0.8 },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
              }}
            />
          </div>

          <motion.div
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Logo and Brand */}
            <motion.div
              className="flex justify-center mb-8"
              variants={fadeInUp}
            >
              <div className="relative">
                <img src={Logo} alt="HIRSTO" className="h-16 w-auto" />
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-[#03045E] rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-5xl lg:text-7xl font-bold text-[#03045E] mb-6 leading-tight"
              variants={fadeInUp}
            >
              Contact Our
              <span className="relative mx-4">
                Pharmacy Team
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#03045E] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Ready to revolutionize your pharmacy? Connect with our team and discover how HIRSTO can transform your pharmacy operations, streamline inventory, and enhance patient care.
            </motion.p>

            {/* Quick Contact Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              variants={staggerContainer}
            >
              {[
                { icon: Clock, label: "Response Time", value: "< 24 Hours" },
                { icon: Mail, label: "Support Channels", value: "3 Ways" },
                { icon: Phone, label: "Availability", value: "24/7 Support" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#03045E]/20 hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-[#03045E]/20 rounded-full flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-[#03045E]" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-2xl font-bold text-[#03045E]">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <motion.div
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <div className="grid lg:grid-cols-2 gap-16">

              {/* Contact Information */}
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl font-bold text-[#03045E] mb-8">Contact Our Pharmacy Experts</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Ready to transform your pharmacy business? Contact us today and discover how HIRSTO can empower your pharmacy team, improve workflow, and grow your business.
                </p>

                <div className="space-y-6">
                  <motion.div
                    className="flex items-start space-x-4"
                    variants={fadeInUp}
                  >
                    <div className="bg-[#03045E] p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#03045E] mb-1">Email</h3>
                      <p className="text-gray-600">support@hirsto.com</p>
                      <p className="text-gray-600">partnerships@hirsto.com</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start space-x-4"
                    variants={fadeInUp}
                  >
                    <div className="bg-[#03045E] p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#03045E] mb-1">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                      <p className="text-gray-600">Emergency: 911</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start space-x-4"
                    variants={fadeInUp}
                  >
                    <div className="bg-[#03045E] p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#03045E] mb-1">Address</h3>
                      <p className="text-gray-600">123 Healthcare Innovation Blvd</p>
                      <p className="text-gray-600">Medical District, NY 10001</p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start space-x-4"
                    variants={fadeInUp}
                  >
                    <div className="bg-[#03045E] p-3 rounded-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#03045E] mb-1">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                className="bg-white border-2 border-[#03045E] p-8 rounded-2xl shadow-lg"
                variants={fadeInUp}
              >
                <h3 className="text-2xl font-bold text-[#03045E] mb-6">Send us a Message</h3>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-[#03045E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03045E] focus:border-[#03045E]"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-[#03045E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03045E] focus:border-[#03045E]"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border-2 border-[#03045E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03045E] focus:border-[#03045E]"
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-[#03045E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03045E] focus:border-[#03045E]">
                      <option>General Inquiry</option>
                      <option>Partnership Opportunity</option>
                      <option>Technical Support</option>
                      <option>Medical Professional Registration</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 border-2 border-[#03045E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#03045E] focus:border-[#03045E]"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#03045E] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#03045E] hover:text-[#03045E] transition-colors duration-300"
                  >
                    Send Message
                  </button>
                </form>
              </motion.div>

            </div>
          </motion.div>
        </section>
        {/* Enhanced Hero Section */}
      </div>



      <Footer />
    </div>
    // </PageTransition>
  );
};

export default Contact;
