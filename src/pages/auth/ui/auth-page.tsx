import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Input, Button } from '@/shared/ui';
import { useSendSms, useVerifySms } from '@/entities/auth/model/hooks';
import { useGetMe } from '@/entities/user/model/hooks';
import { UserRole } from '@/entities/user/model/types';

const roleRoutes: Record<UserRole, string> = {
  volunteer: '/volunteer',
  needy: '/needy',
  admin: '/admin',
};

export const AuthPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);

  const sendSmsMutation = useSendSms();
  const verifySmsMutation = useVerifySms();
  const { data: user, isLoading } = useGetMe();

  // Определяем, находимся ли мы в режиме разработки (для отображения кода в консоли)
  const isDev = import.meta.env.DEV;

  // Редирект на главный экран, если пользователь уже авторизован
  useEffect(() => {
    if (!isLoading && user) {
      const redirectPath = roleRoutes[user.role] || '/auth';
      navigate(redirectPath, { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleSendCode = async () => {
    if (!phone) {
      return;
    }

    try {
      console.log('📱 [Auth] Отправка SMS для номера:', phone);
      const response = await sendSmsMutation.mutateAsync({
        phoneNumber: phone,
        isDev: isDev,
      });
      
      console.log('✅ [Auth] SMS отправлен успешно, ответ:', response);
      
      // Показываем поле ввода кода после успешной отправки
      setShowCodeInput(true);
      console.log('✅ [Auth] Поле ввода кода показано');
      
      // Сохраняем dev код если он есть в ответе
      if (isDev && response?.code) {
        setDevCode(response.code);
        console.log('🔧 DEV MODE: SMS код:', response.code);
      }
    } catch (error) {
      // Ошибка уже обработана в хуке через toast
      console.error('❌ [Auth] Ошибка отправки SMS:', error);
      // Не показываем поле ввода кода при ошибке, так как SMS не был отправлен
    }
  };

  const handleVerify = async () => {
    if (code && code.length === 6) {
      try {
        await verifySmsMutation.mutateAsync({
          phoneNumber: phone,
          code: code,
        });
        // Редирект обрабатывается в хуке useVerifySms
      } catch (error) {
        // Ошибка уже обработана в хуке через toast
        console.error('Failed to verify SMS:', error);
      }
    }
  };

  const handleCopyDevCode = () => {
    if (devCode) {
      navigator.clipboard.writeText(devCode);
      // Можно показать toast, но он уже есть в useSendSms
    }
  };

  // Показываем код в консоли в режиме разработки
  useEffect(() => {
    if (isDev && sendSmsMutation.data?.code) {
      console.log('🔧 DEV MODE: SMS код:', sendSmsMutation.data.code);
      setDevCode(sendSmsMutation.data.code);
    }
  }, [sendSmsMutation.data, isDev]);

  // Показываем загрузку, пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  // Если пользователь авторизован, компонент будет редиректнут через useEffect
  // Но на всякий случай показываем загрузку, пока происходит редирект
  if (user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">
              {t('auth.title')}
            </h1>
            <p className="text-gray-600">
              {showCodeInput ? t('auth.enterCode') : t('auth.enterPhone')}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-6 space-y-4">
            {!showCodeInput ? (
              <>
                <Input
                  type="tel"
                  placeholder={t('auth.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="text-lg"
                />
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleSendCode}
                  disabled={!phone || sendSmsMutation.isPending}
                >
                  {sendSmsMutation.isPending ? t('common.loading') : t('auth.sendCode')}
                </Button>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    {t('auth.codeSentTo')} {phone}
                  </p>
                  <Input
                    type="text"
                    placeholder={t('auth.codePlaceholder')}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="text-lg text-center"
                    maxLength={6}
                  />
                </div>
                {isDev && devCode && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-yellow-800 font-medium mb-1">
                          🔧 DEV MODE: SMS код
                        </p>
                        <p className="text-lg font-mono font-bold text-yellow-900">
                          {devCode}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyDevCode}
                        className="ml-2"
                      >
                        Копировать
                      </Button>
                    </div>
                  </div>
                )}
                <Button
                  fullWidth
                  size="lg"
                  onClick={handleVerify}
                  disabled={!code || code.length !== 6 || verifySmsMutation.isPending}
                >
                  {verifySmsMutation.isPending ? t('common.loading') : t('auth.verify')}
                </Button>
                <Button
                  fullWidth
                  variant="text"
                  onClick={() => {
                    setShowCodeInput(false);
                    setDevCode(null);
                  }}
                >
                  {t('auth.changePhone')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
