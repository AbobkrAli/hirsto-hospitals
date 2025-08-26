import React from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, X } from 'lucide-react';
import Button from '../atoms/Button';
import { InputFormField, SelectFormField } from '../molecules/FormField';
import dayjs from '../../lib/dayjs';

interface AvailabilityFormData {
  date: string;
  startTime: string;
  endTime: string;
}

interface AvailabilityFormProps {
  onSubmit: (data: AvailabilityFormData) => Promise<void>;
  onClose: () => void;
}

const AvailabilityForm: React.FC<AvailabilityFormProps> = ({
  onSubmit: onSubmitProp,
  onClose,
}) => {
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
    reset,
    control,
  } = useForm<AvailabilityFormData>({
    defaultValues: {
      date: '',
      startTime: '',
      endTime: '',
    },
  });

  const startTime = watch('startTime');

  const onSubmit = async (data: AvailabilityFormData) => {
    try {
      await onSubmitProp({
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
      });

      reset();
      onClose();
    } catch (error) {
      console.error('Error creating availability:', error);
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
  const filteredEndTimeOptions = timeOptions.filter((option) =>
    dayjs(`2000-01-01 ${option.value}`).isAfter(dayjs(`2000-01-01 ${startTime}`))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold font-headlines text-[#1E3E72]">Add Availability</h2>
        <Button variant="ghost" size="sm" onClick={onClose} icon={X} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date Field */}
        <InputFormField
          name="date"
          control={control}
          label="Date"
          type="date"
          icon={Calendar}
          rules={{
            required: 'Date is required',
            validate: (value: string) => {
              const selectedDate = dayjs(value);
              const today = dayjs().startOf('day');
              if (selectedDate.isBefore(today)) {
                return 'Cannot select past dates';
              }
              return true;
            },
          }}
        />

        {/* Time Fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start Time */}
          <SelectFormField
            name="startTime"
            control={control}
            label="Start Time"
            icon={Clock}
            options={timeOptions}
            rules={{ required: 'Start time is required' }}
          />

          {/* End Time */}
          <SelectFormField
            name="endTime"
            control={control}
            label="End Time"
            icon={Clock}
            options={filteredEndTimeOptions}
            rules={{
              required: 'End time is required',
              validate: (value: string) => {
                if (!startTime || !value) return true;
                const start = dayjs(`2000-01-01 ${startTime}`);
                const end = dayjs(`2000-01-01 ${value}`);
                if (end.isSameOrBefore(start)) {
                  return 'End time must be after start time';
                }
                return true;
              },
            }}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="flex-1"
          >
            Add Availability
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AvailabilityForm; 