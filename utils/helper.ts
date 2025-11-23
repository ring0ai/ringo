import { format } from 'date-fns';

/**
 * Converts a Date object or date string to dd-MMM-yyyy format
 * @param dateInput - Date object or date string
 * @returns Formatted date string in dd-MMM-yyyy format
 */
export function getddMMMYYYYFormat(dateInput: Date | string): string {
  // If input is a string, convert it to Date object
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date input');
  }

  // Format the date to dd-MMM-yyyy (e.g., 22-Nov-2025)
  return format(date, 'dd-MMM-yyyy');
}
