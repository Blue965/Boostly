export function sanitizeUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.toLowerCase().startsWith('javascript:')) return '#';
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function validateUsername(username: string): boolean {
  const regex = /^[a-zA-Z0-9_-]{3,30}$/;
  return regex.test(username);
}