export function dateTimeString(date: Date | undefined) {
  return date?.toLocaleTimeString([], {
    year: 'numeric',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}
