// src/lib/utils.ts
// ────────────────────────────────────────────────
// Reusable utility functions: IDs, dates, formatting, phone, etc.
// ────────────────────────────────────────────────

/**
 * Generates a short, URL-safe random ID (9 characters)
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Calculate how many days until/until past a given date string.
 * Returns positive = future, negative = overdue, 999 if no date.
 */
export function getDaysOut(dateStr?: string): number {
  if (!dateStr) return 999;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(dateStr);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Human-friendly due date display:
 * - "Today"
 * - "Tomorrow"
 * - "Due in X Days" (if < 7 days)
 * - MM/DD/YYYY otherwise
 */
export function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '';

  const days = getDaysOut(dateStr);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days > 1 && days < 7) return `Due in ${days} Days`;

  const d = new Date(dateStr);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${month}/${day}/${d.getFullYear()}`;
}

/**
 * Standard MM/DD/YYYY format (always padded)
 */
export function formatDateStandard(dateStr?: string): string {
  if (!dateStr) return '';

  const d = new Date(dateStr);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${month}/${day}/${d.getFullYear()}`;
}

/**
 * Format US-style phone number: (123) 456-7890 → 123-456-7890
 * Falls back to original string if invalid
 */
export function formatPhoneNumber(phone?: string): string {
  if (!phone) return '';

  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  return match ? `${match[1]}-${match[2]}-${match[3]}` : phone;
}

/**
 * Simple pluralization helper (used in logs, counts, etc.)
 * Example: pluralize(1, 'day') → "1 day"
 *          pluralize(5, 'quest') → "5 quests"
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) return `${count} ${singular}`;
  return `${count} ${plural || singular + 's'}`;
}

/**
 * Truncate text with ellipsis if longer than max length
 */
export function truncate(str: string, maxLength: number = 80): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Safely parse a date string → returns Date or null
 */
export function safeParseDate(dateStr?: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Get tomorrow's date string in YYYY-MM-DD format
 */
export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export function getDaysFromNow(days: number = 3): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}