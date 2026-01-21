/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

// Управление версией кеша
clientsClaim();

// Предкэширование ресурсов
precacheAndRoute(self.__WB_MANIFEST);

// Обработка навигации
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  ({ request, url }: { request: Request; url: URL }) => {
    if (request.mode !== 'navigate') {
      return false;
    }
    if (url.pathname.startsWith('/_')) {
      return false;
    }
    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    }
    return true;
  },
  createHandlerBoundToURL('/index.html'),
);

// Кеширование изображений
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 дней
      }),
    ],
  }),
);

// Кеширование API запросов
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    networkTimeoutSeconds: 10,
  }),
);

// Кеширование статических ресурсов
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  }),
);

// Обработка push-уведомлений
self.addEventListener('push', (event: PushEvent) => {
  console.log('[SW] Push event received', {
    hasData: !!event.data,
    dataType: event.data?.type,
  });

  if (!event.data) {
    console.warn('[SW] Push event received without data');
    return;
  }

  let notificationData: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: Record<string, any>;
    tag?: string;
  };

  try {
    notificationData = event.data.json();
    console.log('[SW] Parsed notification data:', {
      title: notificationData.title,
      hasBody: !!notificationData.body,
      hasData: !!notificationData.data,
    });
  } catch (error) {
    console.error('[SW] Failed to parse push notification data:', {
      error: error instanceof Error ? error.message : String(error),
      hasData: !!event.data,
    });
    // Попытка прочитать данные асинхронно для отладки
    if (event.data && event.data.text) {
      event.data.text().then((text) => {
        console.error('[SW] Push event data as text:', text);
      }).catch(() => {
        console.error('[SW] Unable to read push event data as text');
      });
    }
    return;
  }

  // Валидация обязательных полей
  if (!notificationData.title || !notificationData.body) {
    console.error('[SW] Invalid notification data: missing title or body', notificationData);
    return;
  }

  const options: NotificationOptions = {
    body: notificationData.body,
    icon: notificationData.icon || '/pwa-192x192.png',
    badge: notificationData.badge || '/pwa-192x192.png',
    data: notificationData.data || {},
    tag: notificationData.tag,
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration
      .showNotification(notificationData.title, options)
      .then(() => {
        console.log('[SW] Notification shown successfully:', notificationData.title);
      })
      .catch((error) => {
        console.error('[SW] Failed to show notification:', {
          error: error instanceof Error ? error.message : String(error),
          title: notificationData.title,
        });
      }),
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  console.log('[SW] Notification clicked:', {
    tag: event.notification.tag,
    data: event.notification.data,
  });

  event.notification.close();

  const notificationData = event.notification.data;
  const urlToOpen = notificationData?.taskId
    ? `/tasks/${notificationData.taskId}`
    : '/tasks';

  event.waitUntil(
    self.clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        console.log('[SW] Found clients:', clientList.length);

        // Если окно уже открыто, фокусируемся на нем
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            console.log('[SW] Focusing existing client:', client.url);
            return client.focus();
          }
        }

        // Иначе открываем новое окно
        if (self.clients.openWindow) {
          console.log('[SW] Opening new window:', urlToOpen);
          return self.clients.openWindow(urlToOpen).catch((error) => {
            console.error('[SW] Failed to open window:', {
              error: error instanceof Error ? error.message : String(error),
              url: urlToOpen,
            });
          });
        } else {
          console.warn('[SW] openWindow is not available');
        }
      })
      .catch((error) => {
        console.error('[SW] Error handling notification click:', {
          error: error instanceof Error ? error.message : String(error),
        });
      }),
  );
});
