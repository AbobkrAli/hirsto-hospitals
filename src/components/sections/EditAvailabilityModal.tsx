import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock } from 'lucide-react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEditAvailability } from '../../hooks/useAppointments';
import { type Appointment } from '../../services/authService';

interface EditAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

const EditAvailabilityModal: React.FC<EditAvailabilityModalProps> = ({
  isOpen,
  onClose,
  appointment
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<15 | 30 | 45>(30);
  const editAvailabilityMutation = useEditAvailability();

  const durations = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' }
  ];

  // Initialize form with appointment data
  useEffect(() => {
    if (appointment) {
      const startTime = dayjs(appointment.start_time);
      const endTime = dayjs(appointment.end_time);
      const duration = endTime.diff(startTime, 'minute');

      setSelectedDateTime(startTime.toDate());
      setSelectedDuration(duration as 15 | 30 | 45);
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!appointment || !selectedDateTime) {
      return;
    }

    try {
      // Create start datetime - ensure it's treated as local time
      const startDateTime = dayjs(selectedDateTime).tz(dayjs.tz.guess());
      const endDateTime = startDateTime.add(selectedDuration, 'minute');

      await editAvailabilityMutation.mutateAsync({
        availabilityId: appointment.id,
        data: {
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
        }
      });

      handleClose();
    } catch (error) {
      console.error('Edit appointment error:', error);
    }
  };

  const handleClose = () => {
    setSelectedDateTime(null);
    setSelectedDuration(30);
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
      {isOpen && appointment && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onClick={(e) => {
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
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#90E0EF]/30">
              <h2 className="text-xl font-bold font-headlines text-[#1E3E72] flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Edit Availability
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
              {/* Date and Time Selection */}
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
                  disabled={editAvailabilityMutation.isPending || !selectedDateTime}
                  className="flex-1 bg-gradient-to-r !bg-[#03045E] text-white py-3 rounded-xl font-semibold font-subtitles hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  whileHover={!editAvailabilityMutation.isPending && selectedDateTime ? { scale: 1.02 } : {}}
                  whileTap={!editAvailabilityMutation.isPending && selectedDateTime ? { scale: 0.98 } : {}}
                >
                  {editAvailabilityMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </div>
                  ) : (
                    'Update Availability'
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

export default EditAvailabilityModal; 