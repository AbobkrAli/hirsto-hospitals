import { useMemo, useState } from 'react';
import Button from '../components/atoms/Button';
import Select from 'react-select';
import { useGetHospital, useUpdateHospital } from '../services/hospitalService';
import { useInsuranceCompanies } from '../hooks/useInsurance';

const Profile: React.FC = () => {
  const { data: hospital, isLoading, error } = useGetHospital();
  const updateHospital = useUpdateHospital();
  const { data: allInsurance = [] } = useInsuranceCompanies();

  const [form, setForm] = useState<{ name: string; email: string; phone_number: string; location: string; bio: string; password: string; insurance_company_ids: number[] }>({
    name: '', email: '', phone_number: '', location: '', bio: '', password: '', insurance_company_ids: []
  });
  const [isEditing, setIsEditing] = useState(false);

  useMemo(() => {
    if (hospital) {
      setForm({
        name: hospital.name || '',
        email: hospital.email || '',
        phone_number: hospital.phone_number || '',
        location: hospital.location || '',
        bio: hospital.bio || '',
        password: '',
        insurance_company_ids: (hospital.insurance_companies || []).map((c: { id: number; name?: string }) => c.id)
      });
      setIsEditing(false);
    }
  }, [hospital]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement & { name: string };
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await updateHospital.mutateAsync({
      data: {
        name: form.name,
        email: form.email,
        password: form.password || undefined,
        phone_number: form.phone_number,
        location: form.location,
        bio: form.bio,
        insurance_company_ids: form.insurance_company_ids
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!hospital) return;
    setForm({
      name: hospital.name || '',
      email: hospital.email || '',
      phone_number: hospital.phone_number || '',
      location: hospital.location || '',
      bio: hospital.bio || '',
      password: '',
      insurance_company_ids: (hospital.insurance_companies || []).map((c: { id: number; name?: string }) => c.id)
    });
    setIsEditing(false);
  };

  if (isLoading) return <div className="p-6">Loading profile…</div>;
  if (error) return <div className="p-6 text-red-600">Failed to load profile</div>;
  if (!hospital) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Hospital Profile</h1>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel} disabled={updateHospital.isPending}>Cancel</Button>
            <Button onClick={handleSave} loading={updateHospital.isPending}>Save Changes</Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)}>Update Profile</Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
        {!isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Name</div>
                <div className="text-gray-900 font-medium">{hospital.name}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="text-gray-900 font-medium">{hospital.email}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Phone Number</div>
                <div className="text-gray-900 font-medium">{hospital.phone_number}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Location</div>
                <div className="text-gray-900 font-medium">{hospital.location}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500">Bio</div>
                <div className="text-gray-900 whitespace-pre-wrap">{hospital.bio || '-'}</div>
              </div>
              <div className="md:col-span-2">
                <div className="text-sm text-gray-500 mb-1">Insurance Companies</div>
                <div className="flex flex-wrap gap-2">
                  {(hospital.insurance_companies || []).length === 0 ? (
                    <span className="text-sm text-gray-500">None</span>
                  ) : (
                    (hospital.insurance_companies || []).map((c: { id: number; name: string }) => (
                      <span key={c.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#CAF0F8] text-[#1E3E72]">{c.name}</span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input name="phone_number" value={form.phone_number} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-gray-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-gray-300" rows={3} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-gray-300" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Insurance Companies</label>
              <Select
                classNamePrefix="react-select"
                isMulti
                options={allInsurance.map((c: { id: number; name: string }) => ({ value: c.id, label: c.name }))}
                value={form.insurance_company_ids.map((id) => ({ value: id, label: (allInsurance as Array<{ id: number; name: string }>).find((c) => c.id === id)?.name || String(id) }))}
                onChange={(opts) => setForm((prev) => ({ ...prev, insurance_company_ids: (opts as Array<{ value: number; label: string }>).map(o => o.value) }))}
                styles={{
                  control: (provided) => ({ ...provided, border: '1px solid #90E0EF', borderRadius: '0.5rem', minHeight: '38px', boxShadow: 'none' }),
                  option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? '#03045E' : s.isFocused ? '#CAF0F8' : 'white', color: s.isSelected ? 'white' : '#1E3E72' }),
                  menu: (p) => ({ ...p, border: '1px solid #90E0EF', borderRadius: '0.5rem' })
                }}
                placeholder="Select insurance companies"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile; 
