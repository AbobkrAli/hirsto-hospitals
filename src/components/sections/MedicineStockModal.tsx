import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Package, Hash, AlertTriangle, DollarSign } from 'lucide-react';
import type { MedicineData } from '../../services/medicineService';

interface MedicineStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicines: MedicineData[];
}

const MedicineStockModal: React.FC<MedicineStockModalProps> = ({
  isOpen,
  onClose,
  medicines
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const medicinesPerPage = 12;
  const totalPages = Math.ceil(medicines.length / medicinesPerPage);

  const paginatedMedicines = medicines.slice(
    (currentPage - 1) * medicinesPerPage,
    currentPage * medicinesPerPage
  );

  const getStockColor = (quantity: number) => {
    if (quantity === 0) return 'text-red-600 bg-red-50 border-red-200';
    if (quantity <= 10) return 'text-red-600 bg-red-50 border-red-200';
    if (quantity <= 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getStockLevel = (quantity: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= 10) return 'Critical';
    if (quantity <= 50) return 'Low';
    return 'Good';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 h-[100vh] backdrop-blur-sm"
            onClick={onClose}
            style={{ zIndex: 9998 }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 9999 }}
          >
            <div className="w-full max-w-6xl">
              <div className="backdrop-blur-xl rounded-2xl shadow-2xl border bg-white/90 border-gray-200/30 max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200/30 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">Medicine Stock</h3>
                        <p className="text-sm text-gray-600">{medicines.length} medicines in inventory</p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100/50 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {medicines.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Medicines Found</h3>
                      <p className="text-gray-500">No medicines are available in the inventory!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {paginatedMedicines.map((medicine) => (
                        <motion.div
                          key={medicine.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all duration-200"
                        >
                          {/* Medicine Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-green-50 rounded-xl">
                                <Package className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-lg">{medicine.name}</h4>
                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStockColor(medicine.quantity)}`}>
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  {getStockLevel(medicine.quantity)}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                                <Hash className="w-4 h-4" />
                                <span className={medicine.quantity <= 10 ? 'text-red-600' : medicine.quantity <= 50 ? 'text-orange-600' : 'text-green-600'}>
                                  {medicine.quantity}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">units</p>
                            </div>
                          </div>

                          {/* Medicine Details */}
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Active Ingredient</p>
                                <p className="text-sm font-medium text-gray-900">{medicine.active_ingredient}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Concentration</p>
                                <p className="text-sm font-medium text-gray-900">{medicine.concentration}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Price</p>
                                <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                                  <DollarSign className="w-3 h-3" />
                                  <span>{medicine.price}</span>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Availability</p>
                                <div className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${medicine.in_stock && medicine.quantity > 0
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-red-100 text-red-800 border border-red-200'
                                  }`}>
                                  {medicine.in_stock && medicine.quantity > 0 ? 'Available' : 'Out of Stock'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-200/30 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing {((currentPage - 1) * medicinesPerPage) + 1} to {Math.min(currentPage * medicinesPerPage, medicines.length)} of {medicines.length} medicines
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="px-3 py-2 text-sm font-medium text-gray-700">
                          {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MedicineStockModal;
