import { AnimatePresence, motion } from 'framer-motion';
import { X, Eye, User } from 'lucide-react';
import type { DoctorData } from '../../services/doctorsService';

interface ViewDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorData | null;
}

const Field: React.FC<{ label: string; value?: string | number | boolean }> = ({ label, value }) => (
  <div>
    <p className="text-xs font-semibold font-subtitles text-[#1E3E72] mb-1">{label}</p>
    <p className="text-sm text-[#1E3E72] bg-[#CAF0F8]/30 border border-[#90E0EF]/40 rounded-lg px-3 py-2">
      {value === undefined || value === null || value === '' ? '-' : String(value)}
    </p>
  </div>
);

const ViewDoctorModal: React.FC<ViewDoctorModalProps> = ({ isOpen, onClose, doctor }) => {
  return (
    <AnimatePresence>
      {isOpen && doctor && (
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
            <div className="w-full max-w-3xl">
              <div className="backdrop-blur-xl rounded-2xl !max-h-[90vh] overflow-y-auto shadow-2xl border bg-white/90 border-[#90E0EF]/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br !bg-[#03045E] flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold font-headlines text-[#1E3E72]">Doctor Details</h2>
                      <p className="text-sm text-[#0077B6] font-paragraphs">Profile overview</p>
                    </div>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-[#CAF0F8]/30 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-[#1E3E72]" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="bg-[#CAF0F8]/30 border border-[#90E0EF]/40 rounded-2xl p-4 flex flex-col items-center text-center">
                      <div className="w-20 h-20 rounded-full bg-[#CAF0F8] border border-[#90E0EF]/50 flex items-center justify-center overflow-hidden">
                        {doctor.profile_image_url || doctor.image_url ? (
                          <img src={doctor.profile_image_url || doctor.image_url} alt={doctor.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-8 h-8 text-[#1E3E72]" />
                        )}
                      </div>
                      <p className="mt-3 text-base font-semibold text-[#1E3E72]">{doctor.name}</p>
                      <p className="text-sm text-[#0077B6]">{doctor.specialization || '—'}</p>
                      <span className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${doctor.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {doctor.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Email" value={doctor.email} />
                    <Field label="Phone Number" value={doctor.phone_number} />
                    <Field label="Age" value={doctor.age} />
                    <Field label="Years of Experience" value={doctor.years_of_experience} />
                    <Field label="Location" value={doctor.location} />
                    <Field label="Nationality" value={doctor.nationality} />
                    <Field label="Languages" value={doctor.languages} />
                    <Field label="Doctor Type" value={doctor.doctor_type} />
                    <div className="md:col-span-2">
                      <p className="text-xs font-semibold font-subtitles text-[#1E3E72] mb-1">Bio</p>
                      <p className="text-sm text-[#1E3E72] bg-[#CAF0F8]/30 border border-[#90E0EF]/40 rounded-lg px-3 py-3 leading-6 whitespace-pre-line">
                        {doctor.bio || '-'}
                      </p>
                    </div>
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

export default ViewDoctorModal;


