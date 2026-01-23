import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Divider } from '@/shared/ui';
import { usePushSubscription } from '@/shared/lib/hooks/use-push-subscription';
import {
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  sendTestNotification,
} from '@/entities/notification/api';
import { toast } from 'sonner';

export const PushNotificationsSettings: FC = () => {
  const { t } = useTranslation();
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscription,
    subscribe,
    unsubscribe,
    requestPermission,
  } = usePushSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleToggle = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (isSubscribed) {
        const endpoint = subscription?.endpoint;
        const success = await unsubscribe();
        if (success) {
          await unsubscribeFromPushNotifications(endpoint);
          toast.success(t('notifications.disabled'));
        }
      } else {
        if (permission !== 'granted') {
          const granted = await requestPermission();
          if (!granted) {
            toast.error(t('notifications.permissionDenied'));
            setIsProcessing(false);
            return;
          }
        }

        const subscription = await subscribe();
        if (subscription) {
          await subscribeToPushNotifications(subscription);
          toast.success(t('notifications.enabled'));
        }
      }
    } catch (err) {
      console.error('Error toggling push notifications:', err);
      toast.error(error || t('notifications.error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusText = () => {
    if (!isSupported) {
      return t('notifications.notSupported');
    }

    if (permission === 'denied') {
      return t('notifications.permissionDenied');
    }

    if (isSubscribed) {
      return t('notifications.statusEnabled');
    }

    if (permission === 'default') {
      return t('notifications.statusDisabled');
    }

    return t('notifications.statusDisabled');
  };

  const getStatusColor = () => {
    if (!isSupported || permission === 'denied') {
      return 'text-red-600';
    }
    if (isSubscribed) {
      return 'text-green-600';
    }
    return 'text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('notifications.title')}
        </h2>
        <div className="text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t('notifications.title')}
        </h2>
        <p className="text-sm text-gray-600">
          {t('notifications.description')}
        </p>
      </div>

      <Divider />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="font-medium text-gray-900">
              {t('notifications.pushNotifications')}
            </div>
            <div className={`text-sm mt-1 ${getStatusColor()}`}>
              {getStatusText()}
            </div>
          </div>
          <div className="ml-4">
            {isSupported && permission !== 'denied' ? (
              <button
                onClick={handleToggle}
                disabled={isProcessing}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
                  border-2 border-transparent transition-colors duration-200 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                  ${isSubscribed ? 'bg-primary' : 'bg-gray-200'}
                  ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                role="switch"
                aria-checked={isSubscribed}
                aria-label={t('notifications.toggle')}
              >
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full
                    bg-white shadow ring-0 transition duration-200 ease-in-out
                    ${isSubscribed ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const granted = await requestPermission();
                  if (!granted) {
                    toast.error(t('notifications.permissionDenied'));
                  }
                }}
              >
                {t('notifications.enable')}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        {!isSupported && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            {t('notifications.notSupported')}
          </div>
        )}

        {permission === 'denied' && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            {t('notifications.permissionDeniedHelp')}
          </div>
        )}

        {isSubscribed && (
          <>
            <Divider />
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Тестирование
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                  Отправьте тестовое уведомление, чтобы проверить работу системы.
                  Уведомление придет даже если вы находитесь на странице.
                </p>
                <Button
                  onClick={async () => {
                    if (isSendingTest) return;
                    setIsSendingTest(true);
                    try {
                      await sendTestNotification(
                        '🧪 Тестовое уведомление',
                        'Если вы видите это уведомление, значит push-уведомления работают корректно!',
                      );
                      toast.success('Тестовое уведомление отправлено!', {
                        description: 'Проверьте, появилось ли уведомление',
                      });
                    } catch (error) {
                      console.error('Error sending test notification:', error);
                      toast.error('Ошибка отправки тестового уведомления', {
                        description:
                          error instanceof Error
                            ? error.message
                            : 'Не удалось отправить уведомление',
                      });
                    } finally {
                      setIsSendingTest(false);
                    }
                  }}
                  disabled={isSendingTest}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {isSendingTest ? 'Отправка...' : '📤 Отправить тестовое уведомление'}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
