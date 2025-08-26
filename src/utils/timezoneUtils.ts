import dayjs from '../lib/dayjs';

// Mapping of countries/nationalities to their primary timezone
export const countryToTimezone: Record<string, string> = {
  // Middle East & North Africa
  'Egyptian': 'Africa/Cairo',
  'Saudi': 'Asia/Riyadh',
  'UAE': 'Asia/Dubai',
  'Emirati': 'Asia/Dubai',
  'Kuwaiti': 'Asia/Kuwait',
  'Qatari': 'Asia/Qatar',
  'Bahraini': 'Asia/Bahrain',
  'Omani': 'Asia/Muscat',
  'Jordanian': 'Asia/Amman',
  'Lebanese': 'Asia/Beirut',
  'Syrian': 'Asia/Damascus',
  'Iraqi': 'Asia/Baghdad',
  'Palestinian': 'Asia/Gaza',
  'Israeli': 'Asia/Jerusalem',
  'Moroccan': 'Africa/Casablanca',
  'Algerian': 'Africa/Algiers',
  'Tunisian': 'Africa/Tunis',
  'Libyan': 'Africa/Tripoli',
  'Sudanese': 'Africa/Khartoum',

  // Europe
  'British': 'Europe/London',
  'German': 'Europe/Berlin',
  'French': 'Europe/Paris',
  'Italian': 'Europe/Rome',
  'Spanish': 'Europe/Madrid',
  'Portuguese': 'Europe/Lisbon',
  'Dutch': 'Europe/Amsterdam',
  'Belgian': 'Europe/Brussels',
  'Swiss': 'Europe/Zurich',
  'Austrian': 'Europe/Vienna',
  'Swedish': 'Europe/Stockholm',
  'Norwegian': 'Europe/Oslo',
  'Danish': 'Europe/Copenhagen',
  'Finnish': 'Europe/Helsinki',
  'Polish': 'Europe/Warsaw',
  'Czech': 'Europe/Prague',
  'Hungarian': 'Europe/Budapest',
  'Greek': 'Europe/Athens',
  'Turkish': 'Europe/Istanbul',
  'Russian': 'Europe/Moscow',
  'Ukrainian': 'Europe/Kiev',

  // North America
  'American': 'America/New_York',
  'Canadian': 'America/Toronto',
  'Mexican': 'America/Mexico_City',

  // South America
  'Brazilian': 'America/Sao_Paulo',
  'Argentinian': 'America/Argentina/Buenos_Aires',
  'Chilean': 'America/Santiago',
  'Colombian': 'America/Bogota',
  'Peruvian': 'America/Lima',
  'Venezuelan': 'America/Caracas',

  // Asia
  'Chinese': 'Asia/Shanghai',
  'Japanese': 'Asia/Tokyo',
  'Korean': 'Asia/Seoul',
  'Indian': 'Asia/Kolkata',
  'Pakistani': 'Asia/Karachi',
  'Bangladeshi': 'Asia/Dhaka',
  'Thai': 'Asia/Bangkok',
  'Vietnamese': 'Asia/Ho_Chi_Minh',
  'Malaysian': 'Asia/Kuala_Lumpur',
  'Singaporean': 'Asia/Singapore',
  'Indonesian': 'Asia/Jakarta',
  'Filipino': 'Asia/Manila',

  // Africa
  'South African': 'Africa/Johannesburg',
  'Nigerian': 'Africa/Lagos',
  'Kenyan': 'Africa/Nairobi',
  'Ethiopian': 'Africa/Addis_Ababa',
  'Ghanaian': 'Africa/Accra',
  'Ivorian': 'Africa/Abidjan',

  // Oceania
  'Australian': 'Australia/Sydney',
  'New Zealander': 'Pacific/Auckland',
};

