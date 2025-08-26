import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface TermsAndSignInProps {
  termsAccepted: boolean;
  setTermsAccepted: (accepted: boolean) => void;
  setShowTermsModal: (show: boolean) => void;
  errors: Record<string, string>;
}

const TermsAndSignIn: React.FC<TermsAndSignInProps> = ({
  termsAccepted,
  setTermsAccepted,
  setShowTermsModal,
  errors
}) => {
  return (
    <>
      {/* Terms and Services Checkbox */}
      <motion.div
        className="flex items-start space-x-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <input
          id="terms"
          type="checkbox"
          checked={termsAccepted}
          onChange={(e) => setTermsAccepted(e.target.checked)}
          className="mt-1 w-4 h-4 text-[#0077B6] bg-white border-2 border-[#90E0EF] rounded focus:ring-[#90E0EF]/30 focus:ring-2"
        />
        <label htmlFor="terms" className="text-sm text-[#1E3E72] font-paragraphs">
          I agree to the{' '}
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="text-[#0077B6] hover:text-[#1E3E72] font-semibold underline transition-colors"
          >
            Terms and Services
          </button>
          {' '}and understand my responsibilities as a medical professional on this platform.
        </label>
      </motion.div>
      {errors.terms && (
        <motion.p
          className="text-red-500 text-sm font-subtitles"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {errors.terms}
        </motion.p>
      )}

      {/* Sign In Link */}
      <motion.div
        className="text-center pt-4 border-t border-[#90E0EF]/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <span className="text-[#0077B6]/80 font-paragraphs text-sm">
          Already have an account?{' '}
        </span>
        <Link
          to="/login"
          className="font-semibold font-subtitles text-[#1E3E72] hover:text-[#0077B6] transition-colors text-sm hover:underline"
        >
          Sign in here
        </Link>
      </motion.div>
    </>
  );
};

export default TermsAndSignIn; 