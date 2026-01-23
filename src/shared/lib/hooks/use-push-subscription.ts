import { useState, useEffect, useCallback } from 'react';
import { VAPID_PUBLIC_KEY, isVapidConfigured, urlBase64ToUint8Array } from '../push/vapid-keys';

export interface PushSubscriptionState {
  subscription: PushSubscription | null;
  isSupported: boolean;
  permission: NotificationPermission;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
}

/**
 * Хук для управления подпиской на push-уведомления
 */
export function usePushSubscription() {
  const [state, setState] = useState<PushSubscriptionState>({
    subscription: null,
    isSupported: false,
    permission: 'default',
    isSubscribed: false,
    isLoading: true,
    error: null,
  });

  // Проверка поддержки браузером
  useEffect(() => {
    // Проверка базовых API
    const hasServiceWorker = typeof window !== 'undefined' && 'serviceWorker' in navigator;
    const hasPushManager = typeof window !== 'undefined' && 'PushManager' in window;
    const hasNotification = typeof window !== 'undefined' && 'Notification' in window && typeof Notification !== 'undefined';
    const hasVapid = isVapidConfigured();
    
    // Проверка secure context (HTTPS или localhost)
    const isSecureContext = typeof window !== 'undefined' && window.isSecureContext;
    
    // Проверка, что мы на localhost или HTTPS
    const isLocalhost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
    const isHTTPS = typeof window !== 'undefined' && window.location.protocol === 'https:';
    
    // Для iOS Safari требуется secure context (HTTPS или localhost)
    const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    const isSupported = 
      hasServiceWorker &&
      hasPushManager &&
      hasNotification &&
      hasVapid &&
      isSecureContext &&
      (isLocalhost || isHTTPS || !isIOS || !isSafari); // На iOS Safari требуется localhost или HTTPS

    const permission: NotificationPermission = 
      isSupported && typeof Notification !== 'undefined' 
        ? Notification.permission 
        : 'denied';

    // Логирование для отладки
    if (typeof window !== 'undefined') {
      console.log('🔔 [Hook] Push support check:', {
        hasServiceWorker,
        hasPushManager,
        hasNotification,
        hasVapid,
        isSecureContext,
        isLocalhost,
        isHTTPS,
        isIOS,
        isSafari,
        hostname: window.location.hostname,
        protocol: window.location.protocol,
        isSupported,
      });
    }

    setState((prev) => ({
      ...prev,
      isSupported,
      permission,
      isLoading: false,
    }));
  }, []);

  // Получение текущей подписки
  const getSubscription = useCallback(async () => {
    if (!state.isSupported) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return subscription;
    } catch (error) {
      console.error('Error getting subscription:', error);
      return null;
    }
  }, [state.isSupported]);

  // Загрузка текущей подписки
  useEffect(() => {
    if (!state.isSupported || state.isLoading) {
      return;
    }

    getSubscription().then((subscription) => {
      if (subscription) {
        console.log('🔔 [Hook] Current subscription found:', {
          endpoint: subscription.endpoint.substring(0, 50) + '...',
        });
      } else {
        console.log('🔔 [Hook] No subscription found');
      }
      setState((prev) => ({
        ...prev,
        subscription,
        isSubscribed: !!subscription,
      }));
    });
  }, [state.isSupported, state.isLoading, getSubscription]);

  // Запрос разрешения
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported || typeof window === 'undefined' || typeof Notification === 'undefined') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isHTTPS = window.location.protocol === 'https:';
      
      let errorMessage = 'Push notifications are not supported';
      if (isIOS && isSafari && !isLocalhost && !isHTTPS) {
        errorMessage = 'Push notifications require HTTPS or localhost on iOS Safari. Please use localhost or deploy with HTTPS.';
      } else if (!window.isSecureContext) {
        errorMessage = 'Push notifications require a secure context (HTTPS or localhost)';
      } else if (!isVapidConfigured()) {
        errorMessage = 'VAPID key is not configured';
      }
      
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      setState((prev) => ({
        ...prev,
        permission,
      }));

      return permission === 'granted';
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to request permission',
      }));
      return false;
    }
  }, [state.isSupported]);

  // Подписка на push-уведомления
  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!state.isSupported) {
      const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isSafari = typeof window !== 'undefined' && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      const isLocalhost = typeof window !== 'undefined' && (
        window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1'
      );
      const isHTTPS = typeof window !== 'undefined' && window.location.protocol === 'https:';
      
      let errorMessage = 'Push notifications are not supported';
      if (isIOS && isSafari && !isLocalhost && !isHTTPS) {
        errorMessage = 'Push notifications require HTTPS or localhost on iOS Safari. Please use localhost or deploy with HTTPS.';
      } else if (typeof window !== 'undefined' && !window.isSecureContext) {
        errorMessage = 'Push notifications require a secure context (HTTPS or localhost)';
      } else if (!isVapidConfigured()) {
        errorMessage = 'VAPID key is not configured';
      }
      
      setState((prev) => ({
        ...prev,
        error: errorMessage,
      }));
      return null;
    }

    if (state.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        return null;
      }
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
      console.log('🔔 [Hook] Creating subscription with VAPID key...');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey as BufferSource,
      });

      console.log('✅ [Hook] Subscription created:', {
        endpoint: subscription.endpoint.substring(0, 50) + '...',
      });

      setState((prev) => ({
        ...prev,
        subscription,
        isSubscribed: true,
        error: null,
      }));

      return subscription;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to subscribe',
      }));
      return null;
    }
  }, [state.isSupported, state.permission, requestPermission]);

  // Отписка от push-уведомлений
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) {
      return false;
    }

    try {
      await state.subscription.unsubscribe();
      setState((prev) => ({
        ...prev,
        subscription: null,
        isSubscribed: false,
        error: null,
      }));
      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to unsubscribe',
      }));
      return false;
    }
  }, [state.subscription]);

  return {
    ...state,
    requestPermission,
    subscribe,
    unsubscribe,
    getSubscription,
  };
}
