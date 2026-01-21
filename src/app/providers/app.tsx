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

    // Если уже подписан, ничего не делаем
    if (isSubscribed) {
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

    // Если разрешение уже получено ранее, подписываемся автоматически
    if (permission === 'granted' && !isSubscribed) {
      subscribe().then(async (subscription) => {
        if (subscription) {
          try {
            await subscribeToPushNotifications(subscription);
          } catch (error) {
            console.error('Ошибка регистрации подписки:', error);
          }
        }
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
