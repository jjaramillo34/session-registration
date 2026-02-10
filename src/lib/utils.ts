export function formatDate(dateStr: string) {
  const months: Record<string, string> = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December'
  };
  
  const [year, month, day] = dateStr.split('-');
  return `${months[month]} ${parseInt(day)}, ${year}`;
}

export function formatTime(time: string) {
  if (!time) return '';
  const parts = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!parts) return time;
  const hour = parseInt(parts[1], 10);
  const minutes = parts[2];
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${hour12}:${minutes} ${period}`;
}

export function formatTimeRange(startTime: string, endTime?: string) {
  if (!endTime || startTime === endTime) return formatTime(startTime);
  return `${formatTime(startTime)} – ${formatTime(endTime)}`;
}

export function toTitleCase(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Strip HTML tags for plain-text display (e.g. table cells, map popups). */
export function stripHtml(html: string): string {
  if (!html?.trim()) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Escape for safe use inside HTML (e.g. map popup content). */
export function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
} 