import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, UserPlus } from 'lucide-react';
import Select from 'react-select';
import type { MultiValue } from 'react-select';
import Button from '../atoms/Button';
import { useCreateDoctor, type CreateDoctorRequest } from '../../services/doctorsService';
import type { InsuranceCompany } from '../../services/insuranceService';

interface InsuranceOption {
  value: number;
  label: string;
}

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  insuranceCompanies: InsuranceCompany[];
}

const AddDoctorModal: React.FC<AddDoctorModalProps> = ({ isOpen, onClose, onSuccess, insuranceCompanies }) => {
  const [form, setForm] = useState<CreateDoctorRequest>({
    name: '',
    age: 0,
    email: '',
    specialization: '',
    bio: '',
    phone_number: '',
    profile_image_url: '',
    location: '',
    years_of_experience: 0,
    nationality: '',
    languages: '',
    insurance_company_ids: [],
  });
  const [selectedInsurances, setSelectedInsurances] = useState<MultiValue<InsuranceOption>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createDoctor = useCreateDoctor();

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: '', age: 0, email: '', specialization: '', bio: '', phone_number: '', profile_image_url: '',
        location: '', years_of_experience: 0, nationality: '', languages: '', insurance_company_ids: []
      });
      setSelectedInsurances([]);
      setIsSubmitting(false);
      setErrors({});
    }
  }, [isOpen]);

  const options: InsuranceOption[] = insuranceCompanies.map((c) => ({ value: c.id, label: c.name }));

  const validateField = (name: string, value: string | number): string => {
    if (name === 'name') {
      if (!String(value).trim()) return 'Name is required';
      if (String(value).trim().length < 2) return 'Name must be at least 2 characters';
    }
    if (name === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      if (!String(value).trim()) return 'Email is required';
      if (!re.test(String(value))) return 'Enter a valid email address';
    }
    if (name === 'specialization') {
      if (!String(value).trim()) return 'Specialization is required';
    }
    if (name === 'age') {
      const num = Number(value);
      if (!Number.isFinite(num)) return 'Age is required';
      if (num < 18 || num > 100) return 'Age must be between 18 and 100';
    }
    if (name === 'years_of_experience') {
      const num = Number(value);
      if (!Number.isFinite(num)) return 'Experience is required';
      if (num < 0 || num > 80) return 'Experience must be between 0 and 80';
    }
    if (name === 'phone_number') {
      const digitsOnly = String(value).replace(/\D/g, '');
      if (!digitsOnly) return 'Phone number is required';
      if (!/^\d+$/.test(digitsOnly)) return 'Phone must contain only digits';
      if (digitsOnly.length > 15) return 'Phone must be at most 15 digits';
      if (digitsOnly.length < 7) return 'Phone must be at least 7 digits';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as { name: string; value: string };
    const casted = name === 'age' || name === 'years_of_experience' ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: casted as any }));
    const err = validateField(name, casted as any);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldsToValidate: Array<keyof CreateDoctorRequest> = ['name', 'email', 'specialization'];
    const numericToValidate: Array<keyof CreateDoctorRequest> = ['age', 'years_of_experience'];
    const phoneToValidate: Array<keyof CreateDoctorRequest> = ['phone_number'];
    const newErrors: Record<string, string> = {};
    [...fieldsToValidate, ...numericToValidate, ...phoneToValidate].forEach((key) => {
      const val = (form as any)[key];
      const err = validateField(key as string, val);
      if (err) newErrors[key as string] = err;
    });
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    setIsSubmitting(true);
    try {
      const insuranceIds = selectedInsurances.map((i) => i.value);
      await createDoctor.mutateAsync({ data: { ...form, insurance_company_ids: insuranceIds } });
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !!form.name.trim() && !!form.email.trim() && !isSubmitting && !Object.values(errors).some(Boolean);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 h-[100vh] backdrop-blur-sm"
            onClick={() => !isSubmitting && onClose()}
            style={{ zIndex: 9998 }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
            style={{ zIndex: 9999 }}
          >
            <div className="w-full max-w-2xl ">
              <div className="backdrop-blur-xl rounded-2xl !max-h-[90vh] overflow-y-auto shadow-2xl border bg-white/90 border-[#90E0EF]/30 p-6 ">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div>
                      <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">Add Doctor</h2>
                      <p className="text-sm text-[#0077B6] font-paragraphs">Create a new doctor profile</p>
                    </div>
                  </div>
                  <button onClick={() => !isSubmitting && onClose()} disabled={isSubmitting} className="p-2 hover:bg-[#CAF0F8]/30 rounded-lg transition-colors disabled:opacity-50">
                    <X className="w-5 h-5 text-[#1E3E72]" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Name</label>
                      <input name="name" value={form.name} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.name ? 'border-red-500' : 'border-[#90E0EF]'}`} required />
                      {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.email ? 'border-red-500' : 'border-[#90E0EF]'}`} required />
                      {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Age</label>
                      <input name="age" type="number" min={18} max={100} value={form.age} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.age ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.age && <p className="text-xs text-red-600 mt-1">{errors.age}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Phone Number</label>
                      <input name="phone_number" inputMode="numeric" maxLength={15} value={form.phone_number} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.phone_number ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.phone_number && <p className="text-xs text-red-600 mt-1">{errors.phone_number}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Specialization</label>
                      <input name="specialization" value={form.specialization} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.specialization ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.specialization && <p className="text-xs text-red-600 mt-1">{errors.specialization}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Profile Image URL</label>
                      <input name="profile_image_url" value={form.profile_image_url} onChange={handleChange} className="mt-1 w-full border border-[#90E0EF] rounded-lg p-2 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Location</label>
                      <input name="location" value={form.location} onChange={handleChange} className="mt-1 w-full border border-[#90E0EF] rounded-lg p-2 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Years of Experience</label>
                      <input name="years_of_experience" type="number" min={0} max={80} value={form.years_of_experience} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.years_of_experience ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.years_of_experience && <p className="text-xs text-red-600 mt-1">{errors.years_of_experience}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Nationality</label>
                      <input name="nationality" value={form.nationality} onChange={handleChange} className="mt-1 w-full border border-[#90E0EF] rounded-lg p-2 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Languages</label>
                      <input name="languages" value={form.languages} onChange={handleChange} className="mt-1 w-full border border-[#90E0EF] rounded-lg p-2 focus:outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Bio</label>
                      <textarea name="bio" value={form.bio} onChange={handleChange} className="mt-1 w-full border border-[#90E0EF] rounded-lg p-2 focus:outline-none" rows={3} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Insurance Companies</label>
                      <Select
                        isMulti
                        value={selectedInsurances}
                        onChange={(v) => setSelectedInsurances(v || [])}
                        options={options}
                        placeholder="Select insurance companies..."
                        isDisabled={isSubmitting}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            border: '1px solid #90E0EF',
                            borderRadius: '0.75rem',
                            minHeight: '44px',
                            boxShadow: 'none',
                            '&:hover': { border: '1px solid #90E0EF' },
                          }),
                          option: (provided, state) => ({
                            ...provided,
                            backgroundColor: state.isSelected ? '#03045E' : state.isFocused ? '#CAF0F8' : 'white',
                            color: state.isSelected ? 'white' : '#1E3E72',
                            '&:hover': { backgroundColor: state.isSelected ? '#03045E' : '#CAF0F8' },
                          }),
                          multiValue: (provided) => ({ ...provided, backgroundColor: '#CAF0F8', borderRadius: '0.5rem' }),
                          multiValueLabel: (provided) => ({ ...provided, color: '#1E3E72', fontWeight: '500' }),
                          multiValueRemove: (provided) => ({
                            ...provided,
                            color: '#1E3E72',
                            '&:hover': { backgroundColor: '#90E0EF', color: '#1E3E72' },
                          }),
                          menu: (provided) => ({
                            ...provided,
                            border: '1px solid #90E0EF',
                            borderRadius: '0.75rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          })
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="bg-[#03045E] cursor-pointer  text-white flex-1" onClick={() => !isSubmitting && onClose()} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={!canSubmit} loading={isSubmitting || createDoctor.isPending} className="flex-1">Add Doctor</Button>
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

export default AddDoctorModal;


