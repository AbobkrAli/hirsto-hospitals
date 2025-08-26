import React from 'react';
import { useTimezone } from '../hooks/useTimezone';

// Test component to verify timezone functionality
const TimezoneTest: React.FC = () => {
  const { formatters, timezone, displayName, pharmacyData } = useTimezone();

  // Sample UTC time for testing
  const sampleUTCTime = '2024-01-15T14:30:00Z';

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Timezone Test</h2>

      <div className="space-y-2 text-sm">
        <p><strong>Pharmacy:</strong> {pharmacyData?.name || 'Loading...'}</p>
        <p><strong>Location:</strong> {pharmacyData?.location || 'Not set'}</p>
        <p><strong>Detected Timezone:</strong> {timezone}</p>
        <p><strong>Display Name:</strong> {displayName}</p>

        <hr className="my-4" />

        <p><strong>Sample UTC Time:</strong> {sampleUTCTime}</p>
        <p><strong>Local Date:</strong> {formatters.date(sampleUTCTime)}</p>
        <p><strong>Local Time:</strong> {formatters.time(sampleUTCTime)}</p>
        <p><strong>Local DateTime:</strong> {formatters.dateTime(sampleUTCTime)}</p>
        <p><strong>DateTime with TZ:</strong> {formatters.dateTimeWithTz(sampleUTCTime)}</p>
        <p><strong>Relative:</strong> {formatters.relative(sampleUTCTime)}</p>
        <p><strong>TZ Abbreviation:</strong> {formatters.timezoneAbbr(sampleUTCTime)}</p>
      </div>
    </div>
  );
};

export default TimezoneTest;
