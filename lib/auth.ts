export const TOKEN_COOKIE_NAME = 'auth_token';

/**
 * Menyimpan auth token ke dalam cookie browser (Client-side)
 */
export function setAuthToken(token: string, days = 7): void {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${TOKEN_COOKIE_NAME}=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
}

/**
 * Mengambil auth token dari cookie browser (Client-side)
 */
export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^|;\\s*)(${TOKEN_COOKIE_NAME})=([^;]*)`));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Menghapus auth token dari cookie browser (Client-side)
 */
export function removeAuthToken(): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${TOKEN_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
