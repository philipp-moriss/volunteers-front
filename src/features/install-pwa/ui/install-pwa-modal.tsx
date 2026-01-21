import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { usePWAInstall } from '@/shared/lib/hooks/use-pwa-install';

interface InstallPWAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPWAModal: FC<InstallPWAModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { platform, isInstallable, install } = usePWAInstall();
  const [showManualInstructions, setShowManualInstructions] = useState(false);

  useEffect(() => {
    if (platform === 'ios') {
      setShowManualInstructions(true);
    }
  }, [platform]);

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    } else {
      setShowManualInstructions(true);
    }
  };

  const getInstructions = () => {
    if (platform === 'ios') {
      return {
        steps: [
          t('pwa.ios.step1'),
          t('pwa.ios.step2'),
          t('pwa.ios.step3'),
          t('pwa.ios.step4'),
        ],
      };
    }

    if (platform === 'android') {
      return {
        steps: [
          t('pwa.android.step1'),
          t('pwa.android.step2'),
          t('pwa.android.step3'),
        ],
      };
    }

    if (platform === 'desktop') {
      return {
        steps: [
          t('pwa.desktop.step1'),
          t('pwa.desktop.step2'),
          t('pwa.desktop.step3'),
        ],
      };
    }

    return {
      steps: [
        t('pwa.generic.step1'),
        t('pwa.generic.step2'),
        t('pwa.generic.step3'),
      ],
    };
  };

  const instructions = getInstructions();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('pwa.title')}
    >
      <div className="space-y-4">
        <p className="text-gray-600">{t('pwa.description')}</p>

        {isInstallable && !showManualInstructions && (
          <div className="space-y-3">
            <Button
              onClick={handleInstall}
              fullWidth
              size="lg"
            >
              {t('pwa.installButton')}
            </Button>
            <Button
              onClick={() => setShowManualInstructions(true)}
              variant="outline"
              fullWidth
            >
              {t('pwa.showInstructions')}
            </Button>
          </div>
        )}

        {(showManualInstructions || !isInstallable) && (
          <div className="space-y-4">
            <div className="bg-pastel-blue rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">
                {t('pwa.instructionsTitle')}
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {instructions.steps.map((step, index) => (
                  <li key={index} className="leading-relaxed">
                    {step}
                  </li>
                ))}
              </ol>
            </div>

            {platform === 'ios' && (
              <div className="bg-pastel-peach rounded-xl p-4">
                <p className="text-sm text-gray-700">
                  {t('pwa.ios.note')}
                </p>
              </div>
            )}

            <Button
              onClick={onClose}
              fullWidth
              variant="primary"
            >
              {t('pwa.gotIt')}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