// Alternative mapping for location-based detection (city/country names)
export const locationToTimezone: Record<string, string> = {
  // Middle East & North Africa
  'Cairo': 'Africa/Cairo',
  'Egypt': 'Africa/Cairo',
  'Alexandria': 'Africa/Cairo',
  'Giza': 'Africa/Cairo',
  'Dubai': 'Asia/Dubai',
  'Abu Dhabi': 'Asia/Dubai',
  'Sharjah': 'Asia/Dubai',
  'UAE': 'Asia/Dubai',
  'United Arab Emirates': 'Asia/Dubai',
  'Riyadh': 'Asia/Riyadh',
  'Jeddah': 'Asia/Riyadh',
  'Mecca': 'Asia/Riyadh',
  'Saudi Arabia': 'Asia/Riyadh',
  'Kuwait City': 'Asia/Kuwait',
  'Kuwait': 'Asia/Kuwait',
  'Doha': 'Asia/Qatar',
  'Qatar': 'Asia/Qatar',
  'Manama': 'Asia/Bahrain',
  'Bahrain': 'Asia/Bahrain',
  'Muscat': 'Asia/Muscat',
  'Oman': 'Asia/Muscat',
  'Amman': 'Asia/Amman',
  'Jordan': 'Asia/Amman',
  'Beirut': 'Asia/Beirut',
  'Lebanon': 'Asia/Beirut',
  'Damascus': 'Asia/Damascus',
  'Syria': 'Asia/Damascus',
  'Baghdad': 'Asia/Baghdad',
  'Iraq': 'Asia/Baghdad',
  'Casablanca': 'Africa/Casablanca',
  'Rabat': 'Africa/Casablanca',
  'Morocco': 'Africa/Casablanca',
  'Algiers': 'Africa/Algiers',
  'Algeria': 'Africa/Algiers',
  'Tunis': 'Africa/Tunis',
  'Tunisia': 'Africa/Tunis',
  'Tripoli': 'Africa/Tripoli',
  'Libya': 'Africa/Tripoli',

  // Europe
  'London': 'Europe/London',
  'Manchester': 'Europe/London',
  'Birmingham': 'Europe/London',
  'United Kingdom': 'Europe/London',
  'UK': 'Europe/London',
  'England': 'Europe/London',
  'Scotland': 'Europe/London',
  'Wales': 'Europe/London',
  'Paris': 'Europe/Paris',
  'Lyon': 'Europe/Paris',
  'Marseille': 'Europe/Paris',
  'France': 'Europe/Paris',
  'Berlin': 'Europe/Berlin',
  'Munich': 'Europe/Berlin',
  'Hamburg': 'Europe/Berlin',
  'Germany': 'Europe/Berlin',
  'Rome': 'Europe/Rome',
  'Milan': 'Europe/Rome',
  'Naples': 'Europe/Rome',
  'Italy': 'Europe/Rome',
  'Madrid': 'Europe/Madrid',
  'Barcelona': 'Europe/Madrid',
  'Valencia': 'Europe/Madrid',
  'Spain': 'Europe/Madrid',
  'Amsterdam': 'Europe/Amsterdam',
  'Rotterdam': 'Europe/Amsterdam',
  'Netherlands': 'Europe/Amsterdam',
  'Holland': 'Europe/Amsterdam',
  'Brussels': 'Europe/Brussels',
  'Belgium': 'Europe/Brussels',
  'Zurich': 'Europe/Zurich',
  'Geneva': 'Europe/Zurich',
  'Switzerland': 'Europe/Zurich',
  'Vienna': 'Europe/Vienna',
  'Austria': 'Europe/Vienna',
  'Stockholm': 'Europe/Stockholm',
  'Sweden': 'Europe/Stockholm',
  'Oslo': 'Europe/Oslo',
  'Norway': 'Europe/Oslo',
  'Copenhagen': 'Europe/Copenhagen',
  'Denmark': 'Europe/Copenhagen',
  'Helsinki': 'Europe/Helsinki',
  'Finland': 'Europe/Helsinki',
  'Warsaw': 'Europe/Warsaw',
  'Poland': 'Europe/Warsaw',
  'Prague': 'Europe/Prague',
  'Czech Republic': 'Europe/Prague',
  'Budapest': 'Europe/Budapest',
  'Hungary': 'Europe/Budapest',
  'Athens': 'Europe/Athens',
  'Greece': 'Europe/Athens',
  'Istanbul': 'Europe/Istanbul',
  'Ankara': 'Europe/Istanbul',
  'Turkey': 'Europe/Istanbul',
  'Moscow': 'Europe/Moscow',
  'St Petersburg': 'Europe/Moscow',
  'Russia': 'Europe/Moscow',

  // North America
  'New York': 'America/New_York',
  'Boston': 'America/New_York',
  'Washington': 'America/New_York',
  'Philadelphia': 'America/New_York',
  'Miami': 'America/New_York',
  'Los Angeles': 'America/Los_Angeles',
  'San Francisco': 'America/Los_Angeles',
  'San Diego': 'America/Los_Angeles',
  'Seattle': 'America/Los_Angeles',
  'Chicago': 'America/Chicago',
  'Dallas': 'America/Chicago',
  'Houston': 'America/Chicago',
  'United States': 'America/New_York',
  'USA': 'America/New_York',
  'US': 'America/New_York',
  'Toronto': 'America/Toronto',
  'Vancouver': 'America/Vancouver',
  'Montreal': 'America/Toronto',
  'Canada': 'America/Toronto',
  'Mexico City': 'America/Mexico_City',
  'Guadalajara': 'America/Mexico_City',
  'Mexico': 'America/Mexico_City',

  // Asia
  'Tokyo': 'Asia/Tokyo',
  'Osaka': 'Asia/Tokyo',
  'Kyoto': 'Asia/Tokyo',
  'Japan': 'Asia/Tokyo',
  'Seoul': 'Asia/Seoul',
  'Busan': 'Asia/Seoul',
  'South Korea': 'Asia/Seoul',
  'Korea': 'Asia/Seoul',
  'Beijing': 'Asia/Shanghai',
  'Shanghai': 'Asia/Shanghai',
  'Guangzhou': 'Asia/Shanghai',
  'Shenzhen': 'Asia/Shanghai',
  'China': 'Asia/Shanghai',
  'Mumbai': 'Asia/Kolkata',
  'Delhi': 'Asia/Kolkata',
  'Bangalore': 'Asia/Kolkata',
  'Chennai': 'Asia/Kolkata',
  'Kolkata': 'Asia/Kolkata',
  'India': 'Asia/Kolkata',
  'Karachi': 'Asia/Karachi',
  'Lahore': 'Asia/Karachi',
  'Islamabad': 'Asia/Karachi',
  'Pakistan': 'Asia/Karachi',
  'Dhaka': 'Asia/Dhaka',
  'Bangladesh': 'Asia/Dhaka',
  'Bangkok': 'Asia/Bangkok',
  'Thailand': 'Asia/Bangkok',
  'Ho Chi Minh': 'Asia/Ho_Chi_Minh',
  'Hanoi': 'Asia/Ho_Chi_Minh',
  'Vietnam': 'Asia/Ho_Chi_Minh',
  'Kuala Lumpur': 'Asia/Kuala_Lumpur',
  'Malaysia': 'Asia/Kuala_Lumpur',
  'Singapore': 'Asia/Singapore',
  'Jakarta': 'Asia/Jakarta',
  'Indonesia': 'Asia/Jakarta',
  'Manila': 'Asia/Manila',
  'Philippines': 'Asia/Manila',

  // Africa
  'Johannesburg': 'Africa/Johannesburg',
  'Cape Town': 'Africa/Johannesburg',
  'Durban': 'Africa/Johannesburg',
  'South Africa': 'Africa/Johannesburg',
  'Lagos': 'Africa/Lagos',
  'Abuja': 'Africa/Lagos',
  'Nigeria': 'Africa/Lagos',
  'Nairobi': 'Africa/Nairobi',
  'Kenya': 'Africa/Nairobi',
  'Addis Ababa': 'Africa/Addis_Ababa',
  'Ethiopia': 'Africa/Addis_Ababa',
  'Accra': 'Africa/Accra',
  'Ghana': 'Africa/Accra',

  // Oceania
  'Sydney': 'Australia/Sydney',
  'Melbourne': 'Australia/Melbourne',
  'Brisbane': 'Australia/Brisbane',
  'Perth': 'Australia/Perth',
  'Australia': 'Australia/Sydney',
  'Auckland': 'Pacific/Auckland',
  'Wellington': 'Pacific/Auckland',
  'New Zealand': 'Pacific/Auckland',
};

