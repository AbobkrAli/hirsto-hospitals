import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ClipboardList } from 'lucide-react';
import Button from '../atoms/Button';
import { useCreateFollowUp, type CreateFollowUpRequest } from '../../services/followUpsService';
import { useHospitalSurgeries } from '../../services/surgeriesService';
import { useHospitalMedicalTests } from '../../services/medicalTestsService';
import Select from 'react-select';

interface AddFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddFollowUpModal: React.FC<AddFollowUpModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState<CreateFollowUpRequest>({
    doctor_id: 0,
    patient_email: '',
    patient_name: '',
    follow_up_type: '',
    related_surgery_id: null,
    related_test_id: null,
    initial_consultation_date: '',
    next_appointment_date: '',
    priority_level: 'routine',
    chief_complaint: '',
    current_symptoms: '',
    vital_signs: '',
    current_medications: '',
    treatment_plan: '',
    follow_up_frequency: '',
    total_sessions_planned: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createMutation = useCreateFollowUp();
  const { data: surgeries = [], isLoading: isLoadingSurgeries } = useHospitalSurgeries();
  const { data: tests = [], isLoading: isLoadingTests } = useHospitalMedicalTests();

  useEffect(() => {
    if (isOpen) {
      setForm({
        doctor_id: 0, patient_email: '', patient_name: '', follow_up_type: '', related_surgery_id: null,
        related_test_id: null, initial_consultation_date: '', next_appointment_date: '', priority_level: 'routine',
        chief_complaint: '', current_symptoms: '', vital_signs: '', current_medications: '', treatment_plan: '',
        follow_up_frequency: '', total_sessions_planned: 0,
      });
      setIsSubmitting(false);
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen]);

  const required = (v: string | number) => String(v ?? '').trim() ? '' : 'This field is required';
  const isEmail = (v: string) => /.+@.+\..+/.test(v);

  const validateField = (name: string, value: string | number | null): string => {
    switch (name) {
      case 'doctor_id': return Number(value) > 0 ? '' : 'Doctor is required';
      case 'patient_email': return isEmail(String(value)) ? '' : 'Valid email is required';
      case 'patient_name':
      case 'follow_up_type':
      case 'priority_level':
      case 'chief_complaint':
      case 'current_symptoms':
      case 'vital_signs':
      case 'current_medications':
      case 'treatment_plan':
      case 'follow_up_frequency':
        return required(String(value));
      case 'initial_consultation_date':
      case 'next_appointment_date':
        return String(value) ? '' : 'Date is required';
      case 'total_sessions_planned': return Number(value) >= 0 ? '' : 'Must be 0 or more';
      default: return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement & { name: string };
    let v: string | number | null = value;
    if (['doctor_id', 'related_surgery_id', 'related_test_id', 'total_sessions_planned'].includes(name)) {
      v = value === '' ? null : Number(value);
    }
    setForm((prev) => ({ ...prev, [name]: v as any }));
    const err = validateField(name, v);
    setErrors((prev) => ({ ...prev, [name]: err }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fields: Array<keyof CreateFollowUpRequest> = [
      'doctor_id', 'patient_email', 'patient_name', 'follow_up_type', 'initial_consultation_date', 'next_appointment_date', 'priority_level', 'chief_complaint', 'current_symptoms', 'vital_signs', 'current_medications', 'treatment_plan', 'follow_up_frequency', 'total_sessions_planned'
    ];
    const newErrors: Record<string, string> = {};
    fields.forEach((k) => {
      const err = validateField(k as string, (form as unknown as Record<string, any>)[k]);
      if (err) newErrors[k as string] = err;
    });
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      const fieldsList = Object.keys(newErrors).join(', ');
      setSubmitError(fieldsList ? `Please fix: ${fieldsList}` : 'Please fill all required fields correctly.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({ data: form });
      onSuccess();
      setSubmitError(null);
    } catch (err: any) {
      const message = err?.response?.data?.detail || err?.message || 'Failed to add follow up';
      setSubmitError(String(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !isSubmitting;

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
            <div className="w-full max-w-3xl ">
              <div className="relative backdrop-blur-xl rounded-2xl !max-h-[90vh] overflow-y-auto shadow-2xl border bg-white/90 border-[#90E0EF]/40 p-0 ">
                <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(202, 240, 248, 0.35), rgba(144, 224, 239, 0.15))' }} />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center shadow-md">
                        <ClipboardList className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">Add Follow Up</h2>
                        <p className="text-sm text-[#0077B6] font-paragraphs">Create a new follow up</p>
                      </div>
                    </div>
                    <button onClick={() => !isSubmitting && onClose()} disabled={isSubmitting} className="p-2 hover:bg-[#CAF0F8]/30 rounded-lg transition-colors disabled:opacity-50">
                      <X className="w-5 h-5 text-[#1E3E72]" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {submitError && (
                      <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">{submitError}</div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Doctor ID</label>
                        <input name="doctor_id" type="number" min={1} value={form.doctor_id} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.doctor_id ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                        {errors.doctor_id && <p className="text-xs text-red-600 mt-1">{errors.doctor_id}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Patient Email</label>
                        <input name="patient_email" value={form.patient_email} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.patient_email ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                        {errors.patient_email && <p className="text-xs text-red-600 mt-1">{errors.patient_email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Patient Name</label>
                        <input name="patient_name" value={form.patient_name} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.patient_name ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                        {errors.patient_name && <p className="text-xs text-red-600 mt-1">{errors.patient_name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Follow Up Type</label>
                        <input name="follow_up_type" value={form.follow_up_type} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.follow_up_type ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                        {errors.follow_up_type && <p className="text-xs text-red-600 mt-1">{errors.follow_up_type}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Related Surgery (optional)</label>
                        <Select
                          classNamePrefix="react-select"
                          isClearable
                          isLoading={isLoadingSurgeries}
                          options={surgeries.map(s => ({ value: s.id, label: s.name }))}
                          value={(() => {
                            const id = form.related_surgery_id ?? null;
                            return id ? { value: id, label: surgeries.find(s => s.id === id)?.name || String(id) } : null;
                          })()}
                          onChange={(opt: { value: number; label: string } | null) => setForm(prev => ({ ...prev, related_surgery_id: opt ? opt.value : null }))}
                          styles={{
                            control: (provided) => ({ ...provided, border: '1px solid #90E0EF', borderRadius: '0.5rem', minHeight: '36px', boxShadow: 'none', '&:hover': { border: '1px solid #90E0EF' } }),
                            option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? '#03045E' : s.isFocused ? '#CAF0F8' : 'white', color: s.isSelected ? 'white' : '#1E3E72' }),
                            menu: (p) => ({ ...p, border: '1px solid #90E0EF', borderRadius: '0.5rem' })
                          }}
                          placeholder="Select a surgery"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Related Medical Test (optional)</label>
                        <Select
                          classNamePrefix="react-select"
                          isClearable
                          isLoading={isLoadingTests}
                          options={tests.map(t => ({ value: t.id, label: t.name }))}
                          value={(() => {
                            const id = form.related_test_id ?? null;
                            return id ? { value: id, label: tests.find(t => t.id === id)?.name || String(id) } : null;
                          })()}
                          onChange={(opt: { value: number; label: string } | null) => setForm(prev => ({ ...prev, related_test_id: opt ? opt.value : null }))}
                          styles={{
                            control: (provided) => ({ ...provided, border: '1px solid #90E0EF', borderRadius: '0.5rem', minHeight: '36px', boxShadow: 'none', '&:hover': { border: '1px solid #90E0EF' } }),
                            option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? '#03045E' : s.isFocused ? '#CAF0F8' : 'white', color: s.isSelected ? 'white' : '#1E3E72' }),
                            menu: (p) => ({ ...p, border: '1px solid #90E0EF', borderRadius: '0.5rem' })
                          }}
                          placeholder="Select a medical test"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Initial Consultation Date</label>
                        <input name="initial_consultation_date" type="datetime-local" value={form.initial_consultation_date} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.initial_consultation_date ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                        {errors.initial_consultation_date && <p className="text-xs text-red-600 mt-1">{errors.initial_consultation_date}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Next Appointment Date</label>
                        <input name="next_appointment_date" type="datetime-local" value={form.next_appointment_date} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.next_appointment_date ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                        {errors.next_appointment_date && <p className="text-xs text-red-600 mt-1">{errors.next_appointment_date}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Priority Level</label>
                        <input name="priority_level" value={form.priority_level} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.priority_level ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                        {errors.priority_level && <p className="text-xs text-red-600 mt-1">{errors.priority_level}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Chief Complaint</label>
                        <textarea name="chief_complaint" value={form.chief_complaint} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.chief_complaint ? 'border-red-500' : 'border-[#90E0EF]'}`} rows={2} />
                        {errors.chief_complaint && <p className="text-xs text-red-600 mt-1">{errors.chief_complaint}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Current Symptoms</label>
                        <textarea name="current_symptoms" value={form.current_symptoms} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.current_symptoms ? 'border-red-500' : 'border-[#90E0EF]'}`} rows={2} />
                        {errors.current_symptoms && <p className="text-xs text-red-600 mt-1">{errors.current_symptoms}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Vital Signs</label>
                        <textarea name="vital_signs" value={form.vital_signs} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.vital_signs ? 'border-red-500' : 'border-[#90E0EF]'}`} rows={2} />
                        {errors.vital_signs && <p className="text-xs text-red-600 mt-1">{errors.vital_signs}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Current Medications</label>
                        <textarea name="current_medications" value={form.current_medications} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.current_medications ? 'border-red-500' : 'border-[#90E0EF]'}`} rows={2} />
                        {errors.current_medications && <p className="text-xs text-red-600 mt-1">{errors.current_medications}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Treatment Plan</label>
                        <textarea name="treatment_plan" value={form.treatment_plan} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.treatment_plan ? 'border-red-500' : 'border-[#90E0EF]'}`} rows={2} />
                        {errors.treatment_plan && <p className="text-xs text-red-600 mt-1">{errors.treatment_plan}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Follow-up Frequency</label>
                        <input name="follow_up_frequency" value={form.follow_up_frequency} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.follow_up_frequency ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                        {errors.follow_up_frequency && <p className="text-xs text-red-600 mt-1">{errors.follow_up_frequency}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Total Sessions Planned</label>
                        <input name="total_sessions_planned" type="number" min={0} value={form.total_sessions_planned} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.total_sessions_planned ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                        {errors.total_sessions_planned && <p className="text-xs text-red-600 mt-1">{errors.total_sessions_planned}</p>}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button type="button" variant="outline" className="bg-[#03045E] cursor-pointer text-white flex-1" onClick={() => !isSubmitting && onClose()} disabled={isSubmitting}>Cancel</Button>
                      <Button type="submit" disabled={!canSubmit || createMutation.isPending} loading={isSubmitting || createMutation.isPending} className="flex-1">Add Follow Up</Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddFollowUpModal;


