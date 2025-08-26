import { useState, useEffect } from 'react';
import {
  Package,
  ShoppingCart,
  Clock,
  AlertTriangle,
  Eye,
  Zap,
  ArrowRight,
  Focus
} from 'lucide-react';
import { getAuthData, type User as UserType } from '../services/authService';
import { useTimezone } from '../hooks/useTimezone';
import { usePharmacyData } from '../hooks/usePharmacyData';
import { usePharmacyMedicines } from '../hooks/useMedicine';
import { useAllPharmacyOrders } from '../hooks/useOrders';
import dayjs from 'dayjs';
import PendingOrdersModal from '../components/sections/PendingOrdersModal';
import LowStockMedicinesModal from '../components/sections/LowStockMedicinesModal';
import FocusModeModal from '../components/sections/FocusModeModal';
import TodaysOrdersModal from '../components/sections/TodaysOrdersModal';
import MedicineStockModal from '../components/sections/MedicineStockModal';
import { InactivePharmacyMessage } from '../components';

const BranchDashboard: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [pendingOrdersModalOpen, setPendingOrdersModalOpen] = useState(false);
  const [lowStockModalOpen, setLowStockModalOpen] = useState(false);
  const [focusModeModalOpen, setFocusModeModalOpen] = useState(false);
  const [todaysOrdersModalOpen, setTodaysOrdersModalOpen] = useState(false);
  const [medicineStockModalOpen, setMedicineStockModalOpen] = useState(false);
  const { formatters } = useTimezone();

  // Check pharmacy status
  const { data: pharmacyData } = usePharmacyData();
  const isPharmacyInactive = pharmacyData && !pharmacyData.is_active;

  // Fetch medicines and orders data
  const { data: medicines = [] } = usePharmacyMedicines();
  const { data: orders = [] } = useAllPharmacyOrders();

  useEffect(() => {
    const { user: userData } = getAuthData();
    if (userData) {
      setUser(userData);
    }
  }, []);

  // Show inactive message if pharmacy is not active
  if (isPharmacyInactive) {
    return <InactivePharmacyMessage />;
  }

  // Calculate stats from real data
  const todaysOrdersData = orders.filter(order =>
    dayjs(order.created_at).isSame(dayjs(), 'day')
  );
  const todaysOrders = todaysOrdersData.length;

  const medicinesOutOfStock = medicines.filter(medicine =>
    !medicine.in_stock || medicine.quantity === 0
  ).length;

  const pendingOrders = orders.filter(order =>
    order.status.toLowerCase() === 'pending'
  );

  // Get medicines sorted by stock (lowest first)
  const medicinesByStock = [...medicines]
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5); // Show top 5 lowest stock

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || 'Branch'}! 👋
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              {formatters.date(dayjs())} • Branch Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Orders</p>
              <p className="text-2xl font-bold text-gray-900">{todaysOrders}</p>
            </div>
            <div
              className="p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 hover:scale-110 transition-all duration-200 hover:shadow-md group border border-blue-100 hover:border-blue-200"
              onClick={() => setTodaysOrdersModalOpen(true)}
              title="Click to view today's orders"
            >
              <ShoppingCart className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Medicine Stock</p>
              <p className="text-2xl font-bold text-gray-900">{medicines.length}</p>
            </div>
            <div
              className="p-3 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 hover:scale-110 transition-all duration-200 hover:shadow-md group border border-blue-100 hover:border-blue-200"
              onClick={() => setMedicineStockModalOpen(true)}
              title="Click to view medicine stock"
            >
              <Package className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          onClick={() => setPendingOrdersModalOpen(true)}
          title="Click to view pending orders"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
              <p className="text-2xl font-bold text-gray-900">{pendingOrders.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 hover:scale-110 transition-all duration-200 hover:shadow-md group">
              <Clock className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
            </div>
          </div>
        </div>

        <div
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
          onClick={() => setLowStockModalOpen(true)}
          title="Click to view out of stock medicines"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
              <p className="text-2xl font-bold text-gray-900">{medicinesOutOfStock}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 hover:scale-110 transition-all duration-200 hover:shadow-md group">
              <AlertTriangle className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* View Pending Orders Action */}
          <button
            onClick={() => setPendingOrdersModalOpen(true)}
            className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 border border-blue-200 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors">
                <Eye className="w-4 h-4 text-blue-700" />
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">View Pending Orders</h3>
            <p className="text-xs text-gray-600 mb-2">
              Review and manage {pendingOrders.length} pending orders that require your attention.
            </p>
            <div className="inline-flex items-center text-xs font-medium text-blue-700">
              <span>Open Orders Modal</span>
            </div>
          </button>

          {/* View Low Stock Action */}
          <button
            onClick={() => setLowStockModalOpen(true)}
            className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 border border-blue-200 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors">
                <Eye className="w-4 h-4 text-blue-700" />
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Check Low Stock</h3>
            <p className="text-xs text-gray-600 mb-2">
              Monitor medicines with low inventory levels and manage stock alerts.
            </p>
            <div className="inline-flex items-center text-xs font-medium text-blue-700">
              <span>Open Stock Modal</span>
            </div>
          </button>

          {/* Focus Mode Action */}
          <button
            onClick={() => setFocusModeModalOpen(true)}
            className="bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-150 border border-blue-200 rounded-xl p-4 text-left transition-all duration-200 hover:shadow-md group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors">
                <Focus className="w-4 h-4 text-blue-700" />
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Focus Mode</h3>
            <p className="text-xs text-gray-600 mb-2">
              Full-screen real-time order monitoring with live updates every 30 seconds.
            </p>
            <div className="inline-flex items-center text-xs font-medium text-blue-700">
              <span>Enter Focus Mode</span>
            </div>
          </button>
        </div>
      </div>

      {/* Pending Orders Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Orders</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {pendingOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No pending orders</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingOrders.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user_email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.medicine?.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total_price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatters.date(dayjs(order.created_at))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Low Stock Medicines Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Low Stock Medicines</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {medicinesByStock.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No medicines found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Ingredient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concentration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicinesByStock.map((medicine) => (
                    <tr key={medicine.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{medicine.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medicine.active_ingredient}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medicine.concentration}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className={`font-medium ${medicine.quantity <= 10 ? 'text-red-600' : medicine.quantity <= 50 ? 'text-orange-600' : 'text-green-600'}`}>
                          {medicine.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${medicine.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${medicine.in_stock && medicine.quantity > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {medicine.in_stock && medicine.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingCart className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Order #1234 completed</p>
              <p className="text-sm text-gray-600">Customer: Ahmed Mohamed</p>
            </div>
            <span className="text-sm text-gray-500">2 hours ago</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">Medicine stock updated</p>
              <p className="text-sm text-gray-600">Paracetamol - 50 units added</p>
            </div>
            <span className="text-sm text-gray-500">4 hours ago</span>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">New order received</p>
              <p className="text-sm text-gray-600">Order #1235 - Prescription needed</p>
            </div>
            <span className="text-sm text-gray-500">6 hours ago</span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TodaysOrdersModal
        isOpen={todaysOrdersModalOpen}
        onClose={() => setTodaysOrdersModalOpen(false)}
        orders={todaysOrdersData}
      />

      <MedicineStockModal
        isOpen={medicineStockModalOpen}
        onClose={() => setMedicineStockModalOpen(false)}
        medicines={medicines}
      />

      <PendingOrdersModal
        isOpen={pendingOrdersModalOpen}
        onClose={() => setPendingOrdersModalOpen(false)}
        orders={pendingOrders}
      />

      <LowStockMedicinesModal
        isOpen={lowStockModalOpen}
        onClose={() => setLowStockModalOpen(false)}
        medicines={medicinesByStock.filter(medicine => !medicine.in_stock || medicine.quantity <= 50)}
      />

      <FocusModeModal
        isOpen={focusModeModalOpen}
        onClose={() => setFocusModeModalOpen(false)}
      />
    </div>
  );
};

export default BranchDashboard;
