import { AnimatePresence, motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import Button from '../atoms/Button';
import type { SurgeryBookingData } from '../../services/surgeriesService';

interface ViewSurgeryBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: SurgeryBookingData | null;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-3 py-2">
    <div className="col-span-1 text-sm font-semibold font-subtitles text-[#1E3E72]">{label}</div>
    <div className="col-span-2 text-sm text-gray-800">{value}</div>
  </div>
);

const ViewSurgeryBookingModal: React.FC<ViewSurgeryBookingModalProps> = ({ isOpen, onClose, booking }) => {
  return (
    <AnimatePresence>
      {isOpen && booking && (
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
              <div className="relative backdrop-blur-xl rounded-2xl !max-h-[90vh] overflow-y-auto overflow-x-hidden shadow-2xl border bg-white/90 border-[#90E0EF]/40 p-0 ">
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center shadow-md">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">Surgery Booking</h2>
                        <p className="text-sm text-[#0077B6] font-paragraphs">View booking information</p>
                      </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#CAF0F8]/40 rounded-lg transition-colors">
                      <X className="w-5 h-5 text-[#1E3E72]" />
                    </button>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <Row label="Patient" value={`${booking.patient_name} (${booking.patient_email})`} />
                    <Row label="Phone" value={booking.patient_phone} />
                    <Row label="Surgery" value={booking.surgery?.name ?? booking.surgery_id} />
                    <Row label="Surgeon" value={booking.surgeon?.name ?? booking.surgeon_id} />
                    <Row label="Scheduled" value={new Date(booking.scheduled_date).toLocaleString()} />
                    <Row label="Estimated End" value={new Date(booking.estimated_end_time).toLocaleString()} />
                    <Row label="Status" value={booking.status} />
                    <Row label="Urgency" value={booking.urgency_level} />
                    <Row label="Pre Notes" value={<p className="whitespace-pre-wrap leading-relaxed">{booking.pre_surgery_notes}</p>} />
                    <Row label="Surgery Notes" value={<p className="whitespace-pre-wrap leading-relaxed">{booking.surgery_notes}</p>} />
                    <Row label="Post Notes" value={<p className="whitespace-pre-wrap leading-relaxed">{booking.post_surgery_notes}</p>} />
                    <Row label="Complications" value={<p className="whitespace-pre-wrap leading-relaxed">{booking.complications}</p>} />
                    <Row label="Room" value={booking.room_number} />
                    <Row label="Anesthesia" value={booking.anesthesia_type} />
                    <Row label="Consent Signed" value={booking.consent_form_signed ? 'Yes' : 'No'} />
                    <Row label="Insurance Approved" value={booking.insurance_approved ? 'Yes' : 'No'} />
                    <Row label="Total Cost" value={booking.total_cost} />
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

export default ViewSurgeryBookingModal;


