import { AnimatePresence, motion } from 'framer-motion';
import { X, ClipboardList } from 'lucide-react';
import Button from '../atoms/Button';
import type { FollowUpData } from '../../services/followUpsService';

interface ViewFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  followUp: FollowUpData | null;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-3 py-2">
    <div className="col-span-1 text-sm font-semibold font-subtitles text-[#1E3E72]">{label}</div>
    <div className="col-span-2 text-sm text-gray-800">{value}</div>
  </div>
);

const ViewFollowUpModal: React.FC<ViewFollowUpModalProps> = ({ isOpen, onClose, followUp }) => {
  return (
    <AnimatePresence>
      {isOpen && followUp && (
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
              <div className="relative backdrop-blur-xl rounded-2xl !max-h-[90vh] overflow-y-auto shadow-2xl border bg-white/90 border-[#90E0EF]/40 p-0 ">
                <div className="absolute -inset-px rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(202, 240, 248, 0.35), rgba(144, 224, 239, 0.15))' }} />
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center shadow-md">
                        <ClipboardList className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">Follow Up Details</h2>
                        <p className="text-sm text-[#0077B6] font-paragraphs">View follow up information</p>
                      </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#CAF0F8]/40 rounded-lg transition-colors">
                      <X className="w-5 h-5 text-[#1E3E72]" />
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <Row label="Patient" value={`${followUp.patient_name} (${followUp.patient_email})`} />
                    <Row label="Doctor" value={followUp.doctor?.name ?? '-'} />
                    <Row label="Type" value={<span className="capitalize">{followUp.follow_up_type}</span>} />
                    <Row label="Priority" value={<span className="capitalize">{followUp.priority_level}</span>} />
                    <Row label="Initial Consultation" value={new Date(followUp.initial_consultation_date).toLocaleString()} />
                    <Row label="Next Appointment" value={new Date(followUp.next_appointment_date).toLocaleString()} />
                    <Row label="Chief Complaint" value={<p className="whitespace-pre-wrap leading-relaxed">{followUp.chief_complaint}</p>} />
                    <Row label="Current Symptoms" value={<p className="whitespace-pre-wrap leading-relaxed">{followUp.current_symptoms}</p>} />
                    <Row label="Vital Signs" value={<p className="whitespace-pre-wrap leading-relaxed">{followUp.vital_signs}</p>} />
                    <Row label="Current Medications" value={<p className="whitespace-pre-wrap leading-relaxed">{followUp.current_medications}</p>} />
                    <Row label="Treatment Plan" value={<p className="whitespace-pre-wrap leading-relaxed">{followUp.treatment_plan}</p>} />
                    <Row label="Follow-up Frequency" value={followUp.follow_up_frequency} />
                    <Row label="Total Sessions Planned" value={followUp.total_sessions_planned} />
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

export default ViewFollowUpModal;


