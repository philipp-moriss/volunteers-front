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
    const isSupported =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window &&
      typeof Notification !== 'undefined' &&
      isVapidConfigured();

    const permission: NotificationPermission = 
      isSupported && typeof Notification !== 'undefined' 
        ? Notification.permission 
        : 'denied';

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
      setState((prev) => ({
        ...prev,
        error: 'Push notifications are not supported',
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
      setState((prev) => ({
        ...prev,
        error: 'Push notifications are not supported',
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
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
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
