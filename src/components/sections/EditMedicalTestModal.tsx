import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Beaker } from 'lucide-react';
import Button from '../atoms/Button';
import { useUpdateMedicalTest, type UpdateMedicalTestRequest, type MedicalTestData } from '../../services/medicalTestsService';

interface EditMedicalTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  test: MedicalTestData | null;
}

const EditMedicalTestModal: React.FC<EditMedicalTestModalProps> = ({ isOpen, onClose, onSuccess, test }) => {
  const [form, setForm] = useState<UpdateMedicalTestRequest>({
    name: '',
    description: '',
    test_type: '',
    department: '',
    cost: 1,
    duration_minutes: 1,
    preparation_instructions: '',
    fasting_required: false,
    fasting_hours: 0,
    sample_type: '',
    normal_range: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateMutation = useUpdateMedicalTest();

  useEffect(() => {
    if (isOpen && test) {
      setForm({
        name: test.name || '',
        description: test.description || '',
        test_type: test.test_type || '',
        department: test.department || '',
        cost: test.cost || 1,
        duration_minutes: test.duration_minutes || 1,
        preparation_instructions: test.preparation_instructions || '',
        fasting_required: !!test.fasting_required,
        fasting_hours: test.fasting_hours || 0,
        sample_type: test.sample_type || '',
        normal_range: test.normal_range || '',
      });
      setIsSubmitting(false);
      setErrors({});
    }
  }, [isOpen, test]);

  const validateField = (name: string, value: string | number | boolean): string => {
    const required = (v: string | number | boolean) => String(v ?? '').trim() ? '' : 'This field is required';
    switch (name) {
      case 'name':
      case 'description':
      case 'test_type':
      case 'department':
      case 'preparation_instructions':
      case 'sample_type':
      case 'normal_range':
        return required(value);
      case 'cost': {
        const n = Number(value); if (!Number.isFinite(n)) return 'Cost is required'; if (n < 1) return 'Cost must be at least 1'; return '';
      }
      case 'duration_minutes': {
        const n = Number(value); if (!Number.isFinite(n)) return 'Duration is required'; if (n < 1 || n > 24 * 60) return 'Duration must be 1-1440 minutes'; return '';
      }
      case 'fasting_hours': {
        const n = Number(value); if (n < 0 || n > 72) return 'Fasting hours must be 0-72'; return '';
      }
      default: return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement & { name: string };
    const v = type === 'checkbox' ? checked : (name === 'cost' || name === 'duration_minutes' || name === 'fasting_hours') ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: v }));
    const err = validateField(name, v as unknown as string | number | boolean);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!test) return;
    const fields: Array<keyof UpdateMedicalTestRequest> = [
      'name', 'description', 'test_type', 'department', 'cost', 'duration_minutes', 'preparation_instructions', 'fasting_required', 'fasting_hours', 'sample_type', 'normal_range'
    ];
    const newErrors: Record<string, string> = {};
    fields.forEach((k) => {
      const err = validateField(k as string, (form as unknown as Record<string, string | number | boolean>)[k]);
      if (err) newErrors[k as string] = err;
    });
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync({ testId: test.id, data: form });
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !Object.values(errors).some(Boolean) && !isSubmitting && form.name.trim() && form.description.trim();

  return (
    <AnimatePresence>
      {isOpen && test && (
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center">
                      <Beaker className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">Edit Medical Test</h2>
                      <p className="text-sm text-[#0077B6] font-paragraphs">Update medical test</p>
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
                      <input name="name" value={form.name} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.name ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Description</label>
                      <textarea name="description" value={form.description} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.description ? 'border-red-500' : 'border-[#90E0EF]'}`} rows={3} />
                      {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Test Type</label>
                      <input name="test_type" value={form.test_type} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.test_type ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.test_type && <p className="text-xs text-red-600 mt-1">{errors.test_type}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Department</label>
                      <input name="department" value={form.department} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.department ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Duration (minutes)</label>
                      <input name="duration_minutes" type="number" min={1} value={form.duration_minutes} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.duration_minutes ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.duration_minutes && <p className="text-xs text-red-600 mt-1">{errors.duration_minutes}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Cost</label>
                      <input name="cost" type="number" min={1} value={form.cost} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.cost ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.cost && <p className="text-xs text-red-600 mt-1">{errors.cost}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Sample Type</label>
                      <input name="sample_type" value={form.sample_type} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.sample_type ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.sample_type && <p className="text-xs text-red-600 mt-1">{errors.sample_type}</p>}
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input id="fasting_required" name="fasting_required" type="checkbox" checked={form.fasting_required} onChange={handleChange} className="h-4 w-4 text-blue-600 border-[#90E0EF] rounded" />
                      <label htmlFor="fasting_required" className="text-sm font-semibold font-subtitles text-[#1E3E72]">Fasting Required</label>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Fasting Hours</label>
                      <input name="fasting_hours" type="number" min={0} max={72} value={form.fasting_hours} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.fasting_hours ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.fasting_hours && <p className="text-xs text-red-600 mt-1">{errors.fasting_hours}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Normal Range</label>
                      <input name="normal_range" value={form.normal_range} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.normal_range ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.normal_range && <p className="text-xs text-red-600 mt-1">{errors.normal_range}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Preparation Instructions</label>
                      <textarea name="preparation_instructions" value={form.preparation_instructions} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.preparation_instructions ? 'border-red-500' : 'border-[#90E0EF]'}`} rows={3} />
                      {errors.preparation_instructions && <p className="text-xs text-red-600 mt-1">{errors.preparation_instructions}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="bg-[#03045E] cursor-pointer text-white flex-1" onClick={() => !isSubmitting && onClose()} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={!canSubmit} loading={isSubmitting || updateMutation.isPending} className="flex-1">Save Changes</Button>
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

export default EditMedicalTestModal;


