/**
 * VAPID публичный ключ для Web Push API
 * Должен быть установлен в переменных окружения как VITE_VAPID_PUBLIC_KEY
 */
export const VAPID_PUBLIC_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY ||
  '';

/**
 * Проверка наличия VAPID ключа
 */
export function isVapidConfigured(): boolean {
  return !!VAPID_PUBLIC_KEY && VAPID_PUBLIC_KEY.length > 0;
}

/**
 * Конвертация VAPID ключа в формат для PushManager
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
