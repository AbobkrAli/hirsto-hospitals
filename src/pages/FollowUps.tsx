import { useState } from 'react';
import { Plus, ClipboardList, Edit, Trash2, AlertCircle, RefreshCw, Eye, Filter } from 'lucide-react';
import Select from 'react-select';
import Button from '../components/atoms/Button';
import { DeleteConfirmationModal } from '../components/sections';
import { InactivePharmacyMessage } from '../components';
import { usePharmacyData } from '../hooks/usePharmacyData';
import { useHospitalFollowUps, useDeleteFollowUp, type FollowUpData } from '../services/followUpsService';
import AddFollowUpModal from '../components/sections/AddFollowUpModal';
import EditFollowUpModal from '../components/sections/EditFollowUpModal';
import ViewFollowUpModal from '../components/sections/ViewFollowUpModal';

const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="animate-pulse">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-6 gap-4">
          {['Patient', 'Type', 'Doctor', 'Next Appt', 'Status', 'Actions'].map((h) => (<div key={h} className="h-4 bg-gray-200 rounded w-20" />))}
        </div>
      </div>
      {Array.from({ length: 5 }, (_, idx) => (
        <div key={idx} className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (<div key={i} className="h-4 bg-gray-200 rounded w-24" />))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FollowUps: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState<FollowUpData | null>(null);
  const [filters, setFilters] = useState<{ status: string | null; patient_email: string | null }>({ status: null, patient_email: null });

  const { data: pharmacyData } = usePharmacyData();
  const isPharmacyInactive = pharmacyData && !pharmacyData.is_active;

  const { data: followUps = [], isLoading, error, refetch } = useHospitalFollowUps(undefined, { status: filters.status, patient_email: filters.patient_email });

  const deleteFollowUp = useDeleteFollowUp();

  if (isPharmacyInactive) return <InactivePharmacyMessage />;

  const handleRetry = () => refetch();

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    await deleteFollowUp.mutateAsync({ followUpId: selected.id });
    setIsDeleteOpen(false);
    setSelected(null);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Follow Ups</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4 text-[#1E3E72]" />
            {/* Status Select */}
            <div className="min-w-[180px]">
              <Select
                classNamePrefix="react-select"
                options={[{ value: '', label: 'All statuses' }, 'pending', 'active', 'completed', 'cancelled'].map(v => typeof v === 'string' ? { value: v, label: v.charAt(0).toUpperCase() + v.slice(1) } : v)}
                value={(() => {
                  const v = filters.status ?? '';
                  return [{ value: '', label: 'All statuses' }, { value: 'pending', label: 'Pending' }, { value: 'active', label: 'Active' }, { value: 'completed', label: 'Completed' }, { value: 'cancelled', label: 'Cancelled' }].find(o => o.value === v);
                })()}
                onChange={(opt: { value: string } | null) => setFilters((f) => ({ ...f, status: opt?.value ? opt.value : null }))}
                styles={{
                  control: (provided) => ({ ...provided, border: '1px solid #90E0EF', borderRadius: '0.5rem', minHeight: '36px', boxShadow: 'none', '&:hover': { border: '1px solid #90E0EF' } }),
                  option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? '#03045E' : s.isFocused ? '#CAF0F8' : 'white', color: s.isSelected ? 'white' : '#1E3E72' }),
                  menu: (p) => ({ ...p, border: '1px solid #90E0EF', borderRadius: '0.5rem' })
                }}
                placeholder="Status"
                isClearable
              />
            </div>
            {/* Patient Email Select (as free text) */}
            <div>
              <input
                className="min-w-[220px] border border-[#90E0EF] rounded-lg px-3 py-2 text-sm focus:outline-none"
                placeholder="Filter by patient email"
                value={filters.patient_email ?? ''}
                onChange={(e) => setFilters((f) => ({ ...f, patient_email: e.target.value || null }))}
              />
            </div>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Follow Up
          </Button>
        </div>
      </div>

      {isLoading && followUps.length === 0 ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Appt</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {followUps.map((fu) => (
                  <tr key={fu.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <ClipboardList className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{fu.patient_name} <span className="text-gray-500">({fu.patient_email})</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{fu.follow_up_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{fu.doctor?.name ?? '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(fu.next_appointment_date).toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${fu.status === 'completed' ? 'bg-green-100 text-green-800' : fu.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{fu.status || 'unknown'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSelected(fu); setIsViewOpen(true); }} className="text-[#1E3E72] hover:text-blue-700 transition-colors" title="View follow up">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelected(fu); setIsEditOpen(true); }} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit follow up">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelected(fu); setIsDeleteOpen(true); }} disabled={deleteFollowUp.isPending} className="text-red-600 hover:text-red-800 transition-colors" title="Delete follow up">
                          <Trash2 className="w-4 h-4" />
                        </button>
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load follow ups</h3>
              <p className="text-gray-500 mb-4">There was an error loading follow ups</p>
              <Button variant="danger" onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          ) : (!followUps || followUps.length === 0) ? (
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No follow ups found</h3>
              <p className="text-gray-500 mb-4">You haven't added any follow ups yet</p>
              <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Follow Up
              </Button>
            </div>
          ) : null}
        </div>
      )}

      <AddFollowUpModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => { setIsAddOpen(false); refetch(); }}
      />
      <EditFollowUpModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setSelected(null); }}
        onSuccess={() => { setIsEditOpen(false); setSelected(null); refetch(); }}
        followUp={selected}
      />
      <ViewFollowUpModal
        isOpen={isViewOpen}
        onClose={() => { setIsViewOpen(false); setSelected(null); }}
        followUp={selected}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelected(null); }}
        onConfirm={handleDeleteConfirm}
        title="Remove Follow Up"
        message={`Are you sure you want to remove "${selected?.patient_name}"? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={deleteFollowUp.isPending}
      />
    </div>
  );
};

export default FollowUps;


