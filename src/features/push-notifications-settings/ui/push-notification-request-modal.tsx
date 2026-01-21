import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';

interface PushNotificationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequest: () => void;
}

export const PushNotificationRequestModal: FC<PushNotificationRequestModalProps> = ({
  isOpen,
  onClose,
  onRequest,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('notifications.enable')}
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          {t('notifications.permissionRequest')}
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              onRequest();
              onClose();
            }}
            fullWidth
            variant="primary"
          >
            {t('notifications.enable')}
          </Button>
          <Button
            onClick={onClose}
            fullWidth
            variant="outline"
          >
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
