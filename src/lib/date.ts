/**
 * Date and Time utilities for formatting and timezone handling (Asia/Dhaka)
 */

export const DHAKA_TIMEZONE = "Asia/Dhaka";

/**
 * Converts ISO string or Date to local YYYY-MM-DDTHH:mm string for datetime-local input
 */
export function toDatetimeLocal(val?: string | Date | null): string {
  if (!val) return "";
  const d = typeof val === "string" ? new Date(val) : val;
  if (isNaN(d.getTime())) return "";

  // Get date in Asia/Dhaka or local timezone parts
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Formats a Date/ISO string to human readable Bangla datetime in Asia/Dhaka timezone
 */
export function formatBanglaDateTime(
  val?: string | Date | null,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!val) return "যে কোনো সময়";
  const d = typeof val === "string" ? new Date(val) : val;
  if (isNaN(d.getTime())) return "যে কোনো সময়";

  const defaultOptions: Intl.DateTimeFormatOptions = {
    timeZone: DHAKA_TIMEZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    ...options,
  };

  try {
    return new Intl.DateTimeFormat("bn-BD", defaultOptions).format(d);
  } catch {
    return d.toLocaleString("bn-BD");
  }
}

/**
 * Formats a Date/ISO string to human readable Bangla date only in Asia/Dhaka timezone
 */
export function formatBanglaDate(
  val?: string | Date | null,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!val) return "যে কোনো সময়";
  return formatBanglaDateTime(val, {
    hour: undefined,
    minute: undefined,
    hour12: undefined,
    ...options,
  });
}
