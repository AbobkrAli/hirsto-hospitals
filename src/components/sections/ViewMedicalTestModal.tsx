import { AnimatePresence, motion } from 'framer-motion';
import { X, Beaker } from 'lucide-react';
import Button from '../atoms/Button';
import type { MedicalTestData } from '../../services/medicalTestsService';

interface ViewMedicalTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  test: MedicalTestData | null;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-3 py-2">
    <div className="col-span-1 text-sm font-semibold font-subtitles text-[#1E3E72]">{label}</div>
    <div className="col-span-2 text-sm text-gray-800">{value}</div>
  </div>
);

const ViewMedicalTestModal: React.FC<ViewMedicalTestModalProps> = ({ isOpen, onClose, test }) => {
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
            <div className="w-full max-w-3xl  ">
              <div className="relative backdrop-blur-xl rounded-2xl !max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl border bg-white/90 border-[#90E0EF]/40 p-0 ">
                <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(202, 240, 248, 0.35), rgba(144, 224, 239, 0.15))' }} />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center shadow-md">
                        <Beaker className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">Medical Test Details</h2>
                        <p className="text-sm text-[#0077B6] font-paragraphs">View test information</p>
                      </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#CAF0F8]/40 rounded-lg transition-colors">
                      <X className="w-5 h-5 text-[#1E3E72]" />
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <Row label="Name" value={test.name} />
                    <Row label="Type" value={<span className="capitalize">{test.test_type}</span>} />
                    <Row label="Department" value={<span className="capitalize">{test.department}</span>} />
                    <Row label="Duration" value={`${test.duration_minutes} minutes`} />
                    <Row label="Cost" value={<span className="font-semibold text-[#1E3E72]">{test.cost}</span>} />
                    <Row label="Fasting Required" value={test.fasting_required ? 'Yes' : 'No'} />
                    <Row label="Fasting Hours" value={test.fasting_hours} />
                    <Row label="Sample Type" value={test.sample_type} />
                    <Row label="Normal Range" value={test.normal_range} />
                    <Row label="Preparation Instructions" value={<p className="whitespace-pre-wrap leading-relaxed">{test.preparation_instructions}</p>} />
                    <Row label="Active" value={<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${test.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{test.is_active ? 'Active' : 'Inactive'}</span>} />
                    {test.created_at && <Row label="Created" value={new Date(test.created_at).toLocaleString()} />}
                    {test.updated_at && <Row label="Updated" value={new Date(test.updated_at).toLocaleString()} />}
                  </div>

                  <div className="flex justify-end gap-3 pt-6">
                    <Button type="button" variant="outline" className="bg-[#03045E] cursor-pointer text-white" onClick={onClose}>Close</Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ViewMedicalTestModal;


