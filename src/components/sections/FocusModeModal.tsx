import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Bell, Clock, User, Package, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { useAllPharmacyOrders } from '../../hooks/useOrders';

interface FocusModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FocusModeModal: React.FC<FocusModeModalProps> = ({
  isOpen,
  onClose
}) => {
  const [lastOrderCount, setLastOrderCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch orders with refetch interval
  const { data: orders = [], refetch } = useAllPharmacyOrders();

  // Get today's orders
  const todaysOrders = orders.filter(order =>
    dayjs(order.created_at).isSame(dayjs(), 'day')
  ).sort((a, b) => dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf());

  // Initialize audio for notifications
  useEffect(() => {
    // Create a simple notification sound using Web Audio API
    const createNotificationSound = () => {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    };

    if (showAlert) {
      createNotificationSound();
      const timer = setTimeout(() => setShowAlert(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  // Setup auto-refresh and time updates
  useEffect(() => {
    if (isOpen) {
      setLastOrderCount(todaysOrders.length);

      // Refresh orders every 30 seconds
      intervalRef.current = setInterval(() => {
        refetch();
      }, 30000);

      // Update current time every second
      timeIntervalRef.current = setInterval(() => {
        setCurrentTime(dayjs());
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, [isOpen, refetch, todaysOrders.length]);

  // Check for new orders
  useEffect(() => {
    if (isOpen && todaysOrders.length > lastOrderCount) {
      const newOrders = todaysOrders.length - lastOrderCount;
      setNewOrdersCount(newOrders);
      setShowAlert(true);
      setLastOrderCount(todaysOrders.length);
    }
  }, [todaysOrders.length, lastOrderCount, isOpen]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'preparing':
        return <Package className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-white"
        >
          {/* New Order Alert */}
          <AnimatePresence>
            {showAlert && (
              <motion.div
                initial={{ opacity: 0, y: -100, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -100, scale: 0.8 }}
                className="absolute top-6 left-1/2 transform -translate-x-1/2 z-60"
              >
                <div className="bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
                  <div className="p-2 bg-white/20 rounded-full">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">New Order{newOrdersCount > 1 ? 's' : ''} Received!</h4>
                    <p className="text-green-100">
                      {newOrdersCount} new order{newOrdersCount > 1 ? 's' : ''} just came in
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
            className="bg-white border-b border-gray-200 px-6 py-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -30, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
                >
                  <h1 className="text-2xl font-bold text-gray-900">Focus Mode</h1>
                  <p className="text-gray-600">
                    {currentTime.format('MMM DD, YYYY • h:mm:ss A')}
                  </p>
                </motion.div>
              </div>

              <div className="flex items-center gap-6">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
                  className="text-right"
                >
                  <div className="text-gray-900 text-2xl font-bold">{todaysOrders.length}</div>
                  <div className="text-gray-500 text-sm">Orders Today</div>
                </motion.div>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
                  className="text-right"
                >
                  <div className="text-orange-600 text-2xl font-bold">{todaysOrders.filter(order => order.status.toLowerCase() === 'pending').length}</div>
                  <div className="text-gray-500 text-sm">Pending Orders</div>
                </motion.div>
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.6, ease: "easeOut" }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-3 hover:bg-gray-100 rounded-xl transition-colors text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="h-[calc(100vh-88px)] overflow-y-auto bg-gray-50 p-6"
          >
            {todaysOrders.length === 0 ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="flex items-center justify-center h-full"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-600 text-lg">Waiting for orders to come in...</p>
                  <div className="mt-4 flex justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {todaysOrders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        delay: index * 0.1,
                        duration: 0.4,
                        ease: "easeOut"
                      }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      }}
                      className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200"
                    >
                      {/* Order Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                            className="p-2 bg-blue-50 rounded-lg"
                          >
                            <Package className="w-5 h-5 text-blue-600" />
                          </motion.div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Order #{order.id}</h4>
                            <p className="text-gray-500 text-sm">
                              {dayjs(order.created_at).format('h:mm A')}
                            </p>
                          </div>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </motion.div>
                      </div>

                      {/* Customer Info */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
                        className="space-y-3 mb-4"
                      >
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="text-sm">{order.user_email || 'Walk-in Customer'}</span>
                        </div>

                        <div className="flex items-center gap-2 text-green-600">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-medium">${order.total_price}</span>
                        </div>
                      </motion.div>

                      {/* Time Since Order */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                        className="pt-3 border-t border-gray-200"
                      >
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {dayjs(order.created_at).fromNow()}
                          </span>
                          <div className="flex items-center gap-1 text-blue-600">
                            <Clock className="w-3 h-3" />
                            <span>{dayjs().diff(dayjs(order.created_at), 'minute')}m ago</span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FocusModeModal;