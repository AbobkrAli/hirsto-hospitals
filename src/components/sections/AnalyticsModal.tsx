import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, TrendingUp, Users, Calendar, Clock, Star, Activity } from 'lucide-react';
import { useAppointmentsData, useDoctorRating } from '../../hooks/useAppointments';
import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import { getAuthData, type User as UserType } from '../../services/authService';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const { bookedAppointments, availableSlots } = useAppointmentsData();
  const { data: ratingData } = useDoctorRating(user?.id);

  useEffect(() => {
    const { user: userData } = getAuthData();
    if (userData) {
      setUser(userData);
    }
  }, []);

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

  // Calculate analytics data
  const today = dayjs();
  const thisWeek = today.startOf('week');
  const thisMonth = today.startOf('month');
  const lastMonth = today.subtract(1, 'month').startOf('month');

  // Time-based metrics
  const appointmentsToday = bookedAppointments.filter(apt =>
    dayjs(apt.start_time).isSame(today, 'day')
  ).length;

  const appointmentsThisWeek = bookedAppointments.filter(apt =>
    dayjs(apt.start_time).isAfter(thisWeek)
  ).length;

  const appointmentsThisMonth = bookedAppointments.filter(apt =>
    dayjs(apt.start_time).isAfter(thisMonth)
  ).length;

  const appointmentsLastMonth = bookedAppointments.filter(apt =>
    dayjs(apt.start_time).isAfter(lastMonth) && dayjs(apt.start_time).isBefore(thisMonth)
  ).length;

  // Growth calculations
  const monthlyGrowth = appointmentsLastMonth > 0
    ? ((appointmentsThisMonth - appointmentsLastMonth) / appointmentsLastMonth * 100)
    : 0;

  // Average appointments per day
  const daysInMonth = today.daysInMonth();
  const avgAppointmentsPerDay = appointmentsThisMonth / daysInMonth;

  // Utilization rate
  const totalSlots = bookedAppointments.length + availableSlots.length;
  const utilizationRate = totalSlots > 0 ? (bookedAppointments.length / totalSlots * 100) : 0;

  // Peak hours analysis
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const appointments = bookedAppointments.filter(apt =>
      dayjs(apt.start_time).hour() === hour
    ).length;
    return { hour, appointments };
  }).filter(data => data.appointments > 0);

  const peakHour = hourlyData.reduce((max, current) =>
    current.appointments > max.appointments ? current : max,
    { hour: 0, appointments: 0 }
  );

  // Weekly pattern
  const weeklyData = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => {
    const dayAppointments = bookedAppointments.filter(apt =>
      dayjs(apt.start_time).day() === index
    ).length;
    return { day, appointments: dayAppointments };
  });

  const busiestDay = weeklyData.reduce((max, current) =>
    current.appointments > max.appointments ? current : max,
    { day: 'Monday', appointments: 0 }
  );

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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto border border-gray-200"
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
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Analytics Report
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Comprehensive practice insights and metrics
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

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Appointments */}
                <motion.div
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Total</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{bookedAppointments.length}</div>
                  <div className="text-xs text-gray-600">Appointments</div>
                </motion.div>

                {/* This Month */}
                <motion.div
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-600">This Month</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{appointmentsThisMonth}</div>
                  <div className="text-xs text-gray-600">
                    {monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}% vs last month
                  </div>
                </motion.div>

                {/* Average Rating */}
                <motion.div
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-600">Rating</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {ratingData ? ratingData.average_rating.toFixed(1) : '—'}
                  </div>
                  <div className="text-xs text-gray-600">
                    {ratingData ? `${ratingData.total_ratings} reviews` : 'No reviews yet'}
                  </div>
                </motion.div>

                {/* Utilization */}
                <motion.div
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Utilization</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{utilizationRate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-600">Capacity used</div>
                </motion.div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Pattern */}
                <motion.div
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Weekly Pattern
                  </h3>
                  <div className="space-y-3">
                    {weeklyData.map((data, index) => (
                      <div key={data.day} className="flex items-center gap-3">
                        <div className="w-16 text-sm font-medium text-gray-700">{data.day.slice(0, 3)}</div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                          <motion.div
                            className="h-full bg-blue-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{
                              width: weeklyData.length > 0
                                ? `${(data.appointments / Math.max(...weeklyData.map(d => d.appointments))) * 100}%`
                                : '0%'
                            }}
                            transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                          />
                        </div>
                        <div className="w-8 text-sm font-medium text-gray-900">{data.appointments}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-700">
                      Busiest Day: <span className="font-bold">{busiestDay.day}</span> ({busiestDay.appointments} appointments)
                    </div>
                  </div>
                </motion.div>

                {/* Performance Insights */}
                <motion.div
                  className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Performance Insights
                  </h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">Peak Hours</span>
                      </div>
                      <div className="text-sm text-green-600">
                        Most busy at {peakHour.hour}:00 with {peakHour.appointments} appointments
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Daily Average</span>
                      </div>
                      <div className="text-sm text-blue-600">
                        {avgAppointmentsPerDay.toFixed(1)} appointments per day this month
                      </div>
                    </div>

                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Patient Flow</span>
                      </div>
                      <div className="text-sm text-purple-600">
                        {bookedAppointments.length} total patients served
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Available Slots</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {availableSlots.length} slots ready for booking
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Recent Trends */}
              <motion.div
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">Summary & Recommendations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Key Highlights</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {appointmentsToday} appointments scheduled for today
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {appointmentsThisWeek} appointments this week
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        {utilizationRate.toFixed(1)}% schedule utilization
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Growth Metrics</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${monthlyGrowth >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {monthlyGrowth >= 0 ? '+' : ''}{monthlyGrowth.toFixed(1)}% monthly growth
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        {ratingData ? `${ratingData.average_rating.toFixed(1)}/5 rating` : 'No ratings yet'}
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Peak activity on {busiestDay.day}s
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnalyticsModal;