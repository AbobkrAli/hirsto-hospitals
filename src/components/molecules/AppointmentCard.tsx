import React from 'react';
import { Calendar, Clock, Mail, Edit, Trash2 } from 'lucide-react';
import Button from '../atoms/Button';
import dayjs from 'dayjs';
import { useTimezone } from '../../hooks/useTimezone';
import type { Appointment } from '../../services/authService';

export interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  showActions?: boolean;
  variant?: 'booked' | 'available';
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const { formatters } = useTimezone();

  const isBooked = appointment.is_booked;
  const startTime = dayjs(appointment.start_time);
  const endTime = dayjs(appointment.end_time);
  const duration = endTime.diff(startTime, 'minute');
  const isUpcoming = startTime.isAfter(dayjs());
  const isToday = startTime.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD');
  const isCurrent = dayjs().isAfter(startTime) && dayjs().isBefore(endTime);

  // Get patient initials or use default
  const getPatientInitials = (email: string | null) => {
    if (!email) return 'P';
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + (name.charAt(1) || '').toUpperCase();
  };

  // Status configuration
  const getStatusConfig = () => {
    if (isCurrent) {
      return {
        badge: 'In Progress',
        bgColor: 'bg-gradient-to-r from-green-500 to-emerald-500',
        textColor: 'text-white',
        iconBg: 'bg-green-500/20',
        iconColor: 'text-green-600',
        cardBg: 'bg-gradient-to-br from-green-50/80 to-emerald-50/80',
        borderColor: 'border-green-200/50',
        shadowColor: 'shadow-green-100/50'
      };
    } else if (isBooked) {
      return {
        badge: 'Booked',
        bgColor: 'bg-gradient-to-r from-blue-500 to-indigo-500',
        textColor: 'text-white',
        iconBg: 'bg-blue-500/20',
        iconColor: 'text-blue-600',
        cardBg: 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80',
        borderColor: 'border-blue-200/50',
        shadowColor: 'shadow-blue-100/50'
      };
    } else {
      return {
        badge: 'Available',
        bgColor: 'bg-gradient-to-r from-[#0077B6] to-[#00B4D8]',
        textColor: 'text-white',
        iconBg: 'bg-[#0077B6]/20',
        iconColor: 'text-[#0077B6]',
        cardBg: 'bg-gradient-to-br from-[#CAF0F8]/80 to-[#90E0EF]/80',
        borderColor: 'border-[#90E0EF]/50',
        shadowColor: 'shadow-[#90E0EF]/30'
      };
    }
  };

  const statusConfig = getStatusConfig();

  const renderActions = () => {
    if (!showActions) return null;

    if (isBooked) {
      return (
        <div className="">

        </div>
      );
    } else {
      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon={Edit}
            onClick={() => onEdit?.(appointment)}
            className="text-xs h-7 sm:h-8 px-2 sm:px-3 hover:bg-[#0077B6]/10 hover:text-[#0077B6] border border-[#0077B6]/20"
          >
            <span className="hidden sm:inline">Edit</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => onDelete?.(appointment)}
            className="text-xs h-7 sm:h-8 px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      );
    }
  };

  return (
    <div
      className={`
        relative overflow-hidden backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl
        ${statusConfig.cardBg} ${statusConfig.borderColor} ${statusConfig.shadowColor}
        border transition-all duration-300 cursor-pointer group
      `}
    >
      {/* Gradient accent bar */}
      <div className={`absolute top-0 left-0 w-full h-1 ${statusConfig.bgColor}`} />

      {/* Card content */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          {/* Avatar/Icon section */}
          <div className="relative flex-shrink-0 self-start">
            <div
              className={`
                w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center
                ${statusConfig.iconBg} backdrop-blur-sm border border-white/20
                shadow-lg group-hover:shadow-xl transition-all duration-300
              `}
            >
              {isBooked ? (
                <div className="flex items-center justify-center w-full h-full">
                  <span className={`text-base sm:text-lg font-bold ${statusConfig.iconColor}`}>
                    {getPatientInitials(appointment.user_email)}
                  </span>
                </div>
              ) : (
                <Calendar className={`w-6 h-6 sm:w-7 sm:h-7 ${statusConfig.iconColor}`} />
              )}
            </div>

            {/* Current appointment pulse indicator */}
            {isCurrent && (
              <div className="absolute -top-1 -right-1">
                <div className="relative">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-pulse" />
                  <div className="absolute inset-0 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full animate-ping opacity-75" />
                </div>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Title and status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-[#1E3E72] truncate group-hover:text-[#0077B6] transition-colors">
                  {isBooked ? (appointment.user_email?.split('@')[0] || 'Patient') : 'Available Slot'}
                </h3>
                {isBooked && appointment.user_email && (
                  <div className="flex items-center gap-1 mt-1">
                    <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-500 truncate">
                      {appointment.user_email}
                    </span>
                  </div>
                )}
              </div>

              {/* Status badge */}
              <span
                className={`
                  px-2 sm:px-3 py-1 text-xs font-bold rounded-full shadow-sm flex-shrink-0
                  ${statusConfig.bgColor} ${statusConfig.textColor}
                  backdrop-blur-sm border border-white/20
                `}
              >
                {statusConfig.badge}
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
                    {formatters.time(appointment.start_time)} - {formatters.time(appointment.end_time)}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                    {duration}min
                  </span>
                </div>
              </div>

              {/* Relative time */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <span className="text-xs text-gray-500 font-medium">
                  {isCurrent ? '🟢 In progress' : formatters.relative(appointment.start_time)}
                </span>
                {isUpcoming && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full self-start sm:self-auto">
                    Upcoming
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions section */}
        {showActions && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20 flex justify-end">
            {renderActions()}
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default AppointmentCard; 