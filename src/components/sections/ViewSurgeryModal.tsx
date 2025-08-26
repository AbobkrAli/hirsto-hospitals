import { AnimatePresence, motion } from 'framer-motion';
import { X, Activity } from 'lucide-react';
import Button from '../atoms/Button';
import type { SurgeryData } from '../../services/surgeriesService';

interface ViewSurgeryModalProps {
  isOpen: boolean;
  onClose: () => void;
  surgery: SurgeryData | null;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-3 py-2">
    <div className="col-span-1 text-sm font-semibold font-subtitles text-[#1E3E72]">{label}</div>
    <div className="col-span-2 text-sm text-gray-800">{value}</div>
  </div>
);

const ViewSurgeryModal: React.FC<ViewSurgeryModalProps> = ({ isOpen, onClose, surgery }) => {
  return (
    <AnimatePresence>
      {isOpen && surgery && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 h-[100vh] backdrop-blur-sm"
            onClick={onClose}
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
              <div className="relative backdrop-blur-xl rounded-2xl !max-h-[90vh] overflow-y-auto shadow-2xl border bg-white/90 border-[#90E0EF]/30 p-6 ">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center shadow-md">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">Surgery Details</h2>
                      <p className="text-sm text-[#0077B6] font-paragraphs">View surgery information</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-[#CAF0F8]/40 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-[#1E3E72]" />
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  <Row label="Name" value={surgery.name} />
                  <Row label="Specialization Required" value={surgery.specialization_required} />
                  <Row label="Estimated Duration" value={`${surgery.estimated_duration_hours} hours`} />
                  <Row label="Cost" value={<span className="font-semibold text-[#1E3E72]">{surgery.cost}</span>} />
                  <Row label="Risk Level" value={<span className="capitalize px-2 py-0.5 rounded-full text-xs bg-[#CAF0F8] text-[#1E3E72]">{surgery.risk_level}</span>} />
                  <Row label="Emergency" value={surgery.is_emergency_surgery ? 'Yes' : 'No'} />
                  <Row label="Active" value={<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${surgery.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{surgery.is_active ? 'Active' : 'Inactive'}</span>} />
                  <Row label="Description" value={<p className="whitespace-pre-wrap leading-relaxed">{surgery.description}</p>} />
                  <Row label="Preparation Instructions" value={<p className="whitespace-pre-wrap leading-relaxed">{surgery.preparation_instructions}</p>} />
                  <Row label="Post-surgery Care" value={<p className="whitespace-pre-wrap leading-relaxed">{surgery.post_surgery_care}</p>} />
                  {surgery.created_at && <Row label="Created" value={new Date(surgery.created_at).toLocaleString()} />}
                  {surgery.updated_at && <Row label="Updated" value={new Date(surgery.updated_at).toLocaleString()} />}
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <Button type="button" variant="outline" className="bg-[#03045E] cursor-pointer text-white" onClick={onClose}>Close</Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewSurgeryModal;


