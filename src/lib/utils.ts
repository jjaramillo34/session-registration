export function formatDate(dateStr: string) {
  const months: { [key: string]: string } = {
    'jan': 'January',
    'feb': 'February',
    // ... add other months as needed
  };
  
  const [month, day, year] = dateStr.split('-');
  return `${months[month.toLowerCase()]} ${parseInt(day)}, ${year}`;
}

export function formatTime(time: string) {
  const hour = parseInt(time.slice(0, -2));
  const minutes = time.slice(-2);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour > 12 ? hour - 12 : hour;
  return `${hour12}:${minutes} ${period}`;
} 