import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { createAvailability } from '../../services/authService';
import { getAuthData } from '../../services/authService';
import toast from 'react-hot-toast';

interface AvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AvailabilityModal: React.FC<AvailabilityModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<15 | 30 | 45>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const durations = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDateTime) {
      const errorMsg = 'Please select both date and time';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const { user } = getAuthData();
    if (!user) {
      const errorMsg = 'User not found';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create start datetime - ensure it's treated as local time
      const startDateTime = dayjs(selectedDateTime).tz(dayjs.tz.guess());
      const endDateTime = startDateTime.add(selectedDuration, 'minute');

      const availabilityData = {
        doctor_id: user.id,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        is_booked: false,
        user_email: ""
      };

      await createAvailability(availabilityData);

      // Reset form
      setSelectedDateTime(null);
      setSelectedDuration(30);

      onSuccess();
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create availability';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDateTime(null);
    setSelectedDuration(30);
    setError(null);
    onClose();
  };

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
            // Close modal if clicking on backdrop
            if (e.target === e.currentTarget) {
              handleClose();
            }
          }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#90E0EF]/30">
              <h2 className="text-xl font-bold font-headlines text-[#1E3E72] flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Set Availability
              </h2>
              <motion.button
                onClick={handleClose}
                className="p-2 hover:bg-[#CAF0F8]/30 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 text-[#1E3E72]" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Error Message */}
              {error && (
                <motion.div
                  className="p-4 bg-red-50 border border-red-200 rounded-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-red-700 text-sm font-subtitles">{error}</p>
                </motion.div>
              )}

              {/* Date Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
                  Date and Time
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Date & Time"
                    value={selectedDateTime ? dayjs(selectedDateTime) : null}
                    onChange={(newValue) => setSelectedDateTime(newValue ? newValue.toDate() : null)}
                    minDateTime={dayjs()}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        className: "w-full px-4 py-3 border border-[#90E0EF]/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:border-transparent bg-white/80 backdrop-blur-sm font-paragraphs"
                      }
                    }}
                  />
                </LocalizationProvider>
              </motion.div>

              {/* Duration Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-3">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {durations.map((duration) => (
                    <motion.button
                      key={duration.value}
                      type="button"
                      onClick={() => setSelectedDuration(duration.value as 15 | 30 | 45)}
                      className={`p-3 rounded-xl border-2 font-subtitles text-sm transition-all ${selectedDuration === duration.value
                        ? 'border-[#0077B6] bg-[#0077B6] text-white shadow-lg'
                        : 'border-[#90E0EF]/50 text-[#1E3E72] hover:border-[#0077B6] hover:bg-[#CAF0F8]/20'
                        }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {duration.label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Preview */}
              {selectedDateTime && (
                <motion.div
                  className="bg-gradient-to-r from-[#CAF0F8]/30 to-[#90E0EF]/30 rounded-xl p-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <h3 className="font-semibold font-subtitles text-[#1E3E72] mb-2">Preview</h3>
                  <div className="text-sm font-paragraphs text-[#0077B6]">
                    <p><strong>Date:</strong> {dayjs(selectedDateTime).format('MM/DD/YYYY')}</p>
                    <p><strong>Start:</strong> {dayjs(selectedDateTime).format('h:mm A')}</p>
                    <p><strong>End:</strong> {dayjs(selectedDateTime).add(selectedDuration, 'minute').format('h:mm A')}</p>
                  </div>

                  {/* UTC Time Display */}
                  <div className="mt-3 pt-3 border-t border-[#90E0EF]/30">
                    <h4 className="font-semibold font-subtitles text-[#1E3E72] mb-1 text-xs">UTC Times:</h4>
                    <div className="text-xs font-paragraphs text-[#0077B6]">
                      <p><strong>Start:</strong> {dayjs(selectedDateTime).utc().format('MMM DD, h:mm A')} UTC</p>
                      <p><strong>End:</strong> {dayjs(selectedDateTime).add(selectedDuration, 'minute').utc().format('MMM DD, h:mm A')} UTC</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                className="flex gap-3 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 border border-[#90E0EF] text-[#1E3E72] py-3 rounded-xl font-semibold font-subtitles hover:bg-[#CAF0F8]/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isLoading || !selectedDateTime}
                  className="flex-1 bg-gradient-to-r !bg-[#03045E] text-white py-3 rounded-xl font-semibold font-subtitles hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={!isLoading && selectedDateTime ? { scale: 1.02 } : {}}
                  whileTap={!isLoading && selectedDateTime ? { scale: 0.98 } : {}}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Availability'
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AvailabilityModal; 