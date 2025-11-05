/**
 * Formats a date string (YYYY-MM-DD) to a readable format like "November 1, 2025"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00"); // Add time to avoid timezone issues
  if (isNaN(date.getTime())) {
    return dateString; // Return original if invalid
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  
  return date.toLocaleDateString("en-US", options);
}

/**
 * Formats a datetime string (ISO format) to a readable format
 */
export function formatDateTime(dateTimeString: string): string {
  const date = new Date(dateTimeString);
  if (isNaN(date.getTime())) {
    return dateTimeString; // Return original if invalid
  }
  
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  };
  
  return date.toLocaleDateString("en-US", options);
}

