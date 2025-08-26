import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useCreateBranch } from '../../hooks/useBranches';
import Button from '../atoms/Button';
import Input from '../atoms/Input';

interface AddBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddBranchModal: React.FC<AddBranchModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    branch_name: '',
    username: '',
    password: '',
    location: '',
    phone_number: ''
  });

  const { mutate: createBranch, isPending } = useCreateBranch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.branch_name.trim() || !formData.username.trim() || !formData.password.trim()) {
      return;
    }

    createBranch(formData, {
      onSuccess: () => {
        setFormData({
          branch_name: '',
          username: '',
          password: '',
          location: '',
          phone_number: ''
        });
        onClose();
      }
    });
  };

  const handleClose = () => {
    setFormData({
      branch_name: '',
      username: '',
      password: '',
      location: '',
      phone_number: ''
    });
    onClose();
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
            <div className="w-full max-w-md">
              <div className="backdrop-blur-xl rounded-2xl shadow-2xl border bg-white/90 border-[#90E0EF]/30 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center">
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">
                        Add New Branch
                      </h2>
                      <p className="text-sm text-[#0077B6] font-paragraphs">
                        Create a new pharmacy branch
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
                      Password *
                    </label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(value) => setFormData(prev => ({ ...prev, password: value }))}
                      placeholder="Enter password"
                      required
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
                      disabled={isPending || !formData.branch_name.trim() || !formData.username.trim() || !formData.password.trim()}
                      className="flex items-center space-x-2"
                    >
                      <Plus size={16} />
                      <span>{isPending ? 'Creating...' : 'Create Branch'}</span>
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

export default AddBranchModal;
