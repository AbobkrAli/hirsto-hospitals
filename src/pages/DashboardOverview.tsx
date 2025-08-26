import { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  Clock,
  Star,
  Stethoscope,
  TestTube,
  Heart,
  UserCheck,
  Eye,
  ArrowRight,
  Zap,
  ChevronRight,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// COLORS for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

type DoctorsAnalyticsItem = {
  doctor_id: number;
  doctor_name: string;
  specialization: string;
  average_rating: number;
  total_ratings: number;
  total_appointments: number;
  completed_appointments: number;
  total_patients: number;
  upcoming_appointments: number;
  cancelled_appointments: number;
};

type Summary = {
  total_doctors: number;
  active_doctors: number;
  total_appointments: number;
  completed_appointments: number;
  total_patients: number;
  upcoming_appointments: number;
  monthly_appointments: Array<{ month: string; appointments: number }>;
  top_specializations: Array<{ name: string; count: number }>;
  surgery_analytics: {
    total_surgeries: number;
    success_rate_percentage: number;
    average_surgery_duration: number;
    total_surgery_revenue: number;
    emergency_surgeries: number;
    most_common_surgeries: Array<{ name: string; count: number }>;
  };
  test_analytics: {
    total_tests: number;
    completed_tests: number;
    average_turnaround_hours: number;
    abnormal_results: number;
    total_test_revenue: number;
    most_common_tests: Array<{ name: string; count: number }>;
  };
  follow_up_analytics: {
    average_sessions_per_follow_up: number;
    patient_satisfaction_average: number;
    improvement_rate_percentage: number;
    active_follow_ups: number;
    follow_up_types: Array<{ name: string; count: number }>;
  };
};

type HospitalAnalytics = {
  hospital_name: string;
  summary: Summary;
  doctors_analytics: DoctorsAnalyticsItem[];
};

const HospitalAnalyticsDashboard = () => {

  const [hospitalData, setHospitalData] = useState<HospitalAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorsModalOpen, setDoctorsModalOpen] = useState(false);
  const [surgeriesModalOpen, setSurgeriesModalOpen] = useState(false);
  const [testsModalOpen, setTestsModalOpen] = useState(false);
  const [followUpsModalOpen, setFollowUpsModalOpen] = useState(false);
  const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);

  useEffect(() => {
    const fetchHospitalAnalytics = async () => {
      try {
        const hospital_id = JSON.parse(localStorage.getItem('hospitalData') || '{}').id;
        if (!hospital_id) {
          throw new Error('Missing hospital id');
        }
        const response = await api.get(`/hospitals/${hospital_id}/analytics`);
        const raw = response.data || {};
        const normalized: HospitalAnalytics = {
          hospital_name: raw.hospital_name,
          summary: {
            total_doctors: raw.summary?.total_doctors ?? 0,
            active_doctors: raw.summary?.active_doctors ?? 0,
            total_appointments: raw.summary?.total_appointments ?? 0,
            completed_appointments: raw.summary?.completed_appointments ?? 0,
            upcoming_appointments: raw.summary?.upcoming_appointments ?? 0,
            cancelled_appointments: raw.summary?.cancelled_appointments ?? 0,
            total_patients: raw.summary?.total_patients ?? 0,
            top_specializations: (raw.summary?.top_specializations ?? []).map((s: any) => ({
              name: s?.name ?? s?.specialization ?? 'Unknown',
              count: s?.count ?? 0,
            })),
            monthly_appointments: (raw.summary?.monthly_appointments ?? []).map((m: any) => ({
              month: m?.month ?? '',
              appointments: m?.appointments ?? m?.count ?? 0,
            })),
            surgery_analytics: {
              total_surgeries: raw.summary?.surgery_analytics?.total_surgeries ?? 0,
              success_rate_percentage: raw.summary?.surgery_analytics?.success_rate_percentage ?? 0,
              average_surgery_duration: raw.summary?.surgery_analytics?.average_surgery_duration ?? 0,
              total_surgery_revenue: raw.summary?.surgery_analytics?.total_surgery_revenue ?? 0,
              emergency_surgeries: raw.summary?.surgery_analytics?.emergency_surgeries ?? 0,
              most_common_surgeries: (raw.summary?.surgery_analytics?.most_common_surgeries ?? []).map((x: any) => ({
                name: x?.name ?? x?.surgery ?? 'Unknown',
                count: x?.count ?? 0,
              })),
            },
            test_analytics: {
              total_tests: raw.summary?.test_analytics?.total_tests ?? 0,
              completed_tests: raw.summary?.test_analytics?.completed_tests ?? 0,
              average_turnaround_hours: raw.summary?.test_analytics?.average_turnaround_hours ?? 0,
              abnormal_results: raw.summary?.test_analytics?.abnormal_results ?? 0,
              total_test_revenue: raw.summary?.test_analytics?.total_test_revenue ?? 0,
              most_common_tests: (raw.summary?.test_analytics?.most_common_tests ?? []).map((x: any) => ({
                name: x?.name ?? x?.test ?? 'Unknown',
                count: x?.count ?? 0,
              })),
            },
            follow_up_analytics: {
              average_sessions_per_follow_up: raw.summary?.follow_up_analytics?.average_sessions_per_follow_up ?? 0,
              patient_satisfaction_average: raw.summary?.follow_up_analytics?.patient_satisfaction_average ?? 0,
              improvement_rate_percentage: raw.summary?.follow_up_analytics?.improvement_rate_percentage ?? 0,
              active_follow_ups: raw.summary?.follow_up_analytics?.active_follow_ups ?? 0,
              follow_up_types: (raw.summary?.follow_up_analytics?.follow_up_types ?? []).map((x: any) => ({
                name: x?.name ?? x?.type ?? 'Unknown',
                count: x?.count ?? 0,
              })),
            },
          },
          doctors_analytics: (raw.doctors_analytics ?? []).map((d: any) => ({
            doctor_id: d?.doctor_id,
            doctor_name: d?.doctor_name,
            specialization: d?.specialization,
            total_appointments: d?.total_appointments ?? 0,
            completed_appointments: d?.completed_appointments ?? 0,
            upcoming_appointments: d?.upcoming_appointments ?? 0,
            cancelled_appointments: d?.cancelled_appointments ?? 0,
            total_patients: d?.total_patients ?? 0,
            average_rating: d?.average_rating ?? 0,
            total_ratings: d?.total_ratings ?? 0,
          })),
        };
        setHospitalData(normalized);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchHospitalAnalytics();

  }, []);

  // Skeleton Loading Component
  const DashboardSkeleton = () => {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded-lg w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Key Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-40"></div>
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-gray-200 rounded w-36"></div>
              <div className="w-5 h-5 bg-gray-200 rounded"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>

        {/* Top Doctors Performance Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="text-right">
                  <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Performance Indicators Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="w-5 h-5 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 rounded-xl mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-16 mx-auto mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!hospitalData) {
    return <div>No data available</div>;
  }

  const { summary, doctors_analytics } = hospitalData;

  // Calculate completion rates
  const appointmentCompletionRate = ((summary.completed_appointments / summary.total_appointments) * 100).toFixed(1);
  const surgerySuccessRate = summary.surgery_analytics.success_rate_percentage;
  const testCompletionRate = ((summary.test_analytics.completed_tests / summary.test_analytics.total_tests) * 100).toFixed(1);

  // Modal Components
  const DoctorsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50  backdrop-blur-lg bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Doctors Performance Analytics</h2>
                    <p className="text-blue-100 text-sm mt-1">Comprehensive overview of all medical staff</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white hover:text-blue-200 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-700 font-medium">Active Doctors</p>
                        <p className="text-2xl font-bold text-green-800">{summary.active_doctors}</p>
                      </div>
                      <div className="p-3 bg-green-200 rounded-lg">
                        <UserCheck className="w-5 h-5 text-green-700" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-700 font-medium">Avg Rating</p>
                        <p className="text-2xl font-bold text-blue-800">
                          {(doctors_analytics.reduce((acc, d) => acc + d.average_rating, 0) / doctors_analytics.length).toFixed(1)}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-200 rounded-lg">
                        <Star className="w-5 h-5 text-blue-700" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-700 font-medium">Total Patients</p>
                        <p className="text-2xl font-bold text-purple-800">
                          {doctors_analytics.reduce((acc, d) => acc + d.total_patients, 0)}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-200 rounded-lg">
                        <Users className="w-5 h-5 text-purple-700" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Cards */}
                <div className="grid gap-6">
                  {doctors_analytics.map((doctor) => {
                    const completionRate = ((doctor.completed_appointments / doctor.total_appointments) * 100).toFixed(1);
                    return (
                      <div key={doctor.doctor_id} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">

                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{doctor.doctor_name}</h3>
                              <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-gray-700">{doctor.average_rating}</span>
                                <span className="text-sm text-gray-500">({doctor.total_ratings} reviews)</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {completionRate}% Completion Rate
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-blue-600" />
                              <p className="text-xs font-medium text-gray-600">Appointments</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{doctor.total_appointments}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-1.5">
                                <div
                                  className="bg-green-500 h-1.5 rounded-full transition-all duration-500"
                                  style={{ width: `${completionRate}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Users className="w-4 h-4 text-purple-600" />
                              <p className="text-xs font-medium text-gray-600">Patients</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{doctor.total_patients}</p>
                            <p className="text-xs text-gray-500 mt-2">Unique patients served</p>
                          </div>

                          <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-orange-600" />
                              <p className="text-xs font-medium text-gray-600">Upcoming</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{doctor.upcoming_appointments}</p>
                            <p className="text-xs text-gray-500 mt-2">Scheduled ahead</p>
                          </div>

                          <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <div className="flex items-center gap-2 mb-2">
                              <Activity className="w-4 h-4 text-red-600" />
                              <p className="text-xs font-medium text-gray-600">Cancelled</p>
                            </div>
                            <p className="text-2xl font-bold text-gray-900">{doctor.cancelled_appointments}</p>
                            <p className="text-xs text-gray-500 mt-2">Cancellation rate: {((doctor.cancelled_appointments / doctor.total_appointments) * 100).toFixed(1)}%</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const SurgeriesModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  backdrop-blur-lg bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Surgery Analytics</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">{summary.surgery_analytics.success_rate_percentage}%</p>
                    <p className="text-sm text-gray-600">Success Rate</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">{summary.surgery_analytics.average_surgery_duration} min</p>
                    <p className="text-sm text-gray-600">Avg Duration</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-purple-600">${summary.surgery_analytics.total_surgery_revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Surgeries</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={summary.surgery_analytics.most_common_surgeries}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const TestsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  backdrop-blur-lg bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Test Analytics</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">{summary.test_analytics.average_turnaround_hours}h</p>
                    <p className="text-sm text-gray-600">Avg Turnaround</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-red-600">{summary.test_analytics.abnormal_results}</p>
                    <p className="text-sm text-gray-600">Abnormal Results</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">${summary.test_analytics.total_test_revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Distribution</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Tooltip />
                          <Legend />
                          <Pie
                            data={summary.test_analytics.most_common_tests}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="count"
                            nameKey="name"
                          >
                            {summary.test_analytics.most_common_tests.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Tests</h3>
                    <div className="space-y-3">
                      {summary.test_analytics.most_common_tests.map((test) => (
                        <div key={test.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{test.name}</span>
                          <span className="text-blue-600 font-semibold">{test.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const FollowUpsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  backdrop-blur-lg bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Follow-up Analytics</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{summary.follow_up_analytics.average_sessions_per_follow_up}</p>
                    <p className="text-sm text-gray-600">Avg Sessions</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <p className="text-2xl font-bold text-yellow-600">{summary.follow_up_analytics.patient_satisfaction_average}</p>
                    </div>
                    <p className="text-sm text-gray-600">Patient Satisfaction</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{summary.follow_up_analytics.improvement_rate_percentage}%</p>
                    <p className="text-sm text-gray-600">Improvement Rate</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{summary.follow_up_analytics.active_follow_ups}</p>
                    <p className="text-sm text-gray-600">Active Follow-ups</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow-up Types Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={summary.follow_up_analytics.follow_up_types}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const AppointmentsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0  backdrop-blur-lg bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Appointments Overview</h2>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Appointments Trend</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={summary.monthly_appointments}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="appointments" stroke="#3B82F6" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Specializations</h3>
                    <div className="space-y-3">
                      {summary.top_specializations.map((spec) => (
                        <div key={spec.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[0] }}></div>
                            <span className="font-medium text-gray-900">{spec.name}</span>
                          </div>
                          <span className="text-blue-600 font-semibold">{spec.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {hospitalData.hospital_name} Analytics
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Comprehensive hospital performance dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total_doctors}</p>
              <p className="text-xs text-green-600">{summary.active_doctors} active</p>
            </div>
            <div
              className="p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 hover:scale-110 transition-all duration-200 hover:shadow-md group border border-blue-200 hover:border-blue-200"
              onClick={() => setDoctorsModalOpen(true)}
              title="Click to view doctors analytics"
            >
              <Stethoscope className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{summary.total_appointments}</p>
              <p className="text-xs text-green-600">{appointmentCompletionRate}% completed</p>
            </div>
            <div
              className="p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 hover:scale-110 transition-all duration-200 hover:shadow-md group border border-blue-200 hover:border-blue-200"
              onClick={() => setAppointmentsModalOpen(true)}
              title="Click to view appointments overview"
            >
              <Calendar className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Surgeries</p>
              <p className="text-2xl font-bold text-gray-900">{summary.surgery_analytics.total_surgeries}</p>
              <p className="text-xs text-green-600">{surgerySuccessRate}% success rate</p>
            </div>
            <div
              className="p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 hover:scale-110 transition-all duration-200 hover:shadow-md group border border-blue-200 hover:border-blue-200"
              onClick={() => setSurgeriesModalOpen(true)}
              title="Click to view surgery analytics"
            >
              <Activity className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900">{summary.test_analytics.total_tests}</p>
              <p className="text-xs text-green-600">{testCompletionRate}% completed</p>
            </div>
            <div
              className="p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 hover:scale-110 transition-all duration-200 hover:shadow-md group border border-blue-200 hover:border-blue-200"
              onClick={() => setTestsModalOpen(true)}
              title="Click to view test analytics"
            >
              <TestTube className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setDoctorsModalOpen(true)}
            className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 border border-blue-200 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors">
                <Eye className="w-4 h-4 text-blue-700" />
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">View Doctors</h3>
            <p className="text-xs text-gray-600 mb-2">
              Detailed analytics for all {summary.active_doctors} active doctors.
            </p>
            <div className="inline-flex items-center text-xs font-medium text-blue-700">
              <span>Open Analytics</span>
            </div>
          </button>

          <button
            onClick={() => setSurgeriesModalOpen(true)}
            className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 border border-blue-200 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors">
                <Activity className="w-4 h-4 text-blue-700" />
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Surgery Analytics</h3>
            <p className="text-xs text-gray-600 mb-2">
              Monitor surgery performance and success rates.
            </p>
            <div className="inline-flex items-center text-xs font-medium text-blue-700">
              <span>View Surgery Data</span>
            </div>
          </button>

          <button
            onClick={() => setTestsModalOpen(true)}
            className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 border border-blue-200 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors">
                <TestTube className="w-4 h-4 text-blue-700" />
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Test Analytics</h3>
            <p className="text-xs text-gray-600 mb-2">
              Review test results and turnaround times.
            </p>
            <div className="inline-flex items-center text-xs font-medium text-blue-700">
              <span>View Test Data</span>
            </div>
          </button>

          <button
            onClick={() => setFollowUpsModalOpen(true)}
            className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 border border-blue-200 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors">
                <Heart className="w-4 h-4 text-blue-700" />
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Follow-ups</h3>
            <p className="text-xs text-gray-600 mb-2">
              Track patient follow-up care and satisfaction.
            </p>
            <div className="inline-flex items-center text-xs font-medium text-blue-700">
              <span>View Follow-ups</span>
            </div>
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Appointments Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Appointments</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.monthly_appointments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Specializations Chart (Pie) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Specializations</h3>
            <PieChart className="w-5 h-5 text-blue-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Tooltip />
                <Legend />
                <Pie
                  data={summary.top_specializations}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="count"
                  nameKey="name"
                  label
                >
                  {summary.top_specializations.map((_, index) => (
                    <Cell key={`spec-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Doctors Performance */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Doctors</h3>
          <button
            onClick={() => setDoctorsModalOpen(true)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appointments</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors_analytics.map((doctor) => {
                const completionRate = ((doctor.completed_appointments / doctor.total_appointments) * 100).toFixed(1);
                return (
                  <tr key={doctor.doctor_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doctor.doctor_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.specialization}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.total_appointments}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.total_patients}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm text-gray-900">{doctor.average_rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({doctor.total_ratings})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Surgery Stats */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-200 rounded-xl">
              <Activity className="w-6 h-6 text-green-700" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-700">{summary.surgery_analytics.success_rate_percentage}%</p>
              <p className="text-sm text-green-600">Success Rate</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-green-700">Emergency Surgeries</span>
              <span className="font-medium text-green-800">{summary.surgery_analytics.emergency_surgeries}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-700">Avg Duration</span>
              <span className="font-medium text-green-800">{summary.surgery_analytics.average_surgery_duration} min</span>
            </div>
          </div>
        </div>

        {/* Test Stats */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-200 rounded-xl">
              <TestTube className="w-6 h-6 text-purple-700" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-purple-700">{summary.test_analytics.average_turnaround_hours}h</p>
              <p className="text-sm text-purple-600">Avg Turnaround</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-purple-700">Abnormal Results</span>
              <span className="font-medium text-purple-800">{summary.test_analytics.abnormal_results}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-purple-700">Revenue</span>
              <span className="font-medium text-purple-800">${summary.test_analytics.total_test_revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Follow-up Stats */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-200 rounded-xl">
              <Heart className="w-6 h-6 text-orange-700" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-orange-700">{summary.follow_up_analytics.improvement_rate_percentage}%</p>
              <p className="text-sm text-orange-600">Improvement Rate</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-orange-700">Patient Satisfaction</span>
              <span className="font-medium text-orange-800 flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                {summary.follow_up_analytics.patient_satisfaction_average}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-orange-700">Active Follow-ups</span>
              <span className="font-medium text-orange-800">{summary.follow_up_analytics.active_follow_ups}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Key Performance Indicators</h3>
          <Target className="w-5 h-5 text-blue-600" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary.total_patients}</p>
            <p className="text-sm text-gray-600">Total Patients</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary.upcoming_appointments}</p>
            <p className="text-sm text-gray-600">Upcoming Appointments</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">${summary.surgery_analytics.total_surgery_revenue.toLocaleString()}</p>
            <p className="text-sm text-gray-600">Surgery Revenue</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-3">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary.follow_up_analytics.active_follow_ups}</p>
            <p className="text-sm text-gray-600">Active Follow-ups</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DoctorsModal isOpen={doctorsModalOpen} onClose={() => setDoctorsModalOpen(false)} />
      <SurgeriesModal isOpen={surgeriesModalOpen} onClose={() => setSurgeriesModalOpen(false)} />
      <TestsModal isOpen={testsModalOpen} onClose={() => setTestsModalOpen(false)} />
      <FollowUpsModal isOpen={followUpsModalOpen} onClose={() => setFollowUpsModalOpen(false)} />
      <AppointmentsModal isOpen={appointmentsModalOpen} onClose={() => setAppointmentsModalOpen(false)} />
    </div>
  );
};

export default HospitalAnalyticsDashboard;