import { AnimatePresence, motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import Button from '../atoms/Button';
import type { TestBookingData } from '../../services/medicalTestsService';

interface ViewTestBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: TestBookingData | null;
}

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="grid grid-cols-3 gap-3 py-2">
    <div className="col-span-1 text-sm font-semibold font-subtitles text-[#1E3E72]">{label}</div>
    <div className="col-span-2 text-sm text-gray-800">{value}</div>
  </div>
);

const ViewTestBookingModal: React.FC<ViewTestBookingModalProps> = ({ isOpen, onClose, booking }) => {
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
                        <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">Medical Test Booking</h2>
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
                    <Row label="Test" value={booking.medical_test?.name ?? booking.medical_test_id} />
                    <Row label="Doctor" value={booking.ordering_doctor?.name ?? booking.ordering_doctor_id} />
                    <Row label="Scheduled" value={new Date(booking.scheduled_date).toLocaleString()} />
                    <Row label="Status" value={booking.status} />
                    <Row label="Urgency" value={booking.urgency_level} />
                    <Row label="Instructions" value={<p className="whitespace-pre-wrap leading-relaxed">{booking.special_instructions}</p>} />
                    <Row label="Results" value={<p className="whitespace-pre-wrap leading-relaxed">{booking.test_results}</p>} />
                    <Row label="Result Values" value={<p className="whitespace-pre-wrap leading-relaxed">{booking.result_values}</p>} />
                    <Row label="Interpretation" value={<p className="whitespace-pre-wrap leading-relaxed">{booking.result_interpretation}</p>} />
                    <Row label="Abnormal Findings" value={<p className="whitespace-pre-wrap leading-relaxed">{booking.abnormal_findings}</p>} />
                    <Row label="Technician Notes" value={<p className="whitespace-pre-wrap leading-relaxed">{booking.technician_notes}</p>} />
                    <Row label="Report File" value={booking.report_file_path || '-'} />
                    <Row label="Result Date" value={booking.result_date ? new Date(booking.result_date).toLocaleString() : '-'} />
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

export default ViewTestBookingModal;


