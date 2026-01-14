import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '../../api';
import { SendSmsRequest } from '../types';

export function useSendSms() {
  return useMutation({
    mutationFn: (data: SendSmsRequest) => authApi.sendSms(data),
    onSuccess: (_, variables) => {
      const isDev = variables.isDev;
      toast.success('SMS код отправлен!', {
        description: isDev
          ? 'Режим разработки: код отправлен в консоль'
          : 'Проверьте ваш телефон и введите полученный код',
        duration: 5000,
      });

      if (isDev) {
        console.log('🔧 DEV MODE: SMS код отправлен для номера', variables.phoneNumber);
      }
    },
    onError: (error: unknown) => {
      console.error('Ошибка отправки SMS:', error);

      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (error as Error)?.message ||
        'Произошла ошибка при отправке SMS кода';

      toast.error('Ошибка отправки SMS', {
        description: errorMessage,
        duration: 5000,
      });
    },
  });
}
