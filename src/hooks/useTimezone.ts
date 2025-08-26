import { useMemo } from 'react';
import { usePharmacyData } from './usePharmacyData';
import { createLocalizedFormatters, getDoctorTimezone, getTimezoneDisplayName } from '../utils/timezoneUtils';

/**
 * Hook to get timezone-aware formatters based on the current pharmacy's location
 */
export const useTimezone = () => {
  const { data: pharmacyData } = usePharmacyData();

  const timezone = useMemo(() => {
    if (!pharmacyData) return 'Africa/Cairo';
    return getDoctorTimezone({
      location: pharmacyData.location || 'Cairo, Egypt'
    });
  }, [pharmacyData]);

  const formatters = useMemo(() => {
    return createLocalizedFormatters(pharmacyData ? {
      location: pharmacyData.location || 'Cairo, Egypt'
    } : undefined);
  }, [pharmacyData]);

  const displayName = useMemo(() => {
    return getTimezoneDisplayName(timezone);
  }, [timezone]);

  return {
    timezone,
    displayName,
    formatters,
    pharmacyData
  };
};
