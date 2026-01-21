/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

// Логирование при активации Service Worker
self.addEventListener('activate', (event) => {
  console.log('🔔 [SW] Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// Логирование при установке Service Worker
self.addEventListener('install', (event) => {
  console.log('🔔 [SW] Service Worker installing');
  self.skipWaiting();
});

// Логирование при активации service worker
self.addEventListener('activate', (event) => {
  console.log('[SW] ✅ Service Worker activated');
  event.waitUntil(clientsClaim());
});

// Логирование при установке
self.addEventListener('install', (event) => {
  console.log('[SW] 📦 Service Worker installing');
});

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
  console.log('[SW] 🔔 Push event received', {
    hasData: !!event.data,
    dataType: event.data?.type,
    timestamp: new Date().toISOString(),
  });

  if (!event.data) {
    console.warn('[SW] ⚠️ Push event received without data');
    // Показываем уведомление даже без данных
    event.waitUntil(
      self.registration.showNotification('Новое уведомление', {
        body: 'У вас новое уведомление',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
      })
    );
    return;
  }

  // Обрабатываем push событие
  event.waitUntil(
    (async () => {
      try {
        let text: string;
        try {
          text = await event.data.text();
          console.log('[SW] 📦 Push data as text:', text);
        } catch (textError) {
          console.error('[SW] ❌ Failed to read push data as text:', textError);
          // Показываем уведомление с дефолтными данными
          await self.registration.showNotification('Новое уведомление', {
            body: 'У вас новое уведомление',
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
          });
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
          notificationData = JSON.parse(text);
          console.log('[SW] ✅ Parsed notification data:', {
            title: notificationData.title,
            hasBody: !!notificationData.body,
            hasData: !!notificationData.data,
          });
        } catch (parseError) {
          console.error('[SW] ❌ Failed to parse JSON:', parseError);
          // Показываем уведомление с текстом данных
          await self.registration.showNotification('Новое уведомление', {
            body: text || 'У вас новое уведомление',
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
          });
          return;
        }

        // Валидация обязательных полей
        if (!notificationData.title || !notificationData.body) {
          console.error('[SW] ❌ Invalid notification data: missing title or body', notificationData);
          await self.registration.showNotification('Новое уведомление', {
            body: notificationData.body || text || 'У вас новое уведомление',
            icon: notificationData.icon || '/pwa-192x192.png',
            badge: notificationData.badge || '/pwa-192x192.png',
          });
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

        await self.registration.showNotification(notificationData.title, options);
        console.log('[SW] ✅ Notification shown successfully:', notificationData.title);
        
        // Отправляем сообщение в основной поток для логирования
        const clients = await self.clients.matchAll();
        clients.forEach((client) => {
          client.postMessage({
            type: 'NOTIFICATION_RECEIVED',
            data: notificationData,
            timestamp: new Date().toISOString(),
          });
        });
      } catch (error) {
        console.error('[SW] ❌ Failed to process push notification:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        // Показываем уведомление с ошибкой для отладки
        try {
          await self.registration.showNotification('Ошибка уведомления', {
            body: error instanceof Error ? error.message : String(error),
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
          });
        } catch (showError) {
          console.error('[SW] ❌ Failed to show error notification:', showError);
        }
      }
    })()
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
