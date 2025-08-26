import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Logo from '../assets/logo.svg';
import Footer from '../components/Footer';
import PharmacyNavbar from '../components/PharmacyNavbar';
const FAQ = () => {
  const [openCategory, setOpenCategory] = useState<number | null>(0);
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const faqData = [
    {
      category: "About the Partnership & Business Model",
      questions: [
        {
          question: "What exactly do you mean by a 'Guaranteed Sales Channel'? How is it different from a regular delivery app?",
          answer: `A "Guaranteed Sales Channel" is the core value of our partnership. Unlike regular delivery apps that may send you random, unconfirmed orders, Hirsto sends you\n only confirmed, prepaid e-prescriptions issued by licensed doctors on our platform. This means every order you receive is a 100% guaranteed sale that is already paid for by the customer; your only job is to prepare it for delivery.`
        },
        {
          question: "My pharmacy is struggling with competition from large chains and online platforms. How does Hirsto help me compete?",
          answer: `We understand that individual pharmacies face an uneven battle on the digital front. Hirsto is designed to be your digital lifeblood by providing you with the sophisticated technology and logistics infrastructure that is typically only available to large chains. We give you an immediate e-commerce presence, manage a secure payment gateway, and handle all delivery logistics , allowing you to compete effectively in the digital marketplace and serve a much wider geographic area without the massive upfront investment.`
        },
        {
          question: "How do you ensure fair competition on the platform? Will you just prioritize the big pharmacy chains?",
          answer: `Order routing is based on a smart algorithm that considers multiple factors, not just the size of the pharmacy. These factors include the patient's location, the real-time availability of the medication in your inventory (for advanced partners), and your partnership tier. Furthermore, partners on the "Partner" and "Health Hub" tiers receive\n priority placement in search results, giving them a competitive advantage.`
        }
      ]
    },
    {
      category: "Operational & Technical Questions",
      questions: [
        {
          question: "I don't have a technical team or an IT department. Is the system difficult to set up and use?",
          answer: `Not at all. The system is designed for simplicity. For our standard partnership tiers, we provide you with a pre-configured tablet with the "Hirsto Order Management System" already installed. The interface is extremely simple, with a single main screen showing "New Orders," "In-Progress Orders," and "Ready for Pickup". We handle all the technical complexity so you can focus on your core business.`
        },
        {
          question: "How does the delivery process work? Do I need to hire my own drivers?",
          answer: `No, you do not need to hire any drivers. Hirsto manages the entire delivery and logistics process. When you prepare an order and press the "Ready for Pickup" button on the tablet, our system automatically dispatches the nearest Hirsto driver to your pharmacy to collect the order and deliver it to the customer.`
        },
        {
          question: "How long does the entire onboarding and setup process take?",
          answer: `We follow a clear, structured timeline managed by your dedicated Partner Success Manager. A typical timeline is:\n Week 1 for account setup and staff training;\n Week 2 for a trial run with test orders; and Week 3 for the full official launch.`
        }
      ]
    },
    {
      category: "Data, Analytics, and Privacy",
      questions: [
        {
          question: "How does the 'Inventory and Demand Analytics Dashboard' work? Are you sharing my sales data with my competitors?",
          answer: `This is a key feature that distinguishes us. The dashboard works by analyzing\n anonymized and aggregated prescription data within a specific geographic area. We\n never share your individual, identifiable sales or inventory data with other pharmacies. The insights are about community-level trends. For example, the system might tell you, "We expect demand for children's medicine to increase by 20% in your area next month," helping you proactively manage your stock without revealing your specific business data to anyone.`
        },
        {
          question: "What is required for the deep API integration mentioned in the advanced plans?",
          answer: `The API integration is for our "Health Hub" partners and allows the Hirsto platform to see your stock levels in real-time, ensuring we only send you orders for medications you currently have. After signing the agreement, we schedule a technical kick-off meeting between our team and your technical contact to facilitate a smooth integration process.`
        }
      ]
    },
    {
      category: "Advanced Partnership (\"Health Hub\")",
      questions: [
        {
          question: "What is the 'Hirsto Health Hub' feature exactly?",
          answer: `This is an exclusive, strategic partnership where we co-create a physical "Hirsto Corner" inside your pharmacy. This space is equipped with biometric kiosks (for measuring blood pressure, temperature, etc.) and a private room for instant video consultations with doctors. It transforms your pharmacy from a simple dispenser of medicine into a primary healthcare center, attracting more customers and creating new revenue streams.`
        },
        {
          question: "What does 'Participation in Clinical Trial Recruitment' involve?",
          answer: `This is another exclusive service for our strategic "Health Hub" partners. Leveraging its health and genetic database, Hirsto can efficiently identify and recruit eligible patients for clinical trials conducted by pharmaceutical companies. Your pharmacy then acts as a certified local center for the trial, which could involve distributing trial medications or conducting simple check-ups for participants, generating significant additional income and enhancing your pharmacy's scientific reputation.`
        }
      ]
    },
  ];

  const toggleCategory = (index: number) => {
    if (openCategory === index) {
      setOpenCategory(null);
      setOpenQuestion(null);
    } else {
      setOpenCategory(index);
      setOpenQuestion(null);
    }
  };

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div
        className='relative'
        style={{
          background: 'linear-gradient(to bottom left, rgba(144, 224, 239, 0.6) 0%, rgba(230, 247, 255, 0.5) 30%, rgba(255, 255, 255, 1) 70%, rgba(255, 255, 255, 1) 100%)'
        }}
      >
        <PharmacyNavbar />

        {/* Enhanced Hero Section */}
        <section className="relative  py-20 overflow-hidden">
          {/* Interactive Background Elements */}
          <div className="absolute inset-0">
            {/* Question Mark Bubbles */}
            <motion.div
              className="absolute top-16 left-16 w-16 h-16 bg-[#90E0EF]/20 rounded-full flex items-center justify-center text-2xl font-bold text-[#03045E]"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              ?
            </motion.div>

            <motion.div
              className="absolute top-32 right-24 w-12 h-12 bg-[#03045E]/15 rounded-full flex items-center justify-center text-lg font-bold text-[#90E0EF]"
              animate={{
                y: [0, 12, 0],
                rotate: [0, -15, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              ?
            </motion.div>

            <motion.div
              className="absolute bottom-24 left-1/3 w-10 h-10 bg-[#90E0EF]/25 rounded-full flex items-center justify-center text-sm font-bold text-[#03045E]"
              animate={{
                y: [0, -8, 0],
                x: [0, 8, 0],
                rotate: [0, 20, 0]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              ?
            </motion.div>

            {/* Knowledge Icons */}
            <motion.div
              className="absolute top-1/4 right-1/3 w-20 h-20 border-2 border-[#90E0EF]/30 rounded-full flex items-center justify-center"
              animate={{
                rotate: 360,
                scale: [1, 1.05, 1]
              }}
              transition={{
                rotate: { duration: 15, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div className="w-8 h-8 bg-[#03045E]/20 rounded-full"></div>
            </motion.div>

            <motion.div
              className="absolute bottom-1/4 right-16 w-6 h-6 bg-[#90E0EF]/40 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Logo with Animation */}
            <motion.div
              className="flex justify-center mb-8"
              variants={fadeInUp}
            >
              <div className="relative">
                <img src={Logo} alt="HIRSTO" className="h-16 w-auto" />
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-[#90E0EF] rounded-full flex items-center justify-center text-xs font-bold text-[#03045E]"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ?
                </motion.div>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="text-5xl lg:text-7xl font-bold text-[#03045E] mb-6 leading-tight"
              variants={fadeInUp}
            >
              Got
              <span className="relative mx-4">
                Questions?
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#03045E] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
                <motion.div
                  className="absolute -top-8 right-0 text-4xl text-[#03045E]"
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 10, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  ?
                </motion.div>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
            >
              Find answers to everything you need to know about HIRSTO's revolutionary healthcare platform.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              variants={staggerContainer}
            >
              {[
                { label: "Questions Answered", value: "100+", icon: "?" },
                { label: "Response Time", value: "Instant", icon: "⚡" },
                { label: "Categories", value: "8+", icon: "📋" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#90E0EF]/20 hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-[#90E0EF]/20 rounded-full flex items-center justify-center text-2xl">
                      {stat.icon}
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
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <motion.div
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <div className="space-y-6">
              {faqData.map((category, categoryIndex) => (
                <motion.div
                  key={categoryIndex}
                  className="bg-white border-2 border-[#03045E] rounded-2xl overflow-hidden shadow-lg"
                  variants={fadeInUp}
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(categoryIndex)}
                    className="w-full px-6 py-4 bg-[#03045E] text-white font-semibold text-left flex items-center justify-between  cursor-pointer transition-colors"
                  >
                    <span className="text-lg">Category {categoryIndex + 1}: {category.category}</span>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${openCategory === categoryIndex ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  {/* Questions with animation */}
                  <AnimatePresence initial={false}>
                    {openCategory === categoryIndex && (
                      <motion.div
                        key="questions"
                        className="border-t-2 border-[#03045E]"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                      >
                        {category.questions.map((item, questionIndex) => {
                          const globalQuestionIndex = categoryIndex * 1000 + questionIndex;
                          return (
                            <div key={questionIndex} className="border-b border-[#03045E] last:border-b-0">
                              <button
                                onClick={() => toggleQuestion(globalQuestionIndex)}
                                className="w-full px-6 py-4 text-left flex items-start justify-between  transition-colors"
                              >
                                <span className="font-medium text-[#03045E] pr-4">
                                  Q{questionIndex + 1}: {item.question}
                                </span>
                                <ChevronRight
                                  className={`w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5 transition-transform ${openQuestion === globalQuestionIndex ? 'rotate-90' : ''}`}
                                />
                              </button>

                              <AnimatePresence initial={false}>
                                {openQuestion === globalQuestionIndex && (
                                  <motion.div
                                    key="answer"
                                    className="px-6 pb-4"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    style={{ overflow: 'hidden' }}
                                  >
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <p className="text-[#03045E] leading-relaxed whitespace-pre-line font-medium">
                                        {item.answer}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>


          </motion.div>
        </section>


      </div>


      <Footer />
    </div>
  );
};

export default FAQ;
