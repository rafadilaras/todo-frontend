'use client';

import { useSyncExternalStore, useCallback } from 'react';

/**
 * Event listener helper untuk menyinkronkan perubahan localStorage
 * antar komponen di tab yang sama dan antar tab browser.
 */
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('local-storage-update', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('local-storage-update', callback);
  };
}

/**
 * Custom Hook useLocalStorage menggunakan useSyncExternalStore (standar modern React 18 & 19).
 * Menjamin integritas SSR di Next.js dan menghindari hydration mismatch.
 *
 * @param key Kunci penyimpanan di localStorage
 * @param initialValue Nilai awal jika cache belum ada
 * @returns [storedValue, setValue]
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const getSnapshot = (): string => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? item : JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  };

  const getServerSnapshot = (): string => {
    return JSON.stringify(initialValue);
  };

  // Mengambil state dari external store (localStorage) secara tersinkronisasi
  const rawValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const storedValue: T = JSON.parse(rawValue);

  // Fungsi pengubah state yang otomatis update localStorage & trigger re-render
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const item = window.localStorage.getItem(key);
        const current: T = item !== null ? JSON.parse(item) : initialValue;
        const nextValue = value instanceof Function ? value(current) : value;

        window.localStorage.setItem(key, JSON.stringify(nextValue));
        // Memicu event agar useSyncExternalStore mengetahui adanya perubahan
        window.dispatchEvent(new Event('local-storage-update'));
      } catch (error) {
        console.warn(`Gagal menyimpan ke localStorage untuk key "${key}":`, error);
      }
    },
    [key, initialValue]
  );

  return [storedValue, setValue] as const;
}
