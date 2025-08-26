import React from 'react';
import Card from '../molecules/Card';
import LoadingSpinner from '../atoms/LoadingSpinner';
import dayjs, { getWeekDays } from '../../lib/dayjs';
import { useTimezone } from '../../hooks/useTimezone';
import type { Appointment } from '../../services/authService';

export interface WeeklyScheduleProps {
  appointments?: Appointment[];
  isLoading?: boolean;
  className?: string;
}

// Skeleton component for weekly schedule - matches WeeklySchedule structure exactly
const WeeklyScheduleSkeleton: React.FC = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
    {Array.from({ length: 7 }, (_, index) => (
      <div key={index} className="text-center">
        {/* Day header - matches actual day header structure */}
        <div className="font-semibold font-subtitles text-[#1E3E72] mb-2">
          <div className="h-3 sm:h-4 bg-[#90E0EF]/30 rounded mb-1 w-6 sm:w-8 mx-auto"></div>
          <div className="text-xs text-[#0077B6] font-paragraphs">
            <div className="h-2 sm:h-3 bg-[#90E0EF]/20 rounded w-4 sm:w-6 mx-auto"></div>
          </div>
        </div>
        {/* Day content - matches actual day content structure */}
        <div className="bg-gradient-to-r from-[#CAF0F8]/30 to-[#90E0EF]/30 rounded-lg p-2 min-h-[80px] sm:min-h-[100px]">
          <div className="space-y-1">
            {Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, i) => (
              <div
                key={i}
                className="h-4 sm:h-6 bg-[#90E0EF]/40 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  appointments = [],
  isLoading = false,
  className = '',
}) => {
  const { formatters } = useTimezone();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-center py-2">
            <LoadingSpinner size="sm" message="Loading weekly schedule..." />
          </div>
          <WeeklyScheduleSkeleton />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
        {getWeekDays().map((day) => {
          const dayName = day.format('ddd');

          // Get appointments for this day
          const dayAppointments = appointments.filter(apt => {
            return dayjs(apt.start_time).isSame(day, 'day');
          });

          return (
            <div key={day.format('YYYY-MM-DD')} className="text-center">
              <div className="font-semibold font-subtitles text-[#1E3E72] mb-2">
                <div className="text-sm sm:text-base">{dayName}</div>
                <div className="text-xs text-[#0077B6] font-paragraphs">
                  {day.format('DD')}
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#CAF0F8]/30 to-[#90E0EF]/30 rounded-lg p-2 min-h-[80px] sm:min-h-[100px]">
                <div className="space-y-1">
                  {dayAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className={`text-white text-xs p-1 rounded font-paragraphs transition-all hover:shadow-sm cursor-pointer truncate ${apt.is_booked ? 'bg-[#0077B6] hover:bg-[#005f8a]' : 'bg-[#1E3E72] hover:bg-[#2a4a7a]'
                        }`}
                      title={`${formatters.time(apt.start_time)} - ${formatters.time(apt.end_time)}${apt.is_booked ? ` (${apt.user_email})` : ''}`}
                    >
                      <div className="truncate">
                        {formatters.time(apt.start_time)}
                      </div>
                    </div>
                  ))}
                  {dayAppointments.length === 0 && (
                    <div className="text-xs text-[#0077B6]/50 font-paragraphs py-2">
                      <span className="hidden sm:inline">No appointments</span>
                      <span className="sm:hidden">Free</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card
      title="Weekly Schedule"
      subtitle="Your appointments this week"
      className={className}
    >
      {renderContent()}
    </Card>
  );
};

export default WeeklySchedule; 