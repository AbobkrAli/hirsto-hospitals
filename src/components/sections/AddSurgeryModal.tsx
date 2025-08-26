import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Activity } from 'lucide-react';
import Button from '../atoms/Button';
import { useCreateSurgery, type CreateSurgeryRequest } from '../../services/surgeriesService';

interface AddSurgeryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddSurgeryModal: React.FC<AddSurgeryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState<CreateSurgeryRequest>({
    name: '',
    description: '',
    specialization_required: '',
    estimated_duration_hours: 1,
    cost: 1,
    preparation_instructions: '',
    post_surgery_care: '',
    risk_level: 'medium',
    is_emergency_surgery: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createSurgery = useCreateSurgery();

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: '', description: '', specialization_required: '', estimated_duration_hours: 1, cost: 1,
        preparation_instructions: '', post_surgery_care: '', risk_level: 'medium', is_emergency_surgery: false,
      });
      setIsSubmitting(false);
      setErrors({});
    }
  }, [isOpen]);

  const validateField = (name: string, value: string | number | boolean): string => {
    if (name === 'name' && !String(value).trim()) return 'Name is required';
    if (name === 'description' && !String(value).trim()) return 'Description is required';
    if (name === 'specialization_required' && !String(value).trim()) return 'Specialization is required';
    if (name === 'estimated_duration_hours') {
      const num = Number(value);
      if (!Number.isFinite(num)) return 'Estimated duration is required';
      if (num < 1 || num > 72) return 'Duration must be between 1 and 72 hours';
    }
    if (name === 'cost') {
      const num = Number(value);
      if (!Number.isFinite(num)) return 'Cost is required';
      if (num < 1) return 'Cost must be at least 1';
    }
    if (name === 'preparation_instructions' && !String(value).trim()) return 'Preparation instructions are required';
    if (name === 'post_surgery_care' && !String(value).trim()) return 'Post-surgery care is required';
    if (name === 'risk_level' && !String(value).trim()) return 'Risk level is required';
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any;
    const v = type === 'checkbox' ? checked : (name === 'cost' || name === 'estimated_duration_hours') ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: v }));
    const err = validateField(name, v as any);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fields: Array<keyof CreateSurgeryRequest> = [
      'name', 'description', 'specialization_required', 'estimated_duration_hours', 'cost', 'preparation_instructions', 'post_surgery_care', 'risk_level'
    ];
    const newErrors: Record<string, string> = {};
    fields.forEach((k) => {
      const err = validateField(k as string, (form as any)[k]);
      if (err) newErrors[k as string] = err;
    });
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    setIsSubmitting(true);
    try {
      await createSurgery.mutateAsync({ data: form });
      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = !Object.values(errors).some(Boolean) && !isSubmitting && form.name.trim() && form.description.trim();

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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">Add Surgery</h2>
                      <p className="text-sm text-[#0077B6] font-paragraphs">Create a new surgery</p>
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
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Specialization Required</label>
                      <input name="specialization_required" value={form.specialization_required} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.specialization_required ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.specialization_required && <p className="text-xs text-red-600 mt-1">{errors.specialization_required}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Estimated Duration (hours)</label>
                      <input name="estimated_duration_hours" type="number" min={1} max={72} value={form.estimated_duration_hours} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.estimated_duration_hours ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.estimated_duration_hours && <p className="text-xs text-red-600 mt-1">{errors.estimated_duration_hours}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Cost</label>
                      <input name="cost" type="number" min={1} value={form.cost} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.cost ? 'border-red-500' : 'border-[#90E0EF]'}`} />
                      {errors.cost && <p className="text-xs text-red-600 mt-1">{errors.cost}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Risk Level</label>
                      <select name="risk_level" value={form.risk_level} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.risk_level ? 'border-red-500' : 'border-[#90E0EF]'}`}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      {errors.risk_level && <p className="text-xs text-red-600 mt-1">{errors.risk_level}</p>}
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <input id="is_emergency_surgery" name="is_emergency_surgery" type="checkbox" checked={form.is_emergency_surgery} onChange={handleChange} className="h-4 w-4 text-blue-600 border-[#90E0EF] rounded" />
                      <label htmlFor="is_emergency_surgery" className="text-sm font-semibold font-subtitles text-[#1E3E72]">Emergency Surgery</label>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Description</label>
                      <textarea name="description" value={form.description} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.description ? 'border-red-500' : 'border-[#90E0EF]'}`} rows={3} />
                      {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Preparation Instructions</label>
                      <textarea name="preparation_instructions" value={form.preparation_instructions} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.preparation_instructions ? 'border-red-500' : 'border-[#90E0EF]'}`} rows={3} />
                      {errors.preparation_instructions && <p className="text-xs text-red-600 mt-1">{errors.preparation_instructions}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold font-subtitles text-[#1E3E72]">Post-surgery Care</label>
                      <textarea name="post_surgery_care" value={form.post_surgery_care} onChange={handleChange} className={`mt-1 w-full border rounded-lg p-2 focus:outline-none ${errors.post_surgery_care ? 'border-red-500' : 'border-[#90E0EF]'}`} rows={3} />
                      {errors.post_surgery_care && <p className="text-xs text-red-600 mt-1">{errors.post_surgery_care}</p>}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="button" variant="outline" className="bg-[#03045E] cursor-pointer text-white flex-1" onClick={() => !isSubmitting && onClose()} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={!canSubmit} loading={isSubmitting || createSurgery.isPending} className="flex-1">Add Surgery</Button>
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

export default AddSurgeryModal;


