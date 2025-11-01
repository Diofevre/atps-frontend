import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from 'date-fns';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Decode and parse a keycloak tokens cookie
 * @param cookieValue - The encoded cookie value
 * @returns The parsed tokens object or null if parsing fails
 */
export function getTokensFromCookie(cookieValue: string): any | null {
  try {
    const decodedValue = decodeURIComponent(cookieValue);
    const tokens = JSON.parse(decodedValue);
    return tokens;
  } catch (e) {
    console.error('Error parsing tokens cookie:', e);
    return null;
  }
}

/**
 * Format a date string into a human-readable format.
 *
 * @param dateString - The date string in ISO 8601 format.
 * @param dateFormat - The desired format for the date. Default is 'dd MMM yyyy | HH:mm'.
 * @returns A formatted date string or "Invalid date" if parsing fails.
 */
export const formatDate = (dateString: string, dateFormat = 'dd MMM yyyy | HH:mm'): string => {
  if (!dateString) {
    return 'Invalid date';
  }

  try {
    const date = parseISO(dateString); // Parses the ISO 8601 date string
    return format(date, dateFormat); // Formats the date
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const COUNTRIES = [
  "Austro Control",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Hong Kong",
  "Iceland",
  "Ireland",
  "Italy",
  "Kazakhstan",
  "Latvia",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Malaysia",
  "Malta",
  "Netherlands",
  "Norway",
  "Pakistan",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "San Marino",
  "Serbia",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "Thailand",
  "United Kingdom",
];

export interface Option {
  value: string;
  label: string;
}

export const COUNTRIES_ACCOUNT: Option[] = [
  { value: "us", label: "United States" },
  { value: "gb", label: "United Kingdom" },
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "es", label: "Spain" },
  { value: "it", label: "Italy" },
  { value: "jp", label: "Japan" },
  { value: "cn", label: "China" },
  { value: "in", label: "India" },
  { value: "br", label: "Brazil" },
  { value: "atc", label: "Austro Control" },
  { value: "be", label: "Belgium" },
  { value: "bg", label: "Bulgaria" },
  { value: "hr", label: "Croatia" },
  { value: "cy", label: "Cyprus" },
  { value: "cz", label: "Czech Republic" },
  { value: "dk", label: "Denmark" },
  { value: "ee", label: "Estonia" },
  { value: "fi", label: "Finland" },
  { value: "gr", label: "Greece" },
  { value: "hu", label: "Hungary" },
  { value: "hk", label: "Hong Kong" },
  { value: "is", label: "Iceland" },
  { value: "ie", label: "Ireland" },
  { value: "kz", label: "Kazakhstan" },
  { value: "lv", label: "Latvia" },
  { value: "li", label: "Liechtenstein" },
  { value: "lt", label: "Lithuania" },
  { value: "lu", label: "Luxembourg" },
  { value: "my", label: "Malaysia" },
  { value: "mt", label: "Malta" },
  { value: "nl", label: "Netherlands" },
  { value: "no", label: "Norway" },
  { value: "pk", label: "Pakistan" },
  { value: "pl", label: "Poland" },
  { value: "pt", label: "Portugal" },
  { value: "qa", label: "Qatar" },
  { value: "ro", label: "Romania" },
  { value: "sm", label: "San Marino" },
  { value: "rs", label: "Serbia" },
  { value: "sk", label: "Slovakia" },
  { value: "si", label: "Slovenia" },
  { value: "se", label: "Sweden" },
  { value: "ch", label: "Switzerland" },
  { value: "th", label: "Thailand" },
];

export const LANGUAGES: Option[] = [
  { value: "en", label: "English" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "es", label: "Spanish" },
  { value: "it", label: "Italian" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
  { value: "hi", label: "Hindi" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ar", label: "Arabic" },
  { value: "nl", label: "Dutch" },
  { value: "sv", label: "Swedish" },
  { value: "fi", label: "Finnish" },
  { value: "no", label: "Norwegian" },
  { value: "da", label: "Danish" },
  { value: "pl", label: "Polish" },
  { value: "tr", label: "Turkish" },
  { value: "ko", label: "Korean" },
  { value: "cs", label: "Czech" },
  { value: "hu", label: "Hungarian" },
  { value: "el", label: "Greek" },
  { value: "he", label: "Hebrew" },
  { value: "th", label: "Thai" },
  { value: "id", label: "Indonesian" },
  { value: "ms", label: "Malay" },
  { value: "vi", label: "Vietnamese" },
  { value: "uk", label: "Ukrainian" },
  { value: "fa", label: "Persian" },
  { value: "ro", label: "Romanian" },
  { value: "bg", label: "Bulgarian" },
  { value: "sr", label: "Serbian" },
  { value: "hr", label: "Croatian" },
  { value: "sk", label: "Slovak" },
  { value: "sl", label: "Slovenian" },
  { value: "lt", label: "Lithuanian" },
  { value: "lv", label: "Latvian" },
  { value: "et", label: "Estonian" },
  { value: "bn", label: "Bengali" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
  { value: "mr", label: "Marathi" },
  { value: "ur", label: "Urdu" },
  { value: "ml", label: "Malayalam" },
  { value: "kn", label: "Kannada" },
  { value: "pa", label: "Punjabi" },
];