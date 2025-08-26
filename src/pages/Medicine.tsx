import { useState } from 'react';
import { Plus, Package, DollarSign, AlertCircle, RefreshCw, Edit, Trash2 } from 'lucide-react';
import Button from '../components/atoms/Button';
import AddMedicineModal from '../components/sections/AddMedicineModal';
import EditMedicineModal from '../components/sections/EditMedicineModal';
import { DeleteConfirmationModal } from '../components/sections';
import { InactivePharmacyMessage } from '../components';
import { usePharmacyData } from '../hooks/usePharmacyData';
import { usePharmacyMedicines, useDeleteMedicine } from '../hooks/useMedicine';
import { createMedicine } from '../services/medicineService';
import ImportMedicinesModal from '../components/sections/ImportMedicinesModal';
import type { MedicineData } from '../services/medicineService';

// Loading skeleton for table
const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="animate-pulse">
      {/* Table header skeleton */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-6 gap-4">
          {['Medicine Name', 'Ingredient', 'Concentration', 'Price', 'Stock', 'Actions'].map((header) => (
            <div key={header} className="h-4 bg-gray-200 rounded w-20"></div>
          ))}
        </div>
      </div>

      {/* Table rows skeleton */}
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Medicine: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineData | null>(null);
  const [importStatus, setImportStatus] = useState<{ name: string; status: 'pending' | 'done' | 'failed'; error?: string }[]>([]);

  // Check pharmacy status
  const { data: pharmacyData } = usePharmacyData();
  const isPharmacyInactive = pharmacyData && !pharmacyData.is_active;

  // Fetch pharmacy's medicines
  const {
    data: medicines = [],
    isLoading,
    error,
    refetch
  } = usePharmacyMedicines();

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(medicines.length / pageSize);
  const paginatedMedicines = medicines.slice((page - 1) * pageSize, page * pageSize);

  // Delete mutation
  const deleteMedicineMutation = useDeleteMedicine();

  // Show inactive message if pharmacy is not active
  if (isPharmacyInactive) {
    return <InactivePharmacyMessage />;
  }

  const handleAddMedicine = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleAddModalSuccess = () => {
    setIsAddModalOpen(false);
  };

  const handleEditMedicine = (medicine: MedicineData) => {
    setSelectedMedicine(medicine);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedMedicine(null);
  };

  const handleEditModalSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedMedicine(null);
  };

  const handleDeleteMedicine = (medicine: MedicineData) => {
    setSelectedMedicine(medicine);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
    setSelectedMedicine(null);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMedicine) return;

    try {
      await deleteMedicineMutation.mutateAsync(selectedMedicine.id);
      handleDeleteModalClose();
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const handleImportMedicines = (medicines: any[]) => {
    setIsImportModalOpen(false);
    setImportStatus(medicines.map(m => ({ name: m.name, status: 'pending' })));
    // Start import loop
    (async () => {
      for (let i = 0; i < medicines.length; i++) {
        setImportStatus(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'pending' } : s));
        try {
          await createMedicine({
            name: medicines[i].name,
            price: medicines[i].price,
            quantity: medicines[i].stock,
            in_stock: medicines[i].stock > 0,
            active_ingredient: medicines[i].ingredient,
            concentration: medicines[i].concentration,
          });
          setImportStatus(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'done' } : s));
        } catch (err: any) {
          setImportStatus(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'failed', error: err?.message || 'Failed' } : s));
        }
      }
      refetch();
    })();
  };

  // Loading state
  if (isLoading && medicines.length === 0) {
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
        <h1 className="text-2xl font-bold text-gray-900">Medicines</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddMedicine} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Medicine
          </Button>
          <Button onClick={() => setIsImportModalOpen(true)} variant="outline" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Import CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicine Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Ingredient
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concentration
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {paginatedMedicines.map((medicine) => (
                <tr key={medicine.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {medicine.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {medicine.active_ingredient}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {medicine.concentration}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">
                        ${medicine.price}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${medicine.in_stock
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {medicine.in_stock ? `In Stock (${medicine.quantity})` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditMedicine(medicine)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit medicine"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMedicine(medicine)}
                        disabled={deleteMedicineMutation.isPending}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete medicine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-6 py-3 border-t bg-gray-50">
                  <div className="text-xs text-gray-500">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </tbody>
          </table>
        </div>

        {error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load medicines</h3>
            <p className="text-gray-500 mb-4">There was an error loading your medicines</p>
            <Button variant="danger" onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        ) : (!medicines || medicines.length === 0) ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medicines found</h3>
            <p className="text-gray-500 mb-4">You haven't added any medicines yet</p>
            <Button
              onClick={handleAddMedicine}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Medicine
            </Button>
          </div>
        ) : null}
      </div>

      {/* Add Medicine Modal */}
      <AddMedicineModal
        isOpen={isAddModalOpen}
        onClose={handleAddModalClose}
        onSuccess={handleAddModalSuccess}
      />

      {/* Edit Medicine Modal */}
      <EditMedicineModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSuccess={handleEditModalSuccess}
        medicine={selectedMedicine}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteConfirm}
        title="Delete Medicine"
        message={`Are you sure you want to delete "${selectedMedicine?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteMedicineMutation.isPending}
      />

      {/* Import Medicines Modal */}
      <ImportMedicinesModal
        open={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportMedicines}
      />
      {importStatus.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-4">
          <h3 className="font-bold mb-2">Import Status</h3>
          <ul className="space-y-1 text-sm">
            {importStatus.map((item, idx) => (
              <li key={idx} className={
                item.status === 'done' ? 'text-green-600' :
                  item.status === 'failed' ? 'text-red-600' :
                    'text-yellow-600'
              }>
                {item.name}: {item.status}
                {item.status === 'failed' && item.error ? ` (${item.error})` : ''}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Medicine;