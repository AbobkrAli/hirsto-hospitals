import React, { useState } from 'react';
import {
  Star,
  Stethoscope,
  Calendar,
  Users,
  Clock,
  TrendingUp,
  Award,
  Activity,
  Filter,
  Search,
  ChevronDown,
  X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mock doctors data
const mockDoctorsData = [
  {
    doctor_id: 1,
    doctor_name: "Dr. Ahmed Hassan",
    specialization: "Cardiology",
    total_appointments: 185,
    completed_appointments: 178,
    upcoming_appointments: 5,
    cancelled_appointments: 2,
    total_patients: 142,
    average_rating: 4.8,
    total_ratings: 89,
    experience_years: 15,
    success_rate: 96.2,
    revenue_generated: 125000,
    monthly_performance: [
      { month: "Jan", appointments: 28 },
      { month: "Feb", appointments: 32 },
      { month: "Mar", appointments: 30 },
      { month: "Apr", appointments: 35 },
      { month: "May", appointments: 31 },
      { month: "Jun", appointments: 29 }
    ]
  },
  {
    doctor_id: 2,
    doctor_name: "Dr. Fatma El-Sayed",
    specialization: "Neurology",
    total_appointments: 156,
    completed_appointments: 148,
    upcoming_appointments: 6,
    cancelled_appointments: 2,
    total_patients: 118,
    average_rating: 4.7,
    total_ratings: 74,
    experience_years: 12,
    success_rate: 94.9,
    revenue_generated: 98000,
    monthly_performance: [
      { month: "Jan", appointments: 22 },
      { month: "Feb", appointments: 26 },
      { month: "Mar", appointments: 28 },
      { month: "Apr", appointments: 25 },
      { month: "May", appointments: 27 },
      { month: "Jun", appointments: 28 }
    ]
  },
  {
    doctor_id: 3,
    doctor_name: "Dr. Mohamed Rashad",
    specialization: "Orthopedics",
    total_appointments: 203,
    completed_appointments: 195,
    upcoming_appointments: 4,
    cancelled_appointments: 4,
    total_patients: 165,
    average_rating: 4.9,
    total_ratings: 112,
    experience_years: 18,
    success_rate: 96.1,
    revenue_generated: 142000,
    monthly_performance: [
      { month: "Jan", appointments: 33 },
      { month: "Feb", appointments: 35 },
      { month: "Mar", appointments: 34 },
      { month: "Apr", appointments: 38 },
      { month: "May", appointments: 32 },
      { month: "Jun", appointments: 31 }
    ]
  },
  {
    doctor_id: 4,
    doctor_name: "Dr. Yasmin Abdel Rahman",
    specialization: "Pediatrics",
    total_appointments: 174,
    completed_appointments: 169,
    upcoming_appointments: 3,
    cancelled_appointments: 2,
    total_patients: 98,
    average_rating: 4.8,
    total_ratings: 67,
    experience_years: 10,
    success_rate: 97.1,
    revenue_generated: 89000,
    monthly_performance: [
      { month: "Jan", appointments: 25 },
      { month: "Feb", appointments: 30 },
      { month: "Mar", appointments: 29 },
      { month: "Apr", appointments: 32 },
      { month: "May", appointments: 28 },
      { month: "Jun", appointments: 30 }
    ]
  },
  {
    doctor_id: 5,
    doctor_name: "Dr. Omar Farouk",
    specialization: "General Surgery",
    total_appointments: 138,
    completed_appointments: 132,
    upcoming_appointments: 4,
    cancelled_appointments: 2,
    total_patients: 125,
    average_rating: 4.6,
    total_ratings: 58,
    experience_years: 14,
    success_rate: 95.7,
    revenue_generated: 156000,
    monthly_performance: [
      { month: "Jan", appointments: 20 },
      { month: "Feb", appointments: 24 },
      { month: "Mar", appointments: 23 },
      { month: "Apr", appointments: 26 },
      { month: "May", appointments: 22 },
      { month: "Jun", appointments: 23 }
    ]
  },
  {
    doctor_id: 6,
    doctor_name: "Dr. Nadia Mahmoud",
    specialization: "Dermatology",
    total_appointments: 145,
    completed_appointments: 140,
    upcoming_appointments: 3,
    cancelled_appointments: 2,
    total_patients: 89,
    average_rating: 4.7,
    total_ratings: 45,
    experience_years: 8,
    success_rate: 96.6,
    revenue_generated: 76000,
    monthly_performance: [
      { month: "Jan", appointments: 22 },
      { month: "Feb", appointments: 25 },
      { month: "Mar", appointments: 24 },
      { month: "Apr", appointments: 27 },
      { month: "May", appointments: 23 },
      { month: "Jun", appointments: 24 }
    ]
  }
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const DoctorsModal = ({ isOpen, onClose }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [filterSpecialization, setFilterSpecialization] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  if (!isOpen) return null;

  // Get unique specializations
  const specializations = [...new Set(mockDoctorsData.map(doc => doc.specialization))];

  // Filter and sort doctors
  const filteredDoctors = mockDoctorsData
    .filter(doctor => {
      const matchesSearch = doctor.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialization = filterSpecialization === 'all' || doctor.specialization === filterSpecialization;
      return matchesSearch && matchesSpecialization;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.average_rating - a.average_rating;
        case 'appointments':
          return b.total_appointments - a.total_appointments;
        case 'revenue':
          return b.revenue_generated - a.revenue_generated;
        case 'success_rate':
          return b.success_rate - a.success_rate;
        default:
          return 0;
      }
    });

  // Calculate overall statistics
  const totalAppointments = mockDoctorsData.reduce((sum, doc) => sum + doc.total_appointments, 0);
  const totalPatients = mockDoctorsData.reduce((sum, doc) => sum + doc.total_patients, 0);
  const averageRating = (mockDoctorsData.reduce((sum, doc) => sum + doc.average_rating, 0) / mockDoctorsData.length).toFixed(1);
  const totalRevenue = mockDoctorsData.reduce((sum, doc) => sum + doc.revenue_generated, 0);

  // Specialization distribution data
  const specializationData = specializations.map(spec => ({
    name: spec,
    value: mockDoctorsData.filter(doc => doc.specialization === spec).length,
    appointments: mockDoctorsData.filter(doc => doc.specialization === spec)
      .reduce((sum, doc) => sum + doc.total_appointments, 0)
  }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Doctors Analytics Dashboard</h2>
              <p className="text-gray-600 mt-1">Comprehensive performance metrics for all medical staff</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-full transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-blue-100">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{mockDoctorsData.length}</p>
              <p className="text-xs text-gray-600">Total Doctors</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-green-100">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mx-auto mb-2">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
              <p className="text-xs text-gray-600">Total Appointments</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-yellow-100">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full mx-auto mb-2">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
              <p className="text-xs text-gray-600">Avg Rating</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-purple-100">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">${(totalRevenue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-gray-600">Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Left Side - Doctors List */}
          <div className="flex-1 flex flex-col">
            {/* Filters */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Specialization Filter */}
                <div className="relative">
                  <select
                    value={filterSpecialization}
                    onChange={(e) => setFilterSpecialization(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Sort By */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="rating">Sort by Rating</option>
                    <option value="appointments">Sort by Appointments</option>
                    <option value="revenue">Sort by Revenue</option>
                    <option value="success_rate">Sort by Success Rate</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Doctors List */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid gap-4">
                {filteredDoctors.map((doctor) => {
                  const completionRate = ((doctor.completed_appointments / doctor.total_appointments) * 100).toFixed(1);

                  return (
                    <div
                      key={doctor.doctor_id}
                      className={`bg-white rounded-xl p-4 border cursor-pointer transition-all duration-200 hover:shadow-lg ${selectedDoctor?.doctor_id === doctor.doctor_id
                          ? 'border-blue-500 shadow-lg ring-2 ring-blue-100'
                          : 'border-gray-200 hover:border-blue-300'
                        }`}
                      onClick={() => setSelectedDoctor(doctor)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                            <Stethoscope className="w-8 h-8 text-blue-600" />
                          </div>

                          {/* Doctor Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{doctor.doctor_name}</h3>
                            <p className="text-blue-600 font-medium mb-2">{doctor.specialization}</p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-gray-500">Appointments</p>
                                <p className="font-semibold text-gray-900">{doctor.total_appointments}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Patients</p>
                                <p className="font-semibold text-gray-900">{doctor.total_patients}</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Success Rate</p>
                                <p className="font-semibold text-green-600">{doctor.success_rate}%</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Revenue</p>
                                <p className="font-semibold text-purple-600">${(doctor.revenue_generated / 1000).toFixed(0)}K</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Rating and Completion */}
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center justify-end gap-1 mb-2">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-lg font-bold text-gray-900">{doctor.average_rating}</span>
                            <span className="text-xs text-gray-500">({doctor.total_ratings})</span>
                          </div>

                          <div className="text-xs text-gray-500 mb-1">Completion Rate</div>
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${completionRate}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side - Doctor Details */}
          <div className="w-1/3 border-l border-gray-200 bg-gray-50">
            {selectedDoctor ? (
              <div className="h-full overflow-y-auto">
                {/* Doctor Header */}
                <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Stethoscope className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{selectedDoctor.doctor_name}</h3>
                    <p className="text-blue-100 mb-2">{selectedDoctor.specialization}</p>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 fill-current text-yellow-300" />
                      <span className="text-lg font-bold">{selectedDoctor.average_rating}</span>
                      <span className="text-blue-100">({selectedDoctor.total_ratings} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="p-6 space-y-6">
                  {/* Key Metrics */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                        <Calendar className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-lg font-bold text-gray-900">{selectedDoctor.total_appointments}</p>
                        <p className="text-xs text-gray-500">Total Appointments</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                        <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-lg font-bold text-gray-900">{selectedDoctor.total_patients}</p>
                        <p className="text-xs text-gray-500">Unique Patients</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                        <Award className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-lg font-bold text-gray-900">{selectedDoctor.success_rate}%</p>
                        <p className="text-xs text-gray-500">Success Rate</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
                        <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                        <p className="text-lg font-bold text-gray-900">${(selectedDoctor.revenue_generated / 1000).toFixed(0)}K</p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Performance Chart */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Monthly Appointments</h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={selectedDoctor.monthly_performance}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="appointments"
                              stroke="#3B82F6"
                              strokeWidth={3}
                              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Details</h4>
                    <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Experience</span>
                        <span className="font-semibold text-gray-900">{selectedDoctor.experience_years} years</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Upcoming Appointments</span>
                        <span className="font-semibold text-blue-600">{selectedDoctor.upcoming_appointments}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cancelled Appointments</span>
                        <span className="font-semibold text-red-600">{selectedDoctor.cancelled_appointments}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Completion Rate</span>
                        <span className="font-semibold text-green-600">
                          {((selectedDoctor.completed_appointments / selectedDoctor.total_appointments) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Stethoscope className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Select a Doctor</p>
                  <p className="text-sm">Click on a doctor to view detailed analytics</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsModal;