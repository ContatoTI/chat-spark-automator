
/**
 * Date utility functions for consistent date handling without timezone issues
 */

/**
 * Format a date string (YYYY-MM-DD or YYYY-MM-DD HH:MM:SS) to a localized format
 * without timezone conversion issues
 */
export const formatLocalDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  
  try {
    let year, month, day;
    
    // Handle different date formats
    if (dateString.includes(" ")) {
      // Format: 2025-04-29 09:00:00
      const [datePart] = dateString.split(" ");
      [year, month, day] = datePart.split("-").map(Number);
    } else if (dateString.includes("T")) {
      // ISO format: 2025-04-29T09:00:00Z
      const [datePart] = dateString.split("T");
      [year, month, day] = datePart.split("-").map(Number);
    } else {
      // Simple date: 2025-04-29
      [year, month, day] = dateString.split("-").map(Number);
    }
    
    // Format as DD/MM/YYYY
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  } catch (error) {
    console.error("Error parsing date:", error);
    return "-";
  }
};

/**
 * Parse a date string to a Date object without timezone conversion
 */
export const parseLocalDate = (dateString: string | null): Date | null => {
  if (!dateString) return null;
  
  try {
    let year, month, day;
    
    // Handle different date formats
    if (dateString.includes(" ")) {
      // Format: 2025-04-29 09:00:00
      const [datePart] = dateString.split(" ");
      [year, month, day] = datePart.split("-").map(Number);
    } else if (dateString.includes("T")) {
      // ISO format: 2025-04-29T09:00:00Z
      const [datePart] = dateString.split("T");
      [year, month, day] = datePart.split("-").map(Number);
    } else {
      // Simple date: 2025-04-29
      [year, month, day] = dateString.split("-").map(Number);
    }
    
    // Create date object (month is 0-based)
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
};
