import { useState } from 'react';
import { Plus, Activity, Edit, Trash2, AlertCircle, RefreshCw, Eye, Filter, FileText } from 'lucide-react';
import Select from 'react-select';
import Button from '../components/atoms/Button';
import { DeleteConfirmationModal } from '../components/sections';
import { InactivePharmacyMessage } from '../components';
import { usePharmacyData } from '../hooks/usePharmacyData';
import { useHospitalSurgeries, useDeleteSurgery, useHospitalSurgeryBookings, type SurgeryData, type SurgeryBookingData } from '../services/surgeriesService';
import AddSurgeryModal from '../components/sections/AddSurgeryModal';
import EditSurgeryModal from '../components/sections/EditSurgeryModal';
import ViewSurgeryModal from '../components/sections/ViewSurgeryModal';
import ViewSurgeryBookingModal from '../components/sections/ViewSurgeryBookingModal';

const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="animate-pulse">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-6 gap-4">
          {['Name', 'Specialization', 'Duration (h)', 'Risk', 'Active', 'Actions'].map((h) => (<div key={h} className="h-4 bg-gray-200 rounded w-20" />))}
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

const Surgeries: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState<SurgeryData | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<SurgeryBookingData | null>(null);
  const [filters, setFilters] = useState<{ risk_level: string | null; is_active: boolean | null }>({ risk_level: null, is_active: null });

  const { data: pharmacyData } = usePharmacyData();
  const isPharmacyInactive = pharmacyData && !pharmacyData.is_active;

  const { data: surgeries = [], isLoading, error, refetch } = useHospitalSurgeries(undefined, { skip: 0, limit: 0, risk_level: filters.risk_level, is_active: filters.is_active });

  const deleteSurgery = useDeleteSurgery();
  const { data: bookings = [], isLoading: isLoadingBookings } = useHospitalSurgeryBookings();

  if (isPharmacyInactive) return <InactivePharmacyMessage />;

  const handleRetry = () => refetch();

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    await deleteSurgery.mutateAsync({ surgeryId: selected.id });
    setIsDeleteOpen(false);
    setSelected(null);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Surgeries</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4 text-[#1E3E72]" />
            {/* Risk Level Select */}
            <div className="min-w-[180px]">
              <Select
                classNamePrefix="react-select"
                options={[
                  { value: '', label: 'All risks' },
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                ]}
                value={(() => {
                  const v = filters.risk_level ?? '';
                  return [
                    { value: '', label: 'All risks' },
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                  ].find(o => o.value === v);
                })()}
                onChange={(opt: { value: string } | null) => setFilters((f) => ({ ...f, risk_level: opt?.value ? opt.value : null }))}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: '1px solid #90E0EF',
                    borderRadius: '0.5rem',
                    minHeight: '36px',
                    boxShadow: 'none',
                    '&:hover': { border: '1px solid #90E0EF' },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#03045E' : state.isFocused ? '#CAF0F8' : 'white',
                    color: state.isSelected ? 'white' : '#1E3E72',
                  }),
                  menu: (provided) => ({ ...provided, border: '1px solid #90E0EF', borderRadius: '0.5rem' })
                }}
                placeholder="Risk level"
                isClearable
              />
            </div>
            {/* Active Select */}
            <div className="min-w-[160px]">
              <Select
                classNamePrefix="react-select"
                options={[
                  { value: '', label: 'All' },
                  { value: 'true', label: 'Active' },
                  { value: 'false', label: 'Inactive' },
                ]}
                value={(() => {
                  const v = filters.is_active === null ? '' : String(filters.is_active);
                  return [
                    { value: '', label: 'All' },
                    { value: 'true', label: 'Active' },
                    { value: 'false', label: 'Inactive' },
                  ].find(o => o.value === v);
                })()}
                onChange={(opt: { value: string } | null) => setFilters((f) => ({ ...f, is_active: !opt?.value ? null : opt.value === 'true' }))}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: '1px solid #90E0EF',
                    borderRadius: '0.5rem',
                    minHeight: '36px',
                    boxShadow: 'none',
                    '&:hover': { border: '1px solid #90E0EF' },
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#03045E' : state.isFocused ? '#CAF0F8' : 'white',
                    color: state.isSelected ? 'white' : '#1E3E72',
                  }),
                  menu: (provided) => ({ ...provided, border: '1px solid #90E0EF', borderRadius: '0.5rem' })
                }}
                placeholder="Active status"
                isClearable
              />
            </div>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Surgery
          </Button>
        </div>
      </div>

      {isLoading && surgeries.length === 0 ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (h)</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {surgeries.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Activity className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{s.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.specialization_required}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.estimated_duration_hours}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{s.risk_level}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${s.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{s.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSelected(s); setIsViewOpen(true); }} className="text-[#1E3E72] hover:text-blue-700 transition-colors" title="View surgery">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelected(s); setIsEditOpen(true); }} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit surgery">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelected(s); setIsDeleteOpen(true); }} disabled={deleteSurgery.isPending} className="text-red-600 hover:text-red-800 transition-colors" title="Delete surgery">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load surgeries</h3>
              <p className="text-gray-500 mb-4">There was an error loading surgeries</p>
              <Button variant="danger" onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          ) : (!surgeries || surgeries.length === 0) ? (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No surgeries found</h3>
              <p className="text-gray-500 mb-4">You haven't added any surgeries yet</p>
              <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Surgery
              </Button>
            </div>
          ) : null}
        </div>
      )}

      {/* Surgery Bookings Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Surgery Bookings</h2>
          {isLoadingBookings && <span className="text-sm text-gray-500">Loading…</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Surgery</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.patient_name} <span className="text-gray-500">({b.patient_email})</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.surgery?.name ?? b.surgery_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(b.scheduled_date).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${b.status === 'completed' ? 'bg-green-100 text-green-800' : b.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{b.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button onClick={() => { setSelectedBooking(b); setIsBookingOpen(true); }} className="text-[#1E3E72] hover:text-blue-700 transition-colors" title="View booking">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!bookings || bookings.length === 0) && !isLoadingBookings && (
          <div className="text-center py-8 text-sm text-gray-500">No bookings found</div>
        )}
      </div>

      <AddSurgeryModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => { setIsAddOpen(false); refetch(); }}
      />
      <EditSurgeryModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setSelected(null); }}
        onSuccess={() => { setIsEditOpen(false); setSelected(null); refetch(); }}
        surgery={selected}
      />
      <ViewSurgeryModal
        isOpen={isViewOpen}
        onClose={() => { setIsViewOpen(false); setSelected(null); }}
        surgery={selected}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelected(null); }}
        onConfirm={handleDeleteConfirm}
        title="Remove Surgery"
        message={`Are you sure you want to remove "${selected?.name}"? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={deleteSurgery.isPending}
      />
      <ViewSurgeryBookingModal
        isOpen={isBookingOpen}
        onClose={() => { setIsBookingOpen(false); setSelectedBooking(null); }}
        booking={selectedBooking}
      />
    </div>
  );
};

export default Surgeries;


