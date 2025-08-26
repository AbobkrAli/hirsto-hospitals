import React, { useState, useEffect } from 'react';
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
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data based on the API structure
const mockHospitalData = {
  hospital_id: 1,
  hospital_name: "Cairo Medical Center",
  summary: {
    total_doctors: 45,
    active_doctors: 42,
    total_appointments: 1250,
    completed_appointments: 1180,
    upcoming_appointments: 45,
    cancelled_appointments: 25,
    total_patients: 890,
    top_specializations: [
      { name: "Cardiology", count: 180 },
      { name: "Orthopedics", count: 165 },
      { name: "Neurology", count: 142 },
      { name: "General Surgery", count: 128 },
      { name: "Pediatrics", count: 115 }
    ],
    monthly_appointments: [
      { month: "Jan", appointments: 95 },
      { month: "Feb", appointments: 110 },
      { month: "Mar", appointments: 125 },
      { month: "Apr", appointments: 140 },
      { month: "May", appointments: 135 },
      { month: "Jun", appointments: 150 }
    ],
    surgery_analytics: {
      total_surgeries: 320,
      completed_surgeries: 295,
      scheduled_surgeries: 18,
      cancelled_surgeries: 7,
      emergency_surgeries: 45,
      average_surgery_duration: 145,
      total_surgery_revenue: 485000,
      success_rate_percentage: 94.5,
      most_common_surgeries: [
        { name: "Appendectomy", count: 35 },
        { name: "Gallbladder Surgery", count: 28 },
        { name: "Hernia Repair", count: 22 },
        { name: "Knee Replacement", count: 18 }
      ]
    },
    test_analytics: {
      total_tests: 2450,
      completed_tests: 2380,
      scheduled_tests: 45,
      cancelled_tests: 25,
      abnormal_results: 285,
      total_test_revenue: 125000,
      average_turnaround_hours: 24,
      most_common_tests: [
        { name: "Blood Test", count: 450 },
        { name: "X-Ray", count: 380 },
        { name: "MRI", count: 220 },
        { name: "CT Scan", count: 195 }
      ]
    },
    follow_up_analytics: {
      total_follow_ups: 580,
      active_follow_ups: 125,
      completed_follow_ups: 455,
      average_sessions_per_follow_up: 3.2,
      patient_satisfaction_average: 4.6,
      improvement_rate_percentage: 87.3,
      follow_up_types: [
        { name: "Post-Surgery", count: 185 },
        { name: "Chronic Care", count: 165 },
        { name: "Rehabilitation", count: 142 },
        { name: "Preventive", count: 88 }
      ]
    }
  },
  doctors_analytics: [
    {
      doctor_id: 1,
      doctor_name: "Dr. Ahmed Hassan",
      specialization: "Cardiology",
      total_appointments: 85,
      completed_appointments: 82,
      upcoming_appointments: 2,
      cancelled_appointments: 1,
      total_patients: 65,
      average_rating: 4.8,
      total_ratings: 45
    },
    {
      doctor_id: 2,
      doctor_name: "Dr. Fatma El-Sayed",
      specialization: "Neurology",
      total_appointments: 78,
      completed_appointments: 75,
      upcoming_appointments: 2,
      cancelled_appointments: 1,
      total_patients: 58,
      average_rating: 4.7,
      total_ratings: 38
    },
    {
      doctor_id: 3,
      doctor_name: "Dr. Mohamed Rashad",
      specialization: "Orthopedics",
      total_appointments: 92,
      completed_appointments: 88,
      upcoming_appointments: 3,
      cancelled_appointments: 1,
      total_patients: 72,
      average_rating: 4.9,
      total_ratings: 52
    }
  ]
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const HospitalAnalyticsDashboard = () => {
  const [hospitalData, setHospitalData] = useState(mockHospitalData);
  const [doctorsModalOpen, setDoctorsModalOpen] = useState(false);
  const [surgeriesModalOpen, setSurgeriesModalOpen] = useState(false);
  const [testsModalOpen, setTestsModalOpen] = useState(false);
  const [followUpsModalOpen, setFollowUpsModalOpen] = useState(false);
  const [appointmentsModalOpen, setAppointmentsModalOpen] = useState(false);

  const { summary, doctors_analytics } = hospitalData;

  // Calculate completion rates
  const appointmentCompletionRate = ((summary.completed_appointments / summary.total_appointments) * 100).toFixed(1);
  const surgerySuccessRate = summary.surgery_analytics.success_rate_percentage;
  const testCompletionRate = ((summary.test_analytics.completed_tests / summary.test_analytics.total_tests) * 100).toFixed(1);

  // Modal Components
  const DoctorsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Doctors Analytics</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="grid gap-4">
              {doctors_analytics.map((doctor) => (
                <div key={doctor.doctor_id} className="bg-gray-50 rounded-xl p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{doctor.doctor_name}</h3>
                      <p className="text-sm text-blue-600">{doctor.specialization}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{doctor.total_appointments}</p>
                      <p className="text-xs text-gray-500">Total Appointments</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{doctor.total_patients}</p>
                      <p className="text-xs text-gray-500">Total Patients</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <p className="text-lg font-bold text-gray-900">{doctor.average_rating}</p>
                      </div>
                      <p className="text-xs text-gray-500">({doctor.total_ratings} reviews)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SurgeriesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
        </div>
      </div>
    );
  };

  const TestsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                      <pie
                        data={summary.test_analytics.most_common_tests}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        nameKey="name"
                      >
                        {summary.test_analytics.most_common_tests.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </pie>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Tests</h3>
                <div className="space-y-3">
                  {summary.test_analytics.most_common_tests.map((test, index) => (
                    <div key={test.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{test.name}</span>
                      <span className="text-blue-600 font-semibold">{test.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FollowUpsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
        </div>
      </div>
    );
  };

  const AppointmentsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
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
                  {summary.top_specializations.map((spec, index) => (
                    <div key={spec.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="font-medium text-gray-900">{spec.name}</span>
                      </div>
                      <span className="text-blue-600 font-semibold">{spec.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {hospitalData.hospital_name} Analytics 🏥
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
              className="p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 hover:scale-110 transition-all duration-200 hover:shadow-md group border border-blue-100 hover:border-blue-200"
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
              className="p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 hover:scale-110 transition-all duration-200 hover:shadow-md group border border-blue-100 hover:border-blue-200"
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
              className="p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 hover:scale-110 transition-all duration-200 hover:shadow-md group border border-blue-100 hover:border-blue-200"
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
              className="p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 hover:scale-110 transition-all duration-200 hover:shadow-md group border border-blue-100 hover:border-blue-200"
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

        {/* Top Specializations Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Specializations</h3>
            <PieChart className="w-5 h-5 text-blue-600" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.top_specializations} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
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