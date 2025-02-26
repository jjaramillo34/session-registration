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
  const hour = parseInt(time.slice(0, -2));
  const minutes = time.slice(-2);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${hour12}:${minutes} ${period}`;
} 