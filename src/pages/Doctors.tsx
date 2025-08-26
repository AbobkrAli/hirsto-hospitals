import { useState } from 'react';
import { Plus, User, Edit, Trash2, AlertCircle, RefreshCw, Eye } from 'lucide-react';
import Button from '../components/atoms/Button';
import { DeleteConfirmationModal } from '../components/sections';
import { InactivePharmacyMessage } from '../components';
import { usePharmacyData } from '../hooks/usePharmacyData';
import { useHospitalDoctors, useCreateDoctor, useUpdateDoctor, useDeleteDoctor, type DoctorData, type CreateDoctorRequest, type UpdateDoctorRequest } from '../services/doctorsService';
import { useInsuranceCompanies } from '../hooks/useInsurance';
import AddDoctorModal from '../components/sections/AddDoctorModal';
import EditDoctorModal from '../components/sections/EditDoctorModal';
import ViewDoctorModal from '../components/sections/ViewDoctorModal';

const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="animate-pulse">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-6 gap-4">
          {['Name', 'Email', 'Specialization', 'Experience', 'Status', 'Actions'].map((header) => (
            <div key={header} className="h-4 bg-gray-200 rounded w-20"></div>
          ))}
        </div>
      </div>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="px-6 py-4 border-b border-gray-100">
          <div className="grid grid-cols-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Doctors: React.FC = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorData | null>(null);

  const { data: pharmacyData } = usePharmacyData();
  const isPharmacyInactive = pharmacyData && !pharmacyData.is_active;

  const { data: doctors = [], isLoading, error, refetch } = useHospitalDoctors();

  const createDoctor = useCreateDoctor();
  const updateDoctor = useUpdateDoctor();
  const deleteDoctor = useDeleteDoctor();

  const { data: insuranceCompanies = [] } = useInsuranceCompanies();

  if (isPharmacyInactive) {
    return <InactivePharmacyMessage />;
  }

  const handleAdd = () => setIsAddOpen(true);
  const handleAddClose = () => setIsAddOpen(false);

  const handleEdit = (doctor: DoctorData) => {
    setSelectedDoctor(doctor);
    setIsEditOpen(true);
  };
  const handleView = (doctor: DoctorData) => {
    setSelectedDoctor(doctor);
    setIsViewOpen(true);
  };
  const handleEditClose = () => {
    setIsEditOpen(false);
    setSelectedDoctor(null);
  };
  const handleEditSubmit = async (data: UpdateDoctorRequest) => {
    if (!selectedDoctor) return;
    await updateDoctor.mutateAsync({ doctorId: selectedDoctor.id, data });
    setIsEditOpen(false);
    setSelectedDoctor(null);
  };

  const handleDelete = (doctor: DoctorData) => {
    setSelectedDoctor(doctor);
    setIsDeleteOpen(true);
  };
  const handleDeleteClose = () => {
    setIsDeleteOpen(false);
    setSelectedDoctor(null);
  };
  const handleDeleteConfirm = async () => {
    if (!selectedDoctor) return;
    await deleteDoctor.mutateAsync({ doctorId: selectedDoctor.id });
    handleDeleteClose();
  };

  const handleRetry = () => refetch();

  if (isLoading && doctors.length === 0) {
    return (
      <div className="space-y-6">
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
        <div className="flex gap-2">
          <Button onClick={handleAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Doctor
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {doctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.specialization}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{doctor.years_of_experience} yrs</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doctor.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {doctor.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleView(doctor)} className="text-[#1E3E72] hover:text-blue-700 transition-colors" title="View doctor">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleEdit(doctor)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Edit doctor">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(doctor)} disabled={deleteDoctor.isPending} className="text-red-600 hover:text-red-800 transition-colors" title="Delete doctor">
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load doctors</h3>
            <p className="text-gray-500 mb-4">There was an error loading doctors</p>
            <Button variant="danger" onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        ) : (!doctors || doctors.length === 0) ? (
          <div className="text-center py-12">
            <User className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500 mb-4">You haven't added any doctors yet</p>
            <Button onClick={handleAdd} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Doctor
            </Button>
          </div>
        ) : null}
      </div>

      <AddDoctorModal
        isOpen={isAddOpen}
        onClose={handleAddClose}
        onSuccess={() => { setIsAddOpen(false); refetch(); }}
        insuranceCompanies={insuranceCompanies}
      />
      <EditDoctorModal
        isOpen={isEditOpen}
        onClose={handleEditClose}
        onSuccess={() => { setIsEditOpen(false); setSelectedDoctor(null); refetch(); }}
        doctor={selectedDoctor}
      />
      <ViewDoctorModal
        isOpen={isViewOpen}
        onClose={() => { setIsViewOpen(false); setSelectedDoctor(null); }}
        doctor={selectedDoctor}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        title="Remove Doctor"
        message={`Are you sure you want to remove "${selectedDoctor?.name}"? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={deleteDoctor.isPending}
      />
    </div>
  );
};

export default Doctors;


