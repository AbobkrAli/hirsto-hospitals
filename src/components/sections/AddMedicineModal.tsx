import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Package } from 'lucide-react';
import Button from '../atoms/Button';
import { useCreateMedicine } from '../../hooks/useMedicine';
import type { CreateMedicineData } from '../../services/medicineService';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<CreateMedicineData>({
    name: '',
    price: 0,
    quantity: 0,
    in_stock: true,
    active_ingredient: '',
    concentration: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMedicineMutation = useCreateMedicine();

  const handleInputChange = (field: keyof CreateMedicineData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Medicine name is required';
    }

    if (!formData.active_ingredient.trim()) {
      newErrors.active_ingredient = 'Active ingredient is required';
    }

    if (!formData.concentration.trim()) {
      newErrors.concentration = 'Concentration is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity must be 0 or greater';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createMedicineMutation.mutateAsync(formData);
      onSuccess();
      // Reset form
      setFormData({
        name: '',
        price: 0,
        quantity: 0,
        in_stock: true,
        active_ingredient: '',
        concentration: ''
      });
      setErrors({});
    } catch {
      // Error is handled by the mutation
    }
  };

  const handleClose = () => {
    if (!createMedicineMutation.isPending) {
      setFormData({
        name: '',
        price: 0,
        quantity: 0,
        in_stock: true,
        active_ingredient: '',
        concentration: ''
      });
      setErrors({});
      onClose();
    }
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
            onClick={handleClose}
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
            <div className="w-full max-w-lg">
              <div className="backdrop-blur-xl rounded-2xl shadow-2xl border bg-white/90 border-[#90E0EF]/30 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">
                        Add New Medicine
                      </h2>
                      <p className="text-sm text-[#0077B6]/70 font-paragraphs">
                        Add a new medicine to your inventory
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={createMedicineMutation.isPending}
                    className="p-2 hover:bg-[#CAF0F8]/30 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-[#1E3E72]" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Medicine Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E3E72] mb-2">
                      Medicine Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-300' : 'border-[#CAF0F8]'
                        } focus:outline-none focus:ring-2 focus:ring-[#03045E]/20 focus:border-[#03045E] transition-colors font-paragraphs bg-white/80`}
                      placeholder="Enter medicine name"
                      disabled={createMedicineMutation.isPending}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Active Ingredient */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E3E72] mb-2">
                      Active Ingredient *
                    </label>
                    <input
                      type="text"
                      value={formData.active_ingredient}
                      onChange={(e) => handleInputChange('active_ingredient', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.active_ingredient ? 'border-red-300' : 'border-[#CAF0F8]'
                        } focus:outline-none focus:ring-2 focus:ring-[#03045E]/20 focus:border-[#03045E] transition-colors font-paragraphs bg-white/80`}
                      placeholder="Enter active ingredient"
                      disabled={createMedicineMutation.isPending}
                    />
                    {errors.active_ingredient && (
                      <p className="text-red-500 text-sm mt-1">{errors.active_ingredient}</p>
                    )}
                  </div>

                  {/* Concentration */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E3E72] mb-2">
                      Concentration *
                    </label>
                    <input
                      type="text"
                      value={formData.concentration}
                      onChange={(e) => handleInputChange('concentration', e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border ${errors.concentration ? 'border-red-300' : 'border-[#CAF0F8]'
                        } focus:outline-none focus:ring-2 focus:ring-[#03045E]/20 focus:border-[#03045E] transition-colors font-paragraphs bg-white/80`}
                      placeholder="e.g., 500mg, 10ml/5mg"
                      disabled={createMedicineMutation.isPending}
                    />
                    {errors.concentration && (
                      <p className="text-red-500 text-sm mt-1">{errors.concentration}</p>
                    )}
                  </div>

                  {/* Price and Quantity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1E3E72] mb-2">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.price || ''}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.price ? 'border-red-300' : 'border-[#CAF0F8]'
                          } focus:outline-none focus:ring-2 focus:ring-[#03045E]/20 focus:border-[#03045E] transition-colors font-paragraphs bg-white/80`}
                        placeholder="0.00"
                        disabled={createMedicineMutation.isPending}
                      />
                      {errors.price && (
                        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#1E3E72] mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.quantity || ''}
                        onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.quantity ? 'border-red-300' : 'border-[#CAF0F8]'
                          } focus:outline-none focus:ring-2 focus:ring-[#03045E]/20 focus:border-[#03045E] transition-colors font-paragraphs bg-white/80`}
                        placeholder="0"
                        disabled={createMedicineMutation.isPending}
                      />
                      {errors.quantity && (
                        <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                      )}
                    </div>
                  </div>

                  {/* Stock Status */}
                  <div>
                    <label className="block text-sm font-medium text-[#1E3E72] mb-2">
                      Stock Status
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="in_stock"
                          checked={formData.in_stock}
                          onChange={() => handleInputChange('in_stock', true)}
                          className="mr-2"
                          disabled={createMedicineMutation.isPending}
                        />
                        <span className="text-sm text-[#1E3E72]">In Stock</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="in_stock"
                          checked={!formData.in_stock}
                          onChange={() => handleInputChange('in_stock', false)}
                          className="mr-2"
                          disabled={createMedicineMutation.isPending}
                        />
                        <span className="text-sm text-[#1E3E72]">Out of Stock</span>
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={createMedicineMutation.isPending}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMedicineMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      {createMedicineMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Package className="w-4 h-4" />
                          Add Medicine
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddMedicineModal;
