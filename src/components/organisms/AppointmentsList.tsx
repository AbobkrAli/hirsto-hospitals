import React from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import Card from '../molecules/Card';
import AppointmentCard from '../molecules/AppointmentCard';
import LoadingSpinner from '../atoms/LoadingSpinner';
import Button from '../atoms/Button';
import type { Appointment } from '../../services/authService';

export interface AppointmentsListProps {
  title: string;
  appointments: Appointment[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointment: Appointment) => void;
  variant?: 'booked' | 'available';
  emptyMessage?: string;
  className?: string;
}

// Skeleton component for appointment cards - matches AppointmentCard structure exactly
const AppointmentSkeleton: React.FC = () => (
  <div className="backdrop-blur-xl rounded-2xl shadow-lg border bg-white/80 border-[#90E0EF]/30 p-4 sm:p-6 transition-all hover:shadow-xl animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
      {/* Avatar circle - matches Calendar icon area in AppointmentCard */}
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#90E0EF]/50 bg-[#90E0EF]/30 flex-shrink-0"></div>

      {/* Content area - matches AppointmentCard text content */}
      <div className="flex-1 min-w-0">
        <div className="h-3 sm:h-4 bg-[#90E0EF]/30 rounded mb-2 w-24 sm:w-32"></div>
        <div className="h-3 bg-[#90E0EF]/20 rounded mb-1 w-36 sm:w-48"></div>
        <div className="h-3 bg-[#90E0EF]/20 rounded w-20 sm:w-24"></div>
      </div>

      {/* Actions area - matches status badge + buttons in AppointmentCard */}
      <div className="flex sm:flex-col sm:text-right items-center sm:items-end gap-2 sm:gap-0 sm:space-y-2 flex-shrink-0">
        <div className="h-5 sm:h-6 bg-[#90E0EF]/30 rounded-full w-12 sm:w-16"></div>
        <div className="flex gap-2">
          <div className="w-10 sm:w-12 h-5 sm:h-6 bg-[#90E0EF]/30 rounded"></div>
          <div className="w-10 sm:w-12 h-5 sm:h-6 bg-[#90E0EF]/30 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Loading skeleton list
const AppointmentsSkeletonList: React.FC<{ count: number }> = ({ count }) => (
  <div className="space-y-3 sm:space-y-4">
    {Array.from({ length: count }, (_, index) => (
      <AppointmentSkeleton key={index} />
    ))}
  </div>
);

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  title,
  appointments,
  isLoading = false,
  error = null,
  onRetry,
  onEdit,
  onDelete,
  variant = 'booked',
  emptyMessage = 'No appointments found',
  className = '',
}) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center py-2">
            <LoadingSpinner size="sm" message={`Loading ${title.toLowerCase()}...`} />
          </div>
          <AppointmentsSkeletonList count={variant === 'booked' ? 4 : 3} />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mb-2" />
          <span className="text-red-500 font-subtitles mb-4 text-sm sm:text-base text-center">{error.message}</span>
          {onRetry && (
            <Button variant="danger" onClick={onRetry} className="text-sm">
              Retry
            </Button>
          )}
        </div>
      );
    }

    if (appointments.length === 0) {
      return (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-[#90E0EF] mb-4" />
          <p className="text-[#0077B6] font-subtitles text-sm sm:text-base">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto">
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onEdit={onEdit}
            onDelete={onDelete}
            variant={variant}
          />
        ))}
      </div>
    );
  };

  return (
    <Card title={title} className={className}>
      {renderContent()}
    </Card>
  );
};

export default AppointmentsList; 