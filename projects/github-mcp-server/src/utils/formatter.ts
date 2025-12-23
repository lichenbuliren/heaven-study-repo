export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
