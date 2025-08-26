import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center h-full w-full z-[9999]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#90E0EF]/30 z-[10000] flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#90E0EF]/30">
              <div>
                <h2 className="text-2xl font-bold font-headlines text-[#1E3E72]">
                  Terms and Services
                </h2>
                <p className="text-[#0077B6] font-subtitles">
                  Please read and accept our terms to continue
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#CAF0F8]/30 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-[#1E3E72]" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 font-paragraphs text-[#1E3E72]">
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold font-subtitles text-[#1E3E72] mb-3">
                    1. Medical Professional Agreement
                  </h3>
                  <p className="text-sm leading-relaxed mb-3">
                    By registering with HEARSTO, you confirm that you are a licensed medical professional
                    with valid credentials to practice medicine in your jurisdiction. You agree to provide
                    accurate, complete, and up-to-date information about your medical qualifications,
                    specializations, and professional background.
                  </p>
                  <p className="text-sm leading-relaxed">
                    You understand that HEARSTO may verify your credentials and that providing false
                    information may result in immediate termination of your account.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold font-subtitles text-[#1E3E72] mb-3">
                    2. Patient Care Standards
                  </h3>
                  <p className="text-sm leading-relaxed mb-3">
                    You agree to maintain the highest standards of patient care and medical ethics
                    while using our platform. This includes but is not limited to:
                  </p>
                  <ul className="text-sm space-y-1 ml-6 list-disc">
                    <li>Providing accurate medical advice and diagnoses</li>
                    <li>Maintaining patient confidentiality at all times</li>
                    <li>Following all applicable medical laws and regulations</li>
                    <li>Responding to patient inquiries in a timely manner</li>
                    <li>Referring patients to appropriate specialists when necessary</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold font-subtitles text-[#1E3E72] mb-3">
                    3. Privacy and Data Protection
                  </h3>
                  <p className="text-sm leading-relaxed mb-3">
                    HEARSTO is committed to protecting patient data and maintaining HIPAA compliance.
                    You agree to:
                  </p>
                  <ul className="text-sm space-y-1 ml-6 list-disc">
                    <li>Use secure connections and devices when accessing patient information</li>
                    <li>Not share login credentials with unauthorized personnel</li>
                    <li>Report any suspected data breaches immediately</li>
                    <li>Follow all platform security protocols and guidelines</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold font-subtitles text-[#1E3E72] mb-3">
                    4. Platform Usage Guidelines
                  </h3>
                  <p className="text-sm leading-relaxed mb-3">
                    You agree to use the HEARSTO platform responsibly and professionally:
                  </p>
                  <ul className="text-sm space-y-1 ml-6 list-disc">
                    <li>Maintain accurate and current profile information</li>
                    <li>Use professional language and behavior in all communications</li>
                    <li>Respect the intellectual property rights of HEARSTO and other users</li>
                    <li>Not engage in any activity that could harm the platform or other users</li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold font-subtitles text-[#1E3E72] mb-3">
                    5. Liability and Insurance
                  </h3>
                  <p className="text-sm leading-relaxed">
                    You acknowledge that you maintain appropriate medical malpractice insurance
                    and that HEARSTO does not provide coverage for your professional activities.
                    You agree to indemnify HEARSTO against any claims arising from your use of
                    the platform or provision of medical services.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold font-subtitles text-[#1E3E72] mb-3">
                    6. Termination
                  </h3>
                  <p className="text-sm leading-relaxed">
                    Either party may terminate this agreement at any time with written notice.
                    HEARSTO reserves the right to suspend or terminate accounts that violate
                    these terms or engage in unprofessional conduct.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold font-subtitles text-[#1E3E72] mb-3">
                    7. Updates to Terms
                  </h3>
                  <p className="text-sm leading-relaxed">
                    HEARSTO may update these terms from time to time. Continued use of the
                    platform after changes constitutes acceptance of the updated terms.
                  </p>
                </section>

                <div className="bg-[#CAF0F8]/30 rounded-xl p-4 border border-[#90E0EF]/50">
                  <p className="text-sm font-semibold text-[#1E3E72] mb-2">
                    Contact Information
                  </p>
                  <p className="text-sm text-[#0077B6]">
                    For questions about these terms, please contact us at:
                    <br />
                    Email: legal@hearsto.com
                    <br />
                    Phone: +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-[#90E0EF]/30">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-[#90E0EF] text-[#1E3E72] rounded-xl font-semibold font-subtitles hover:bg-[#CAF0F8]/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onAccept}
                className="flex-1 px-6 py-3 bg-gradient-to-r !bg-[#03045E] text-white rounded-xl font-semibold font-subtitles hover:shadow-lg transition-all duration-300"
              >
                Accept Terms & Continue
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TermsModal; 