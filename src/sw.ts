/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

// Определение режима разработки (в Service Worker нет import.meta.env)
const isDev = self.registration?.scope?.includes('localhost') || 
              self.registration?.scope?.includes('127.0.0.1') ||
              self.registration?.scope?.includes('192.168.');

// Утилита для условного логирования
const log = (...args: any[]) => {
  if (isDev) {
    console.log(...args);
  }
};

const logError = (...args: any[]) => {
  // Ошибки всегда логируем
  console.error(...args);
};

const logWarn = (...args: any[]) => {
  // Предупреждения всегда логируем
  console.warn(...args);
};

// Логирование при установке Service Worker
self.addEventListener('install', () => {
  log('[SW] 📦 Service Worker installing');
  self.skipWaiting();
});

// Логирование при активации Service Worker
self.addEventListener('activate', () => {
  log('[SW] ✅ Service Worker activated');
  clientsClaim();
});

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
  // Всегда логируем получение push события (для отладки)
  console.log('[SW] 🔔🔔🔔 PUSH EVENT RECEIVED 🔔🔔🔔', {
    hasData: !!event.data,
    timestamp: new Date().toISOString(),
    permission: Notification.permission,
  });
  
  log('[SW] 🔔🔔🔔 PUSH EVENT RECEIVED 🔔🔔🔔', {
    hasData: !!event.data,
    timestamp: new Date().toISOString(),
    permission: Notification.permission,
  });

  // Проверяем разрешение на уведомления
  if (Notification.permission !== 'granted') {
    logWarn('[SW] ⚠️ Notification permission is not granted:', Notification.permission);
    return;
  }
  
  log('[SW] ✅ Permission granted, processing push event...');

  if (!event.data) {
    logWarn('[SW] ⚠️ Push event received without data');
    // Показываем уведомление даже без данных
    event.waitUntil(
      self.registration.showNotification('Новое уведомление', {
        body: 'У вас новое уведомление',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
      }).then(() => {
        log('[SW] ✅ Default notification shown');
      }).catch((error) => {
        logError('[SW] ❌ Failed to show default notification:', error);
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
          if (!event.data) {
            throw new Error('Push event has no data');
          }
          text = await event.data.text();
          log('[SW] 📦 Push data as text:', text);
        } catch (textError) {
          logError('[SW] ❌ Failed to read push data as text:', textError);
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
          log('[SW] ✅ Parsed notification data:', {
            title: notificationData.title,
            hasBody: !!notificationData.body,
            hasData: !!notificationData.data,
          });
        } catch (parseError) {
          logError('[SW] ❌ Failed to parse JSON:', parseError);
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
          logError('[SW] ❌ Invalid notification data: missing title or body', notificationData);
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
          silent: false,
        };

        // Проверяем активные клиенты
        const activeClients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
        const hasActiveClient = activeClients.some((client) => client.focused);
        
        log('[SW] 📤 Attempting to show notification:', {
          title: notificationData.title,
          body: notificationData.body,
          permission: Notification.permission,
          hasActiveClient,
          clientsCount: activeClients.length,
        });

        try {
          // Всегда логируем попытку показа уведомления (даже в production для отладки)
          console.log('[SW] 📤 Attempting to show notification:', {
            title: notificationData.title,
            body: notificationData.body,
            permission: Notification.permission,
            hasActiveClient,
            clientsCount: activeClients.length,
          });

          await self.registration.showNotification(notificationData.title, options);
          
          // Всегда логируем успех
          console.log('[SW] ✅ Notification shown successfully:', {
            title: notificationData.title,
            timestamp: new Date().toISOString(),
          });
          
          log('[SW] ✅ Notification shown successfully:', {
            title: notificationData.title,
          });
          
          // Дополнительная проверка через небольшую задержку (только в dev)
          if (isDev) {
            setTimeout(() => {
              log('[SW] 🔍 Notification check after 1s - permission:', Notification.permission);
            }, 1000);
          }
        } catch (showError) {
          // Всегда логируем ошибки
          console.error('[SW] ❌ Failed to show notification:', {
            error: showError instanceof Error ? showError.message : String(showError),
            stack: showError instanceof Error ? showError.stack : undefined,
            permission: Notification.permission,
            errorName: showError instanceof Error ? showError.name : typeof showError,
          });
          
          logError('[SW] ❌ Failed to show notification:', {
            error: showError instanceof Error ? showError.message : String(showError),
            stack: showError instanceof Error ? showError.stack : undefined,
            permission: Notification.permission,
            errorName: showError instanceof Error ? showError.name : typeof showError,
          });
          throw showError;
        }
        
        // Отправляем сообщение в основной поток для логирования
        const allClients = await self.clients.matchAll();
        allClients.forEach((client) => {
          client.postMessage({
            type: 'NOTIFICATION_RECEIVED',
            data: notificationData,
            timestamp: new Date().toISOString(),
          });
        });
      } catch (error) {
        logError('[SW] ❌ Failed to process push notification:', {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        // Показываем уведомление с ошибкой только в dev режиме
        if (isDev) {
          try {
            await self.registration.showNotification('Ошибка уведомления', {
              body: error instanceof Error ? error.message : String(error),
              icon: '/pwa-192x192.png',
              badge: '/pwa-192x192.png',
            });
          } catch (showError) {
            logError('[SW] ❌ Failed to show error notification:', showError);
          }
        }
      }
    })()
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  log('[SW] Notification clicked:', {
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
        log('[SW] Found clients:', clientList.length);

        // Если окно уже открыто, фокусируемся на нем
        for (const client of clientList) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            log('[SW] Focusing existing client:', client.url);
            return client.focus();
          }
        }

        // Иначе открываем новое окно
        if (self.clients.openWindow) {
          log('[SW] Opening new window:', urlToOpen);
          return self.clients.openWindow(urlToOpen).catch((error) => {
            logError('[SW] Failed to open window:', {
              error: error instanceof Error ? error.message : String(error),
              url: urlToOpen,
            });
          });
        } else {
          logWarn('[SW] openWindow is not available');
        }
      })
      .catch((error) => {
        logError('[SW] Error handling notification click:', {
          error: error instanceof Error ? error.message : String(error),
        });
      }),
  );
});

// Обработка закрытия уведомлений (для аналитики)
self.addEventListener('notificationclose', (event: NotificationEvent) => {
  log('[SW] Notification closed:', {
    tag: event.notification.tag,
    data: event.notification.data,
    timestamp: new Date().toISOString(),
  });

  // Отправляем событие в основной поток для аналитики (опционально)
  event.waitUntil(
    self.clients.matchAll().then((clientList) => {
      clientList.forEach((client) => {
        client.postMessage({
          type: 'NOTIFICATION_CLOSED',
          data: {
            tag: event.notification.tag,
            data: event.notification.data,
            timestamp: new Date().toISOString(),
          },
        });
      });
    }),
  );
});
