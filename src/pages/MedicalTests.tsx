import { useState } from 'react';
import { Plus, Beaker, Edit, Trash2, AlertCircle, RefreshCw, Eye, Filter, FileText } from 'lucide-react';
import Select from 'react-select';
import Button from '../components/atoms/Button';
import { DeleteConfirmationModal } from '../components/sections';
import { InactivePharmacyMessage } from '../components';
import { usePharmacyData } from '../hooks/usePharmacyData';
import { useHospitalMedicalTests, useDeleteMedicalTest, useHospitalTestBookings, type MedicalTestData, type TestBookingData } from '../services/medicalTestsService';
import { AddMedicalTestModal, EditMedicalTestModal, ViewMedicalTestModal, ViewTestBookingModal } from '../components/sections';

const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="animate-pulse">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-6 gap-4">
          {['Name', 'Type', 'Department', 'Duration (m)', 'Active', 'Actions'].map((h) => (<div key={h} className="h-4 bg-gray-200 rounded w-20" />))}
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

const MedicalTests: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState<MedicalTestData | null>(null);
  const [filters, setFilters] = useState<{ test_type: string | null; department: string | null; is_active: boolean | null }>({ test_type: null, department: null, is_active: null });
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<TestBookingData | null>(null);

  const { data: pharmacyData } = usePharmacyData();
  const isPharmacyInactive = pharmacyData && !pharmacyData.is_active;

  const { data: tests = [], isLoading, error, refetch } = useHospitalMedicalTests(undefined, { test_type: filters.test_type, department: filters.department, is_active: filters.is_active });

  const deleteTest = useDeleteMedicalTest();
  const { data: bookings = [], isLoading: isLoadingBookings } = useHospitalTestBookings();

  if (isPharmacyInactive) return <InactivePharmacyMessage />;

  const handleRetry = () => refetch();

  const handleDeleteConfirm = async () => {
    if (!selected) return;
    await deleteTest.mutateAsync({ testId: selected.id });
    setIsDeleteOpen(false);
    setSelected(null);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Medical Tests</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Filter className="w-4 h-4 text-[#1E3E72]" />
            {/* Type Select */}
            <div className="min-w-[180px]">
              <Select
                classNamePrefix="react-select"
                options={[{ value: '', label: 'All types' }, 'blood', 'urine', 'imaging', 'biopsy'].map(v => typeof v === 'string' ? { value: v, label: v.charAt(0).toUpperCase() + v.slice(1) } : v)}
                value={(() => {
                  const v = filters.test_type ?? '';
                  return [{ value: '', label: 'All types' }, { value: 'blood', label: 'Blood' }, { value: 'urine', label: 'Urine' }, { value: 'imaging', label: 'Imaging' }, { value: 'biopsy', label: 'Biopsy' }].find(o => o.value === v);
                })()}
                onChange={(opt: { value: string } | null) => setFilters((f) => ({ ...f, test_type: opt?.value ? opt.value : null }))}
                styles={{
                  control: (provided) => ({ ...provided, border: '1px solid #90E0EF', borderRadius: '0.5rem', minHeight: '36px', boxShadow: 'none', '&:hover': { border: '1px solid #90E0EF' } }),
                  option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? '#03045E' : s.isFocused ? '#CAF0F8' : 'white', color: s.isSelected ? 'white' : '#1E3E72' }),
                  menu: (p) => ({ ...p, border: '1px solid #90E0EF', borderRadius: '0.5rem' })
                }}
                placeholder="Test type"
                isClearable
              />
            </div>

            {/* Active Select */}
            <div className="min-w-[160px]">
              <Select
                classNamePrefix="react-select"
                options={[{ value: '', label: 'All' }, { value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]}
                value={(() => {
                  const v = filters.is_active === null ? '' : String(filters.is_active);
                  return [{ value: '', label: 'All' }, { value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }].find(o => o.value === v);
                })()}
                onChange={(opt: { value: string } | null) => setFilters((f) => ({ ...f, is_active: !opt?.value ? null : opt.value === 'true' }))}
                styles={{
                  control: (provided) => ({ ...provided, border: '1px solid #90E0EF', borderRadius: '0.5rem', minHeight: '36px', boxShadow: 'none', '&:hover': { border: '1px solid #90E0EF' } }),
                  option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? '#03045E' : s.isFocused ? '#CAF0F8' : 'white', color: s.isSelected ? 'white' : '#1E3E72' }),
                  menu: (p) => ({ ...p, border: '1px solid #90E0EF', borderRadius: '0.5rem' })
                }}
                placeholder="Active status"
                isClearable
              />
            </div>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Medical Test
          </Button>
        </div>
      </div>

      {isLoading && tests.length === 0 ? (
        <TableSkeleton />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration (m)</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {tests.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Beaker className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-sm font-medium text-gray-900">{t.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{t.test_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{t.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.duration_minutes}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${t.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{t.is_active ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setSelected(t); setIsViewOpen(true); }} className="text-[#1E3E72] hover:text-blue-700 transition-colors" title="View test">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelected(t); setIsEditOpen(true); }} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit test">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelected(t); setIsDeleteOpen(true); }} disabled={deleteTest.isPending} className="text-red-600 hover:text-red-800 transition-colors" title="Delete test">
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load medical tests</h3>
              <p className="text-gray-500 mb-4">There was an error loading medical tests</p>
              <Button variant="danger" onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          ) : (!tests || tests.length === 0) ? (
            <div className="text-center py-12">
              <Beaker className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No medical tests found</h3>
              <p className="text-gray-500 mb-4">You haven't added any medical tests yet</p>
              <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Your First Test
              </Button>
            </div>
          ) : null}
        </div>
      )}

      {/* Test Bookings Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Medical Test Bookings</h2>
          {isLoadingBookings && <span className="text-sm text-gray-500">Loading…</span>}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.patient_name} <span className="text-gray-500">({b.patient_email})</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.medical_test?.name ?? b.medical_test_id}</td>
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

      <AddMedicalTestModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => { setIsAddOpen(false); refetch(); }}
      />
      <EditMedicalTestModal
        isOpen={isEditOpen}
        onClose={() => { setIsEditOpen(false); setSelected(null); }}
        onSuccess={() => { setIsEditOpen(false); setSelected(null); refetch(); }}
        test={selected}
      />
      <ViewMedicalTestModal
        isOpen={isViewOpen}
        onClose={() => { setIsViewOpen(false); setSelected(null); }}
        test={selected}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => { setIsDeleteOpen(false); setSelected(null); }}
        onConfirm={handleDeleteConfirm}
        title="Remove Medical Test"
        message={`Are you sure you want to remove "${selected?.name}"? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={deleteTest.isPending}
      />
      <ViewTestBookingModal
        isOpen={isBookingOpen}
        onClose={() => { setIsBookingOpen(false); setSelectedBooking(null); }}
        booking={selectedBooking}
      />
    </div>
  );
};

export default MedicalTests;


