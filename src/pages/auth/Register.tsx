import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TermsModal } from '../../components';
import RegisterFeatures from '../../components/sections/RegisterFeatures';
import { PharmacyRegisterForm } from '../../components/forms/PharmacyRegisterForm';
import PharmacyNavbar from '../../components/PharmacyNavbar';
import Footer from '../../components/Footer';

const Register: React.FC = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <>
      <PharmacyNavbar />
      <div className="min-h-screen  relative overflow-hidden">
        {/* Animated Background Elements */}

        <div className="relative z-10 p-4 sm:p-6 lg:p-8">
          <motion.div
            className="max-w-[85vw] mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Side - Features */}
              <RegisterFeatures />

              {/* Right Side - Registration Form */}
              <motion.div
                className="lg:col-span-7"
                variants={itemVariants}
              >
                <PharmacyRegisterForm />
                <div className="text-center pt-4 border-t border-[#90E0EF]/30 mt-8">
                  <span className="text-[#0077B6]/80 font-paragraphs text-sm">
                    Already have an account?{' '}
                  </span>
                  <Link
                    to="/login"
                    className="font-semibold font-subtitles text-[#1E3E72] hover:text-[#0077B6] transition-colors text-sm hover:underline"
                  >
                    Login
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Terms Modal */}
        <TermsModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          onAccept={() => {
            setShowTermsModal(false);
          }}
        />
      </div>
      <Footer />

    </>

  );
};

export default Register; 