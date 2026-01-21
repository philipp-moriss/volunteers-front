import { apiClient } from '@/shared/api/base-client';

export interface PushSubscriptionDto {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Подписка на push-уведомления
 */
export async function subscribeToPushNotifications(
  subscription: PushSubscription,
): Promise<void> {
  const subscriptionData: PushSubscriptionDto = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
      auth: arrayBufferToBase64(subscription.getKey('auth')!),
    },
  };

  await apiClient.request('/notifications/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscriptionData),
  });
}

/**
 * Отписка от push-уведомлений
 */
export async function unsubscribeFromPushNotifications(
  endpoint?: string,
): Promise<void> {
  await apiClient.request('/notifications/unsubscribe', {
    method: 'DELETE',
    body: endpoint ? JSON.stringify({ endpoint }) : undefined,
  });
}

/**
 * Конвертация ArrayBuffer в base64
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
