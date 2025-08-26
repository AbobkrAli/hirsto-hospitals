import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Eye, FileText, Users, Globe, Database, UserCheck, RefreshCw } from 'lucide-react';
import PharmacyNavbar from '../components/PharmacyNavbar';

type TabKey =
  | 'overview'
  | 'data-collection'
  | 'data-usage'
  | 'data-sharing'
  | 'security'
  | 'your-rights'
  | 'future-policy';

const Privacy = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

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

  const tabs: { id: TabKey; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Privacy Overview', icon: Shield },
    { id: 'data-collection', label: 'Data Collection', icon: Database },
    { id: 'data-usage', label: 'Data Usage', icon: Eye },
    { id: 'data-sharing', label: 'Data Sharing', icon: Users },
    { id: 'security', label: 'Security Measures', icon: Lock },
    { id: 'your-rights', label: 'Your Rights', icon: UserCheck },
    { id: 'future-policy', label: 'Future Policy Change', icon: RefreshCw }
  ];

  const tabContent: Record<TabKey, {
    title: string;
    icon: React.ElementType;
    content: React.ReactNode;
  }> = {
    overview: {
      title: "Privacy Overview",
      icon: Shield,
      content: (
        <div className="space-y-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>1. Introduction and Scope</strong><br />
              This Privacy Policy ("Policy") is specifically intended for, and applies to, our valued pharmacy partners ("You", "the Partner Pharmacy", "the Partner"). It outlines in exhaustive detail the types of data Hirsto ("We", "Us", "Our") collects in the course of our B2B partnership, the explicit purposes for which we use this data, and the measures we take to protect it. Our guiding principle is to operate as a "Smart Growth Partner", and this policy is a cornerstone of the trust required for such a strategic relationship. This Policy pertains exclusively to the data collected from pharmacies participating in our network through our B2B platform and services, including the Hirsto Order Management System.
            </p>
          </div>
        </div>
      )
    },
    'data-collection': {
      title: "Data Collection",
      icon: Database,
      content: (
        <div className="space-y-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>2. The Data We Collect</strong><br />
              To facilitate the seamless operation of our platform and provide the full suite of services, we collect the following categories of information directly from our Pharmacy Partners.
            </p>
            <ol className="list-decimal pl-6 mt-4 space-y-2 text-base">
              <li>
                <strong>Pharmacy Profile and Identification Data:</strong> This is the foundational data required to list your pharmacy on the Hirsto platform and make it discoverable to customers.
                <ul className="list-disc pl-6 mt-1">
                  <li>The official name and branding logo of your pharmacy.</li>
                  <li>The physical address(es) of your branch(es).</li>
                  <li>Official contact information, including phone numbers and email addresses.</li>
                  <li>Your pharmacy's standard operating hours.</li>
                  <li>The specific geographic delivery zones your pharmacy covers.</li>
                </ul>
              </li>
              <li>
                <strong>Operational and Performance Data:</strong> This data is generated through your activity on the Hirsto platform and is essential for managing the service and providing you with performance insights.
                <ul className="list-disc pl-6 mt-1">
                  <li>Data on confirmed, prepaid e-prescriptions received and processed through the Hirsto Order Management System.</li>
                  <li>Metrics related to order fulfillment, such as the average time taken to prepare an order for pickup.</li>
                  <li>Aggregated and anonymized customer ratings and feedback on your service.</li>
                </ul>
              </li>
              <li>
                <strong>Inventory Data (Applicable to Advanced Partnership Tiers):</strong> For partners on advanced tiers like the "Health Hub" plan, real-time inventory data is crucial for advanced features.
                <ul className="list-disc pl-6 mt-1">
                  <li>Real-time stock availability and quantities of specific medications, enabled via a deep technical integration between the Hirsto platform and your pharmacy's inventory management system through an API.</li>
                </ul>
              </li>
              <li>
                <strong>Financial Data:</strong> This information is necessary for the sole purpose of financial reconciliation and payment settlement.
                <ul className="list-disc pl-6 mt-1">
                  <li>Your pharmacy's official bank account information for the settlement of payments collected by Hirsto for the prepaid prescriptions you fulfill.</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      )
    },
    'data-usage': {
      title: "How We Use Your Data",
      icon: Eye,
      content: (
        <div className="space-y-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>3. How We Use the Collected Data</strong><br />
              Our use of your data is strictly limited to purposes that enhance the partnership, drive growth for your pharmacy, and ensure the efficient operation of the Hirsto ecosystem.
            </p>
            <ol className="list-decimal pl-6 mt-4 space-y-2 text-base">
              <li>
                <strong>To Enable Core Operations:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>We use your location and inventory data to intelligently route confirmed, prepaid e-prescriptions from customers to your pharmacy, thereby creating a "guaranteed sales channel".</li>
                  <li>We use your address and order details to manage the entire logistics and delivery process, dispatching the nearest driver to your location for pickup once an order is marked as "Ready for Pickup".</li>
                  <li>We utilize your financial data to process and settle your payments for fulfilled orders.</li>
                </ul>
              </li>
              <li>
                <strong>To Provide Analytics and Strategic Insights:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Your dedicated Partner Success Manager uses your operational data to conduct monthly performance reviews with you, providing insights on metrics like order volume and preparation time.</li>
                  <li>For eligible partners, we use anonymized and aggregated prescription data from your specific geographic area to power the Inventory and Demand Analytics Dashboard, providing you with predictive reports and insights to proactively manage your stock. For instance, we may alert you to an anticipated 20% increase in demand for children's medicine if a new pediatrician is starting in your area.</li>
                </ul>
              </li>
              <li>
                <strong>To Facilitate Advanced Services (Exclusive to Strategic Partners):</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>We use your physical location and branding to co-establish a physical "Hirsto Corner" within your pharmacy, transforming it into a primary care hub with biometric kiosks and video consultation rooms.</li>
                  <li>We may use your status as a strategic partner to designate your pharmacy as a local center for clinical trial recruitment and services, creating a new, significant revenue stream for you.</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      )
    },
    'data-sharing': {
      title: "Data Sharing Practices",
      icon: Users,
      content: (
        <div className="space-y-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>Data Sharing and Confidentiality</strong><br />
              We understand the sensitivity of your business data. Our data-sharing practices are limited and are designed to protect your competitive position.
            </p>
            <ol className="list-decimal pl-6 mt-4 space-y-2 text-base">
              <li>
                <strong>With Whom We Share Data:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>Delivery Partners: We share only the necessary information (pharmacy address, order ID) with our delivery drivers or third-party logistics partners to facilitate order pickup and delivery.</li>
                  <li>Customers: Customers see your pharmacy's public profile data (name, logo, location) to select you and track their order.</li>
                  <li>Payment Gateways: Financial data is shared securely with our payment processing partners to facilitate transactions.</li>
                </ul>
              </li>
              <li>
                <strong>Our Confidentiality Commitment:</strong>
                <ul className="list-disc pl-6 mt-1">
                  <li>We explicitly do not share your specific, identifiable operational data, sales figures, or detailed inventory data with any other competing pharmacy on the platform.</li>
                  <li>The data used for the predictive demand analytics dashboard is always anonymized and aggregated at a geographic level, meaning insights are drawn from the trends of a whole area (e.g., "Mirdif"), not from the specific performance of a single pharmacy. Your individual business intelligence is kept confidential.</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      )
    },
    security: {
      title: "Data Security",
      icon: Lock,
      content: (
        <div className="space-y-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>5. Data Security</strong><br />
              We implement robust technical and organizational security measures to protect your data against unauthorized access, alteration, disclosure, or destruction. This includes data encryption, access controls, and regular security assessments.
            </p>
          </div>
        </div>
      )
    },
    'your-rights': {
      title: "Your Rights and Controls",
      icon: UserCheck,
      content: (
        <div className="space-y-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>Your Rights and Controls</strong><br />
              As our partner, you have the right to access and update your Pharmacy Profile Data (e.g., operating hours, contact information) through your dedicated Partner Success Manager. You retain ownership of all your data.
            </p>
          </div>
        </div>
      )
    },
    'future-policy': {
      title: "Future Policy Change",
      icon: RefreshCw,
      content: (
        <div className="space-y-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">
              <strong>Future Policy Change</strong><br />
              We may update this Privacy Policy from time to time to reflect new services, evolving legal requirements, or
              changes in our business practices. Any significant modifications will be communicated to our partner
              pharmacies in advance. We encourage you to periodically review this Policy to stay informed about how
              we are protecting your data and your rights.
            </p>
          </div>
        </div>
      )
    },

  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - keeping the original header */}
      <div
        className='relative'
        style={{
          background: 'linear-gradient(to bottom left, rgba(144, 224, 239, 0.6) 0%, rgba(230, 247, 255, 0.5) 30%, rgba(255, 255, 255, 1) 70%, rgba(255, 255, 255, 1) 100%)'
        }}
      >
        <PharmacyNavbar />

        {/* Enhanced Hero Section */}
        <section className="relative bg-gradient-to-br py-20 overflow-hidden">
          {/* Security & Privacy Themed Background */}
          <div className="absolute inset-0">
            {/* Security Icons */}
            <motion.div
              className="absolute top-20 left-20 w-16 h-16 bg-[#90E0EF]/20 rounded-full flex items-center justify-center"
              animate={{
                y: [0, -12, 0],
                rotate: [0, 8, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Shield className="w-8 h-8 text-[#03045E]" />
            </motion.div>

            <motion.div
              className="absolute top-32 right-24 w-14 h-14 bg-[#03045E]/15 rounded-full flex items-center justify-center"
              animate={{
                y: [0, 10, 0],
                rotate: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            >
              <Lock className="w-6 h-6 text-[#03045E]" />
            </motion.div>

            <motion.div
              className="absolute bottom-24 left-1/4 w-12 h-12 bg-[#90E0EF]/25 rounded-full flex items-center justify-center"
              animate={{
                y: [0, -8, 0],
                x: [0, 6, 0],
                rotate: [0, 15, 0]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              <Eye className="w-5 h-5 text-[#03045E]" />
            </motion.div>

            {/* Data Protection Symbols */}
            <motion.div
              className="absolute top-1/2 left-1/8 w-20 h-20 border-2 border-[#90E0EF]/30 rounded-xl flex items-center justify-center"
              animate={{
                rotate: 360,
                scale: [1, 1.03, 1]
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <FileText className="w-8 h-8 text-[#03045E]/50" />
            </motion.div>

            <motion.div
              className="absolute bottom-1/3 right-16 w-8 h-8 bg-[#03045E]/30 rounded-full flex items-center justify-center"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Users className="w-4 h-4 text-[#03045E]" />
            </motion.div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Main Title */}
            <motion.h1
              className="text-5xl lg:text-7xl font-bold text-[#03045E] mb-6 leading-tight"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              Privacy &
              <span className="relative mx-4">
                Security
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-[#03045E] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
                <motion.div
                  className="absolute -top-6 right-0"
                  animate={{
                    y: [0, -3, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Shield className="w-6 h-6 text-[#03045E]" />
                </motion.div>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: 0.2 }}
            >
              Your health data deserves the highest level of protection. Learn how HIRSTO safeguards your privacy.
            </motion.p>

            {/* Security Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                { icon: Shield, label: "Encryption Level", value: "256-bit AES" },
                { icon: Lock, label: "Compliance", value: "HIPAA & GDPR" },
                { icon: Globe, label: "Data Centers", value: "SOC 2 Certified" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#90E0EF]/20 hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-12 h-12 bg-[#90E0EF]/20 rounded-full flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-[#03045E]" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    {stat.label}
                  </h3>
                  <p className="text-xl font-bold text-[#03045E]">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </div>

      {/* Privacy Tabs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-12 bg-white rounded-2xl p-2 shadow-lg border border-[#90E0EF]/20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === tab.id
                  ? 'bg-[#03045E] text-white shadow-lg scale-105'
                  : 'text-gray-600 hover:text-[#03045E] hover:bg-[#90E0EF]/10'
                  }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-xl border border-[#90E0EF]/20 p-8 lg:p-12"
            >
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-[#03045E] rounded-2xl flex items-center justify-center mr-4">
                  {React.createElement(tabContent[activeTab].icon, {
                    className: "w-6 h-6 text-white"
                  })}
                </div>
                <h2 className="text-3xl font-bold text-[#03045E]">
                  {tabContent[activeTab].title}
                </h2>
              </div>

              {tabContent[activeTab].content}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