/**
 * Detects timezone from doctor's nationality
 */
export const getTimezoneFromNationality = (nationality: string): string => {
  if (!nationality) return 'Africa/Cairo'; // Default fallback
  
  // Clean up the nationality string
  const cleanNationality = nationality.trim();
  
  // Direct match
  if (countryToTimezone[cleanNationality]) {
    return countryToTimezone[cleanNationality];
  }
  
  // Fuzzy match - check if nationality contains any key
  for (const [key, timezone] of Object.entries(countryToTimezone)) {
    if (cleanNationality.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(cleanNationality.toLowerCase())) {
      return timezone;
    }
  }
  
  return 'Africa/Cairo'; // Default fallback
};

/**
 * Detects timezone from doctor's location with intelligent matching
 */
export const getTimezoneFromLocation = (location: string): string => {
  if (!location) return 'Africa/Cairo'; // Default fallback
  
  // Clean up the location string
  const cleanLocation = location.trim();
  
  // Direct match (case-insensitive)
  for (const [key, timezone] of Object.entries(locationToTimezone)) {
    if (cleanLocation.toLowerCase() === key.toLowerCase()) {
      return timezone;
    }
  }
  
  // Fuzzy match - check if location contains any key or vice versa
  for (const [key, timezone] of Object.entries(locationToTimezone)) {
    const keyLower = key.toLowerCase();
    const locationLower = cleanLocation.toLowerCase();
    
    // Check if location contains the key (e.g., "Cairo, Egypt" contains "Cairo")
    if (locationLower.includes(keyLower) || keyLower.includes(locationLower)) {
      return timezone;
    }
    
    // Check for partial matches (useful for abbreviations)
    if (locationLower.length >= 3 && keyLower.length >= 3) {
      // Check if any word in the location matches any word in the key
      const locationWords = locationLower.split(/[\s,.-]+/);
      const keyWords = keyLower.split(/[\s,.-]+/);
      
      for (const locWord of locationWords) {
        for (const keyWord of keyWords) {
          if (locWord === keyWord && locWord.length >= 3) {
            return timezone;
          }
        }
      }
    }
  }
  
  return 'Africa/Cairo'; // Default fallback
};

