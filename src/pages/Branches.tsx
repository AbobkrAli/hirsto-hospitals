import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, MapPin, User, Phone, Calendar, Building2 } from 'lucide-react';
import { usePharmacyBranches, useDeleteBranch } from '../hooks/useBranches';
import { usePharmacyData } from '../hooks/usePharmacyData';
import { type BranchData } from '../services/branchService';
// ...existing code...
import Button from '../components/atoms/Button';
import AddBranchModal from '../components/sections/AddBranchModal';
import EditBranchModal from '../components/sections/EditBranchModal';
import DeleteConfirmationModal from '../components/sections/DeleteConfirmationModal';
import { InactivePharmacyMessage } from '../components';

const Branches: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);

  // Check pharmacy status
  const { data: pharmacyData, isLoading: isPharmacyLoading } = usePharmacyData();
  const isPharmacyInactive = pharmacyData && !pharmacyData.is_active;

  const { data: branches = [], isLoading: isBranchesLoading, error } = usePharmacyBranches();
  const { mutate: deleteBranch } = useDeleteBranch();

  // Show skeleton loader if either pharmacy or branches data is loading
  if (isPharmacyLoading || isBranchesLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse flex items-center justify-center">
            <span className="h-5 w-5 bg-gray-300 rounded-full mr-2 animate-pulse" />
            <span className="h-4 w-16 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
        {/* Table Skeleton */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {/* Branch Details Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                        <div className="flex items-center space-x-2">
                          <span className="h-4 w-4 bg-gray-300 rounded-full" />
                          <span className="h-4 w-20 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </td>
                    {/* Username Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="h-4 w-4 bg-gray-300 rounded-full" />
                        <span className="h-4 w-16 bg-gray-200 rounded" />
                      </div>
                    </td>
                    {/* Contact Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="h-4 w-4 bg-gray-300 rounded-full" />
                        <span className="h-4 w-20 bg-gray-200 rounded" />
                      </div>
                    </td>
                    {/* Status Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 h-6 w-16 animate-pulse" />
                    </td>
                    {/* Created Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="h-4 w-4 bg-gray-300 rounded-full" />
                        <span className="h-4 w-16 bg-gray-200 rounded" />
                      </div>
                    </td>
                    {/* Actions Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <span className="h-8 w-8 bg-gray-100 rounded" />
                        <span className="h-8 w-8 bg-gray-100 rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Show inactive message if pharmacy is not active
  if (isPharmacyInactive) {
    return <InactivePharmacyMessage />;
  }

  const handleEditBranch = (branch: BranchData) => {
    setSelectedBranch(branch);
    setIsEditModalOpen(true);
  };

  const handleDeleteBranch = (branch: BranchData) => {
    setSelectedBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBranch) {
      deleteBranch(selectedBranch.id);
      setIsDeleteModalOpen(false);
      setSelectedBranch(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isBranchesLoading) {
    // Show a skeleton that closely matches the actual content, including icons and layout
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse flex items-center justify-center">
            <span className="h-5 w-5 bg-gray-300 rounded-full mr-2 animate-pulse" />
            <span className="h-4 w-16 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
        {/* Table Skeleton */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {/* Branch Details Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
                        <div className="flex items-center space-x-2">
                          <span className="h-4 w-4 bg-gray-300 rounded-full" />
                          <span className="h-4 w-20 bg-gray-100 rounded" />
                        </div>
                      </div>
                    </td>
                    {/* Username Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="h-4 w-4 bg-gray-300 rounded-full" />
                        <span className="h-4 w-16 bg-gray-200 rounded" />
                      </div>
                    </td>
                    {/* Contact Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="h-4 w-4 bg-gray-300 rounded-full" />
                        <span className="h-4 w-20 bg-gray-200 rounded" />
                      </div>
                    </td>
                    {/* Status Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 h-6 w-16 animate-pulse" />
                    </td>
                    {/* Created Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="h-4 w-4 bg-gray-300 rounded-full" />
                        <span className="h-4 w-16 bg-gray-200 rounded" />
                      </div>
                    </td>
                    {/* Actions Skeleton */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <span className="h-8 w-8 bg-gray-100 rounded" />
                        <span className="h-8 w-8 bg-gray-100 rounded" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading branches. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Branches</h1>
          <p className="text-gray-600 mt-1">Manage your pharmacy branches</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Branch</span>
        </Button>
      </div>

      {/* Branches Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {branches.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No branches</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new branch.</p>
            <div className="mt-6">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Add Branch</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Branch Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {branches.map((branch) => (
                  <motion.tr
                    key={branch.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {branch.branch_name}
                        </div>
                        {branch.location && (
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin size={14} className="mr-1" />
                            {branch.location}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <User size={14} className="mr-1" />
                        {branch.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {branch.phone_number ? (
                        <div className="text-sm text-gray-900 flex items-center">
                          <Phone size={14} className="mr-1" />
                          {branch.phone_number}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No phone</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${branch.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {branch.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(branch.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditBranch(branch)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Edit branch"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteBranch(branch)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete branch"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddBranchModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <EditBranchModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBranch(null);
        }}
        branch={selectedBranch}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedBranch(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Branch"
        message={`Are you sure you want to delete "${selectedBranch?.branch_name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Branches;
