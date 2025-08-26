import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Edit2 } from 'lucide-react';
import { useUpdateBranch } from '../../hooks/useBranches';
import { type BranchData } from '../../services/branchService';
import Button from '../atoms/Button';
import Input from '../atoms/Input';

interface EditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: BranchData | null;
}

const EditBranchModal: React.FC<EditBranchModalProps> = ({ isOpen, onClose, branch }) => {
  const [formData, setFormData] = useState({
    branch_name: '',
    username: '',
    password: '',
    location: '',
    phone_number: '',
    is_active: true
  });

  const { mutate: updateBranch, isPending } = useUpdateBranch();

  useEffect(() => {
    if (branch) {
      setFormData({
        branch_name: branch.branch_name,
        username: branch.username,
        password: '', // Don't pre-fill password for security
        location: branch.location,
        phone_number: branch.phone_number,
        is_active: branch.is_active
      });
    }
  }, [branch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!branch) return;

    // Validate required fields
    if (!formData.branch_name.trim() || !formData.username.trim()) {
      return;
    }

    const updateData = {
      branch_name: formData.branch_name,
      username: formData.username,
      location: formData.location,
      phone_number: formData.phone_number,
      is_active: formData.is_active,
      ...(formData.password.trim() && { password: formData.password })
    };

    updateBranch(
      { branchId: branch.id, data: updateData },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  const handleClose = () => {
    if (branch) {
      setFormData({
        branch_name: branch.branch_name,
        username: branch.username,
        password: '',
        location: branch.location,
        phone_number: branch.phone_number,
        is_active: branch.is_active
      });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && branch && (
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
            <div className="w-full max-w-md">
              <div className="backdrop-blur-xl rounded-2xl shadow-2xl border bg-white/90 border-[#90E0EF]/30 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center">
                      <Edit2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">
                        Edit Branch
                      </h2>
                      <p className="text-sm text-[#0077B6] font-paragraphs">
                        Update branch information
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isPending}
                    className="p-2 hover:bg-[#CAF0F8]/30 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <X className="w-5 h-5 text-[#1E3E72]" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="branch_name" className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-1">
                      Branch Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.branch_name}
                      onChange={(value) => setFormData(prev => ({ ...prev, branch_name: value }))}
                      placeholder="Enter branch name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-1">
                      Username *
                    </label>
                    <Input
                      type="text"
                      value={formData.username}
                      onChange={(value) => setFormData(prev => ({ ...prev, username: value }))}
                      placeholder="Enter username"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-1">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                      placeholder="Enter new password (leave blank to keep current)"
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-1">
                      Location
                    </label>
                    <Input
                      type="text"
                      value={formData.location}
                      onChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
                      placeholder="Enter location"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone_number" className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-1">
                      Phone Number
                    </label>
                    <Input
                      type="text"
                      value={formData.phone_number}
                      onChange={(value) => setFormData(prev => ({ ...prev, phone_number: value }))}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="is_active"
                      name="is_active"
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_active" className="ml-2 block text-sm font-semibold font-subtitles text-[#1E3E72]">
                      Active
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleClose}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || !formData.branch_name.trim() || !formData.username.trim()}
                      className="flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>{isPending ? 'Updating...' : 'Update Branch'}</span>
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

export default EditBranchModal;
