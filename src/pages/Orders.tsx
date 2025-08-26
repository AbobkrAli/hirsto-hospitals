import { useState } from 'react';
import { Package, AlertCircle, RefreshCw, Search } from 'lucide-react';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import { usePharmacyData } from '../hooks/usePharmacyData';
import { usePharmacyOrders, useAllPharmacyOrders } from '../hooks/useOrders';
import { InactivePharmacyMessage } from '../components';

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' };
      case 'confirmed':
        return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' };
      case 'preparing':
        return { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200' };
      case 'ready':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'completed':
        return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' };
      case 'cancelled':
        return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', border: 'border-gray-200' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  );
};

// Loading skeleton for table
const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="animate-pulse">
      {/* Table header skeleton */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-7 gap-4">
          {['Order ID', 'User Email', 'Medicine', 'Quantity', 'Total Price', 'Status', 'Date'].map((header) => (
            <div key={header} className="h-4 bg-gray-200 rounded w-20"></div>
          ))}
        </div>
      </div>

      {/* Table rows skeleton */}
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-7 gap-4">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-12"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Orders: React.FC = () => {
  const [userEmail, setUserEmail] = useState('');
  const [searchMode, setSearchMode] = useState<'all' | 'user'>('all');

  // Check pharmacy status
  const { data: pharmacyData } = usePharmacyData();
  const isPharmacyInactive = pharmacyData && !pharmacyData.is_active;

  // Fetch all orders or user-specific orders based on search mode
  const {
    data: allOrders,
    isLoading: allOrdersLoading,
    error: allOrdersError,
    refetch: refetchAllOrders
  } = useAllPharmacyOrders();

  const {
    data: userOrders,
    isLoading: userOrdersLoading,
    error: userOrdersError,
    refetch: refetchUserOrders
  } = usePharmacyOrders(userEmail);

  // Show inactive message if pharmacy is not active
  if (isPharmacyInactive) {
    return <InactivePharmacyMessage />;
  }

  const handleSearchByUser = () => {
    if (userEmail.trim()) {
      setSearchMode('user');
    }
  };

  const handleShowAllOrders = () => {
    setSearchMode('all');
    setUserEmail('');
  };

  const handleRetry = () => {
    if (searchMode === 'all') {
      refetchAllOrders();
    } else {
      refetchUserOrders();
    }
  };

  // Get the appropriate data based on search mode
  const orders = searchMode === 'user' ? (userOrders || []) : (allOrders || []);
  const isLoading = searchMode === 'user' ? userOrdersLoading : allOrdersLoading;
  const error = searchMode === 'user' ? userOrdersError : allOrdersError;

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (isLoading && !orders.length) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
        </div>

        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <div className="flex items-center gap-3">
          <Input
            type="email"
            placeholder="Enter user email..."
            value={userEmail}
            onChange={setUserEmail}
            className="w-64"
          />
          <Button
            onClick={handleSearchByUser}
            disabled={!userEmail.trim() || userOrdersLoading}
            className="flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Search User
          </Button>
          {searchMode === 'user' && (
            <Button
              variant="secondary"
              onClick={handleShowAllOrders}
              className="flex items-center gap-2"
            >
              Show All Orders
            </Button>
          )}
        </div>
      </div>

      {/* Search indicator */}
      {searchMode === 'user' && userEmail && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
          <p className="text-sm text-blue-800">
            Showing orders for: <span className="font-medium">{userEmail}</span>
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicine
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.user_email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.medicine.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.medicine.active_ingredient} {order.medicine.concentration}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.quantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${order.total_price.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.created_at)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load orders</h3>
            <p className="text-gray-500 mb-4">There was an error loading the orders</p>
            <Button variant="danger" onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-4">
              {searchMode === 'user'
                ? `No orders found for ${userEmail}`
                : 'No orders have been placed yet'
              }
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Orders;
