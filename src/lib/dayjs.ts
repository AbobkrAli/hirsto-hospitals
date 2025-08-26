import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs with plugins
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(customParseFormat);

// Set default timezone to Cairo/Africa timezone
dayjs.tz.setDefault('Africa/Cairo');

export default dayjs;

// Utility functions for common date operations - all use Cairo timezone
export const formatters = {
  date: (date: string | Date | dayjs.Dayjs) => dayjs(date).tz('Africa/Cairo').format('MMM DD, YYYY'),
  time: (date: string | Date | dayjs.Dayjs) => dayjs(date).tz('Africa/Cairo').format('h:mm A'),
  dateTime: (date: string | Date | dayjs.Dayjs) => dayjs(date).tz('Africa/Cairo').format('MMM DD, YYYY h:mm A'),
  iso: (date: string | Date | dayjs.Dayjs) => dayjs(date).toISOString(),
  relative: (date: string | Date | dayjs.Dayjs) => dayjs(date).tz('Africa/Cairo').fromNow(),
};

export const getWeekDays = (startDate?: string | Date | dayjs.Dayjs) => {
  const start = startDate ? dayjs(startDate).tz('Africa/Cairo').startOf('week').add(1, 'day') : dayjs().tz('Africa/Cairo').startOf('week').add(1, 'day'); // Monday
  return Array.from({ length: 7 }, (_, i) => start.add(i, 'day'));
};

export const isToday = (date: string | Date | dayjs.Dayjs) => dayjs(date).tz('Africa/Cairo').isSame(dayjs().tz('Africa/Cairo'), 'day');
export const isTomorrow = (date: string | Date | dayjs.Dayjs) => dayjs(date).tz('Africa/Cairo').isSame(dayjs().tz('Africa/Cairo').add(1, 'day'), 'day');
export const isYesterday = (date: string | Date | dayjs.Dayjs) => dayjs(date).tz('Africa/Cairo').isSame(dayjs().tz('Africa/Cairo').subtract(1, 'day'), 'day'); 