/**
 * Detects the best timezone for a doctor based on their location
 */
export const getDoctorTimezone = (doctorData: {
  location?: string;
}): string => {
  // Use location only (automatic detection)
  if (doctorData.location) {
    const locationTimezone = getTimezoneFromLocation(doctorData.location);
    return locationTimezone;
  }
  
  return 'Africa/Cairo'; // Default fallback if no location
};

/**
 * Converts UTC time to doctor's local timezone based on location
 */
export const convertToLocalTime = (
  utcTime: string | Date | dayjs.Dayjs,
  doctorData?: {
    location?: string;
  }
): dayjs.Dayjs => {
  const timezone = doctorData ? getDoctorTimezone(doctorData) : 'Africa/Cairo';
  return dayjs.utc(utcTime).tz(timezone);
};

/**
 * Enhanced formatters that use doctor's local timezone based on location
 */
export const createLocalizedFormatters = (doctorData?: {
  location?: string;
}) => {
  const timezone = doctorData ? getDoctorTimezone(doctorData) : 'Africa/Cairo';
  
  return {
    date: (date: string | Date | dayjs.Dayjs) => dayjs.utc(date).tz(timezone).format('MMM DD, YYYY'),
    time: (date: string | Date | dayjs.Dayjs) => dayjs.utc(date).tz(timezone).format('h:mm A'),
    dateTime: (date: string | Date | dayjs.Dayjs) => dayjs.utc(date).tz(timezone).format('MMM DD, YYYY h:mm A'),
    dateTimeWithTz: (date: string | Date | dayjs.Dayjs) => {
      const localTime = dayjs.utc(date).tz(timezone);
      const tzAbbr = localTime.format('z');
      return `${localTime.format('MMM DD, YYYY h:mm A')} ${tzAbbr}`;
    },
    relative: (date: string | Date | dayjs.Dayjs) => dayjs.utc(date).tz(timezone).fromNow(),
    timezone: () => timezone,
    timezoneAbbr: (date?: string | Date | dayjs.Dayjs) => {
      const timeToUse = date || new Date();
      return dayjs.utc(timeToUse).tz(timezone).format('z');
    }
  };
};

/**
 * Get timezone name for display
 */
export const getTimezoneDisplayName = (timezone: string): string => {
  const timezoneNames: Record<string, string> = {
    'Africa/Cairo': 'Egypt Time (EET)',
    'Asia/Riyadh': 'Arabia Standard Time (AST)',
    'Asia/Dubai': 'Gulf Standard Time (GST)',
    'Europe/London': 'Greenwich Mean Time (GMT)',
    'Europe/Paris': 'Central European Time (CET)',
    'America/New_York': 'Eastern Time (ET)',
    'America/Los_Angeles': 'Pacific Time (PT)',
    'Asia/Tokyo': 'Japan Standard Time (JST)',
    'Australia/Sydney': 'Australian Eastern Time (AET)',
    // Add more as needed
  };
  
  return timezoneNames[timezone] || timezone;
};
