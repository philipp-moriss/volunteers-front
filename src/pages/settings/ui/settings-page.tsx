import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Header, Card, Button, Divider } from '@/shared/ui';
import { PushNotificationsSettings } from '@/features/push-notifications-settings/ui';

export const SettingsPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title={t('settings.title')}
        backButton
        onBack={() => navigate(-1)}
      />
      <div className="px-4 py-6 space-y-4">
        <Card variant="default" className="p-6">
          <PushNotificationsSettings />
        </Card>
      </div>
    </div>
  );
};
