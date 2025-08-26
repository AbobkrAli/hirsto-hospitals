import React from 'react';
import { Calendar, Clock, Mail, User, Video } from 'lucide-react';
import { formatters } from '../../lib/dayjs';
import dayjs from 'dayjs';
import type { AppointmentHistory } from '../../services/historyService';

export interface HistoryCardProps {
  appointment: AppointmentHistory;
  onViewDetails?: (appointment: AppointmentHistory) => void;
  onJoinMeeting?: (appointment: AppointmentHistory) => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  appointment,
  onViewDetails,
  onJoinMeeting,
}) => {
  const appointmentDate = dayjs(appointment.start_time).tz('Africa/Cairo');
  const isToday = appointmentDate.format('YYYY-MM-DD') === dayjs().tz('Africa/Cairo').format('YYYY-MM-DD');
  const isPast = appointmentDate.isBefore(dayjs().tz('Africa/Cairo'));

  // Get patient initials from email
  const getPatientInitials = (email: string) => {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + (name.charAt(1) || '').toUpperCase();
  };

  return (
    <div className="relative overflow-hidden backdrop-blur-xl rounded-2xl shadow-lg border transition-all duration-300 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-blue-200/50 hover:shadow-xl cursor-pointer group">
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

      {/* Card content */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          {/* Avatar/Icon section */}
          <div className="relative flex-shrink-0 self-start">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-500/20 backdrop-blur-sm border border-white/20 shadow-lg group-hover:shadow-xl transition-all duration-300 flex items-center justify-center">
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-base sm:text-lg font-bold text-blue-600">
                  {getPatientInitials(appointment.user_email)}
                </span>
              </div>
            </div>

            {/* Video call indicator */}
            <div className="absolute -top-1 -right-1">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <Video className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title and status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-[#1E3E72] truncate group-hover:text-[#0077B6] transition-colors">
                  {appointment.user_email.split('@')[0]}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-500 truncate">
                    {appointment.user_email}
                  </span>
                </div>
              </div>

              {/* Status badge */}
              <span className="px-2 sm:px-3 py-1 text-xs font-bold rounded-full shadow-sm flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white backdrop-blur-sm border border-white/20">
                Completed
              </span>
            </div>

            {/* Time information */}
            <div className="space-y-2">
              {/* Date and time */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0077B6] flex-shrink-0" />
                  <span className="font-medium text-[#1E3E72] truncate">
                    {formatters.date(appointment.start_time)}
                    {isToday && (
                      <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full font-semibold">
                        Today
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#0077B6] flex-shrink-0" />
                  <span className="font-medium text-[#1E3E72] truncate">
                    {appointment.appointment_time}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                    {appointment.duration_minutes}min
                  </span>
                </div>
              </div>

              {/* Room ID */}
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-[#0077B6] flex-shrink-0" />
                <span className="text-[#0077B6] font-medium">
                  Room: {appointment.room_id}
                </span>
              </div>

              {/* Relative time */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-xs text-gray-500 font-medium">
                  {formatters.relative(appointment.start_time)}
                </span>
                {isPast && (
                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full self-start sm:self-auto">
                    Past Appointment
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions section */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20 flex justify-end gap-2">
          {appointment.room_id && onJoinMeeting && (
            <button
              onClick={() => onJoinMeeting(appointment)}
              className="text-xs px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-1"
            >
              <Video className="w-3 h-3" />
              Join Meeting
            </button>
          )}
          <button
            onClick={() => onViewDetails?.(appointment)}
            className="text-xs px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default HistoryCard; 