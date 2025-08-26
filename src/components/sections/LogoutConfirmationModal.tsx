import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, AlertTriangle } from 'lucide-react';
import Button from '../atoms/Button';

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300,
        duration: 0.3
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300,
        duration: 0.2
      }
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !isLoading) {
              onClose();
            }
          }}
        >
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md border border-[#90E0EF]/30"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#90E0EF]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold font-headlines text-[#1E3E72]">
                    Confirm Logout
                  </h2>
                  <p className="text-[#0077B6] font-subtitles text-sm sm:text-base">
                    Are you sure you want to sign out?
                  </p>
                </div>
              </div>
              {!isLoading && (
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-[#CAF0F8]/30 rounded-lg transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#1E3E72]" />
                </motion.button>
              )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold font-headlines text-[#1E3E72] mb-2">
                    You're about to sign out
                  </h3>
                  <p className="text-[#0077B6] font-paragraphs text-sm sm:text-base leading-relaxed">
                    You will need to sign in again to access your dashboard and manage appointments.
                    Any unsaved changes will be lost.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-3 text-sm sm:text-base"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleConfirm}
                  disabled={isLoading}
                  loading={isLoading}
                  icon={LogOut}
                  className="flex-1 py-3 text-sm sm:text-base"
                >
                  {isLoading ? 'Signing Out...' : 'Sign Out'}
                </Button>
              </div>

              {/* Additional info */}
              <div className="mt-4 p-3 bg-gradient-to-r from-[#CAF0F8]/40 to-[#90E0EF]/40 rounded-lg border border-[#90E0EF]/30">
                <p className="text-xs sm:text-sm text-[#0077B6] font-paragraphs text-center">
                  💡 <strong>Tip:</strong> Your data is automatically saved and will be available when you sign back in.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LogoutConfirmationModal; 