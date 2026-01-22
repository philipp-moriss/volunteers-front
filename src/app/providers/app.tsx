import { FC, ReactNode, useEffect, useState } from 'react';
import { Toaster } from 'sonner';
import { QueryProvider } from './query-provider';
import { Router } from './router';
import { InstallPWAModal } from '@/features/install-pwa/ui';
import { PushNotificationRequestModal } from '@/features/push-notifications-settings/ui/push-notification-request-modal';
import { usePWAInstall } from '@/shared/lib/hooks/use-pwa-install';
import { usePushSubscription } from '@/shared/lib/hooks/use-push-subscription';
import { subscribeToPushNotifications } from '@/entities/notification/api';
import { getToken } from '@/shared/lib/auth/token';
import '@/shared/lib/i18n';

// Логирование уведомлений в основном потоке
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'NOTIFICATION_RECEIVED') {
      console.log('🔔 [App] Push notification received:', event.data);
      console.log('🔔 [App] Notification permission:', Notification.permission);
      
      // Проверяем, почему уведомление может не показываться
      if (Notification.permission !== 'granted') {
        console.warn('⚠️ [App] Notification permission is not granted:', Notification.permission);
      }
    }
  });

  // Также слушаем события от Service Worker для отладки
  navigator.serviceWorker.ready.then(async (registration) => {
    console.log('🔔 [App] Service Worker ready, checking notifications support');
    console.log('🔔 [App] Notification permission:', Notification.permission);
    
    // Проверяем текущую подписку
    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        console.log('✅ [App] Active subscription found:', {
          endpoint: subscription.endpoint.substring(0, 50) + '...',
        });
      } else {
        console.warn('⚠️ [App] No active subscription found');
      }
    } catch (error) {
      console.error('❌ [App] Error checking subscription:', error);
    }
    
    // Проверяем, можем ли мы показать уведомление
    if (Notification.permission === 'granted') {
      console.log('✅ [App] Notifications are allowed');
    } else {
      console.warn('⚠️ [App] Notifications are not allowed:', Notification.permission);
    }
  });
}

interface AppProviderProps {
  children?: ReactNode;
}

// Безопасное использование localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem failed:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('localStorage.setItem failed:', error);
    }
  },
};

export const App: FC<AppProviderProps> = ({ children }) => {
  const { isInstallable, isInstalled } = usePWAInstall();
  const { subscribe, isSubscribed, isSupported, permission, requestPermission } = usePushSubscription();
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showPushRequestModal, setShowPushRequestModal] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

  // Автоматический запрос разрешения и подписка на push-уведомления после авторизации
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const token = getToken();
    if (!token) {
      return;
    }

    if (!isSupported) {
      return;
    }

    // Проверяем, запрашивали ли мы разрешение ранее
    const hasRequestedBefore = safeLocalStorage.getItem('push-permission-requested') === 'true';

    // Если разрешение еще не запрошено, показываем модальное окно
    if (permission === 'default' && !permissionRequested && !hasRequestedBefore) {
      setPermissionRequested(true);
      safeLocalStorage.setItem('push-permission-requested', 'true');
      
      // Показываем модальное окно с задержкой
      setTimeout(() => {
        setShowPushRequestModal(true);
      }, 2000);
      return;
    }

    // Если уже подписан, проверяем, что подписка отправлена на сервер
    if (isSubscribed) {
      // Проверяем, была ли подписка отправлена на сервер
      const subscriptionSent = safeLocalStorage.getItem('push-subscription-sent') === 'true';
      if (!subscriptionSent) {
        // Если подписка есть, но не отправлена на сервер, отправляем
        navigator.serviceWorker.ready.then(async (registration) => {
          const subscription = await registration.pushManager.getSubscription();
          if (subscription) {
            try {
              await subscribeToPushNotifications(subscription);
              safeLocalStorage.setItem('push-subscription-sent', 'true');
              console.log('✅ [App] Existing subscription sent to server');
            } catch (error) {
              console.error('❌ [App] Ошибка отправки существующей подписки:', error);
            }
          }
        });
      }
      return;
    }

    // Если разрешение уже получено ранее, но подписки нет, подписываемся автоматически
    if (permission === 'granted' && !isSubscribed) {
      console.log('🔔 [App] Permission granted, subscribing to push notifications...');
      subscribe().then(async (subscription) => {
        if (subscription) {
          console.log('🔔 [App] Subscription created:', {
            endpoint: subscription.endpoint.substring(0, 50) + '...',
            hasKeys: !!subscription.getKey('p256dh') && !!subscription.getKey('auth'),
          });
          try {
            await subscribeToPushNotifications(subscription);
            safeLocalStorage.setItem('push-subscription-sent', 'true');
            console.log('✅ [App] Subscription sent to server successfully');
          } catch (error) {
            console.error('❌ [App] Ошибка регистрации подписки:', error);
            safeLocalStorage.setItem('push-subscription-sent', 'false');
          }
        } else {
          console.warn('⚠️ [App] Subscription is null');
        }
      }).catch((error) => {
        console.error('❌ [App] Failed to subscribe:', error);
        safeLocalStorage.setItem('push-subscription-sent', 'false');
      });
    }
  }, [isSupported, permission, isSubscribed, subscribe, requestPermission, permissionRequested]);

  useEffect(() => {
    if (!isInstalled) {
      const hasSeenModal = safeLocalStorage.getItem('pwa-install-modal-seen');
      if (!hasSeenModal) {
        const timer = setTimeout(() => {
          setShowInstallModal(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isInstallable, isInstalled]);

  const handleCloseModal = () => {
    setShowInstallModal(false);
    safeLocalStorage.setItem('pwa-install-modal-seen', 'true');
  };

  const handlePushRequest = async () => {
    const granted = await requestPermission();
    if (granted) {
      const subscription = await subscribe();
      if (subscription) {
        try {
          await subscribeToPushNotifications(subscription);
        } catch (error) {
          console.error('Ошибка регистрации подписки:', error);
        }
      }
    }
  };

  return (
    <QueryProvider>
      <Router />
      {children}
      <Toaster position="top-right" />
      <InstallPWAModal isOpen={showInstallModal} onClose={handleCloseModal} />
      <PushNotificationRequestModal
        isOpen={showPushRequestModal}
        onClose={() => setShowPushRequestModal(false)}
        onRequest={handlePushRequest}
      />
    </QueryProvider>
  );
};
