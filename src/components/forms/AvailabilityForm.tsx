import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { X, Calendar, Clock } from 'lucide-react';
import { useCreateAvailability } from '../../hooks/useAppointments';
import { useAppStore } from '../../store/useAppStore';
import dayjs from '../../lib/dayjs';

interface AvailabilityFormData {
  date: string;
  startTime: string;
  endTime: string;
}

interface AvailabilityFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAppStore();
  const createAvailabilityMutation = useCreateAvailability();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AvailabilityFormData>({
    defaultValues: {
      date: dayjs().format('YYYY-MM-DD'),
      startTime: '09:00',
      endTime: '10:00',
    },
  });

  const startTime = watch('startTime');

  const onSubmit = async (data: AvailabilityFormData) => {
    if (!user?.id) {
      return;
    }

    try {
      const startDateTime = dayjs(`${data.date} ${data.startTime}`).toISOString();
      const endDateTime = dayjs(`${data.date} ${data.endTime}`).toISOString();

      await createAvailabilityMutation.mutateAsync({
        doctor_id: Number(user.id),
        start_time: startDateTime,
        end_time: endDateTime,
        is_booked: false,
        user_email: '',
      });

      reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error('Form submission error:', error);
    }
  };

  // Generate time options (9 AM to 6 PM in 30-minute intervals)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = dayjs().hour(hour).minute(minute).format('HH:mm');
        const label = dayjs().hour(hour).minute(minute).format('h:mm A');
        options.push({ value: time, label });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-headlines text-[#1E3E72]">Add Availability</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[#90E0EF]/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-[#1E3E72]" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date Field */}
        <div>
          <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date
          </label>
          <Controller
            name="date"
            control={control}
            rules={{
              required: 'Date is required',
              validate: (value) => {
                const selectedDate = dayjs(value);
                const today = dayjs().startOf('day');
                if (selectedDate.isBefore(today)) {
                  return 'Cannot select past dates';
                }
                return true;
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                className="w-full px-4 py-3 border border-[#90E0EF]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/50 focus:border-[#0077B6] font-paragraphs bg-white/50"
              />
            )}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-500 font-paragraphs">{errors.date.message}</p>
          )}
        </div>

        {/* Time Fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start Time */}
          <div>
            <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              Start Time
            </label>
            <Controller
              name="startTime"
              control={control}
              rules={{ required: 'Start time is required' }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 border border-[#90E0EF]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/50 focus:border-[#0077B6] font-paragraphs bg-white/50"
                >
                  {timeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-500 font-paragraphs">{errors.startTime.message}</p>
            )}
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-semibold font-subtitles text-[#1E3E72] mb-2">
              <Clock className="w-4 h-4 inline mr-2" />
              End Time
            </label>
            <Controller
              name="endTime"
              control={control}
              rules={{
                required: 'End time is required',
                validate: (value) => {
                  if (dayjs(`2000-01-01 ${value}`).isSameOrBefore(dayjs(`2000-01-01 ${startTime}`))) {
                    return 'End time must be after start time';
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 border border-[#90E0EF]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0077B6]/50 focus:border-[#0077B6] font-paragraphs bg-white/50"
                >
                  {timeOptions
                    .filter((option) => dayjs(`2000-01-01 ${option.value}`).isAfter(dayjs(`2000-01-01 ${startTime}`)))
                    .map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                </select>
              )}
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-500 font-paragraphs">{errors.endTime.message}</p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-[#90E0EF]/30 text-[#1E3E72] rounded-xl hover:bg-[#90E0EF]/10 transition-colors font-semibold font-subtitles"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || createAvailabilityMutation.isPending}
            className="flex-1 py-3 px-4 bg-gradient-to-r !bg-[#03045E] text-white rounded-xl hover:shadow-lg transition-all font-semibold font-subtitles disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || createAvailabilityMutation.isPending ? 'Creating...' : 'Add Availability'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilityForm; 