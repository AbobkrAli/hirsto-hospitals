import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Clock } from 'lucide-react';
import Button from '../atoms/Button';
import { useCreateFollowUpSession, type CreateFollowUpSessionRequest } from '../../services/followUpsService';
import Select from 'react-select';

interface AddFollowUpSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  followUpId: number | null;
}

const AddFollowUpSessionModal: React.FC<AddFollowUpSessionModalProps> = ({ isOpen, onClose, onSuccess, followUpId }) => {
  const [form, setForm] = useState<CreateFollowUpSessionRequest>({
    follow_up_id: 0,
    session_number: 1,
    session_date: '',
    session_type: 'in_person',
    duration_minutes: 0,
    patient_symptoms: '',
    vital_signs: '',
    physical_examination: '',
    patient_concerns: '',
    doctor_observations: '',
    treatment_adjustments: '',
    medications_prescribed: '',
    next_session_plan: '',
    session_outcome: 'stable',
    patient_compliance: 'good',
    side_effects_reported: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createMutation = useCreateFollowUpSession();

  useEffect(() => {
    if (isOpen) {
      setForm((prev) => ({ ...prev, follow_up_id: followUpId || 0 }));
      setIsSubmitting(false);
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen, followUpId]);

  const required = (v: string | number) => String(v ?? '').trim() ? '' : 'This field is required';
  const allowedSessionTypes = ['in_person', 'remote', 'phone'];
  const allowedSessionOutcomes = ['improved', 'stable', 'declined', 'concerns_noted'];
  const allowedCompliance = ['excellent', 'good', 'fair', 'poor'];

  const validateField = (name: string, value: string | number): string => {
    switch (name) {
      case 'follow_up_id': return Number(value) > 0 ? '' : 'Follow up is required';
      case 'session_number': return Number.isInteger(Number(value)) && Number(value) >= 1 ? '' : 'Session number must be an integer  1';
      case 'session_date': {
        const s = String(value);
        if (!s) return 'Date is required';
        const d = new Date(s);
        return Number.isNaN(d.getTime()) ? 'Invalid date/time' : '';
      }
      case 'session_type': return allowedSessionTypes.includes(String(value)) ? '' : `Type must be one of: ${allowedSessionTypes.join(', ')}`;
      case 'duration_minutes': return Number.isFinite(Number(value)) && Number(value) >= 1 && Number(value) <= 1440 ? '' : 'Duration must be 1240 minutes';
      case 'patient_symptoms':
      case 'doctor_observations':
      case 'next_session_plan':
        return required(String(value));
      case 'patient_compliance': return allowedCompliance.includes(String(value)) ? '' : `Compliance must be one of: ${allowedCompliance.join(', ')}`;
      case 'session_outcome': return allowedSessionOutcomes.includes(String(value)) ? '' : `Outcome must be one of: ${allowedSessionOutcomes.join(', ')}`;
      default: return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement & { name: string };
    const v = ['session_number', 'duration_minutes', 'follow_up_id'].includes(name) ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: v as any }));
    const err = validateField(name, v as any);
    setErrors((prev) => ({ ...prev, [name]: err }));
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fields: Array<keyof CreateFollowUpSessionRequest> = [
      'follow_up_id', 'session_number', 'session_date', 'session_type', 'duration_minutes', 'patient_symptoms', 'doctor_observations', 'next_session_plan', 'session_outcome', 'patient_compliance'
    ];
    const newErrors: Record<string, string> = {};
    fields.forEach((k) => {
      const err = validateField(k as string, (form as unknown as Record<string, any>)[k]);
      if (err) newErrors[k as string] = err;
    });
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      const list = Object.keys(newErrors).join(', ');
      setSubmitError(list ? `Please fix: ${list}` : 'Please fill all required fields correctly.');
      return;
    }
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({ data: form });
      onSuccess();
      setSubmitError(null);
    } catch (err: any) {
      const message = err?.response?.data?.detail || err?.message || 'Failed to add session';
      setSubmitError(String(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !isSubmitting;

  return (
    <AnimatePresence>
      {isOpen && followUpId && (
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
              <div className="backdrop-blur-xl rounded-2xl !max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl border bg-white/90 border-[#90E0EF]/30 p-6 ">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">Add Follow Up Session</h2>
                      <p className="text-sm text-[#0077B6] font-paragraphs">Create a new session</p>
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
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Session Number</label>
                      <input name="session_number" type="number" min={1} value={form.session_number} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Session Date</label>
                      <input name="session_date" type="datetime-local" value={form.session_date} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Session Type</label>
                      <input name="session_type" value={form.session_type} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Duration (minutes)</label>
                      <input name="duration_minutes" type="number" min={0} value={form.duration_minutes} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Patient Symptoms</label>
                      <textarea name="patient_symptoms" value={form.patient_symptoms} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" rows={2} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Vital Signs</label>
                      <textarea name="vital_signs" value={form.vital_signs} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" rows={2} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Physical Examination</label>
                      <textarea name="physical_examination" value={form.physical_examination} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" rows={2} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Patient Concerns</label>
                      <textarea name="patient_concerns" value={form.patient_concerns} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" rows={2} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Doctor Observations</label>
                      <textarea name="doctor_observations" value={form.doctor_observations} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" rows={2} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Treatment Adjustments</label>
                      <textarea name="treatment_adjustments" value={form.treatment_adjustments} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" rows={2} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Medications Prescribed</label>
                      <textarea name="medications_prescribed" value={form.medications_prescribed} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" rows={2} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Next Session Plan</label>
                      <textarea name="next_session_plan" value={form.next_session_plan} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" rows={2} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Session Outcome</label>
                      <Select
                        classNamePrefix="react-select"
                        options={[
                          { value: 'improved', label: 'Improved' },
                          { value: 'stable', label: 'Stable' },
                          { value: 'declined', label: 'Declined' },
                          { value: 'concerns_noted', label: 'Concerns Noted' },
                        ]}
                        value={(() => {
                          const v = form.session_outcome;
                          return [
                            { value: 'improved', label: 'Improved' },
                            { value: 'stable', label: 'Stable' },
                            { value: 'declined', label: 'Declined' },
                            { value: 'concerns_noted', label: 'Concerns Noted' },
                          ].find(o => o.value === v) || null;
                        })()}
                        onChange={(opt) => setForm(prev => ({ ...prev, session_outcome: (opt as { value: string; label: string } | null)?.value || 'stable' }))}
                        styles={{
                          control: (provided) => ({ ...provided, border: '1px solid #90E0EF', borderRadius: '0.5rem', minHeight: '36px', boxShadow: 'none', '&:hover': { border: '1px solid #90E0EF' } }),
                          option: (p, s) => ({ ...p, backgroundColor: s.isSelected ? '#03045E' : s.isFocused ? '#CAF0F8' : 'white', color: s.isSelected ? 'white' : '#1E3E72' }),
                          menu: (p) => ({ ...p, border: '1px solid #90E0EF', borderRadius: '0.5rem' })
                        }}
                        placeholder="Select outcome"
                        isClearable
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Patient Compliance</label>
                      <input name="patient_compliance" value={form.patient_compliance} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Side Effects Reported</label>
                      <textarea name="side_effects_reported" value={form.side_effects_reported} onChange={handleChange} className="mt-1 w-full border rounded-lg p-2 focus:outline-none border-[#90E0EF]" rows={2} />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="bg-[#03045E] cursor-pointer text-white flex-1" onClick={() => !isSubmitting && onClose()} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={!canSubmit || createMutation.isPending} loading={isSubmitting || createMutation.isPending} className="flex-1">Add Session</Button>
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

export default AddFollowUpSessionModal;


