import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useAppointmentsData } from '../../hooks/useAppointments';
import { formatters } from '../../lib/dayjs';
import dayjs from 'dayjs';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const { bookedAppointments, availableSlots } = useAppointmentsData();

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

  // Get calendar data
  const startOfMonth = currentDate.startOf('month');
  const endOfMonth = currentDate.endOf('month');
  const startOfCalendar = startOfMonth.startOf('week');
  const endOfCalendar = endOfMonth.endOf('week');

  // Generate calendar days
  const calendarDays = [];
  let day = startOfCalendar;
  while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar)) {
    calendarDays.push(day);
    day = day.add(1, 'day');
  }

  // Get appointments for a specific day
  const getAppointmentsForDay = (date: dayjs.Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    const booked = bookedAppointments.filter(apt =>
      dayjs(apt.start_time).format('YYYY-MM-DD') === dateStr
    );
    const available = availableSlots.filter(apt =>
      dayjs(apt.start_time).format('YYYY-MM-DD') === dateStr
    );
    return { booked, available };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev'
      ? currentDate.subtract(1, 'month')
      : currentDate.add(1, 'month')
    );
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
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Full Calendar
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Manage your appointments and availability
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-6 h-6 text-gray-600" />
              </motion.button>
            </div>

            {/* Calendar Content */}
            <div className="p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {currentDate.format('MMMM YYYY')}
                </h3>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </motion.button>
                  <motion.button
                    onClick={() => setCurrentDate(dayjs())}
                    className="px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Today
                  </motion.button>
                  <motion.button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </motion.button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Day Headers */}
                <div className="grid grid-cols-7 bg-gray-50">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-3 text-center">
                      <span className="text-sm font-semibold text-gray-700">
                        {day}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, index) => {
                    const { booked, available } = getAppointmentsForDay(day);
                    const isCurrentMonth = day.month() === currentDate.month();
                    const isToday = day.isSame(dayjs(), 'day');
                    const isPast = day.isBefore(dayjs(), 'day');

                    return (
                      <motion.div
                        key={index}
                        className={`min-h-[80px] sm:min-h-[100px] p-2 border-r border-b border-gray-200 ${!isCurrentMonth ? 'opacity-40' : ''
                          } ${isToday ? 'bg-blue-50' : ''} 
                        ${!isPast && isCurrentMonth ? 'hover:bg-gray-50' : ''} transition-colors cursor-pointer`}
                        whileHover={!isPast && isCurrentMonth ? { scale: 1.02 } : {}}
                      >
                        <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600 font-bold' :
                          isPast ? 'text-gray-400' : 'text-gray-900'
                          }`}>
                          {day.format('D')}
                        </div>

                        {/* Appointment indicators */}
                        <div className="space-y-1">
                          {booked.map((apt, idx) => (
                            <div key={idx} className="text-xs bg-green-100 text-green-700 px-1 py-0.5 rounded truncate">
                              {formatters.time(apt.start_time)}
                            </div>
                          ))}
                          {available.map((apt, idx) => (
                            <div key={idx} className="text-xs bg-blue-100 text-blue-700 px-1 py-0.5 rounded truncate">
                              {formatters.time(apt.start_time)}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-200 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Booked Appointments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-200 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Available Slots</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 rounded"></div>
                  <span className="text-sm font-medium text-gray-700">Today</span>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-green-600 mb-1">This Month</div>
                  <div className="text-xl font-bold text-gray-900">
                    {bookedAppointments.filter(apt => dayjs(apt.start_time).month() === currentDate.month()).length}
                  </div>
                  <div className="text-xs text-gray-600">Booked</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <div className="text-sm font-medium text-blue-600 mb-1">Available</div>
                  <div className="text-xl font-bold text-gray-900">
                    {availableSlots.filter(apt => dayjs(apt.start_time).month() === currentDate.month()).length}
                  </div>
                  <div className="text-xs text-gray-600">Slots</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm col-span-2 sm:col-span-1">
                  <div className="text-sm font-medium text-purple-600 mb-1">Utilization</div>
                  <div className="text-xl font-bold text-gray-900">
                    {availableSlots.length > 0
                      ? Math.round((bookedAppointments.length / (bookedAppointments.length + availableSlots.length)) * 100)
                      : 0
                    }%
                  </div>
                  <div className="text-xs text-gray-600">Rate</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CalendarModal; 